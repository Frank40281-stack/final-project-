# 🎨 Alpha 專案 v2.0 配色規範與 HTML 頁面對照地圖 (COLOR Mapping & Design System v2.0)

本文件記載專案經過清理與整理後的 v2.0 最終定案版配色規範與對應網頁說明。

---

## 📌 v2.0 最終定案版配色與 HTML 對照表 (Color to HTML Mapping Table)

| 配色主題 / 風格 | 配色規範文件 (`color/`) | 相對應 HTML 頁面 | 核心色調 (Hex Token) |
| :--- | :--- | :--- | :--- |
| **翡翠墨綠香檳金 (v2.0 預設正式主頁 + StockAI Widget)** | [finalcolor_palette.md](file:///h:/2026-finalPROJECT/color/finalcolor_palette.md) | [index.html](file:///h:/2026-finalPROJECT/index.html) | `#0A1810` `#F5D77F` `#34D399` |

---

## 🤖 StockAI 智能問答機器人組件 (已整合至首頁右下角)

* **整合主頁**：[index.html](file:///h:/2026-finalPROJECT/index.html)
* **浮動套件**：[AIBOT/chatbot/widget.js](file:///h:/2026-finalPROJECT/AIBOT/chatbot/widget.js)
* **安全金鑰**：[AIBOT/.config.json](file:///h:/2026-finalPROJECT/AIBOT/.config.json) (隱藏檔受 `.gitignore` 保護)
* **說明文件**：[AIBOT/chatbot/README.md](file:///h:/2026-finalPROJECT/AIBOT/chatbot/README.md)

---

## 🔍 v2.0 核心視覺與組件說明

### 翡翠墨綠香檳金 (Emerald & Gold Luxury Theme v2.0)
* **主背景色**：`#0A1810` (深沉翡翠墨綠)
* **主要強調色**：`#F5D77F` (奢華香檳金)
* **右上角 MENU 按鈕**：金邊、金字、金色雙橫線 (`#F5D77F`) 100% 統一。
* **自訂滑鼠游標**：金光閃閃香檳金光暈游標 (`.cursor` z-index: `2147483647` 最高合法層級)。
