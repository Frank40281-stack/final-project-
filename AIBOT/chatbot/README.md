# StockAI Chat Widget

股市 AI 智能問答機器人，支援台股 & 美股分析。

## 🌐 Demo

部署於 Vercel：[查看 Demo](https://shj-chi.vercel.app)

## ✨ 功能

- 🤖 浮動聊天機器人（右下角 Widget）
- 🔑 支援三大 AI 供應商（自動偵測 Key 格式）
  - 🟦 **Gemini** (Google) → Key 以 `AIza` 開頭
  - 🟩 **ChatGPT** (OpenAI) → Key 以 `sk-` 開頭
  - 🟪 **Claude** (Anthropic) → Key 以 `sk-ant-` 開頭
- 📊 快捷分類 Chip（美股、台股、觀測指標、籌碼面、技術面...）
- 🌙 深色股票儀表板風格（Glassmorphism）
- 📱 RWD 響應式，支援手機版

## 🚀 嵌入任何頁面

只需一行 script：

```html
<script src="https://your-domain/chatbot/widget.js"></script>
```

## 📁 檔案結構

```
chatbot/
├── index.html      # 全頁版 AI 問答介面
├── style.css       # 深色股票風格 CSS
├── app.js          # 全頁版邏輯
├── widget.js       # 浮動 Widget（獨立嵌入版）
└── widget-demo.html # Widget 嵌入範例
```

## 🔌 資料來源

- 台股 API：http://35.229.146.232/
- 美股 API：http://34.81.30.50:8000/api/
