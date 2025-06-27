#!/usr/bin/env node
import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function readPage(pageId) {
  try {
    // Get page properties
    console.log('📄 Getting page properties...\n');
    const page = await notion.pages.retrieve({ page_id: pageId });
    
    console.log('Page Title:', page.properties.title?.title?.[0]?.plain_text || 'No title');
    console.log('Page URL:', page.url);
    console.log('Created:', new Date(page.created_time).toLocaleString());
    console.log('Last edited:', new Date(page.last_edited_time).toLocaleString());
    
    // Get page content blocks
    console.log('\n📝 Getting page content...\n');
    const blocks = await notion.blocks.children.list({
      block_id: pageId,
      page_size: 100
    });
    
    console.log(`Found ${blocks.results.length} blocks in the page:\n`);
    
    // Parse and display content
    for (const block of blocks.results) {
      if (block.type === 'paragraph' && block.paragraph.rich_text.length > 0) {
        const text = block.paragraph.rich_text.map(t => t.plain_text).join('');
        console.log('Paragraph:', text);
      } else if (block.type === 'heading_1') {
        const text = block.heading_1.rich_text.map(t => t.plain_text).join('');
        console.log('\n# ' + text);
      } else if (block.type === 'heading_2') {
        const text = block.heading_2.rich_text.map(t => t.plain_text).join('');
        console.log('\n## ' + text);
      } else if (block.type === 'heading_3') {
        const text = block.heading_3.rich_text.map(t => t.plain_text).join('');
        console.log('\n### ' + text);
      } else if (block.type === 'bulleted_list_item') {
        const text = block.bulleted_list_item.rich_text.map(t => t.plain_text).join('');
        console.log('• ' + text);
      } else if (block.type === 'numbered_list_item') {
        const text = block.numbered_list_item.rich_text.map(t => t.plain_text).join('');
        console.log('1. ' + text);
      } else if (block.type === 'to_do') {
        const text = block.to_do.rich_text.map(t => t.plain_text).join('');
        const checked = block.to_do.checked ? '✓' : '☐';
        console.log(`${checked} ${text}`);
      } else if (block.type === 'toggle') {
        const text = block.toggle.rich_text.map(t => t.plain_text).join('');
        console.log('▶ ' + text);
      } else if (block.type === 'code') {
        const text = block.code.rich_text.map(t => t.plain_text).join('');
        const language = block.code.language || 'plaintext';
        console.log(`\nCode (${language}):`);
        console.log('```');
        console.log(text);
        console.log('```');
      } else if (block.type === 'child_database') {
        console.log('\n📊 Child Database:', block.child_database.title);
      } else if (block.type === 'child_page') {
        console.log('\n📄 Child Page:', block.id);
      }
    }
    
  } catch (error) {
    console.error('❌ Error reading page:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\nMake sure the page is shared with your integration.');
    }
  }
}

// Read the Command Center page
const pageId = '1e2b3d5e-22cd-8082-991d-ca3a2274e543';
console.log(`Reading page with ID: ${pageId}\n`);
readPage(pageId);