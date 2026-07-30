// ===== StockAI Chatbot - Frontend Mock =====

// ---- Data ----
const TW_STOCK_API = 'http://35.229.146.232/';
const US_STOCK_API = 'http://34.81.30.50:8000/api/';

let chatSessions = [];
let currentSessionId = null;
let isTyping = false;

// ---- Mock AI Response Engine ----
const RESPONSES = [
  {
    match: ['台積電', '2330', 'tsmc'],
    reply: (q) => `
**📊 台積電 (2330) 分析摘要**

根據目前系統的多維度評分，台積電在以下維度表現：

| 維度 | 評分 | 說明 |
|------|------|------|
| 籌碼面 | ⭐⭐⭐⭐⭐ | 外資持續增持，機構活躍度高 |
| 技術面 | ⭐⭐⭐⭐ | RSI 位於 55-65 健康區間，均線多頭排列 |
| 基本面 | ⭐⭐⭐⭐⭐ | EPS 年增率強勁，毛利率維持 53%+ |
| 情緒面 | ⭐⭐⭐⭐ | 空頭未平倉比例低，市場氣氛偏多 |

**💡 關鍵觀察：**
- AI 伺服器需求持續推升 CoWoS 先進封裝訂單
- 美國 CHIPS 法案補貼帶動亞利桑那廠加速建設
- 近期外資單日買超名列前茅

> ⚠️ 目前為模擬回覆，串接 AI API 後可獲得基於即時數據的真實分析。`
  },
  {
    match: ['rsi', '超買', '超賣', '技術指標'],
    reply: () => `
**📈 RSI（相對強弱指標）完整教學**

RSI 是衡量**價格動能強弱**的震盪型指標，計算公式為：

\`RSI = 100 - [100 / (1 + 平均漲幅/平均跌幅)]\`

**🔴 判讀標準（以 RSI 14 為例）：**

| RSI 值 | 信號 | 操作意涵 |
|--------|------|---------|
| > 70 | 超買區 | 注意獲利了結，等待回調 |
| 50-70 | 多頭區 | 趨勢向上，可持有 |
| 30-50 | 弱勢區 | 觀察是否跌破支撐 |
| < 30 | 超賣區 | 注意反彈機會 |

**🔥 進階技巧 — 背離訊號：**
- **多頭背離**：股價創新低，RSI 卻未創新低 → 下跌動能衰竭，醞釀反彈
- **空頭背離**：股價創新高，RSI 卻未創新高 → 上漲動能衰竭，醞釀回調

> 💡 本系統使用 RSI 14 作為技術面評分基準之一`
  },
  {
    match: ['obv', '能量潮', '量價'],
    reply: () => `
**⚡ OBV 能量潮指標解析**

OBV（On-Balance Volume）是透過**量能累積**來驗證價格趨勢的指標。

**計算邏輯：**
- 當日收盤 **上漲** → 將成交量**加入** OBV
- 當日收盤 **下跌** → 將成交量**減去** OBV

**🔥 本系統 OBV 55D Money Flow 的應用：**
- 追蹤過去 55 個交易日的資金流向累積
- 與 55 日高點視窗對比，判斷是否為有效突破

**搭配均線使用策略：**
1. OBV 與股價**同步上升** → 多頭確認，可進場
2. OBV 與股價**背離**（價漲量縮）→ 警示訊號，注意風險
3. OBV 突破前高 → 往往預示股價即將突破`
  },
  {
    match: ['三大法人', '外資', '投信', '自營商', '買超', '賣超'],
    reply: () => `
**🏦 三大法人動向分析**

三大法人指：**外資（FINI）、投信、自營商**

**📊 今日模擬數據（僅供展示）：**

| 排名 | 股票 | 三大法人買超(張) | 主力 |
|------|------|----------------|------|
| 1 | 台積電 2330 | +45,820 | 外資 |
| 2 | 聯發科 2454 | +12,300 | 外資+投信 |
| 3 | 廣達 2382 | +8,750 | 投信 |
| 4 | 緯穎 6669 | +6,200 | 外資 |
| 5 | 富邦媒 8454 | +4,100 | 投信 |

**💡 判讀重點：**
- 外資 + 投信**雙買**：籌碼最強，通常是波段主流股
- 自營商買超：可能為造市或避險操作，需配合其他指標

> 串接 [台股 API](${TW_STOCK_API}) 後可取得即時真實法人籌碼數據`
  },
  {
    match: ['政策', '美國', '供應鏈', '半導體', 'chips', 'ai資料中心'],
    reply: () => `
**🌐 美國政策紅利與台灣供應鏈連動分析**

本系統將個股分類至以下美國政策主題：

**🔥 高度受惠主題：**
| 政策主題 | 受惠台股類型 |
|---------|------------|
| AI 資料中心 | CoWoS 封裝、HBM 記憶體、電源管理 IC |
| 半導體 CHIPS | 晶圓代工、IP 設計、設備材料 |
| 電力基建電網 | 電力設備、變壓器、電纜 |
| 國防航太軍工 | PCB、特殊合金、航電模組 |

**📊 政策關聯性評級：**
- **核心受惠**：直接承接美國訂單或補貼（如台積電、日月光）
- **供應鏈受惠**：核心企業的上下游夥伴
- **題材延伸**：概念相關但關聯較間接

> 💡 本系統使用此框架對台股進行政策題材分類評分`
  },
  {
    match: ['籌碼', '機構', '持股', '法人持股', '外資持股'],
    reply: () => `
**🧲 籌碼面指標完整解析（總分 5.0 分）**

本系統籌碼面包含以下 6 大子指標：

1. **機構持股比例（Institutional Ownership %）**
   → 比例越高，代表大資金認同程度越高

2. **MRQ 機構持股變化**
   → 最近一季機構增減持，正值為加碼

3. **機構股東家數變化（Owners Change）**
   → 持有機構數量增加 = 更多機構認同

4. **投組配置增長（Portfolio Allocation Growth）**
   → 機構對此股的配置比例是否上升

5. **買賣家數比（Buyer/Seller Ratio）**
   → 買進機構 / 賣出機構，>1 代表買方佔優

6. **相對淨流入（Relative Net Inflow）**
   → 相對同類股的資金流入強度

> 🎯 籌碼面是本系統最重視的維度（5/16分），強勢股通常籌碼面先行發動`
  }
];

