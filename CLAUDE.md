# CLAUDE.md

此檔案為 Claude Code (claude.ai/code) 在此專案中工作時的指導文件。

## 專案概覽

notion-mcp 是一個 Model Context Protocol (MCP) 伺服器，提供 Notion API 整合功能，讓 Claude Code 能夠直接與 Notion 工作區互動。此專案旨在成為一個可重用的 npm 套件，供其他開發者整合到他們的 MCP 環境中。

### 核心功能
- 搜尋 Notion 頁面和資料庫
- 讀取頁面內容和屬性
- 查詢資料庫資料
- 建立新頁面
- 更新頁面屬性

## 開發一致性原則

### 遵循規範的重要性
- 本專案所有開發工作都**必須**遵循此文件中定義的規範和最佳實踐
- 任何程式碼撰寫都應符合本文件的指導原則
- 確保團隊開發的一致性和可維護性
- **測試驅動開發**：在開始任何新功能或修改之前，應先撰寫測試

### 處理寫法不一致的流程
當遇到與 CLAUDE.md 規範不一致的寫法時，請遵循以下流程：

1. **暫停實作** - 不立即採用不一致的寫法
2. **討論評估** - 分析新寫法的優缺點，與現有規範進行比較
3. **決策過程**：
   - 如果新寫法更優：討論並更新 CLAUDE.md 規範
   - 如果現有規範更好：繼續遵循 CLAUDE.md 的指導
   - 如果存在爭議：優先保持現有規範的一致性
4. **文件同步** - 確保 CLAUDE.md 始終反映最新的最佳實踐

## 語言偏好設定
- **主要溝通語言**: 繁體中文（台灣慣用詞）
- **程式碼註解**: 英文（技術文件標準）
- **文件說明**: 繁體中文
- **錯誤訊息**: 英文（保持與 MCP 協議一致）

## TypeScript 開發規範

### 重點原則
- **強型別定義** - 充分利用 TypeScript 的型別系統
- **明確的介面定義** - 所有公開 API 都應有清楚的型別定義
- **避免 any 型別** - 使用 unknown 或更具體的型別
- **錯誤處理** - 使用明確的錯誤類型和訊息
- **非同步處理** - 優先使用 async/await 而非 callbacks
- **模組化設計** - 保持單一職責原則

### 命名慣例
- **檔案名稱**: kebab-case (例如: `notion-utils.ts`)
- **類別名稱**: PascalCase (例如: `NotionClient`)
- **函式/變數**: camelCase (例如: `searchPages`)
- **常數**: UPPER_SNAKE_CASE (例如: `MAX_RETRY_COUNT`)
- **介面**: 以 I 開頭 (例如: `INotionPage`)

## MCP 協議實作原則

### 工具定義規範
1. **明確的工具命名** - 使用 `notion_` 前綴
2. **詳細的參數說明** - 包含型別、必填性、預設值
3. **錯誤處理** - 提供清楚的錯誤訊息
4. **回應格式** - 保持一致的資料結構

### 請求處理流程
1. **參數驗證** - 檢查必要參數
2. **API 呼叫** - 處理 Notion API 請求
3. **錯誤處理** - 捕獲並轉換錯誤
4. **資料轉換** - 格式化回應資料

## Notion API 整合

### API 金鑰管理
- **環境變數**: 使用 `NOTION_API_KEY` 儲存金鑰
- **安全性**: 絕不將金鑰硬編碼在程式中
- **權限控制**: 遵循最小權限原則

### 錯誤處理策略
- **重試機制**: 對暫時性錯誤實作指數退避重試
- **錯誤分類**: 區分客戶端錯誤和伺服器錯誤
- **錯誤日誌**: 記錄詳細的錯誤資訊供除錯

### 環境變數管理
- **依賴 Claude Code**: MCP 的環境變數應由 Claude Code 管理，而非在套件中使用 dotenv
- **主流做法**: 不在 MCP 套件中包含 .env 載入邏輯
- **設定方式**: 使用 `claude mcp add` 時透過 `-e` 參數設定

## 測試策略

### 測試類型
- **單元測試**: 測試個別函式和類別
- **整合測試**: 測試與 Notion API 的整合
- **MCP 協議測試**: 驗證工具定義和回應格式

### 測試工具
- **測試框架**: Jest 或 Vitest
- **模擬工具**: 使用 mock 避免真實 API 呼叫
- **覆蓋率**: 維持 80% 以上的測試覆蓋率

## MCP 的正確理解與使用

