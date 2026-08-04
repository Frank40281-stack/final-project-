/**
 * StockAI Chat Widget v3.1 (Dual Color Themes: Gold & Cyan)
 * =========================================================
 * 使用方式：在任何 HTML 頁面加入以下一行：
 *   <script src="/js/widget.js"></script>
 *
 * 配色主題支援（右上方 🎨 鈕可隨時切換，舊版與新版皆完整保留）：
 *   - 👑 尊爵黑金 (Alpha Dark Gold - 新版預設，完全匹配 Alpha 阿爾法投資網站)
 *   - ⚡ 霓虹藍紫 (Classic Neon Cyan/Purple - 舊版經典配色)
 *
 * 支援三大 AI 供應商（自動偵測 Key 格式）：
 *   - 🟦 Gemini (Google)   → Key 以 "AIza" 開頭
 *   - 🟩 ChatGPT (OpenAI)  → Key 以 "sk-" 開頭（非 sk-ant-）
 *   - 🟪 Claude (Anthropic)→ Key 以 "sk-ant-" 開頭
 */
(function () {
  'use strict';

  const TW_API  = 'https://35.229.146.232/';
  const US_API  = 'http://34.81.30.50:8000/api/';
  const LS_KEY  = 'stockai_api_key';
  const LS_THEME= 'stockai_theme';

  const EP_GEMINI  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const EP_OPENAI  = 'https://api.openai.com/v1/chat/completions';
  const EP_CLAUDE  = 'https://api.anthropic.com/v1/messages';

  const SYSTEM_PROMPT = `你是「StockAI 股市智能助手」，專屬於一套整合台股與美股的多維度量化分析系統。
你已完整讀過系統設計報告，請依照這些知識回答使用者問題。用繁體中文回答。

【強烈規範：系統資料庫規模統計（當使用者詢問台股/美股數量、規模、我們有多少股票時）】
- 🇹🇼 台股資料庫規模：即時連線監測 133 檔核心指標個股（API: https://35.229.146.232/）。
- 🇺🇸 美股資料庫規模：線上系統監測 433 檔核心個股，涵蓋 20 大美國政策主題與 12 大產業板塊（API: http://34.81.30.50:8000/api/）。
- 🌐 全站總計：共監測 566 檔台美股個股。
- 絕對禁止回答「全台灣交易所 1800 檔」或「美股上萬檔」這種泛泛大眾數據！當使用者詢問「我們有多少台股/美股/股票」時，必須直接回答本 Alpha 平台資料庫的 133 檔台股與 433 檔美股！

【強烈規範：個股查詢回覆 5 大步驟】
當使用者詢問特定個股（例如台積電、2330、NVDA、AMD、AIR 等）時，你的回答必須 100% 嚴格遵守以下 5 個步驟格式：

1. 📈 **最新股價**：標明最新動態股價或收盤報價（例：$ 145.10 (USD) / NT$ 985.00）。
2. 🔗 **個股分析連結**：提供該個股之本機專屬儀表板連結（例：👉 [點此查看超微 (AMD) 儀表板](http://127.0.0.1:5500/pages/stock.html?market=us&ticker=AMD)）。
3. 🏛️ **政策與產業循環定位**：說明 [分類產業循環]、[政策受惠狀況] 與 [官方證明文件]。
4. 📊 **技術分析與個股綜合評分**：說明技術面、籌碼面狀況與 100 分制綜合評分 (例：85 / 100，星級：★★★★☆)。
5. 💡 **實質操作建議**：給出具體分析與區間操作建議。

台股 API：${TW_API}
美股 API：${US_API}
`;

  // ── CSS Variables & Styles ────────────────────────────────────────────────
  const CSS = `
  /* 預設主題：黑金尊爵 (Alpha Dark Gold) */
  :root, .sai-theme-gold {
    --sai-primary-grad: linear-gradient(135deg, #f3d077 0%, #c59b27 100%);
    --sai-btn-shadow: 0 6px 28px rgba(229, 193, 88, 0.4);
    --sai-ring-color: rgba(229, 193, 88, 0.35);
    --sai-panel-bg: #0b0e17;
    --sai-hd-bg: linear-gradient(135deg, rgba(243, 208, 119, 0.12), rgba(197, 155, 39, 0.08));
    --sai-accent: #e5c158;
    --sai-accent-hover: #f3d077;
    --sai-accent-border: rgba(229, 193, 88, 0.3);
    --sai-accent-bg: rgba(229, 193, 88, 0.08);
    --sai-user-bub-bg: linear-gradient(135deg, rgba(243, 208, 119, 0.15), rgba(197, 155, 39, 0.12));
    --sai-user-bub-border: rgba(229, 193, 88, 0.25);
    --sai-btn-color: #0b0e17;
  }

  /* 舊版主題：霓虹藍紫 (Classic Neon Cyan/Purple) */
  .sai-theme-cyan {
    --sai-primary-grad: linear-gradient(135deg, #00d4ff 0%, #7b61ff 100%);
    --sai-btn-shadow: 0 6px 28px rgba(0, 212, 255, 0.4);
    --sai-ring-color: rgba(0, 212, 255, 0.35);
    --sai-panel-bg: #0f1320;
    --sai-hd-bg: linear-gradient(135deg, rgba(0,212,255,0.07), rgba(123,97,255,0.07));
    --sai-accent: #00d4ff;
    --sai-accent-hover: #5ce1ff;
    --sai-accent-border: rgba(0, 212, 255, 0.22);
    --sai-accent-bg: rgba(0, 212, 255, 0.05);
    --sai-user-bub-bg: linear-gradient(135deg, rgba(0,212,255,0.11), rgba(123,97,255,0.11));
    --sai-user-bub-border: rgba(0, 212, 255, 0.18);
    --sai-btn-color: #ffffff;
  }

  #sai-btn {
    position: fixed; bottom: 28px; left: 28px; z-index: 2147483600 !important;
    display: flex; align-items: center; gap: 10px;
    padding: 0 20px 0 14px; height: 52px; border-radius: 999px; border: none;
    background: var(--sai-primary-grad);
    color: var(--sai-btn-color); font-family: 'Inter','Noto Sans TC',sans-serif;
    font-size: 0.9rem; font-weight: 700; cursor: none !important; letter-spacing: 0.3px;
    box-shadow: var(--sai-btn-shadow);
    pointer-events: auto !important;
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    animation: sai-ring 3s ease-in-out infinite;
  }
  #sai-btn:hover { transform: translateY(-2px) scale(1.04); cursor: none !important; }
  #sai-btn.open { background: linear-gradient(135deg, #2a3142, #1a2035); color: #fff; animation: none; box-shadow: 0 4px 16px rgba(0,0,0,0.5); }
  #sai-btn .sai-btn-icon { font-size: 1.2rem; line-height: 1; pointer-events: none; }
  #sai-btn .sai-btn-label { white-space: nowrap; pointer-events: none; }

  #sai-badge {
    position: absolute; top: -4px; right: -4px;
    width: 20px; height: 20px; border-radius: 50%;
    background: #ff4757; border: 2px solid #0a0d14;
    font-size: 11px; font-weight: 700; color: #fff;
    display: none; align-items: center; justify-content: center;
    font-family: Inter, sans-serif; pointer-events: none;
  }

  @keyframes sai-ring {
    0%,100% { box-shadow: var(--sai-btn-shadow), 0 0 0 0 var(--sai-ring-color); }
    55%      { box-shadow: var(--sai-btn-shadow), 0 0 0 10px rgba(0,0,0,0); }
  }

  #sai-panel {
    position: fixed; bottom: 94px; left: 28px; z-index: 2147483600 !important;
    width: 370px; height: 540px; max-height: calc(100vh - 110px);
    border-radius: 20px;
    background: var(--sai-panel-bg);
    border: 1px solid var(--sai-accent-border);
    box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px var(--sai-accent-border);
    display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Inter','Noto Sans TC',sans-serif;
    transform-origin: bottom left;
    transform: scale(0.88) translateY(16px); opacity: 0; pointer-events: none;
    transition: all 0.3s cubic-bezier(0.34,1.3,0.64,1);
  }
  #sai-panel.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all !important; }

  /* ── Position overrides ── */
  .sai-pos-bottom-right #sai-btn, #sai-btn.sai-pos-bottom-right { left: auto !important; right: 28px !important; }
  .sai-pos-bottom-right #sai-panel, #sai-panel.sai-pos-bottom-right { left: auto !important; right: 28px !important; transform-origin: bottom right !important; }
  .sai-pos-bottom-left #sai-btn, #sai-btn.sai-pos-bottom-left { right: auto !important; left: 28px !important; }
  .sai-pos-bottom-left #sai-panel, #sai-panel.sai-pos-bottom-left { right: auto !important; left: 28px !important; transform-origin: bottom left !important; }

  /* ── Header ── */
  .sai-hd {
    padding: 14px 16px; flex-shrink: 0;
    background: var(--sai-hd-bg);
    border-bottom: 1px solid var(--sai-accent-border);
    display: flex; align-items: center; gap: 10px;
  }
  .sai-hd-av {
    width: 36px; height: 36px; border-radius: 50%; flex-shrink: 0;
    background: var(--sai-primary-grad); color: var(--sai-btn-color);
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
  }
  .sai-hd-info { flex: 1; }
  .sai-hd-title { font-size: 0.9rem; font-weight: 700; color: #f0f4ff; }
  .sai-hd-status {
    display: flex; align-items: center; gap: 5px;
    font-size: 0.7rem; color: #8892a8; margin-top: 2px;
  }
  .sai-status-dot {
    width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0;
    animation: sai-pulse 2s ease-in-out infinite;
  }
  .sai-status-dot.online  { background: #00e899; box-shadow: 0 0 5px #00e899; }
  .sai-status-dot.offline { background: #ff8c42; box-shadow: 0 0 5px #ff8c42; }
  @keyframes sai-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }

  .sai-hd-actions { display: flex; gap: 6px; }
  .sai-icon-btn {
    width: 30px; height: 30px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.04); color: #8892a8; font-size: 0.85rem;
    cursor: none !important; display: flex; align-items: center; justify-content: center;
    transition: all .2s ease;
  }
  .sai-icon-btn:hover { background: rgba(255,255,255,0.1); color: #f0f4ff; cursor: none !important; }

  /* ── API Key Panel ── */
  #sai-key-panel {
    display: none; flex-direction: column; gap: 8px;
    padding: 12px 16px; border-bottom: 1px solid var(--sai-accent-border);
    background: rgba(0,0,0,0.2); font-size: 0.8rem; color: #8892a8;
  }
  #sai-key-panel p { margin: 0; }
  .sai-key-row { display: flex; gap: 6px; }
  #sai-key-input {
    flex: 1; padding: 7px 11px;
    background: rgba(255,255,255,0.05); border: 1px solid var(--sai-accent-border);
    border-radius: 8px; color: #f0f4ff; font-size: 0.8rem; outline: none;
    font-family: inherit; transition: border-color .2s;
  }
  #sai-key-input:focus { border-color: var(--sai-accent); }
  #sai-key-input::placeholder { color: #4a5568; }
  #sai-key-save {
    padding: 7px 14px; border-radius: 8px; border: none;
    background: var(--sai-primary-grad);
    color: var(--sai-btn-color); font-weight: 700; font-size: 0.8rem; cursor: pointer;
    font-family: inherit; transition: opacity .2s;
  }
  #sai-key-save:hover { opacity: .88; }
  .sai-key-note { font-size: 0.7rem; color: #4a5568; }

  /* ── Messages ── */
  #sai-msgs {
    flex: 1; overflow-y: auto !important; padding: 14px 12px;
    display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
    overscroll-behavior: contain !important;
    -webkit-overflow-scrolling: touch;
    pointer-events: auto !important;
  }
  #sai-msgs::-webkit-scrollbar { width: 5px; }
  #sai-msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }

  .sai-row { display: flex; gap: 8px; animation: sai-fi .28s ease; }
  .sai-row.u  { flex-direction: row-reverse; }
  @keyframes sai-fi { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }

  .sai-av {
    width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
    font-size: 0.68rem; font-weight: 700;
    display: flex; align-items: center; justify-content: center; margin-top: 2px;
  }
  .sai-av.a { background: var(--sai-accent-bg); border: 1px solid var(--sai-accent-border); color: var(--sai-accent); }
  .sai-av.u { background: rgba(123,97,255,.14); border: 1px solid rgba(123,97,255,.28); color:#a78bfa; }

  .sai-bub {
    max-width: 83%; padding: 9px 12px; border-radius: 13px;
    font-size: 0.81rem; line-height: 1.65; word-break: break-word;
  }
  .sai-bub.a { background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07); border-top-left-radius: 3px; color:#d8e0f0; }
  .sai-bub.u { background: var(--sai-user-bub-bg); border: 1px solid var(--sai-user-bub-border); border-top-right-radius:3px; color:#f0f4ff; }
  .sai-bub strong { color: var(--sai-accent); }
  .sai-bub a { color: var(--sai-accent); }

  /* Typing */
  .sai-typing {
    display: flex; gap: 5px; padding: 9px 12px;
    background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.07);
    border-radius: 13px; border-top-left-radius: 3px; width: fit-content;
  }
  .sai-td {
    width: 6px; height: 6px; background: var(--sai-accent); border-radius: 50%;
    animation: sai-bce 1.2s ease-in-out infinite;
  }
  .sai-td:nth-child(2){animation-delay:.2s} .sai-td:nth-child(3){animation-delay:.4s}
  @keyframes sai-bce { 0%,80%,100%{transform:translateY(0);opacity:.5} 40%{transform:translateY(-5px);opacity:1} }

  /* Chips (2-Row Layout) */
  #sai-chips {
    display: flex; flex-wrap: wrap; gap: 6px;
    padding: 8px 12px; flex-shrink: 0;
    max-height: 84px; overflow-y: auto !important;
    overscroll-behavior: contain !important;
    pointer-events: auto !important;
    background: rgba(0, 0, 0, 0.15);
    border-top: 1px solid var(--sai-accent-border);
  }
  #sai-chips::-webkit-scrollbar { width: 3px; }
  #sai-chips::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 2px; }
  .sai-chip {
    font-size: 0.74rem; padding: 5px 11px; border-radius: 8px; white-space: nowrap;
    border: 1px solid var(--sai-accent-border); background: var(--sai-accent-bg);
    color: var(--sai-accent); cursor: none !important; transition: all .2s ease; font-family: inherit;
    font-weight: 500;
  }
  .sai-chip:hover {
    background: var(--sai-accent); color: var(--sai-btn-color);
    border-color: var(--sai-accent); transform: translateY(-1px);
    cursor: none !important;
  }
  .sai-chip:active { transform: translateY(0); }

  /* Input */
  .sai-inp-area {
    display: flex; gap: 7px; padding: 10px 12px; flex-shrink: 0;
    border-top: 1px solid var(--sai-accent-border); align-items: flex-end;
  }
  #sai-textarea {
    flex: 1; background: rgba(255,255,255,.05); border: 1px solid var(--sai-accent-border);
    border-radius: 11px; padding: 8px 12px; font-family: inherit; font-size: 0.81rem;
    color: #f0f4ff; resize: none; min-height: 36px; max-height: 90px;
    outline: none; line-height: 1.5; transition: border-color .2s;
  }
  #sai-textarea::placeholder { color: #4a5568; }
  #sai-textarea:focus { border-color: var(--sai-accent); }
  #sai-send {
    width: 34px; height: 34px; border-radius: 50%; border: none; flex-shrink: 0;
    background: var(--sai-primary-grad); color: var(--sai-btn-color); cursor:pointer;
    display: flex; align-items: center; justify-content: center;
    box-shadow: var(--sai-btn-shadow); transition: all .2s ease;
  }
  #sai-send:disabled { background: rgba(255,255,255,.06); color:#4a5568; box-shadow:none; cursor:not-allowed; }
  #sai-send:not(:disabled):hover { transform: scale(1.1); }

  .sai-footer {
    text-align: center; font-size: 0.63rem; color: #4a5568;
    padding: 4px 0 8px; flex-shrink: 0;
  }

  @media (max-width: 480px) {
    #sai-panel {
      right: 10px !important; bottom: 76px !important;
      width: calc(100vw - 20px) !important; max-width: 400px !important;
      height: 72vh !important; border-radius: 16px !important;
    }
    #sai-btn {
      right: 14px !important; bottom: 14px !important;
      padding: 0 14px 0 10px !important; height: 44px !important; font-size: 0.8rem !important;
    }
    #sai-chips {
      max-height: 96px !important; padding: 6px 8px !important;
    }
    .sai-chip {
      font-size: 0.72rem !important; padding: 4px 9px !important;
    }
  }
  `;

  // ── Stock Report Database ──────────────────────────────────────────────────
  let stockDatabase = window.STOCK_AI_DB || {};

  function loadStockDatabase() {
    if (window.STOCK_AI_DB && Object.keys(window.STOCK_AI_DB).length > 0) {
      stockDatabase = window.STOCK_AI_DB;
      return;
    }
    const dbFiles = [
      ['us_stocks_433_db.json', '433美股_AI_Bot_完整解答版.json'],
      ['tw_stocks_133_db.json', '133台股_AI_Bot_完整解答版.json']
    ];

    dbFiles.forEach(fileGroup => {
      const candidatePaths = [];
      fileGroup.forEach(fileName => {
        const encName = encodeURIComponent(fileName);
        candidatePaths.push(`../questionforAIBOT-report/${fileName}`);
        candidatePaths.push(`/questionforAIBOT-report/${fileName}`);
        candidatePaths.push(`questionforAIBOT-report/${fileName}`);
        candidatePaths.push(`../questionforAIBOT-report/${encName}`);
        candidatePaths.push(`/questionforAIBOT-report/${encName}`);
        candidatePaths.push(`questionforAIBOT-report/${encName}`);
      });

      (function tryNext(i) {
        if (i >= candidatePaths.length) return;
        fetch(candidatePaths[i])
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            if (data && data.stocks) {
              data.stocks.forEach(st => {
                if (st.symbol) stockDatabase[st.symbol.toUpperCase()] = st;
                if (st.stock_name) stockDatabase[st.stock_name.toLowerCase()] = st;
              });
            } else {
              tryNext(i + 1);
            }
          })
          .catch(() => tryNext(i + 1));
      })(0);
    });
  }

  function findStockInDB(q) {
    if (!q) return null;
    const ql = q.trim().toLowerCase();

    const upper = ql.toUpperCase();
    if (stockDatabase[upper]) return stockDatabase[upper];

    const words = ql.split(/[^a-z0-9]+/);
    for (const w of words) {
      if (!w) continue;
      const sym = w.toUpperCase();
      if (stockDatabase[sym]) return stockDatabase[sym];
    }

    for (const [k, st] of Object.entries(stockDatabase)) {
      if (k.length >= 2 && (ql.includes(k) || (st.stock_name && st.stock_name.toLowerCase().includes(ql)))) {
        return st;
      }
    }
    return null;
  }

  function checkSystemScaleQuery(q) {
    if (!q) return null;
    const ql = q.trim().toLowerCase();

    // Check if asking about TW stocks scale
    if ((ql.includes('台股') || ql.includes('台灣')) && (ql.includes('多少') || ql.includes('幾') || ql.includes('數量') || ql.includes('規模') || ql.includes('有幾') || ql.includes('我們有') || ql.includes('總共'))) {
      return `**🇹🇼 系統台股資料庫規模**\n\n・**即時連線監測數量**：Alpha 平台線上系統共連線監測 **133 檔**台股核心指標個股。\n・**政策受惠圖譜標的**：包含 57 檔重點政策受惠個股（如台積電 2330、鴻海 2317、台達電 2308、華城 1519 等）。\n・**核心 API 端點**：https://35.229.146.232/\n・**本地歷史與即時數據庫**：\`questionforAIBOT/Twstock/\`（共 133 檔完整個股 JSON 檔）。`;
    }

    // Check if asking about US stocks scale
    if ((ql.includes('美股') || ql.includes('美國')) && (ql.includes('多少') || ql.includes('幾') || ql.includes('數量') || ql.includes('規模') || ql.includes('有幾') || ql.includes('我們有') || ql.includes('總共'))) {
      return `**🇺🇸 系統美股資料庫規模**\n\n・**即時監測數量**：Alpha 平台線上系統共監測 **433 檔**美股核心個股。\n・**雙軌分類**：涵蓋 **20 大美國政策主題** 與 **GICS 12 大產業板塊**。\n・**核心 API 端點**：http://34.81.30.50:8000/api/\n・**解答與報告資料庫**：\`questionforAIBOT-report/433美股_AI_Bot_完整報告.md\``;
    }

    // Check general database quantity query
    if ((ql.includes('多少') || ql.includes('幾檔') || ql.includes('數量') || ql.includes('規模') || ql.includes('幾支') || ql.includes('我們有')) && (ql.includes('股票') || ql.includes('個股') || ql.includes('標的') || ql.includes('資料庫') || ql.includes('台股') || ql.includes('美股'))) {
      return `**📊 Alpha 平台系統監測股票總數量**\n\n・**🇹🇼 台股**：即時連線監測 **133 檔**指標個股（API: https://35.229.146.232/）。\n・**🇺🇸 美股**：線上系統監測 **433 檔**核心個股，劃分為 20 大政策主題與 12 大產業（API: http://34.81.30.50:8000/api/）。\n・**🌐 全站總計**：共監測 **566 檔**台美股核心標的。`;
    }

    return null;
  }

  // ── Mock AI Responses ─────────────────────────────────────────────────────
  const MOCKS = [
    { kw: ['美股','美股多少','美股數量','美股幾檔'],
      r: () => `**🇺🇸 美股資料庫規模**\n\n・**即時監測數量**：線上系統共監測 **433 檔**美股核心個股。\n・**雙軌分類**：涵蓋 **20 大美國政策主題** 與 **GICS 12 大產業板塊**。\n・**核心 API 端點**：http://34.81.30.50:8000/api/\n\n> 💡 提供歷史勝率、軋空風險與 16 分多維評分！` },
    { kw: ['數量','幾檔','多少','列表','清單'],
      r: () => `**📊 系統監測股票數量**\n\n・**🇹🇼 台股**：即時連線監測 **133 檔**指標個股（API: https://35.229.146.232/）。\n・**🇺🇸 美股**：線上系統監測 **433 檔**核心個股，劃分為 20 大政策主題與 12 大產業（API: http://34.81.30.50:8000/api/）。` },
    { kw: ['即時','歷史','更新','時間'],
      r: () => `**🕒 資料時效性說明**\n\n1. **股票清單**：支援動態 Smart Fetch 即時連線查詢。\n2. **籌碼與財務面**：採用最新交易日與 13F、Form 4 申報。\n3. **技術面動能**：包含「近三日觸發買訊」動態篩選。` }
  ];

  const FALLBACKS = [
    `目前為**股市資料庫直接查詢模式** 🤖\n\n您可以隨時輸入任何美股或台股代號（例如 \`ANET\`、\`AMD\`、\`NVDA\`、\`AIR\`、\`GOOGL\` 等）進行 5 大步驟檢索分析！`
  ];

  function mockReply(q) {
    const dbMatch = findStockInDB(q);
    if (dbMatch && dbMatch.full_bot_answer) {
      return dbMatch.full_bot_answer;
    }
    const ql = q.toLowerCase();
    for (const m of MOCKS) if (m.kw.some(k => ql.includes(k.toLowerCase()))) return m.r();
    return FALLBACKS[Math.floor(Math.random() * FALLBACKS.length)];
  }

  function md(t) {
    if (!t) return '';
    let s = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:var(--sai-accent,#e5c158);text-decoration:underline;">$1</a>');
    s = s.replace(/(^|[^"'>])(https?:\/\/[a-zA-Z0-9\.\/:_\-%\?&=#]+)/g, '$1<a href="$2" target="_blank" rel="noopener" style="color:var(--sai-accent,#e5c158);text-decoration:underline;">$2</a>');
    return s
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g,'<em>$1</em>')
      .replace(/^> (.*?)$/gm,'<span style="display:block;border-left:2px solid var(--sai-accent,#e5c158);padding-left:8px;color:#8892a8;font-size:.78em;margin-top:4px">$1</span>')
      .replace(/\n/g,'<br>');
  }

  function detectProvider(key) {
    if (!key) return null;
    if (key.startsWith('sk-ant-')) return 'claude';
    if (key.startsWith('sk-'))    return 'openai';
    if (key.startsWith('AIza'))   return 'gemini';
    return 'unknown';
  }

  function providerLabel(key) {
    const p = detectProvider(key);
    if (p === 'gemini') return '🟦 Gemini (Google) 已連線';
    if (p === 'openai') return '🟩 ChatGPT (OpenAI) 已連線';
    if (p === 'claude') return '🟪 Claude (Anthropic) — 需後端代理';
    return '⚠️ 無法識別的 Key 格式';
  }

  const NAME_TICKER_MAP = {
    '超微': 'AMD', '輝達': 'NVDA', '台積電': '2330', '聯發科': '2454',
    '華城': '1519', '廣達': '2382', '鴻海': '2317', '緯創': '3231',
    '蘋果': 'AAPL', '微軟': 'MSFT', '谷歌': 'GOOGL', '亞馬遜': 'AMZN', '特斯拉': 'TSLA'
  };

  async function getStockContext(userText) {
    let ticker = null;
    const txt = userText.trim();
    for (const [name, sym] of Object.entries(NAME_TICKER_MAP)) {
      if (txt.includes(name)) { ticker = sym; break; }
    }
    if (!ticker) {
      const match = txt.match(/\b([A-Za-z]{1,5}|\d{4})\b/);
      if (match) ticker = match[1].toUpperCase();
    }
    if (!ticker) return '';

    try {
      const res = await fetch(`https://t2prj.ai-future2026.cc/api/stock/${ticker}/json/`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.success && json.data) {
          const d = json.data;
          const s = d.backtest?.summary || {};
          const price = s.latest_close !== undefined ? (typeof s.latest_close === 'number' ? s.latest_close.toFixed(2) : s.latest_close) : null;
          const date = s.latest_date || '最新動態';
          if (price !== null) {
            return `\n\n【真實 API 數據強制注入（請 100% 依據此數據回答第 1 步驟與相關資訊）】：
- 標的：${d.stock_name || ticker} (${ticker})
- 1. 最新真實股價 (latest_close)：$ ${price} USD (數據日期: ${date})
- 2. 個股分析連結：http://127.0.0.1:5500/pages/stock.html?market=us&ticker=${ticker}
- 3. 產業/政策：${d.source_section || '國防／AI基建'} | ${d.policy_subsector || '受惠股'}
- 4. 量化評分：總分 ${d.scores?.total_score || 14}/21 (籌碼 ${d.scores?.chip_score || 5}, 技術 ${d.scores?.technical_score || 3.5})
- 絕對強制規範：你回答中的「1. 最新股價」必須為：$ ${price} (USD)，絕對禁止自行猜測或捏造任何其他數字！`;
          }
        }
      }
    } catch(e) {}
    return '';
  }

  // ── Gemini / OpenAI / Claude APIs ────────────────────────────────────────
  async function geminiReply(userText, apiKey, stockCtx) {
    const prompt = SYSTEM_PROMPT + stockCtx + '\n\n問題：' + userText;
    const body = { contents: [{ role: 'user', parts: [{ text: prompt }] }] };
    const res = await fetch(`${EP_GEMINI}?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '（無回應）';
  }

  async function openaiReply(userText, apiKey, stockCtx) {
    const sysPrompt = SYSTEM_PROMPT + stockCtx;
    const body = { model: 'gpt-4o-mini', messages: [{ role: 'system', content: sysPrompt }, { role: 'user', content: userText }], max_tokens: 600 };
    const res = await fetch(EP_OPENAI, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '（無回應）';
  }

  async function claudeReply(userText, apiKey, stockCtx) {
    const sysPrompt = SYSTEM_PROMPT + stockCtx;
    const body = { model: 'claude-3-5-haiku-20241022', max_tokens: 600, system: sysPrompt, messages: [{ role: 'user', content: userText }] };
    const res = await fetch(EP_CLAUDE, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Claude HTTP ${res.status}`);
    const data = await res.json();
    return data?.content?.[0]?.text || '（無回應）';
  }

  async function aiReply(userText, apiKey) {
    const provider = detectProvider(apiKey);
    const stockCtx = await getStockContext(userText);
    if (provider === 'gemini') return await geminiReply(userText, apiKey, stockCtx);
    if (provider === 'openai') return await openaiReply(userText, apiKey, stockCtx);
    if (provider === 'claude') return await claudeReply(userText, apiKey, stockCtx);
    throw new Error('無法識別的 API Key 格式');
  }

  // ── Build Widget ──────────────────────────────────────────────────────────
  function build() {
    if (!document.getElementById('sai-gf')) {
      const lk = document.createElement('link');
      lk.id = 'sai-gf'; lk.rel = 'stylesheet';
      lk.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+TC:wght@400;500;700&display=swap';
      document.head.appendChild(lk);
    }
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    const scripts = Array.from(document.querySelectorAll('script'));
    const widgetScript = document.currentScript || scripts.find(s => s.src && s.src.includes('widget.js'));
    const scriptPos = widgetScript ? widgetScript.getAttribute('data-position') : null;
    const pos = scriptPos || 'bottom-left';

    // Launcher Button
    const btn = document.createElement('button');
    btn.id = 'sai-btn';
    btn.setAttribute('aria-label','開啟 StockAI 助手');
    btn.innerHTML = `
      <span class="sai-btn-icon">🤖</span>
      <span class="sai-btn-label">StockAI 助手</span>
      <span id="sai-badge">1</span>`;

    // Panel
    const panel = document.createElement('div');
    panel.id = 'sai-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-label','StockAI 股市問答機器人');

    if (pos === 'bottom-right') {
      btn.classList.add('sai-pos-bottom-right');
      panel.classList.add('sai-pos-bottom-right');
    } else {
      btn.classList.add('sai-pos-bottom-left');
      panel.classList.add('sai-pos-bottom-left');
    }

    const path = window.location.pathname.toLowerCase();
    const isLandingPage = path.endsWith('index.html') || path.endsWith('/') || path === '';
    if (isLandingPage) {
      btn.style.display = 'none';
    }

    document.body.appendChild(btn);
    panel.innerHTML = `
      <!-- Header -->
      <div class="sai-hd">
        <div class="sai-hd-av">🤖</div>
        <div class="sai-hd-info">
          <div class="sai-hd-title">StockAI 股市解答助手</div>
          <div class="sai-hd-status">
            <span class="sai-status-dot online" id="sai-dot"></span>
            <span id="sai-status-txt">🟢 已連線 433 美股 &amp; 133 台股資料庫</span>
          </div>
        </div>
        <div class="sai-hd-actions">
          <button class="sai-icon-btn" id="sai-home-btn" title="返回機器人小首頁 / 選單">🏠</button>
          <button class="sai-icon-btn" id="sai-theme-btn" title="切換配色主題（黑金尊爵 / 霓虹藍）">🎨</button>
          <button class="sai-icon-btn" id="sai-close" title="關閉">✕</button>
        </div>
      </div>

      <!-- Messages -->
      <div id="sai-msgs">
        <div class="sai-row">
          <div class="sai-av a">AI</div>
          <div class="sai-bub a">
            👋 您好！我是 <strong>StockAI</strong> 股市解答助手。<br>
            系統已直連 **433 檔美股與 133 檔台股驗證解答庫**！<br><br>
            您可以隨時輸入任何個股代號（例如 <code>ANET</code>、<code>AMD</code>、<code>GOOGL</code>、<code>AIR</code>、<code>2330</code> 等）或詢問「我們有多少台股」，獲取 100% 精準的 5 大步驟個股分析！<br><br>
            🎨 點擊右上角 **🎨** 可隨時切換「👑黑金尊爵 / ⚡霓虹藍」配色！
          </div>
        </div>
      </div>

      <!-- Quick Chips (2-Row Layout) -->
      <div id="sai-chips">
        <button class="sai-chip" data-q="我們有多少台股">🇹🇼 系統台股規模</button>
        <button class="sai-chip" data-q="我們有多少美股">🇺🇸 系統美股規模</button>
        <button class="sai-chip" data-q="ANET">📈 ANET (Arista)</button>
        <button class="sai-chip" data-q="AMD">📈 AMD (超微)</button>
        <button class="sai-chip" data-q="GOOGL">📈 GOOGL (谷歌)</button>
        <button class="sai-chip" data-q="AIR">📈 AIR (AAR Corp)</button>
        <button class="sai-chip" data-q="2330">📈 2330 (台積電)</button>
        <button class="sai-chip" data-q="請介紹美股觀測系統的 20 個政策主題與 12 大產業板塊？">🌐 政策與產業板塊</button>
      </div>

      <!-- Input -->
      <div class="sai-inp-area">
        <textarea id="sai-textarea" placeholder="輸入個股代號或問題... (Enter 送出)" rows="1" maxlength="500"></textarea>
        <button id="sai-send" disabled aria-label="送出">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="sai-footer">Powered by Alpha StockAI · 台股 133 檔 &amp; 美股 433 檔直連解答庫</div>
    `;
    document.body.appendChild(panel);

    // DOM refs
    const badge     = document.getElementById('sai-badge');
    const homeBtn   = document.getElementById('sai-home-btn');
    const themeBtn  = document.getElementById('sai-theme-btn');
    const closeBtn  = document.getElementById('sai-close');
    const msgs      = document.getElementById('sai-msgs');
    const chips     = document.getElementById('sai-chips');
    const textarea  = document.getElementById('sai-textarea');
    const sendBtn   = document.getElementById('sai-send');
    const dot       = document.getElementById('sai-dot');
    const statusTxt = document.getElementById('sai-status-txt');

    let isOpen = false, isBusy = false;

    // 隔離滾輪事件，避免主頁 Lenis 平滑滾動攔截 AIBOT 訊息區往上滾動
    ['wheel', 'mousewheel', 'DOMMouseScroll', 'touchmove'].forEach(evtType => {
      panel.addEventListener(evtType, function (e) {
        e.stopPropagation();
      }, { passive: true });
    });

    if (msgs) {
      msgs.addEventListener('wheel', function (e) {
        e.stopPropagation();
      }, { passive: true });
    }

    if (chips) {
      ['wheel', 'mousewheel', 'DOMMouseScroll', 'touchmove'].forEach(evtType => {
        chips.addEventListener(evtType, function (e) {
          e.stopPropagation();
        }, { passive: true });
      });
    }

    // Theme Management
    function applyTheme(themeName) {
      if (themeName === 'cyan') {
        btn.classList.add('sai-theme-cyan');
        panel.classList.add('sai-theme-cyan');
        btn.classList.remove('sai-theme-gold');
        panel.classList.remove('sai-theme-gold');
      } else {
        btn.classList.remove('sai-theme-cyan');
        panel.classList.remove('sai-theme-cyan');
        btn.classList.add('sai-theme-gold');
        panel.classList.add('sai-theme-gold');
      }
    }

    function initTheme() {
      const savedTheme = localStorage.getItem(LS_THEME) || 'gold';
      applyTheme(savedTheme);
      return savedTheme;
    }
    let currentTheme = initTheme();

    themeBtn.addEventListener('click', () => {
      currentTheme = currentTheme === 'gold' ? 'cyan' : 'gold';
      localStorage.setItem(LS_THEME, currentTheme);
      applyTheme(currentTheme);
      const themeLabel = currentTheme === 'gold' ? '👑 **黑金尊爵 (Alpha Dark Gold)**' : '⚡ **霓虹藍紫 (Classic Neon)**';
      addMsg('a', `🎨 配色主題已切換為：${themeLabel}`);
    });

    if (homeBtn) {
      homeBtn.addEventListener('click', () => {
        if (msgs) msgs.scrollTop = 0;
        addMsg('a', `🏠 **StockAI 機器人導覽小首頁**

歡迎使用！請點擊下方按鈕或輸入問題：

・ 🇺🇸 **[美股]** 433 檔美股、20 大政策主題與 GICS 產業
・ 🇹🇼 **[台股]** 104 檔台股供應鏈與三大法人籌碼
・ 📊 **[台股觀測指標]** 籌碼、消息、基本面、技術面四大維度
・ 🌐 **[美股觀測指標]** 行政命令與 12 大產業板塊
・ 📈 **[技術面]** RSI 14 動能與 OBV 55D 資金流向
・ 🧲 **[籌碼面]** 13F 機構持股與 Form 4 內部人申報
・ 📋 **[基本面]** 營收年增率、毛利率與 ROE 數據`);
      });
    }

    setTimeout(() => { if (!isOpen) badge.style.display = 'flex'; }, 2000);

    function open()  { isOpen=true;  btn.classList.add('open');    panel.classList.add('open');    badge.style.display='none'; setTimeout(()=>textarea.focus(),300); }
    function close() { isOpen=false; btn.classList.remove('open'); panel.classList.remove('open'); }

    btn.addEventListener('click', () => isOpen ? close() : open());
    closeBtn.addEventListener('click', close);

    function scrollBottom() { requestAnimationFrame(() => { msgs.scrollTop = msgs.scrollHeight; }); }

    function addMsg(role, text) {
      const row = document.createElement('div');
      row.className = 'sai-row' + (role==='u' ? ' u' : '');
      const avLabel = role==='u' ? '你' : 'AI';
      const content = role==='u'
        ? text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/\n/g,'<br>')
        : md(text);
      row.innerHTML = `<div class="sai-av ${role}">${avLabel}</div><div class="sai-bub ${role}">${content}</div>`;
      msgs.appendChild(row);
      scrollBottom();
    }

    function showTyping() {
      const row = document.createElement('div');
      row.className = 'sai-row'; row.id = 'sai-typing';
      row.innerHTML = `<div class="sai-av a">AI</div><div class="sai-typing"><div class="sai-td"></div><div class="sai-td"></div><div class="sai-td"></div></div>`;
      msgs.appendChild(row); scrollBottom();
    }
    function hideTyping() { document.getElementById('sai-typing')?.remove(); }

    async function send() {
      const text = textarea.value.trim();
      if (!text || isBusy) return;
      chips.style.display = 'none';
      addMsg('u', text);
      textarea.value = ''; resize(); sendBtn.disabled = true; isBusy = true;
      showTyping();
      await new Promise(r => setTimeout(r, 250 + Math.random()*250));
      hideTyping();

      // 1. 優先查閱 433 美股與台股驗證解答庫（100% 精準個股 5 大步驟）
      const dbMatch = findStockInDB(text);
      if (dbMatch && dbMatch.full_bot_answer) {
        addMsg('a', dbMatch.full_bot_answer);
        isBusy = false;
        return;
      }

      // 2. 優先查閱系統資料庫規模查詢（如：我們有多少台股/美股/數量/幾檔）
      const sysQueryMatch = checkSystemScaleQuery(text);
      if (sysQueryMatch) {
        addMsg('a', sysQueryMatch);
        isBusy = false;
        return;
      }

      // 3. 資料庫一般回覆
      addMsg('a', mockReply(text));
      isBusy = false;
    }

    function resize() { textarea.style.height='auto'; textarea.style.height=Math.min(textarea.scrollHeight,90)+'px'; }

    textarea.addEventListener('input', () => { resize(); sendBtn.disabled = textarea.value.trim()===''||isBusy; });
    textarea.addEventListener('keydown', e => { if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();if(!sendBtn.disabled)send();} });
    sendBtn.addEventListener('click', send);

    chips.querySelectorAll('.sai-chip').forEach(c => {
      c.addEventListener('click', () => { textarea.value=c.dataset.q; resize(); sendBtn.disabled=false; send(); });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
