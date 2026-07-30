# 🎨 商業周刊「財富網」權威媒體雜誌風格配色指南 (Business Weekly Editorial Red & Warm Gold)

本配色方案靈感取自台灣財經權威媒體「商業周刊 財富網」（`https://wealth.businessweekly.com.tw/`）。整體設計以**商周權威紅、暖意標記黃、深炭灰導覽與純白閱讀底色**，展現出**知識權威、深度報導、極佳閱讀舒適度與內容導向**的專業媒體質感。

---

## 核心色彩盤 (Palette Breakdown)

### 1. 商周權威紅 (Business Weekly Editorial Red) - 品牌與即時焦點
* **視覺心理**：代表商業洞察、即時權威、專業報導與焦點強光。
* **應用場景**：品牌標籤、分類Tag、標題小邊框與重要連結。
  * **商周經典紅 (Primary Red)**: `#C8161D` / `rgb(200, 22, 29)`
  * **活力鮮明紅 (Bright Red)**: `#E60012` / `rgb(230, 0, 18)`

---

### 2. 商周金黃標籤 (Editorial Highlight Gold) - 分類亮點與排行數字
* **視覺心理**：代表經典專欄、財富致富、熱門聚焦。
* **應用場景**：「名人堂」頂部標籤、側邊欄「最新文章」、「熱門排行」數字標章 (1, 2, 3)。
  * **商周暖金 (Highlight Gold)**: `#FFC800` / `rgb(255, 200, 0)`
  * **亮黃標籤 (Bright Yellow)**: `#F5B800` / `rgb(245, 184, 0)`

---

### 3. 深炭灰導覽列 (Deep Charcoal Nav Header) - 高級沉穩架構
* **視覺心理**：代表秩序、專業架構、低調襯托主要文章。
* **應用場景**：頂部固定導覽列 (Header Bar)、頁尾與按鈕。
  * **深炭灰 (Charcoal Header)**: `#222222` / `rgb(34, 34, 34)`
  * **選中金黃底 (Active Yellow Tab)**: `#FFC800`

---

### 4. 閱讀舒適純白與炭灰內文 (Clean White & Soft Black) - 極致閱讀體驗
* **視覺心理**：最大化閱讀舒適度，降低長時間觀看眼睛疲勞。
* **應用場景**：主要文章內文、報導背景。
  * **純潔白底色 (Pure White)**: `#FFFFFF`
  * **內文炭灰黑 (Body Charcoal)**: `#2B2B2B`
  * **中介資料灰 (Muted Gray)**: `#666666`

---

## 🎨 色彩對照表 (Color Reference Table)

| 色彩類別 | 色彩名稱 | HEX 碼 | RGB 碼 | HSL 碼 | 主要用途 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **主品牌色** | 商周權威紅 | `#C8161D` | `rgb(200, 22, 29)` | `hsl(358, 80%, 44%)` | 分類標籤 / 品牌標誌 / 重要連結 |
| **高光標籤** | 商周暖金 | `#FFC800` | `rgb(255, 200, 0)` | `hsl(47, 100%, 50%)` | 「名人堂」標籤 / 熱門排行 123 標章 |
| **導覽底色** | 深炭灰 | `#222222` | `rgb(34, 34, 34)` | `hsl(0, 0%, 13%)` | 頂部導覽列 / 沉穩邊框 |
| **背景底色** | 純潔白 | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | 主要內文閱讀背景 |
| **正文字體** | 炭灰黑 | `#2B2B2B` | `rgb(43, 43, 43)` | `hsl(0, 0%, 17%)` | 正文內文 (高可讀性) |

---

## 💻 CSS 設計 Token (Copy-Paste CSS Variables)

```css
:root {
  /* 背景系列 */
  --bg-bw-white: #ffffff;
  --bg-bw-header: #222222;
  --bg-bw-card: #f9f9f9;

  /* 品牌紅與暖金 */
  --color-bw-red: #c8161d;
  --color-bw-gold: #ffc800;
  --gradient-bw: linear-gradient(135deg, #c8161d 0%, #a00e14 100%);

  /* 文字 */
  --text-bw-primary: #2b2b2b;
  --text-bw-muted: #666666;
  --text-bw-header: #ffffff;
}
```