const FALLBACK_RESPONSES = [
  `感謝您的提問！🤔

目前系統正在**模擬模式**下運行，此問題需要串接 AI API 才能提供精確分析。

**您可以嘗試問我：**
- 台積電、聯發科等個股分析
- RSI、OBV 等技術指標解釋  
- 三大法人籌碼動向
- 美國政策對台股供應鏈影響

> 串接 Gemini API 或 OpenAI API 後，即可獲得基於真實數據的 AI 分析。`,

  `這是個好問題！📊

**股市分析小提示：**
本系統整合了以下多維度評分架構：
- 🧲 **籌碼面**（5分）：法人持股、買賣比
- 💬 **情緒面**（2.5分）：空頭比例、ESG
- 📋 **基本面**（5.5分）：EPS、毛利率、內部人
- 📈 **技術面**（3分）：RSI、RS Line、OBV

總分 16 分，分數越高代表個股綜合條件越強。

> 模擬模式下無法提供更具體的回覆，請串接 AI API 後再試。`,

  `您詢問的內容已收到！🌟

目前系統具備以下資料來源：
- **台股 API**：[${TW_STOCK_API}](${TW_STOCK_API})
- **美股 API**：[${US_STOCK_API}](${US_STOCK_API})

串接 AI API 後，系統可以：
1. 即時拉取個股財報數據進行分析
2. 比對歷史均量，判斷量能突破
3. 計算多維度評分並給出綜合建議

> ⚠️ 模擬模式回覆僅供展示，不代表真實投資建議。`
];

// ---- Utility ----
function generateId() {
  return 'sess_' + Math.random().toString(36).substr(2, 9);
}

function formatTime(date) {
  return date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' });
}

function autoResize(textarea) {
  textarea.style.height = 'auto';
  textarea.style.height = Math.min(textarea.scrollHeight, 160) + 'px';
}

// ---- DOM References ----
const chatMessages = document.getElementById('chat-messages');
const welcomeScreen = document.getElementById('welcome-screen');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const charCount = document.getElementById('char-count');
const chatHistory = document.getElementById('chat-history');
const menuBtn = document.getElementById('menu-btn');
const sidebar = document.getElementById('sidebar');
const sidebarClose = document.getElementById('sidebar-close');
const newChatBtn = document.getElementById('new-chat-btn');
const clearBtn = document.getElementById('clear-btn');

// ---- Message Rendering ----
function renderUserMessage(text) {
  const row = document.createElement('div');
  row.className = 'message-row user';
  row.innerHTML = `
    <div class="avatar user-av">你</div>
    <div class="bubble user-bubble">${escapeHtml(text)}</div>
  `;
  chatMessages.appendChild(row);
  scrollToBottom();
}

function renderAITyping() {
  const row = document.createElement('div');
  row.className = 'message-row ai-row';
  row.id = 'typing-row';
  row.innerHTML = `
    <div class="avatar ai">AI</div>
    <div class="typing-indicator">
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    </div>
  `;
  chatMessages.appendChild(row);
  scrollToBottom();
  return row;
}

