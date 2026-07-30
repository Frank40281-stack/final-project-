## 🎨 一、 溫暖配色系統分析 (Color Palette Analysis)

這套色彩設計之所以給人**溫暖、親切又安心**的感受，主因在於它大量使用了**帶有木質與大地質感的暖橘與栗褐色系**，並搭配**沉穩的深石青色**作為輔助平衡，擺脫了傳統政府或醫療網站冰冷的感覺。

### 1. 核心色彩盤 (Color Tokens)

| 色彩名稱 | HEX 碼 | RGB / 視覺說明 | 應用位置與功能 | 心理學感受 |
| :--- | :--- | :--- | :--- | :--- |
| **暖磚橘 (Warm Terracotta)** | `#D04500` | `rgb(208, 69, 0)`<br>溫暖的柿橘、磚紅色 | 主按鈕 (`.btn-submit`, `.btn-primary`)、關鍵字、標題焦點、無障礙Focus框 | 傳遞關懷、親切、熱情與生命力，給予照顧者與長者被擁抱的安全感 |
| **沉穩深石青 (Deep Teal)** | `#004852` | `rgb(0, 72, 82)`<br>深沉耐看的藍綠色 | Top Nav 快選按鈕、網頁網址連結、重點對比 | 與暖橘色形成高對比的「補色平衡」，增加醫療與公共服務的權威感與專業信賴度 |
| **栗褐大地棕 (Warm Chestnut)** | `#663C2A` | `rgb(102, 60, 42)`<br>自然大地木質棕 | 麵包屑導航 (`.breadcrumb`)、次要連結線條 | 溫合沉穩，連結大地與自然的意象，提升親合力 |
| **深炭灰內文 (Soft Charcoal)** | `#1C1B1B` | `rgb(28, 27, 27)`<br>微溫深炭灰色 | 主要內文段落 (`body`) | 替代刺眼的純黑色 (`#000000`)，在長時間閱讀時大幅降低視覺疲勞 |
| **暖灰色次要文字 (Medium Slate)**| `#504E4E` | `rgb(80, 78, 78)`<br>質感中灰色 | H3/H4 副標題、腳步導航資訊 | 建立良好的視覺層級 (Visual Hierarchy) |
| **暖白/乳灰背景 (Warm Grey/White)**| `#F1F1F1` / `#FFFFFF` | 溫和的淡灰與乾淨白 | 區塊卡片背景、搜尋欄、網頁底色 | 確保畫面潔淨、透氣，提升字體可讀性 |


## 💡 三、 UI/UX 設計亮點 (Design Highlights)

1. **友善銀髮族的大字體與圓角設計**:
   - 字體採用 `Lato, "PingFang TC", "Helvetica Neue", 微軟正黑體`，字距設為 `0.05em`、行高 `1.5em ~ 1.85em`，極為易讀。
   - 按鈕邊角採用 `border-radius: 4px` 軟圓角，溫柔無邊角傷害感。
2. **無障礙規範與視覺包容性**:
   - 符合政府 Web Accessibility (無障礙網頁規範)，提供快選鍵 `:::` (`accesskey`)、定位跳轉按鈕。
   - 高對比焦點外框 (`box-shadow: 0 0px 0px 2px #d04500`)，讓視覺障礙者或使用鍵盤導航的民眾能清晰定位。
3. **動態微互動與觸感**:
   - 按鈕 hover 時自然加深焦糖色調，轉換流暢，讓整體視覺體驗輕柔動態。

---

## 🛠️ 四、 前端開發可參考之 CSS 設計變數 (CSS Design Tokens)

若您想在自己的網頁專案中複用這套溫暖配色，可以使用以下 CSS 變數：

```css
:root {
  /* 品牌主色 - 暖磚橘 */
  --primary-warm-orange: #d04500;
  --primary-warm-orange-hover: #9d3400;
  
  /* 輔助對比色 - 深石青 */
  --secondary-deep-teal: #004852;
  
  /* 大地色系 - 栗褐棕 */
  --earth-brown: #663c2a;
  
  /* 文字與中性色 */
  --text-main: #1c1b1b;
  --text-sub: #504e4e;
  --bg-light: #f1f1f1;
  --bg-card: #ffffff;
  --border-color: #e0e0e0;
  
  /* 字型設定 */
  --font-family-base: Lato, "PingFang TC", "Helvetica Neue", "Microsoft JhengHei", sans-serif;
}
```

---
*報告產生時間: 2026-07-22*
