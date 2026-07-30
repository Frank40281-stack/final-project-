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

  const TW_API  = 'http://35.229.146.232/';
  const US_API  = 'http://34.81.30.50:8000/api/';
  const LS_KEY  = 'stockai_api_key';
  const LS_THEME= 'stockai_theme';

  const EP_GEMINI  = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
  const EP_OPENAI  = 'https://api.openai.com/v1/chat/completions';
  const EP_CLAUDE  = 'https://api.anthropic.com/v1/messages';

  // ── System prompt ─────────────────────────────────────────────────────────
  const SYSTEM_PROMPT = `你是「StockAI 股市智能助手」，專屬於一套整合台股與美股的多維度量化分析系統。
你已完整讀過以下兩份系統設計報告，請依照這些知識回答使用者問題。請用繁體中文回答，語氣專業但親切，回答300字以內。

台股 API：${TW_API}
美股 API：${US_API}

═══════════════════════════════════════════════════
【台股觀測系統核心知識】
═══════════════════════════════════════════════════

【觀點一：巨觀視角 — 美國政策紅利與全球供應鏈連結度】
本系統最大特色是將台股與美國宏觀政策主題強力連結，分類包含：
・科技硬體：AI資料中心、半導體CHIPS、量子科技
・能源基建：電力基建電網、核能SMR周邊、傳統能源LNG
・戰備資源：國防航太軍工、關鍵礦物金屬
・產業回流：EV電池充電、製藥製造回流
政策關聯性評級分三級：核心受惠 > 供應鏈受惠 > 題材延伸

【觀點二：四大維度綜合評分（總分 16 分）】
1. 籌碼面（Chip Score，5.0分）— 機構持股、Owners家數變化、買賣家數比
2. 消息情緒面（Sentiment Score，2.5分）— Short Interest %、Days To Cover軋空指標
3. 基本面（Fundamental Score，5.5分）— Float、Form 4、13F申報、成交量相對均量
4. 技術面（Technical Score，3.0分）— RSI 14動能、Composite RS Line、OBV 55D

【觀點三：個股微觀 — 多維指標共振】
・K線 + MA均線（5/10/20/60日）+ 成交量比 → 尋找突破拐點
・融資餘額 + 融券餘額 + 券資比 → 軋空機會偵測

═══════════════════════════════════════════════════
【美股觀測系統核心知識】
═══════════════════════════════════════════════════
・美股資料庫規模：線上系統 (http://34.81.30.50:8000/api/) 即時監測 433 檔美股核心個股。
・雙軌視角：20 個美股政策主題與 GICS 12 大產業板塊。
・標的動能：包含「近三日觸發買訊」之動態篩選。
═══════════════════════════════════════════════════`;

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
    position: fixed; bottom: 28px; right: 28px; z-index: 99998;
    display: flex; align-items: center; gap: 10px;
    padding: 0 20px 0 14px; height: 52px; border-radius: 999px; border: none;
    background: var(--sai-primary-grad);
    color: var(--sai-btn-color); font-family: 'Inter','Noto Sans TC',sans-serif;
    font-size: 0.9rem; font-weight: 700; cursor: pointer; letter-spacing: 0.3px;
    box-shadow: var(--sai-btn-shadow);
    transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1);
    animation: sai-ring 3s ease-in-out infinite;
  }
  #sai-btn:hover { transform: translateY(-2px) scale(1.04); }
  #sai-btn.open { background: linear-gradient(135deg, #2a3142, #1a2035); color: #fff; animation: none; box-shadow: 0 4px 16px rgba(0,0,0,0.5); }
  #sai-btn .sai-btn-icon { font-size: 1.2rem; line-height: 1; }
  #sai-btn .sai-btn-label { white-space: nowrap; }

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
    position: fixed; bottom: 94px; right: 28px; z-index: 99999;
    width: 370px; height: 540px; max-height: calc(100vh - 110px);
    border-radius: 20px;
    background: var(--sai-panel-bg);
    border: 1px solid var(--sai-accent-border);
    box-shadow: 0 24px 64px rgba(0,0,0,0.75), 0 0 0 1px var(--sai-accent-border);
    display: flex; flex-direction: column; overflow: hidden;
    font-family: 'Inter','Noto Sans TC',sans-serif;
    transform-origin: bottom right;
    transform: scale(0.88) translateY(16px); opacity: 0; pointer-events: none;
    transition: all 0.3s cubic-bezier(0.34,1.3,0.64,1);
  }
  #sai-panel.open { transform: scale(1) translateY(0); opacity: 1; pointer-events: all; }

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
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    transition: all .2s ease;
  }
  .sai-icon-btn:hover { background: rgba(255,255,255,0.1); color: #f0f4ff; }

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
    flex: 1; overflow-y: auto; padding: 14px 12px;
    display: flex; flex-direction: column; gap: 10px; scroll-behavior: smooth;
  }
  #sai-msgs::-webkit-scrollbar { width: 3px; }
  #sai-msgs::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 2px; }

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

  /* Chips */
  #sai-chips {
    display: flex; flex-wrap: nowrap; overflow-x: auto; gap: 6px;
    padding: 6px 12px 10px; flex-shrink: 0;
    scrollbar-width: none;
  }
  #sai-chips::-webkit-scrollbar { display: none; }
  .sai-chip {
    font-size: 0.72rem; padding: 5px 11px; border-radius: 999px; white-space: nowrap;
    border: 1px solid var(--sai-accent-border); background: var(--sai-accent-bg);
    color: #8892a8; cursor: pointer; transition: all .2s ease; font-family: inherit;
    flex-shrink: 0;
  }
  .sai-chip:hover { border-color: var(--sai-accent); color: var(--sai-accent); background: var(--sai-accent-bg); transform: translateY(-1px); }
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
    #sai-panel { right:10px; bottom:86px; width:calc(100vw - 20px); height:68vh; }
    #sai-btn   { right:16px; bottom:16px; padding: 0 16px 0 12px; height:46px; font-size:.82rem; }
  }
  `;

  // ── Mock AI Responses ─────────────────────────────────────────────────────
  const MOCKS = [
    { kw: ['美股','美股多少','美股數量','美股幾檔'],
      r: () => `**🇺🇸 美股資料庫規模**\n\n・**即時監測數量**：線上系統共監測 **433 檔**美股核心個股。\n・**雙軌分類**：涵蓋 **20 大美國政策主題** 與 **GICS 12 大產業板塊**。\n・**核心 API 端點**：http://34.81.30.50:8000/api/\n\n> 💡 提供歷史勝率、軋空風險與 16 分多維評分！` },
    { kw: ['數量','幾檔','多少','列表','清單'],
      r: () => `**📊 系統監測股票數量**\n\n・**🇹🇼 台股**：即時連線監測 **133 檔**指標個股（API: http://35.229.146.232/）。\n・**🇺🇸 美股**：線上系統監測 **433 檔**核心個股，劃分為 20 大政策主題與 12 大產業（API: http://34.81.30.50:8000/api/）。` },
    { kw: ['即時','歷史','更新','時間'],
      r: () => `**🕒 資料時效性說明**\n\n1. **股票清單**：支援動態 Smart Fetch 即時連線查詢。\n2. **籌碼與財務面**：採用最新交易日與 13F、Form 4 申報。\n3. **技術面動能**：包含「近三日觸發買訊」動態篩選。` },
    { kw: ['台積電','2330','tsmc'],
      r: () => `**📊 台積電 (2330)**\n籌碼面 ⭐⭐⭐⭐⭐ 外資持續增持\n技術面 ⭐⭐⭐⭐ RSI 健康區間\n基本面 ⭐⭐⭐⭐⭐ 毛利率 53%+` }
  ];
  const FALLBACKS = [
    `目前**模擬模式** 🤖\n\n可問我台股、美股分析、RSI、OBV 技術指標或籌碼動向。\n\n> 點選 🔑 設定 API Key 可升級為真實 AI 分析！`
  ];

  function mockReply(q) {
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

  // ── Gemini / OpenAI / Claude APIs ────────────────────────────────────────
  async function geminiReply(userText, apiKey) {
    const body = { contents: [{ role: 'user', parts: [{ text: SYSTEM_PROMPT + '\n\n問題：' + userText }] }] };
    const res = await fetch(`${EP_GEMINI}?key=${apiKey}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Gemini HTTP ${res.status}`);
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || '（無回應）';
  }

  async function openaiReply(userText, apiKey) {
    const body = { model: 'gpt-4o-mini', messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: userText }], max_tokens: 600 };
    const res = await fetch(EP_OPENAI, { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`OpenAI HTTP ${res.status}`);
    const data = await res.json();
    return data?.choices?.[0]?.message?.content || '（無回應）';
  }

  async function claudeReply(userText, apiKey) {
    const body = { model: 'claude-3-5-haiku-20241022', max_tokens: 600, system: SYSTEM_PROMPT, messages: [{ role: 'user', content: userText }] };
    const res = await fetch(EP_CLAUDE, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' }, body: JSON.stringify(body) });
    if (!res.ok) throw new Error(`Claude HTTP ${res.status}`);
    const data = await res.json();
    return data?.content?.[0]?.text || '（無回應）';
  }

  async function aiReply(userText, apiKey) {
    const provider = detectProvider(apiKey);
    if (provider === 'gemini') return await geminiReply(userText, apiKey);
    if (provider === 'openai') return await openaiReply(userText, apiKey);
    if (provider === 'claude') return await claudeReply(userText, apiKey);
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

    // Launcher Button
    const btn = document.createElement('button');
    btn.id = 'sai-btn';
    btn.setAttribute('aria-label','開啟 StockAI 助手');
    btn.innerHTML = `
      <span class="sai-btn-icon">🤖</span>
      <span class="sai-btn-label">StockAI 助手</span>
      <span id="sai-badge">1</span>`;
    document.body.appendChild(btn);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'sai-panel';
    panel.setAttribute('role','dialog');
    panel.setAttribute('aria-label','StockAI 股市問答機器人');
    panel.innerHTML = `
      <!-- Header -->
      <div class="sai-hd">
        <div class="sai-hd-av">🤖</div>
        <div class="sai-hd-info">
          <div class="sai-hd-title">StockAI 股市助手</div>
          <div class="sai-hd-status">
            <span class="sai-status-dot offline" id="sai-dot"></span>
            <span id="sai-status-txt">模擬模式（未設定 API Key）</span>
          </div>
        </div>
        <div class="sai-hd-actions">
          <button class="sai-icon-btn" id="sai-theme-btn" title="切換配色主題（黑金尊爵 / 霓虹藍）">🎨</button>
          <button class="sai-icon-btn" id="sai-key-btn" title="設定 AI API Key（Gemini / OpenAI / Claude）">🔑</button>
          <button class="sai-icon-btn" id="sai-close" title="關閉">✕</button>
        </div>
      </div>

      <!-- API Key Panel -->
      <div id="sai-key-panel">
        <p style="font-weight:700;color:#f0f4ff">設定 AI API Key：</p>
        <div class="sai-key-row">
          <input type="password" id="sai-key-input" placeholder="貼上 Gemini / OpenAI / Claude 金鑰...">
          <button id="sai-key-save">儲存</button>
        </div>
        <p class="sai-key-note" style="line-height:1.6">
          🟦 <b style="color:#d8e0f0">AIza...</b> → Gemini (Google)<br>
          🟩 <b style="color:#d8e0f0">sk-...</b> → ChatGPT (OpenAI)<br>
          🟪 <b style="color:#d8e0f0">sk-ant-...</b> → Claude (需後端代理)<br>
          🔒 金鑰僅存於本機 localStorage，不外傳。
        </p>
      </div>

      <!-- Messages -->
      <div id="sai-msgs">
        <div class="sai-row">
          <div class="sai-av a">AI</div>
          <div class="sai-bub a">
            👋 您好！我是 <strong>StockAI</strong> 股市助手。<br>
            可詢問台股、美股分析、技術指標等問題！<br><br>
            🎨 點擊右上角 **🎨** 可隨時切換「👑黑金尊爵 / ⚡霓虹藍」配色！<br>
            🔑 點擊 **🔑** 可升級真實 AI (Gemini/OpenAI/Claude)。
          </div>
        </div>
      </div>

      <!-- Quick Chips -->
      <div id="sai-chips">
        <button class="sai-chip" data-q="美股最近有哪些值得關注的強勢股或題材？">🇺🇸 美股</button>
        <button class="sai-chip" data-q="台股目前有哪些強勢族群或主流類股？">🇹🇼 台股</button>
        <button class="sai-chip" data-q="請介紹台股分析系統中使用的主要觀測指標有哪些？">📊 觀測指標</button>
        <button class="sai-chip" data-q="目前台股籌碼面最強的股票有哪些特徵？">🧲 籌碼面</button>
        <button class="sai-chip" data-q="請解釋 RSI 與 OBV 技術指標的使用方式">📈 技術面</button>
        <button class="sai-chip" data-q="如何從毛利率、EPS、內部人持股分析一家公司的基本面？">📋 基本面</button>
        <button class="sai-chip" data-q="三大法人（外資、投信、自營商）今日買超哪些股票最多？">🏦 法人動態</button>
        <button class="sai-chip" data-q="美國政策（AI、半導體、電力基建）對台灣供應鏈有什麼影響？">🌐 政策題材</button>
      </div>

      <!-- Input -->
      <div class="sai-inp-area">
        <textarea id="sai-textarea" placeholder="輸入問題... (Enter 送出)" rows="1" maxlength="500"></textarea>
        <button id="sai-send" disabled aria-label="送出">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
            <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
      <div class="sai-footer">Powered by StockAI · 台股 &amp; 美股分析</div>
    `;
    document.body.appendChild(panel);

    // DOM refs
    const badge     = document.getElementById('sai-badge');
    const themeBtn  = document.getElementById('sai-theme-btn');
    const keyBtn    = document.getElementById('sai-key-btn');
    const closeBtn  = document.getElementById('sai-close');
    const keyPanel  = document.getElementById('sai-key-panel');
    const keyInput  = document.getElementById('sai-key-input');
    const keySave   = document.getElementById('sai-key-save');
    const msgs      = document.getElementById('sai-msgs');
    const chips     = document.getElementById('sai-chips');
    const textarea  = document.getElementById('sai-textarea');
    const sendBtn   = document.getElementById('sai-send');
    const dot       = document.getElementById('sai-dot');
    const statusTxt = document.getElementById('sai-status-txt');

    let isOpen = false, isBusy = false;

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

    // Load Key
    function loadKey() {
      const k = localStorage.getItem(LS_KEY) || '';
      if (k) {
        keyInput.value = k;
        const provider = detectProvider(k);
        dot.className = provider === 'claude' ? 'sai-status-dot offline' : 'sai-status-dot online';
        statusTxt.textContent = providerLabel(k);
      } else {
        dot.className = 'sai-status-dot offline';
        statusTxt.textContent = '模擬模式（未設定 API Key）';
      }
      return k;
    }
    loadKey();

    setTimeout(() => { if (!isOpen) badge.style.display = 'flex'; }, 2000);

    function open()  { isOpen=true;  btn.classList.add('open');    panel.classList.add('open');    badge.style.display='none'; setTimeout(()=>textarea.focus(),300); }
    function close() { isOpen=false; btn.classList.remove('open'); panel.classList.remove('open'); keyPanel.style.display='none'; }

    btn.addEventListener('click', () => isOpen ? close() : open());
    closeBtn.addEventListener('click', close);

    keyBtn.addEventListener('click', () => {
      const showing = keyPanel.style.display === 'flex';
      keyPanel.style.display = showing ? 'none' : 'flex';
    });

    keySave.addEventListener('click', () => {
      const k = keyInput.value.trim();
      if (k) {
        localStorage.setItem(LS_KEY, k);
        const p = detectProvider(k);
        const providerName = p==='gemini' ? 'Gemini (Google)' : p==='openai' ? 'ChatGPT (OpenAI)' : p==='claude' ? 'Claude (Anthropic)' : '未知';
        addMsg('a', `✅ **${providerName}** API Key 已儲存！已可使用真實 AI 分析。`);
      } else {
        localStorage.removeItem(LS_KEY);
        addMsg('a', '⚠️ 已清除 API Key，回到模擬模式。');
      }
      loadKey();
      keyPanel.style.display = 'none';
    });

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
      await new Promise(r => setTimeout(r, 600 + Math.random()*700));
      hideTyping();
      const key = localStorage.getItem(LS_KEY);
      if (key) {
        try {
          const reply = await aiReply(text, key);
          addMsg('a', reply);
        } catch(e) {
          addMsg('a', `⚠️ API 回應失敗（${e.message}）\n\n降回模擬模式：\n\n${mockReply(text)}`);
        }
      } else {
        addMsg('a', mockReply(text));
      }
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
