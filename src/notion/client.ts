import { Client } from '@notionhq/client';

export class NotionClient {
  private client: Client;

  constructor(apiKey: string) {
    this.client = new Client({ auth: apiKey });
  }

  async searchPages(query: string, limit: number = 10) {
    const response = await this.client.search({
      query,
      page_size: limit,
      filter: { property: 'object', value: 'page' }
    });
    return response.results;
  }

  async searchDatabases(query: string, limit: number = 10) {
    const response = await this.client.search({
      query,
      page_size: limit,
      filter: { property: 'object', value: 'database' }
    });
    return response.results;
  }

  async getPage(pageId: string) {
    return await this.client.pages.retrieve({ page_id: pageId });
  }

  async getDatabase(databaseId: string) {
    return await this.client.databases.retrieve({ database_id: databaseId });
  }

  async queryDatabase(databaseId: string, params?: any) {
    return await this.client.databases.query({
      database_id: databaseId,
      ...params
    });
  }

  async getBlocks(blockId: string, limit: number = 100) {
    const blocks: any[] = [];
    let cursor: string | undefined;
    
    do {
      const response = await this.client.blocks.children.list({
        block_id: blockId,
        page_size: limit,
        start_cursor: cursor
      });
      
      blocks.push(...response.results);
      cursor = response.has_more ? response.next_cursor ?? undefined : undefined;
    } while (cursor);
    
    return blocks;
  }

  async createPage(params: any) {
    return await this.client.pages.create(params);
  }

  async updatePage(pageId: string, properties: any) {
    return await this.client.pages.update({
      page_id: pageId,
      properties
    });
  }

  async appendBlocks(blockId: string, children: any[]) {
    return await this.client.blocks.children.append({
      block_id: blockId,
      children
    });
  }
}