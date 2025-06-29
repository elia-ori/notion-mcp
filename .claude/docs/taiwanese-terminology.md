# 台灣慣用詞對照表

此文件定義專案中應使用的台灣慣用詞彙，避免使用大陸用詞。

## 技術術語對照

**避免使用（大陸用詞）→ 使用（台灣慣用詞）**

### 軟體開發相關
- 優化 → 最佳化
- 軟件/硬件 → 軟體/硬體
- 數據 → 資料
- 網絡 → 網路
- 信息 → 資訊
- 服務器 → 伺服器
- 默認 → 預設
- 登錄 → 登入
- 配置/設置 → 設定
- 緩存 → 快取
- 變量 → 變數
- 函數 → 函式
- 類 → 類別
- 對象 → 物件
- 模塊 → 模組
- 組件 → 元件
- 調試 → 偵錯
- 異常 → 例外
- 運行 → 執行
- 創建 → 建立
- 保存 → 儲存
- 導入/導出 → 匯入/匯出
- 導航 → 導覽
- 搜索 → 搜尋
- 查找 → 尋找
- 界面 → 介面
- 交互 → 互動
- 用戶 → 使用者
- 訪問 → 存取
- 加載 → 載入
- 發布 → 發佈
- 回滾 → 回復
- 撤銷 → 復原
- 重構 → 重構（保持不變）
- 部署 → 部署（保持不變）

### 電腦硬體相關
- 視頻 → 影片
- 信息 → 訊息
- 默認 → 預設
- 添加 → 新增/加入
- 剪切 → 剪下
- 粘貼 → 貼上
- 菜單 → 選單
- 文件 → 檔案
- 打印 → 列印
- 字節 → 位元組
- 鼠標 → 滑鼠
- 鍵盤 → 鍵盤（相同）
- 磁盤 → 磁碟
- 計算機 → 電腦

### 網路相關
- 網絡連接 → 網路連線
- 網絡配置 → 網路設定
- 在線 → 線上
- 離線 → 離線（相同）
- 下載 → 下載（相同）
- 上傳 → 上傳（相同）
- 帶寬 → 頻寬
- 流量 → 流量（相同）

### 資料庫相關
- 數據庫 → 資料庫
- 數據表 → 資料表
- 字段 → 欄位
- 記錄 → 記錄（相同）
- 查詢 → 查詢（相同）
- 索引 → 索引（相同）
- 主鍵 → 主鍵（相同）
- 外鍵 → 外來鍵

### 專案管理相關
- 需求分析 → 需求分析（相同）
- 項目 → 專案
- 版本控制 → 版本控制（相同）
- 測試用例 → 測試案例
- 文檔 → 文件

## 使用原則
### 1. 適用範圍
- 技術文件和說明
- 程式碼註解
- 錯誤訊息
- API 文件
- Git commit 訊息
- 使用者介面文字

### 2. 例外情況
- **專有名詞** - 保持原文（如 Laravel、Docker）
- **既定慣例** - 如果專案中已有既定用法且改變會造成混淆
- **第三方文件引用** - 直接引用時保持原文

### 3. 實際應用範例

#### Git Commit 訊息
**Bad:**
```
feat: 优化用户登录逻辑
fix: 修复数据库连接问题
docs: 更新API文档
```

**Good:**
```
feat: 最佳化使用者登入邏輯
fix: 修正資料庫連線問題
docs: 更新 API 文件
```
