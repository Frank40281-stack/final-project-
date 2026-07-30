# Project-Scoped Rules

## Stock Query Rules
- **US Stock (美股)**: When the user asks about US stocks or asks for US stock data/dashboard, provide the link to: http://34.81.30.50:8000/api/
- **Taiwan Stock (台股)**: When the user asks about Taiwan stocks or asks for Taiwan stock data/dashboard, provide the link to: http://35.229.146.232/

## Chatbot & Data Fetching Architecture
- **Stock AI Chat Widget (右下角機器人 v3.1 雙配色版本)**:
  - **雙配色主題 (Dual Themes & 🎨 Switcher)**:
    1. `👑 尊爵黑金 (Alpha Dark Gold)`: 預設主題，專為 Alpha 阿爾法投資網站設計之奢華深色金黃配色（`#f3d077` ~ `#c59b27`）。
    2. `⚡ 霓虹藍紫 (Classic Neon)`: 舊版經典電競科技配色（`#00d4ff` ~ `#7b61ff`）。
    - 使用者可透過右上角 `🎨` 按鈕切換，偏好設定會自動紀錄於 `localStorage.stockai_theme`。