### MCP 本質
- MCP 是 **Claude Code 的擴充工具**，不是專案依賴
- 類似 VS Code 擴充功能，應該集中管理而非分散在各專案
- 一次安裝，所有專案都能使用

### 安裝位置
- **推薦**: `~/mcp-servers/` 目錄集中管理
- **避免**: 安裝在各個專案的 node_modules
- **原因**: 避免重複安裝、版本不一致、設定困難

### Claude Code 註冊語法
```bash
# 正確語法（注意 -- 雙破折號）
claude mcp add <name> -e KEY=value -- <command> <args>

# 實際範例
claude mcp add notion -e NOTION_API_KEY=xxx -- node /path/to/index.js
```

## npm 發佈準備

### 發佈前檢查清單
1. **版本號更新** - 遵循語義化版本規範
2. **文件完整性** - README、API 文件、使用範例
3. **測試通過** - 所有測試都必須通過
4. **建置成功** - TypeScript 編譯無錯誤
5. **套件大小** - 檢查並優化套件大小

### package.json 必要欄位
- `name`: 套件名稱（考慮 scope）
- `version`: 語義化版本號
- `description`: 清楚的套件描述
- `main`: 主要入口點
- `types`: TypeScript 定義檔
- `files`: 要包含在套件中的檔案
- `keywords`: 相關關鍵字
- `author`: 作者資訊
- `license`: 授權條款
- `repository`: Git 倉庫連結

## 開發指令

### 常用指令
```bash
# 安裝依賴
npm install

# 開發模式
npm run dev

# 建置專案
npm run build

# 執行測試
npm test

# 檢查程式碼品質
npm run lint

# 格式化程式碼
npm run format
```

### 發佈流程
```bash
# 本地測試打包
npm pack

# 檢視套件內容
npm pack --dry-run

# 發佈到 npm
npm publish
```

### npm 發佈最佳實踐

#### 套件命名策略
- **使用 scope**: `@username/package-name` 避免名稱衝突
- **好處**: 品牌一致性、避免命名衝突、易於識別
- **範例**: `@elia-ori/notion-mcp`

#### 發佈流程
1. **更新 README.md** - npm 會自動使用作為套件說明
2. **更新版本號** - 遵循語義化版本
3. **提交並推送** - 保持 git 和 npm 同步
4. **執行發佈** - `npm publish`

#### 版本管理
- **修復**: 0.1.0 → 0.1.1 (patch)
- **新功能**: 0.1.0 → 0.2.0 (minor)
- **重大變更**: 0.1.0 → 1.0.0 (major)

### 台灣慣用詞對照表
請避免使用大陸用詞，統一使用台灣慣用詞彙。詳細對照表請參考：
- [台灣慣用詞對照表](./.claude/docs/taiwanese-terminology.md) - 完整的用詞規範和使用原則
## 敏感資訊管理

### API 金鑰和憑證
- **環境變數管理**: API Key 應透過 Claude Code 的環境變數設定，而非儲存在專案中
- **npm 發佈 token**: 儲存在 GitHub Secrets 中
- **安全原則**: 不在程式碼或文件中儲存實際的金鑰

## Git 工作流程

### 分支策略
- `main`: 穩定版本，可直接發佈
- `develop`: 開發分支
- `feature/*`: 新功能開發
- `fix/*`: 錯誤修復

### 提交訊息規範
遵循 Conventional Commits：
- `feat:` 新功能
- `fix:` 錯誤修復
- `docs:` 文件更新
- `refactor:` 重構
- `test:` 測試相關
- `chore:` 維護工作

## 持續整合

### GitHub Actions
- **測試流程**: 每次推送執行測試
- **建置檢查**: 確保 TypeScript 編譯成功
- **程式碼品質**: ESLint 和 Prettier 檢查
- **自動發佈**: 標籤推送時自動發佈到 npm

## 疑難排解

### 常見問題
1. **Notion API 錯誤**
   - 檢查 API 金鑰是否有效
   - 確認 Integration 有存取權限
   - 查看 API 配額限制

2. **MCP 連線問題**
   - 確認 MCP 伺服器正確啟動
   - 檢查環境變數設定
   - 查看錯誤日誌

3. **TypeScript 編譯錯誤**
   - 更新相依套件
   - 檢查 tsconfig.json 設定
   - 確認型別定義檔案

## 未來規劃

### 即將實作功能
- [ ] 更新頁面內容
- [ ] 刪除頁面功能
- [ ] 批次操作支援
- [ ] Webhook 整合
- [ ] 快取機制

### 長期目標
- 提供更完整的 Notion API 覆蓋
- 改善效能和錯誤處理
- 建立更多使用範例
- 支援更多 MCP 功能