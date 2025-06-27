import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
  ErrorCode,
  McpError
} from '@modelcontextprotocol/sdk/types.js';
import { NotionClient } from '../notion/client.js';
import { blockToText, formatPageProperties } from '../utils/notion-utils.js';

export class NotionMcpServer {
  private server: Server;
  private notionClient: NotionClient;

  constructor(apiKey: string) {
    this.notionClient = new NotionClient(apiKey);
    this.server = new Server(
      {
        name: 'notion-mcp-server',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: this.getTools(),
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) =>
      this.handleToolCall(request)
    );
  }

  private getTools(): Tool[] {
    return [
      {
        name: 'notion_search_pages',
        description: 'Search for pages in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'notion_search_databases',
        description: 'Search for databases in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 10)',
              default: 10,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'notion_get_page',
        description: 'Get a specific page by ID',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: 'The ID of the page',
            },
          },
          required: ['pageId'],
        },
      },
      {
        name: 'notion_get_page_content',
        description: 'Get the content blocks of a page',
        inputSchema: {
          type: 'object',
          properties: {
            pageId: {
              type: 'string',
              description: 'The ID of the page',
            },
          },
          required: ['pageId'],
        },
      },
      {
        name: 'notion_query_database',
        description: 'Query a database with filters and sorts',
        inputSchema: {
          type: 'object',
          properties: {
            databaseId: {
              type: 'string',
              description: 'The ID of the database',
            },
            filter: {
              type: 'object',
              description: 'Filter conditions (Notion filter format)',
            },
            sorts: {
              type: 'array',
              description: 'Sort conditions',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results',
              default: 100,
            },
          },
          required: ['databaseId'],
        },
      },
      {
        name: 'notion_create_page',
        description: 'Create a new page in Notion',
        inputSchema: {
          type: 'object',
          properties: {
            parentId: {
              type: 'string',
              description: 'Parent page or database ID',
            },
            title: {
              type: 'string',
              description: 'Page title',
            },
            properties: {
              type: 'object',
              description: 'Page properties',
            },
            content: {
              type: 'array',
              description: 'Content blocks',
            },
          },
          required: ['parentId', 'title'],
        },
      },
    ];
  }

  private async handleToolCall(request: any) {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'notion_search_pages':
          return await this.searchPages(args);
        case 'notion_search_databases':
          return await this.searchDatabases(args);
        case 'notion_get_page':
          return await this.getPage(args);
        case 'notion_get_page_content':
          return await this.getPageContent(args);
        case 'notion_query_database':
          return await this.queryDatabase(args);
        case 'notion_create_page':
          return await this.createPage(args);
        default:
          throw new McpError(
            ErrorCode.MethodNotFound,
            `Unknown tool: ${name}`
          );
      }
    } catch (error) {
      if (error instanceof McpError) throw error;
      throw new McpError(
        ErrorCode.InternalError,
        `Tool execution failed: ${error}`
      );
    }
  }

  private async searchPages(args: any) {
    const results = await this.notionClient.searchPages(args.query, args.limit);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            results.map((page: any) => ({
              id: page.id,
              title: formatPageProperties(page.properties).title || 'Untitled',
              url: page.url,
              lastEdited: page.last_edited_time,
            })),
            null,
            2
          ),
        },
      ],
    };
  }

  private async searchDatabases(args: any) {
    const results = await this.notionClient.searchDatabases(args.query, args.limit);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            results.map((db: any) => ({
              id: db.id,
              title: db.title[0]?.plain_text || 'Untitled',
              url: db.url,
              lastEdited: db.last_edited_time,
            })),
            null,
            2
          ),
        },
      ],
    };
  }

  private async getPage(args: any) {
    const page = await this.notionClient.getPage(args.pageId);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            id: page.id,
            properties: formatPageProperties((page as any).properties),
            url: (page as any).url,
            lastEdited: (page as any).last_edited_time,
          }, null, 2),
        },
      ],
    };
  }

  private async getPageContent(args: any) {
    const blocks = await this.notionClient.getBlocks(args.pageId);
    const content = blocks.map(blockToText).filter(text => text).join('\n\n');
    return {
      content: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }

  private async queryDatabase(args: any) {
    const response = await this.notionClient.queryDatabase(args.databaseId, {
      filter: args.filter,
      sorts: args.sorts,
      page_size: args.limit,
    });
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(
            response.results.map((page: any) => ({
              id: page.id,
              properties: formatPageProperties(page.properties),
              url: page.url,
              lastEdited: page.last_edited_time,
            })),
            null,
            2
          ),
        },
      ],
    };
  }

  private async createPage(args: any) {
    const properties: any = {
      title: {
        title: [
          {
            text: {
              content: args.title,
            },
          },
        ],
      },
    };

    if (args.properties) {
      Object.assign(properties, args.properties);
    }

    const pageParams: any = {
      parent: { page_id: args.parentId },
      properties,
    };

    if (args.content) {
      pageParams.children = args.content;
    }

    const page = await this.notionClient.createPage(pageParams);
    
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            id: page.id,
            url: (page as any).url,
            message: 'Page created successfully',
          }, null, 2),
        },
      ],
    };
  }

  async start() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Notion MCP server started');
  }
}