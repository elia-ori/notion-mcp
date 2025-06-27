#!/usr/bin/env node
import { Client } from '@notionhq/client';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
  console.error('❌ Error: NOTION_API_KEY not found in .env file');
  process.exit(1);
}

console.log('🔄 Testing Notion API connection...\n');

const notion = new Client({ auth: apiKey });

async function testConnection() {
  try {
    // Test 1: Search for pages
    console.log('📄 Searching for pages...');
    const searchResponse = await notion.search({
      query: '',
      page_size: 5,
      filter: { property: 'object', value: 'page' }
    });
    
    console.log(`✅ Found ${searchResponse.results.length} pages`);
    
    if (searchResponse.results.length > 0) {
      console.log('\nFirst page:');
      const firstPage = searchResponse.results[0];
      console.log(`- ID: ${firstPage.id}`);
      console.log(`- URL: ${firstPage.url}`);
    }
    
    // Test 2: Search for databases
    console.log('\n🗃️  Searching for databases...');
    const dbResponse = await notion.search({
      query: '',
      page_size: 5,
      filter: { property: 'object', value: 'database' }
    });
    
    console.log(`✅ Found ${dbResponse.results.length} databases`);
    
    if (dbResponse.results.length > 0) {
      console.log('\nFirst database:');
      const firstDb = dbResponse.results[0];
      console.log(`- ID: ${firstDb.id}`);
      console.log(`- URL: ${firstDb.url}`);
    }
    
    console.log('\n✅ Connection test successful!');
    console.log('\n💡 Remember to share specific pages/databases with your integration in Notion.');
    
  } catch (error) {
    console.error('\n❌ Connection test failed:');
    console.error(error.message);
    console.error('\nPlease check:');
    console.error('1. Your API key is correct');
    console.error('2. The integration is properly set up in Notion');
    console.error('3. You have shared at least one page with the integration');
  }
}

testConnection();