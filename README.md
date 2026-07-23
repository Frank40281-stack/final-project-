# 📈 Alpha 阿爾法投資 — 政策驅動台美股投資研究與 KPI 驗證平台

> **小白也一眼就懂的投資指南網站**  
> 結合全球景氣循環、美國政策事件、台美供應鏈關聯數據，並透過 GCP Django API 即時呈現個股 KPI 多層驗證與 Chart1 - Price Context 互動式技術回測圖表。

---

## 🌟 專案核心特色 (Key Features)

1. **三大景氣循環卡片導覽 (Three-Cycle Navigation)**
   - **第一循環｜已驗證領漲**：成熟主線，如 AI／資料中心／電力基建、半導體/美國製造。
   - **第二循環｜政策資金擴散**：受惠擴散，如 國防／太空／情報、傳統能源／LNG、汽車／零組件。
   - **第三循環｜預期／待驗證**：潛在機會，如 關鍵礦物／國安材料、核能／陸／先進電力、量子科技。
   - 三張全螢幕卡片直接呈現完整產業清單，並依循環快速進入產業研究頁。

2. **全螢幕沉浸式 Menu 選單 (Interactive Full-Screen Menu)**
   - 提供快速導覽 (`TOP`, `STATEMENT`, `SECTORS`) 與三大循環入口。
   - 搭載選單開啟時的**全畫面滾動鎖定 (Scroll Lock)** 與背景標題動態隱藏防干擾機制。
   - Loading、Menu、循環與個股頁共用右上方大型綠色光源、斜向體積光、網格與暗角，建立一致的電影級視覺語言。

3. **單視窗個股研究儀表板 (Single-Viewport Stock Dashboard)**
   - **GCP Django REST API 即時串接** (`http://34.81.30.50:8000/api/stock/{ticker}/json/`)。
   - 桌面版將政策事件、區間報酬、互動線圖與 20 項 KPI 驗證配置於單一視窗，無須捲動即可掌握核心資訊。
   - **Chart1 - Price Context 互動式圖表** (基於 Chart.js v4)：
     - **收盤價 Close** (藍色光暈漸層線)
     - **50日均線 50MA** (橘色虛線)
     - **KPI18-20 觸發點標記** (螢光綠亮點，懸停彈出 KPI-18/19/20 詳細條件 Tooltip)
   - 漲跌幅使用動態分層 3D 金融字體：黃綠漸層、雙層邊緣、右下擠出、環境光與鏡面倒影。

4. **同產業個股導覽軌 (Same-Industry Stock Navigator)**
   - 個股頁右側自動列出同產業全部股票，顯示公司 Logo、代號與公司名稱。
   - 當前個股置中高亮，可點擊或使用滑鼠滾輪逐檔切換，搭配平滑置中及頁面淡出過場。

5. **月度常規公布時序表 (Macro Data Calendar)**
   - 循環頁頂部可展開電影感玻璃資料表，整理 PMI、ADP、NFP、CPI、PPI、零售銷售、GDP、PCE 與初請失業金。
   - 提供台灣夏令／冬令時間與常見公布規律，支援按鈕、背景點擊、關閉鍵與 `Esc` 收合。

6. **即時資料與防快取機制 (Live Data & Anti-Caching)**
   - API 請求自動帶上動態時間戳記 (`?_t=timestamp`)，避免瀏覽器沿用舊資料。
   - **CORS 跨網域存取友善提示**：內建跨網域防護與清晰的排查說明。

---

## 🛠️ 技術棧 (Tech Stack)

| 領域 | 使用技術 |
| :--- | :--- |
| **前端架構 (Frontend)** | HTML5, Vanilla CSS3 (Custom Token System), JavaScript (ES6+) |
| **圖表繪製 (Data Visualization)** | Chart.js (v4.x) |
| **動畫與平滑滾動** | GSAP 3 (GreenSock), ScrollTrigger, Lenis Smooth Scroll |
| **字體與視覺** | Google Fonts (Outfit, Jost, Oxanium, Noto Sans TC), Cinematic Dark UI System |
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
│   ├── industry.js          # 循環頁篩選、月度時序表與產業卡片邏輯
│   ├── stock.js             # 個股頁面、GCP API、Chart.js 與同產業導覽軌
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
- 確認 API 主機與 8000 連接埠可連線。
- 後端 Django 必須回傳 `Access-Control-Allow-Origin: http://127.0.0.1:8000`（或實際前端來源）。
- 修改 CORS 設定後須重新啟動 Gunicorn／Docker 服務；僅開放資料庫或防火牆權限並不能取代瀏覽器 CORS 設定。

---

## 📜 聲明 (Disclaimer)

本平台所有政策研究、供應鏈驗證與資料庫 KPI 圖表僅供學術與專題研究參考，不構成任何投資建議。