function renderAIMessage(text) {
  const typingRow = document.getElementById('typing-row');
  if (typingRow) typingRow.remove();

  const row = document.createElement('div');
  row.className = 'message-row ai-row';
  row.innerHTML = `
    <div class="avatar ai">AI</div>
    <div class="bubble ai-bubble">${markdownToHtml(text)}</div>
  `;
  chatMessages.appendChild(row);
  scrollToBottom();
}

function escapeHtml(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

function markdownToHtml(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:rgba(0,212,255,0.1);padding:1px 6px;border-radius:4px;font-size:0.85em;color:var(--accent-blue)">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" style="color:var(--accent-blue);text-decoration:underline">$1</a>')
    .replace(/^> (.*?)$/gm, '<blockquote style="border-left:3px solid var(--accent-blue);padding-left:12px;color:var(--text-secondary);margin:8px 0;font-size:0.85em">$1</blockquote>')
    .replace(/^#{1,3} (.*?)$/gm, '<h3 style="color:var(--accent-blue);font-size:1rem;margin-bottom:8px">$1</h3>')
    .replace(/\n\|(.*)\|\n/g, matchTable)
    .replace(/\n/g, '<br>')
    .replace(/<br><br>/g, '<br>');
}

function matchTable(match) {
  const rows = match.trim().split('\n').filter(r => !r.match(/^\|[-| ]+\|$/));
  let html = '<table style="width:100%;border-collapse:collapse;margin:10px 0;font-size:0.82em">';
  rows.forEach((row, i) => {
    const cells = row.split('|').slice(1, -1);
    html += '<tr>';
    cells.forEach(cell => {
      const tag = i === 0 ? 'th' : 'td';
      const style = i === 0
        ? 'style="padding:7px 10px;background:rgba(0,212,255,0.08);border:1px solid rgba(255,255,255,0.07);color:var(--accent-blue);font-weight:600;text-align:left"'
        : 'style="padding:7px 10px;border:1px solid rgba(255,255,255,0.05);color:var(--text-secondary)"';
      html += `<${tag} ${style}>${cell.trim()}</${tag}>`;
    });
    html += '</tr>';
  });
  html += '</table>';
  return html;
}

function scrollToBottom() {
  requestAnimationFrame(() => {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });
}

// ---- AI Response Logic ----
function getAIResponse(query) {
  const q = query.toLowerCase();
  for (const r of RESPONSES) {
    if (r.match.some(kw => q.includes(kw.toLowerCase()))) {
      return r.reply(query);
    }
  }
  return FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)];
}

// ---- Send Message ----
async function sendMessage() {
  const text = userInput.value.trim();
  if (!text || isTyping) return;

  // Hide welcome screen
  if (welcomeScreen && welcomeScreen.parentNode) {
    welcomeScreen.style.animation = 'fadeOut 0.3s ease forwards';
    setTimeout(() => welcomeScreen.remove(), 300);
  }

  // Create session if needed
  if (!currentSessionId) createNewSession();
  addMessageToSession(currentSessionId, 'user', text);

  userInput.value = '';
  autoResize(userInput);
  charCount.textContent = '0 / 2000';
  sendBtn.disabled = true;
  isTyping = true;

  renderUserMessage(text);
  renderAITyping();

  // Simulate typing delay (800ms - 1800ms)
  const delay = 800 + Math.random() * 1000;
  await new Promise(r => setTimeout(r, delay));

  const reply = getAIResponse(text);
  renderAIMessage(reply);
  addMessageToSession(currentSessionId, 'ai', reply);
  updateHistoryItem(currentSessionId, text);

  isTyping = false;
}

// ---- Session Management ----
function createNewSession() {
  const id = generateId();
  currentSessionId = id;
  chatSessions.unshift({ id, title: '新對話', messages: [], createdAt: new Date() });
  renderHistoryItem(chatSessions[0]);
  return id;
}

function addMessageToSession(id, role, text) {
  const session = chatSessions.find(s => s.id === id);
  if (session) session.messages.push({ role, text, time: new Date() });
}

function updateHistoryItem(id, text) {
  const session = chatSessions.find(s => s.id === id);
  if (session) {
    session.title = text.length > 28 ? text.slice(0, 28) + '…' : text;
    const item = document.getElementById('hist-' + id);
    if (item) item.textContent = session.title;
  }
}

function renderHistoryItem(session) {
  const existing = document.getElementById('hist-' + session.id);
  if (existing) return;

  const item = document.createElement('div');
  item.className = 'history-item active';
  item.id = 'hist-' + session.id;
  item.textContent = session.title;
  item.addEventListener('click', () => loadSession(session.id));

  // Deactivate others
  document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
  chatHistory.prepend(item);
}

