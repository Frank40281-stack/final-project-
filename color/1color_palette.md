# 🎨 黑金經典價值投資配色指南 (Luxury Black & Gold Investment Palette)

本配色方案靈感取自書籍《不盯盤、不看線圖，50萬滾出50億》封面視覺設計。整體風格展現出**極致沉穩、專業權威、高奢價值感與高對比視覺衝擊力**，非常適合應用於金融投資、資產管理、高級品牌與高轉換率網頁設計。

---

## 核心色彩盤 (Palette Breakdown)

### 1. 深度沉穩黑 (Deep Charcoal & Jet Black) - 主背景色
* **視覺心理**：代表專業權威、高端神秘感、沉穩不張揚。
* **應用場景**：網頁整體背景 (Hero Area)、卡片底圖、導覽列 (Navbar)。
  * **主背景黑 (Jet Black)**: `#0D0D0D` / `rgb(13, 13, 13)`
  * **深灰卡片黑 (Charcoal Surface)**: `#1A1A1A` / `rgb(26, 26, 26)`
  * **柔和邊界黑 (Border Shadow)**: `#262626` / `rgb(38, 38, 38)`

---

### 2. 奢華高光金 (Metallic Champagne Gold) - 主視覺焦點
* **視覺心理**：代表資產財富、卓越成就、核心價值與高回報率。
* **應用場景**：關鍵數據數字 (如：50億)、金屬光澤漸層標題、獎牌標籤 (TOP1)、重要趨勢箭頭。
  * **高光金 (Bright Highlight Gold)**: `#F5D77F` / `rgb(245, 215, 127)`
  * **標準金 (Base Royal Gold)**: `#D4AF37` / `rgb(212, 175, 55)`
  * **暗影金 (Deep Bronze Shadow)**: `#9B7B38` / `rgb(155, 123, 56)`
  * **漸層語法 (Gold Gradient CSS)**:
    ```css
    background: linear-gradient(135deg, #F5D77F 0%, #D4AF37 50%, #9B7B38 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    ```

---

### 3. 醒目活力紅 (Crimson Vermilion Red) - 強烈對比強調色
* **視覺心理**：代表緊急感、熱銷突破、關鍵警示與行動引導 (CTA)。
* **應用場景**：促銷標籤 (上市首月突破)、熱門推薦 Badge、重要行動按鈕 (CTA Button)。
  * **珊瑚朱紅 (Crimson Red)**: `#E63946` / `rgb(230, 57, 70)`
  * **深深紅 (Dark Crimson)**: `#C1121F` / `rgb(193, 18, 31)`

---

### 4. 純淨高對比白 (Pure White & Light Cream) - 主要文字與標題
* **視覺心理**：代表清晰透明、極佳閱讀性、純潔客觀。
* **應用場景**：主標題文字 (如：不盯盤、不看線圖)、副標題、正文內容。
  * **純潔白 (Pure White)**: `#FFFFFF` / `rgb(255, 255, 255)`
  * **柔和白 (Warm Soft White)**: `#F8F9FA` / `rgb(248, 249, 250)`

---

### 5. 古銅啞光金 (Muted Antique Gold) - 輔助線條與次要邊框
* **視覺心理**：精緻細節、不搶眼的優雅質感。
* **應用場景**：區塊分隔線、小步驟卡片外框 (1 資產價值投資、2 收益價值投資)。
  * **古銅金 (Muted Bronze)**: `#A68A56` / `rgb(166, 138, 86)`
  * **次要金邊 (Subtle Gold Border)**: `#685532` / `rgb(104, 85, 50)`

---

## 🎨 色彩對照表 (Color Reference Table)

| 色彩類別 | 色彩名稱 | HEX 碼 | RGB 碼 | HSL 碼 | 主要用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **主背景** | 沉穩純黑 | `#0D0D0D` | `rgb(13, 13, 13)` | `hsl(0, 0%, 5%)` | 頁面整體底色 |
| **次背景** | 深灰卡片 | `#1A1A1A` | `rgb(26, 26, 26)` | `hsl(0, 0%, 10%)` | 卡片背景 / 浮層選單 |
| **主焦點** | 香檳高光金 | `#F5D77F` | `rgb(245, 215, 127)` | `hsl(45, 87%, 73%)` | 金色漸層高光 / 核心數據 |
| **主焦點** | 帝王標準金 | `#D4AF37` | `rgb(212, 175, 55)` | `hsl(46, 65%, 52%)` | 核心圖示 / 標籤文字 |
| **強調色** | 醒目朱紅 | `#E63946` | `rgb(230, 57, 70)` | `hsl(355, 78%, 56%)` | 熱銷標籤 / 行動按鈕 (CTA) |
| **主要文字** | 純潔白 | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | 主標題 / 正文內文 |
| **輔助線條** | 古銅啞光金 | `#A68A56` | `rgb(166, 138, 86)` | `hsl(39, 32%, 49%)` | 外框線 / 分隔線 / 步驟卡 |

---

## 💻 CSS 設計 Token (Copy-Paste CSS Variables)

可以直接複製以下 CSS 變數至專案的 `root` 或 CSS 檔案中：

```css
:root {
  /* 背景系列 */
  --bg-primary: #0d0d0d;
  --bg-surface: #1a1a1a;
  --bg-surface-hover: #262626;

  /* 金色主視覺系列 */
  --color-gold-light: #f5d77f;
  --color-gold-base: #d4af37;
  --color-gold-dark: #9b7b38;
  --gradient-gold: linear-gradient(135deg, #f5d77f 0%, #d4af37 50%, #9b7b38 100%);

  /* 紅色強調系列 */
  --color-accent-red: #e63946;
  --color-accent-red-hover: #c1121f;

  /* 文字系列 */
  --text-primary: #ffffff;
  --text-secondary: #f8f9fa;
  --text-muted: #a68a56;

  /* 邊框與分隔線 */
  --border-gold: #a68a56;
  --border-subtle: #332d21;
}
```
