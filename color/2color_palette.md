# 🎨 深海冰山與金色光束避險風格配色指南 (Midnight Navy & Gold Spotlight Palette)

本配色方案靈感取自「班克先生 (MR.Bank) - 投資避險」視覺主圖（`color/2.jpg`）。整體設計以**深海沉靜藍黑**作為底色，結合**冰川冷青**與**探照光束金**，展現出極致的**冷靜避險、風險掃雷、專業權威與高端科技感**。

---

## 核心色彩盤 (Palette Breakdown)

### 1. 深海沉香藍黑 (Deep Ocean Midnight Navy) - 主背景色
* **視覺心理**：代表深邃神秘、極致冷靜、沉穩專業與理性風險控管。
* **應用場景**：網頁整體背景、卡片主底色、頁尾 (Footer) 與導覽列。
  * **極深海黑藍 (Midnight Obsidian)**: `#05101E` / `rgb(5, 16, 30)`
  * **沉香湛藍 (Deep Ocean Blue)**: `#0A1F33` / `rgb(10, 31, 51)`
  * **暗藏深藍 (Slate Navy Surface)**: `#0D2840` / `rgb(13, 40, 64)`
  * **背景漸層語法**:
    ```css
    background: linear-gradient(135deg, #05101e 0%, #0a1f33 50%, #0d2840 100%);
    ```

---

### 2. 探照光束金 (Gold Spotlight & Champagne Beam) - 核心焦點與行動按鈕
* **視覺心理**：代表揭開迷霧、撥開錯覺、洞察真相與高回報核心價值。
* **應用場景**：重要關鍵字 (如：資深、掃雷術)、關鍵數據、探照光束 Glow、行動按鈕【立即報名】與價格標籤。
  * **探照高光金 (Bright Beam Gold)**: `#FFE57F` / `rgb(255, 229, 127)`
  * **香檳暖金 (Champagne Base Gold)**: `#F0C430` / `rgb(240, 196, 48)`
  * **按鈕古銅金 (Bronze CTA Gold)**: `#C29B38` / `rgb(194, 155, 56)`

---

### 3. 冰山冷晶青 (Glacier Ice Cyan) - 避險與科技輔助色
* **視覺心理**：代表風險防範、理性透明、冰山隱藏風險與數據晶亮感。
* **應用場景**：趨勢線圖 (K線/折線圖)、水波微光、邊框線條、數據標籤。
  * **冰山極光青 (Glacier Cyan Glow)**: `#80DEEA` / `rgb(128, 222, 234)`
  * **海水深青 (Ocean Teal Blue)**: `#1E88E5` / `rgb(30, 136, 229)`

---

### 4. 純淨雪白 (Pure White) - 主標題與高可讀性文字
* **視覺心理**：純潔清晰、高傳達效率、極佳可讀性。
* **應用場景**：主標題文字 (投資避險)、副標題、內文段落。
  * **雪山白 (Pure Crisp White)**: `#FFFFFF` / `rgb(255, 255, 255)`
  * **雲霧柔白 (Cloud Soft White)**: `#E0E6ED` / `rgb(224, 230, 237)`

---

## 🎨 色彩對照表 (Color Reference Table)

| 色彩類別 | 色彩名稱 | HEX 碼 | RGB 碼 | HSL 碼 | 主要用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **主背景** | 極深海黑藍 | `#05101E` | `rgb(5, 16, 30)` | `hsl(214, 71%, 7%)` | 頁面整體主底色 |
| **次背景** | 沉香湛藍 | `#0A1F33` | `rgb(10, 31, 51)` | `hsl(209, 67%, 12%)` | 卡片背景 / 導覽區塊 |
| **核心焦點** | 探照高光金 | `#FFE57F` | `rgb(255, 229, 127)` | `hsl(48, 100%, 75%)` | 標題關鍵字 / 焦點光束 |
| **行動按鈕** | 按鈕古銅金 | `#C29B38` | `rgb(194, 155, 56)` | `hsl(43, 55%, 49%)` | 【立即報名】/ 價格標籤底色 |
| **科技輔助** | 冰山極光青 | `#80DEEA` | `rgb(128, 222, 234)` | `hsl(187, 71%, 71%)` | 折線圖 / 科技微光 / 邊框 |
| **主要文字** | 純淨雪白 | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | 主標題 / 正文文字 |

---

## 💻 CSS 設計 Token (Copy-Paste CSS Variables)

可以直接複製以下 CSS 變數至專案中使用：

```css
:root {
  /* 背景系列 */
  --bg-deep-ocean: #05101e;
  --bg-navy-surface: #0a1f33;
  --bg-slate-card: #0d2840;

  /* 金色焦點與 CTA */
  --color-beam-gold: #ffe57f;
  --color-cta-gold: #c29b38;
  --gradient-ocean-gold: linear-gradient(135deg, #ffe57f 0%, #f0c430 50%, #c29b38 100%);

  /* 冰山青科技色 */
  --color-glacier-cyan: #80deea;
  --color-ocean-blue: #1e88e5;

  /* 文字系列 */
  --text-white: #ffffff;
  --text-cloud: #e0e6ed;
  --text-muted-cyan: #80deea;

  /* 邊框與分隔線 */
  --border-cyan-subtle: rgba(128, 222, 234, 0.2);
  --border-gold-subtle: rgba(240, 196, 48, 0.3);
}
```
