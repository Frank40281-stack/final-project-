# Django Stock KPI JSON API 說明文件 (GCP 部署與 KPI 定義)

本文件說明專案已部署於 GCP 上運行的 Stock KPI JSON API 規格、資料欄位定義，以及 KPI-01 至 KPI-20 的資料定義連結。

---

## 1. API 接口規格

### 📍 取得特定股票 KPI JSON 數據
* **網址路徑**：`/api/stock/<symbol>/json/` (例：`/api/stock/AAPL/json/`|http://34.81.30.50:8000/api/stock/AAPL/json/)
* **請求方法**：`GET`
* **回應格式**：`application/json`
* **HTTP 狀態碼**：
  * `200 OK`：成功取得資料。
  * `404 Not Found`：資料庫中查無此股票代號。

### 📍 原 HTML 儀表板頁面 (保留)
* **網址路徑**：`/api/stock/<symbol>/` (例：`/api/stock/AAPL/`)
* **回應格式**：`text/html`

---

## 2. JSON 回應資料結構 (Schema)

當請求成功時，API 將回傳以下結構：

```json
{
  "success": true,
  "message": "Stock KPI data retrieved successfully",
  "data": {
    "symbol": "AAPL",
    "stock_name": "Apple Inc.",
    "run_id": 968,
    "run_date": "2026-07-07T21:03:35",
    "scores": {
      "chip_score": 3.5,
      "sentiment_score": 2.0,
      "fundamental_score": 2.5,
      "technical_score": 2.0,
      "total_score": 10.0
    },
    "kpis": [
      {
        "code": "01",
        "name": "機構持股比例",
        "value": 65.782,
        "display_value": "65.78%",
        "score": 0.5,
        "status": "OK",
        "source": "Yahoo Finance/yfinance; Fintel",
        "detail": "Shares Outstanding=14,687,356,000"
      }
    ]
  }
}
```

### 🔹 欄位解析
* **`success`** (boolean)：請求是否成功。
* **`message`** (string)：說明訊息。
* **`data`** (object)：核心股票數據。
  * **`symbol`** (string)：標準化大寫股票代號 (例：`AAPL`)。
  * **`stock_name`** (string)：公司名稱。
  * **`run_id`** (integer)：最後一次抓取的執行序號 (Run ID)。
  * **`run_date`** (string)：最後一次抓取的日期時間 (ISO 8601 格式)。
  * **`scores`** (object)：四大面向評分及總分。
    * `chip_score`：籌碼面得分 (總分 5 分)。
    * `sentiment_score`：消息/市場情緒面得分 (總分 2.5 分)。
    * `fundamental_score`：基本面得分 (總分 5.5 分)。
    * `technical_score`：技術面得分 (總分 3 分)。
    * `total_score`：總得分 (四大面向加總，總分 16 分)。
  * **`kpis`** (array)：包含 20 項 KPI 明細的列表。每個 KPI 物件包含：
    * `code` (string)：KPI 編號 (`"01"` 到 `"20"`)。
    * `name` (string)：KPI 名稱。
    * `value` (float/null)：抓取到的原始數值（若無數值或為 `None` 則為 `null`，例如無交易紀錄時）。
    * `display_value` (string)：格式化後的顯示數值 (例：`"65.78%"` 或 `"No data"`)。
    * `score` (float/null)：該項 KPI 獲得的評分。
    * `status` (string)：抓取狀態 (例：`"OK"`、`"需 Fintel 資料"`、`"無交易紀錄"` 等)。
    * `source` (string)：資料來源。
    * `detail` (string)：計算細節或輔助參數資訊。

---

## 3. KPI-01 至 KPI-20 定義與連結對照表

API 所產生的 `kpis` 列表固定包含 20 項指標，依其分類與意義對照如下：

| KPI 編號 | KPI 項目名稱 | 所屬面向 (Category) | 說明 / 資料來源說明 |
|:---:|:---|:---:|:---|
| **01** | **機構持股比例** | 籌碼面 (`chip`) | 機構法人持有股票總數佔發行股數的比例。主要來自 Yahoo Finance 與 Fintel。 |
| **02** | **MRQ 機構持股變化** | 籌碼面 (`chip`) | 最近一季 (Most Recent Quarter) 機構持股比例的增減變化。依賴 Fintel。 |
| **03** | **Owners 家數變化** | 籌碼面 (`chip`) | 持有該股的機構法人家數增減變化。依賴 Fintel。 |
| **04** | **Portfolio Allocation Growth** | 籌碼面 (`chip`) | 法人機構在其投資組合中，對該股配置權重的增長情況。若 Fintel 缺失，會啟用 yfinance 估算備援。 |
| **05** | **Buyer/Seller Ratio** | 籌碼面 (`chip`) | 機構法人的買進家數與賣出家數比例。若 Fintel 缺失，會啟用 yfinance 估算備援。 |
| **06** | **Relative Net Inflow** | 籌碼面 (`chip`) | 機構法人資金的相對淨流入指標。若 Fintel 缺失，會啟用 yfinance 估算備援。 |
| **07** | **Institutional Activity Score** | 籌碼面 (`chip`) | 綜合計算機構活躍度得分。計算公式依賴 KPI 5 與 KPI 6 的結果。 |
| **08** | **Short Interest %** | 情緒面 (`sentiment`) | 空頭未平倉股數佔流通股數的比例 (放空比例)。資料來自 MarketBeat。 |
| **09** | **Short Interest Change** | 情緒面 (`sentiment`) | 空頭持倉比例的月增減變化。資料來自 MarketBeat。 |
| **10** | **Days To Cover** | 情緒面 (`sentiment`) | 空頭回補天數 (以平均成交量計算空頭平倉所需天數)。資料來自 MarketBeat。 |
| **11** | **ESG Score** | 情緒面 (`sentiment`) | 企業環境、社會與治理評分。資料來自 StockCircle。 |
| **12** | **機構佔流通股比例** | 基本面 (`fundamental`) | 法人機構持有股數佔實際市場流通股數 (Float) 的比例。主要來自 Yahoo Finance。 |
| **13** | **成交量活躍度** | 基本面 (`fundamental`) | 當前成交量相對於歷史均量的活絡程度。 |
| **14** | **成交量增長率** | 基本面 (`fundamental`) | 成交量的增長速率。 |
| **15** | **Insider Ownership** | 基本面 (`fundamental`) | 公司內部人 (董監事、高階主管) 的持股比例。主要來自 Yahoo Finance。 |
| **16** | **Form 4 Net Insider Trading** | 基本面 (`fundamental`) | 申報的 Form 4 內部人交易淨額。若當季無內部人申報交易，狀態為 `'無交易紀錄'` 且數值為 `null`。 |
| **17** | **13F Holder Shares Change** | 基本面 (`fundamental`) | 依據 13F 申報計算的持股人股數增減變化。資料來自 WhaleWisdom。 |
| **18** | **RSI 14 Momentum** | 技術面 (`technical`) | 14 日相對強弱指標 (Wilder RSI)，用以判定股價超買/超賣以及動能是否背離。 |
| **19** | **Composite RS Line** | 技術面 (`technical`) | 綜合相對強度線，加權計算個股相對於 S&P 500 (80%)、NASDAQ (10%)、Dow Jones (10%) 的相對強勢結構。 |
| **20** | **OBV 55D Money Flow** | 技術面 (`technical`) | 能量潮指標 (On-Balance Volume) 搭配 55 日高點窗口，用以判定量價同步性與資金流向。 |

> 📌 **技術面 (KPI 18~20) 細部運算規格**：  
> 請參閱專案目錄下的 [KPI_technique.md](file:///C:/AI_class/TeamPRJdj/KPI_technique.md) 規格說明書。

---

## 4. GCP 跨網域前端存取設定 (CORS)

若您的組員要從不同網域的前端網頁（例如 React/Next.js）利用 JavaScript `fetch` 存取部署在 GCP 上的 API，必須在專案中配置 CORS：

### 🛠 本地開發與預設 CORS 運作
專案中已實作了自訂的 CORS 中間件：
* **原始碼位置**：[config/middleware.py](file:///C:/AI_class/TeamPRJdj/config/middleware.py)
* **預設允許來源**：`http://127.0.0.1:3000` (本地 Next.js 開發網址)

### 🛠 修改為組員的前端部署網址
若要讓組員部署在 Vercel 或其他雲端上的前端正常取得資料，請修改 [config/middleware.py](file:///C:/AI_class/TeamPRJdj/config/middleware.py) 中的網域設定：

```python
# config/middleware.py
class LocalCorsMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.method == "OPTIONS":
            from django.http import HttpResponse
            response = HttpResponse()
        else:
            response = self.get_response(request)
        
        # 將此處改為組員的前端部署網址，或正式環境網域
        response["Access-Control-Allow-Origin"] = "https://你的組員專案.vercel.app"
        response["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        response["Access-Control-Allow-Headers"] = "Content-Type"
        return response
```

### 🛠 部署更新指令
在 GCP 重啟服務以套用最新邏輯：
```bash
# 若使用 systemd + gunicorn
sudo systemctl restart gunicorn

# 若使用 Docker Compose
docker compose restart web
```
