# 🎨 翡翠墨綠香檳金尊爵風格配色指南 (Emerald Forest & Champagne Gold Investment Palette)

本配色方案為 Alpha 阿爾法投資專案最終選定之主題風格（對應展示網頁 `finalindex.html` 與 `index_emerald.html`）。整體設計以**極深沉墨綠炭黑背景、皇室香檳高光金標題與對比數字、以及微光翡翠電光綠邊框**為核心，營造出極具專業權威、高奢資產管理感與極致閱讀舒適度之視覺饗宴。

---

## 核心色彩盤 (Palette Breakdown)

### 1. 深度沉穩墨綠黑 (Deep Emerald Forest Black) - 主背景色
* **視覺心理**：代表生機成長、資本累積、極致沉穩與專業機構信任感。
* **應用場景**：網頁 Hero 區域背景、毛玻璃導覽列 (Navbar Overlay)、卡片底圖。
  * **主背景墨綠黑 (Emerald Dark Background)**: `#0A1810` / `rgb(10, 24, 16)`
  * **深翡翠卡片綠 (Emerald Surface)**: `#0F2419` / `rgb(15, 36, 25)`
  * **透光卡片底色 (Glass Card Surface)**: `rgba(15, 36, 25, 0.85)`

---

### 2. 奢華皇室香檳金 (Metallic Champagne Gold) - 主視覺焦點與品牌符碼
* **視覺心理**：代表資產價值、頂級成就、金屬光澤與高對比視覺焦點。
* **應用場景**：品牌 Logo (`α Alpha 阿爾法投資`)、選單序號 (`{ 01 }`, `{ 02 }`)、標題亮點與漸層文字。
  * **高光香檳金 (Bright Highlight Gold)**: `#F5D77F` / `rgb(245, 215, 127)`
  * **標準皇家金 (Base Royal Gold)**: `#D4AF37` / `rgb(212, 175, 55)`
  * **暗影古銅金 (Bronze Shadow)**: `#9B7B38` / `rgb(155, 123, 56)`
  * **香檳金漸層 CSS**:
    ```css
    background: linear-gradient(135deg, #ffffff 0%, #f5d77f 50%, #d4af37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    ```

---

### 3. 翡翠電光綠 (Emerald Electric Glow) - 科技光感與互動點綴
* **視覺心理**：代表高科技量化資料、活力成長訊號與精準選購提示。
* **應用場景**：按鈕懸停 (Hover State)、微光外框 (Glowing Border)、重點次標題。
  * **螢光翡翠綠 (Emerald Glow)**: `#34D399` / `rgb(52, 211, 153)`
  * **深翡翠綠 (Emerald Accent)**: `#10B981` / `rgb(16, 185, 129)`

---

### 4. 舒適內文與輔助字體 (Clean Text & Muted Sage)
* **視覺心理**：降低高對比度產生的視覺疲勞，維持長時間閱讀舒適性。
  * **高亮標題純白 (Pure White)**: `#FFFFFF`
  * **輔助文字鼠尾草綠 (Muted Sage)**: `#A3B8AC` / `rgb(163, 184, 172)`

---

## 🎨 色彩對照表 (Color Reference Table)

| 色彩類別 | 色彩名稱 | HEX 碼 | RGB 碼 | HSL 碼 | 主要用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **主背景色** | 深墨綠炭黑 | `#0A1810` | `rgb(10, 24, 16)` | `hsl(146, 41%, 7%)` | Hero / 網頁整體底色 |
| **卡片背景** | 深翡翠綠 | `#0F2419` | `rgb(15, 36, 25)` | `hsl(149, 41%, 10%)` | 內容卡片 / 選單導覽底色 |
| **主焦點金** | 香檳高光金 | `#F5D77F` | `rgb(245, 215, 127)` | `hsl(45, 86%, 73%)` | 品牌 Logo / 標題漸層 / 序號標示 |
| **標準皇家金**| 經典金 | `#D4AF37` | `rgb(212, 175, 55)` | `hsl(46, 65%, 52%)` | 邊框 / 跑馬燈點綴 |
| **電光螢光綠**| 翡翠電光綠 | `#34D399` | `rgb(52, 211, 153)` | `hsl(158, 64%, 52%)` | 科技感次標 / 懸停按鈕 glow |
| **正文字體** | 鼠尾草綠 | `#A3B8AC` | `rgb(163, 184, 172)` | `hsl(146, 14%, 68%)` | 段落文字 / 描述性輔助說明 |

---

## 💻 CSS 設計 Token (Copy-Paste CSS Variables)

```css
:root {
  --bg-emerald-dark: #0a1810;
  --bg-emerald-surface: #0f2419;
  --bg-emerald-card: rgba(15, 36, 25, 0.85);
  --border-emerald-gold: rgba(212, 175, 55, 0.25);
  --border-emerald-glow: rgba(52, 211, 153, 0.3);

  --color-gold-highlight: #f5d77f;
  --color-gold-base: #d4af37;
  --color-gold-bronze: #9b7b38;
  --gradient-gold: linear-gradient(135deg, #ffffff 0%, #f5d77f 50%, #d4af37 100%);

  --color-emerald-glow: #34d399;
  --color-emerald-accent: #10b981;

  --text-white: #ffffff;
  --text-sage: #a3b8ac;
}
```