function loadSession(id) {
  currentSessionId = id;
  document.querySelectorAll('.history-item').forEach(el => {
    el.classList.toggle('active', el.id === 'hist-' + id);
  });
  // On mobile, close sidebar after selecting
  sidebar.classList.remove('open');
  document.querySelector('.overlay')?.classList.remove('show');
}

// ---- Sidebar Overlay ----
function createOverlay() {
  let overlay = document.querySelector('.overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);
    overlay.addEventListener('click', closeSidebar);
  }
  return overlay;
}

function openSidebar() {
  sidebar.classList.add('open');
  createOverlay().classList.add('show');
}

function closeSidebar() {
  sidebar.classList.remove('open');
  document.querySelector('.overlay')?.classList.remove('show');
}

// ---- Suggestion Cards ----
document.querySelectorAll('.suggestion-card').forEach(card => {
  card.addEventListener('click', () => {
    const query = card.dataset.query;
    userInput.value = query;
    autoResize(userInput);
    charCount.textContent = `${query.length} / 2000`;
    sendBtn.disabled = false;
    sendMessage();
  });
});

// ---- Event Listeners ----
userInput.addEventListener('input', () => {
  autoResize(userInput);
  const len = userInput.value.length;
  charCount.textContent = `${len} / 2000`;
  sendBtn.disabled = len === 0 || isTyping;
});

userInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (!sendBtn.disabled) sendMessage();
  }
});

sendBtn.addEventListener('click', sendMessage);

menuBtn.addEventListener('click', openSidebar);
sidebarClose.addEventListener('click', closeSidebar);

newChatBtn.addEventListener('click', () => {
  currentSessionId = null;
  chatMessages.innerHTML = '';
  // Re-add welcome screen
  const ws = document.createElement('div');
  ws.className = 'welcome-screen';
  ws.id = 'welcome-screen';
  ws.innerHTML = `
    <div class="welcome-logo">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="url(#wlg2)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
        <defs><linearGradient id="wlg2" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop stop-color="#00d4ff"/><stop offset="1" stop-color="#7b61ff"/>
        </linearGradient></defs>
      </svg>
    </div>
    <h1 class="welcome-title">股市 AI 智能助手</h1>
    <p class="welcome-subtitle">詢問台股、美股相關問題，獲取即時分析與洞察</p>
    <div class="suggestion-grid">
      <button class="suggestion-card" data-query="台積電 2330 近期走勢如何？技術面有什麼訊號？">
        <div class="sug-icon">📈</div><div class="sug-text"><div class="sug-title">技術面分析</div><div class="sug-desc">台積電近期走勢與技術訊號</div></div>
      </button>
      <button class="suggestion-card" data-query="目前台股籌碼面最強的 AI 相關股票有哪些？">
        <div class="sug-icon">🧲</div><div class="sug-text"><div class="sug-title">籌碼面篩選</div><div class="sug-desc">AI 題材籌碼最強個股</div></div>
      </button>
      <button class="suggestion-card" data-query="美國半導體政策對台灣半導體供應鏈有什麼影響？">
        <div class="sug-icon">🌐</div><div class="sug-text"><div class="sug-title">政策影響分析</div><div class="sug-desc">美國政策對台股供應鏈</div></div>
      </button>
      <button class="suggestion-card" data-query="解釋一下 RSI 指標超買超賣的判讀方式">
        <div class="sug-icon">📊</div><div class="sug-text"><div class="sug-title">指標教學</div><div class="sug-desc">RSI 超買超賣如何判讀</div></div>
      </button>
    </div>
  `;
  chatMessages.appendChild(ws);

  // Re-bind suggestion cards
  ws.querySelectorAll('.suggestion-card').forEach(card => {
    card.addEventListener('click', () => {
      const query = card.dataset.query;
      userInput.value = query;
      autoResize(userInput);
      charCount.textContent = `${query.length} / 2000`;
      sendBtn.disabled = false;
      sendMessage();
    });
  });

  closeSidebar();
});

clearBtn.addEventListener('click', () => {
  if (confirm('確定要清除目前對話嗎？')) {
    chatMessages.innerHTML = '<div class="message-row"><p style="color:var(--text-muted);font-size:0.82rem;margin:auto">對話已清除</p></div>';
    if (currentSessionId) {
      const session = chatSessions.find(s => s.id === currentSessionId);
      if (session) session.messages = [];
    }
  }
});

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
  userInput.focus();
  // Add CSS for fadeOut animation
  const style = document.createElement('style');
  style.textContent = `@keyframes fadeOut { to { opacity:0; transform:translateY(-10px); } }`;
  document.head.appendChild(style);
});
