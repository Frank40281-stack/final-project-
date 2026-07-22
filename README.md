# 📈 Alpha 阿爾法投資 — 政策驅動台美股投資研究與 KPI 驗證平台

> **小白也一眼就懂的投資指南網站**  
> 結合全球景氣循環、美國政策事件、台美供應鏈關聯數據，並透過 GCP Django API 即時呈現個股 KPI 多層驗證與 Chart1 - Price Context 互動式技術回測圖表。

---

## 🌟 專案核心特色 (Key Features)

1. **三大景氣循環卡片導覽 (Three-Cycle Navigation)**
   - **第一循環｜已驗證領漲**：成熟主線，如 AI／資料中心／電力基建、半導體/美國製造。
   - **第二循環｜政策資金擴散**：受惠擴散，如 國防／太空／情報、傳統能源／LNG、汽車／零組件。
   - **第三循環｜預期／待驗證**：潛在機會，如 關鍵礦物／國安材料、核能／陸／先進電力、量子科技。
   - **完美的水平對齊視覺**：精心校準的三卡片頂部標題水平對齊與彈性 Flex 佈局。

2. **全螢幕沉浸式 Menu 選單 (Interactive Full-Screen Menu)**
   - 提供頂部快速導覽 (`TOP`, `STATEMENT`, `SECTORS`) 與十大產業分類按鈕。
   - 搭載選單開啟時的**全畫面滾動鎖定 (Scroll Lock)** 與背景標題動態隱藏防干擾機制。

3. **個股技術回測與數據驗證 (Stock Study & Chart1 Interactive Backtest)**
   - **GCP Django REST API 即時串接** (`http://34.81.30.50:8000/api/stock/{ticker}/json/`)。
   - **Chart1 - Price Context 互動式圖表** (基於 Chart.js v4)：
     - **收盤價 Close** (藍色光暈漸層線)
     - **50日均線 50MA** (橘色虛線)
     - **KPI18-20 觸發點標記** (螢光綠亮點，懸停彈出 KPI-18/19/20 詳細條件 Tooltip)
   - **頂部回測統計數據卡片**：展示最新日期、最新股價 P0、觸發點次數、勝率 (Win/Loss) 及半年/1年/2年 回報率。

4. **即時數據刷新與防快取機制 (Real-time Data Refresh & Anti-Caching)**
   - **方案 1 (F5 重新整理即時抓取)**：API 請求自動帶上動態時間戳記 (`?_t=timestamp`)，強行繞過瀏覽器快取取得最新資料庫記錄。
   - **方案 2 (手動 🔄「刷新數據」按鈕)**：圖表標頭支援免重整理一鍵非同步更新 API，搭配 360 度旋轉動畫與「最後更新 HH:mm:ss」時間標籤。
   - **CORS 跨網域存取友善提示**：內建跨網域防護與清晰的排查說明。

---

## 🛠️ 技術棧 (Tech Stack)

| 領域 | 使用技術 |
| :--- | :--- |
| **前端架構 (Frontend)** | HTML5, Vanilla CSS3 (Custom Token System), JavaScript (ES6+) |
| **圖表繪製 (Data Visualization)** | Chart.js (v4.x) |
| **動畫與平滑滾動** | GSAP 3 (GreenSock), ScrollTrigger, Lenis Smooth Scroll |
| **字體與視覺** | Google Fonts (Outfit, Noto Sans TC), Dark Mode Aesthetic System |
| **後端 API 來源** | GCP Django REST API (`http://34.81.30.50:8000/api/`) |

---

## 📂 專案檔案結構 (Project Structure)

```
前端專題PROMAX/
├── assets/                  # 靜態圖片與媒體資源 (美股/台股數據、循環背景圖)
├── css/
│   ├── styles.css           # 核心通用樣式、Header、Menu 導覽與排版系統
│   ├── hero-new.css         # Hero 區域、照片牆與文案動畫樣式
│   └── research.css         # 個股研究頁面、KPI 卡片與 Chart.js 畫布樣式
├── js/
│   ├── main.js              # 主頁面互動、GSAP 動態與選單邏輯
│   ├── stock.js             # 個股頁面邏輯、GCP API 讀取、Chart.js 互動圖表與刷新機制
│   ├── cycle-data.js        # 三大循環與產業關聯資料庫
│   └── reload-to-home.js    # 頁面跳轉與重定向處理
├── pages/
│   ├── industry.html        # 產業大類瀏覽頁面
│   └── stock.html           # 個股技術研究與圖表驗證頁面
├── index.html               # 平台首頁入口
├── 美股.csv                  # 美股政策研究原始數據
├── 台股.csv                  # 台股政策研究原始數據
└── README.md                # 專案說明文件
```

---

## 🚀 快速開始與本地執行 (Getting Started)

### 1. 本地啟動伺服器
可以使用 Python 內建 HTTP Server 在專案根目錄啟動伺服器：

```bash
# 在專案目錄下執行
python -m http.server 8000
```

完成後開啟瀏覽器造訪：`http://127.0.0.1:8000`

### 2. 關於 API CORS 跨網域存取提示
在本地測試美股個股頁面 (`stock.html`) 時，若 API 提示 `Failed to fetch (CORS 跨網域限制)`：
- **開發測試**：請開啟 Chrome/Edge 瀏覽器擴充套件 **「Allow CORS: Access-Control-Allow-Origin」** 並切換為 ON 狀態。
- **生產環境**：後端 Django 伺服器配置 `django-cors-headers` 允許跨網域請求即可。

---

## 📜 聲明 (Disclaimer)

本平台所有政策研究、供應鏈驗證與資料庫 KPI 圖表僅供學術與專題研究參考，不構成任何投資建議。
