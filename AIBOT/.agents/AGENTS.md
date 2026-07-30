# Project-Scoped Rules

## Stock Query Rules
- **US Stock (美股)**: When the user asks about US stocks or asks for US stock data/dashboard, provide the link to: http://34.81.30.50:8000/api/
- **US Stock News (美股新聞)**: When the user asks about US stock news or AI stock news analysis, provide the link to: http://35.234.20.97/stock_ai/
- **Taiwan Stock (台股)**: When the user asks about Taiwan stocks or asks for Taiwan stock data/dashboard, provide the link to: http://35.229.146.232/

## Chatbot & Data Fetching Architecture
- **Stock AI Chat Widget (右下角機器人 v3.1 雙配色版本)**:
  - **雙配色主題 (Dual Themes & 🎨 Switcher)**:
    1. `👑 尊爵黑金 (Alpha Dark Gold)`: 預設主題，專為 Alpha 阿爾法投資網站設計之奢華深色金黃配色（`#f3d077` ~ `#c59b27`）。
    2. `⚡ 霓虹藍紫 (Classic Neon)`: 舊版經典電競科技配色（`#00d4ff` ~ `#7b61ff`）。
    - 使用者可透過右上角 `🎨` 按鈕切換，偏好設定會自動紀錄於 `localStorage.stockai_theme`。
  - **Smart Fetch 智慧按需連線**: 機器人採用按需輕量化抓取機制（Smart Fetch）。當使用者詢問股票檔數、即時資料或特定標的時，前端自動注入美股 433 檔資料庫狀態並連線 `http://35.229.146.232/` 擷取輕量數據（如 133 檔台股摘要）注入模型，極大化節省傳輸與 AI Token 資源。
  - **資料時效性 (即時 vs 歷史)**: 
    1. 股票清單與 API 狀態：支援即時動態連線與狀態檢測。
    2. 籌碼與財務面指標：採用最新交易日與 13F、Form 4、MRQ 財報之歷史發布與算量數據。
    3. 技術面與動能：包含近三日觸發買訊之動態篩選。

## Future Task Reminders
- **Chatbot Test Webpage (AI問答機器人測試網頁)**: 已完成 v3.1 雙主題配色與多 AI 供應商支援（Gemini / OpenAI / Claude）與 Smart Fetch 動態資料載入機制，已部署於 GitHub `yahui236236/final-project` 及隨身碟 `D:\2026-final-project`。
