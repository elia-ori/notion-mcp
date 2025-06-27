#!/usr/bin/env node
import { NotionMcpServer } from './server/index.js';
import * as dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.NOTION_API_KEY;

if (!apiKey) {
  console.error('Error: NOTION_API_KEY environment variable is required');
  console.error('Please set it in your .env file or environment');
  process.exit(1);
}

const server = new NotionMcpServer(apiKey);

server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});