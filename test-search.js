import { NotionClient } from './dist/notion/client.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function testSearch() {
  const apiKey = process.env.NOTION_API_KEY;
  if (!apiKey) {
    console.error('NOTION_API_KEY is required');
    process.exit(1);
  }

  const client = new NotionClient(apiKey);
  
  try {
    console.log('Searching for pages...');
    const pages = await client.searchPages('', 5); // 搜尋前 5 個頁面
    
    if (pages.length > 0) {
      console.log(`Found ${pages.length} pages:`);
      pages.forEach((page, index) => {
        const title = page.properties?.title?.title?.[0]?.plain_text || 
                     page.properties?.Name?.title?.[0]?.plain_text || 
                     'Untitled';
        console.log(`${index + 1}. ${title} (ID: ${page.id})`);
      });
      
      // 讀取第一個頁面的內容
      console.log('\nGetting content of first page...');
      const firstPageId = pages[0].id;
      const blocks = await client.getBlocks(firstPageId);
      console.log(`Page has ${blocks.length} blocks`);
    } else {
      console.log('No pages found');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

testSearch();