# Notion MCP Server

一個 Model Context Protocol (MCP) 伺服器，用於整合 Notion API，讓 Claude Code 可以直接與你的 Notion 工作區互動。

## 功能

- 搜尋頁面和資料庫
- 讀取頁面內容和屬性
- 查詢資料庫內容
- 建立新頁面
- 更新頁面屬性

## 前置需求

1. Node.js 18 或更高版本
2. Notion API Key（從 [Notion Integrations](https://www.notion.so/my-integrations) 取得）

## 安裝步驟

### 1. 複製專案並安裝依賴

```bash
cd ~/Projects/mcp-servers  # 或你的 MCP 專案目錄
git clone [your-repo-url] notion-mcp  # 如果有 git repo
cd notion-mcp
npm install
```

### 2. 設定 Notion API Key

複製環境變數範例檔案：
```bash
cp .env.example .env
```

編輯 `.env` 檔案，加入你的 Notion API Key：
```
NOTION_API_KEY=secret_xxxxxxxxxxxxxxxxxxxxx
```

### 3. 建立 Notion Integration

1. 前往 https://www.notion.so/my-integrations
2. 點擊 "New integration"
3. 給 integration 一個名稱（例如 "Claude Code MCP"）
4. 選擇你要連接的工作區
5. 複製 "Internal Integration Token"

### 4. 授權 Integration 存取頁面

在 Notion 中，你需要明確授權 integration 存取特定頁面或資料庫：

1. 開啟你想要存取的頁面或資料庫
2. 點擊右上角的 "..." 選單
3. 在 "Connections" 區域，點擊 "Add connections"
4. 搜尋並選擇你的 integration

### 5. 建置專案

```bash
npm run build
```

### 6. 在 Claude Code 中註冊 MCP 伺服器

```bash
claude mcp add notion
```

當提示時，輸入：
- Name: `notion`
- Command: `node`
- Arguments: `/Users/alvin/Projects/mcp-servers/notion-mcp/dist/index.js`

## 使用方式

在 Claude Code 中，你可以使用以下工具：

### 搜尋頁面
```
使用 notion_search_pages 工具搜尋 "專案計畫"
```

### 讀取頁面內容
```
使用 notion_get_page_content 工具讀取頁面 ID xxx-xxx-xxx 的內容
```

### 查詢資料庫
```
使用 notion_query_database 工具查詢資料庫 ID xxx-xxx-xxx
```

### 建立新頁面
```
使用 notion_create_page 工具在頁面 ID xxx-xxx-xxx 下建立標題為 "新任務" 的頁面
```

## 可用工具

- `notion_search_pages` - 搜尋 Notion 頁面
- `notion_search_databases` - 搜尋 Notion 資料庫
- `notion_get_page` - 取得特定頁面的屬性
- `notion_get_page_content` - 取得頁面的內容區塊
- `notion_query_database` - 查詢資料庫（支援篩選和排序）
- `notion_create_page` - 建立新頁面

## 開發

### 開發模式
```bash
npm run dev
```

### 建置
```bash
npm run build
```

### 專案結構
```
notion-mcp/
├── src/
│   ├── index.ts          # 入口點
│   ├── server/
│   │   └── index.ts      # MCP 伺服器實作
│   ├── notion/
│   │   └── client.ts     # Notion API 客戶端
│   └── utils/
│       └── notion-utils.ts # 工具函數
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## 疑難排解

### 找不到頁面或資料庫
確保你已經在 Notion 中授權 integration 存取該頁面或資料庫。

### API Key 無效
檢查 `.env` 檔案中的 API Key 是否正確，並確保 integration 仍然有效。

### 權限錯誤
確保 integration 有足夠的權限（讀取/寫入）來執行所需的操作。

## 授權

MIT License