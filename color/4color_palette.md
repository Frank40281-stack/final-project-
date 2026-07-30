# 🎨 元大證券「投資先生」活潑信任藍黃風格配色指南 (Yuanta Trust Blue & Vibrant Orange)

本配色方案靈感取自台灣券商龍頭「元大證券 - 投資先生」官方首頁（`https://www.yuanta.com.tw/file-repository/content/mr_invest/index.html`）。整體採用**信賴深藍、活力橘黃與清爽天藍水藍**，展現出**國民級券商誠信、親民活力、明亮親切與極佳閱讀性**。

---

## 核心色彩盤 (Palette Breakdown)

### 1. 元大信賴藍 (Yuanta Corporate Trust Blue) - 主品牌與權威感
* **視覺心理**：代表安全信賴、規模龐大、穩健與交易權威感。
* **應用場景**：品牌 Logo、主標題「投資先生 最懂你的投資專家」、按鈕底色。
  * **元大經典藍 (Primary Blue)**: `#1E8BFA` / `rgb(30, 139, 250)`
  * **深邃品牌藍 (Dark Trust Blue)**: `#004899` / `rgb(0, 72, 153)`
  * **科技天空藍 (Sky Blue Glow)**: `#E4F4FF` / `rgb(228, 244, 255)`

---

### 2. 活力陽光橘黃 (Vibrant Sunshine Orange & Gold) - 行動按鈕與開戶焦點
* **視覺心理**：代表親民熱情、富貴增值、吸引點擊與行動轉換率 (CTA)。
* **應用場景**：側邊「我要開戶」、「立即下載」浮動按鈕、強調獎項標籤。
  * **活力橘黃 (Sunshine Orange)**: `#FEAE2A` / `rgb(254, 174, 42)`
  * **暖意珊瑚橘 (Coral Orange)**: `#FF974F` / `rgb(255, 151, 79)`

---

### 3. 明亮清爽白 (Clean White & Soft Gray) - 背景與內文最高可讀性
* **視覺心理**：代表透明清晰、資訊公開、現代簡潔。
* **應用場景**：整體頁面背景、功能說明卡片。
  * **極致清爽白 (Pure White)**: `#FFFFFF` / `rgb(255, 255, 255)`
  * **新微立體陰影 (Neo-Brutalism Shadow Blue)**: `#C0D8F8` / `rgb(192, 216, 248)`

---

## 🎨 色彩對照表 (Color Reference Table)

| 色彩類別 | 色彩名稱 | HEX 碼 | RGB 碼 | HSL 碼 | 主要用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **主品牌色** | 元大經典藍 | `#1E8BFA` | `rgb(30, 139, 250)` | `hsl(210, 95%, 55%)` | 主標題 / 品牌識別 / 主要按鈕 |
| **次品牌色** | 深邃品牌藍 | `#004899` | `rgb(0, 72, 153)` | `hsl(212, 100%, 30%)` | 頁尾 / 輔助強調文字 |
| **焦點行動色** | 活力陽光橘 | `#FEAE2A` | `rgb(254, 174, 42)` | `hsl(37, 99%, 58%)` | 「我要開戶」/ 行動下載 CTA |
| **背景輔助色** | 科技天空藍 | `#E4F4FF` | `rgb(228, 244, 255)` | `hsl(204, 100%, 95%)` | 區塊卡片底色 / 微光背景 |
| **主要文字** | 沉穩深灰白 | `#1C2833` | `rgb(28, 40, 51)` | `hsl(210, 29%, 15%)` | 內文段落 / 功能說明 |

---

## 💻 CSS 設計 Token (Copy-Paste CSS Variables)

```css
:root {
  /* 背景系列 */
  --bg-yuanta-white: #ffffff;
  --bg-yuanta-sky: #e4f4ff;
  --bg-yuanta-card: #f8fbff;

  /* 主品牌藍與橘黃 CTA */
  --color-yuanta-blue: #1e8bfa;
  --color-yuanta-dark-blue: #004899;
  --color-yuanta-orange: #feae2a;
  --gradient-yuanta: linear-gradient(135deg, #1e8bfa 0%, #004899 100%);

  /* 影與微立體邊框 */
  --shadow-yuanta: 4px 4px 0px #c0d8f8;
  --border-yuanta: 1px solid #1e8bfa;

  /* 文字 */
  --text-yuanta-primary: #1c2833;
  --text-yuanta-muted: #566573;
}
```
