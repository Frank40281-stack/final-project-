(function () {
  'use strict';

  const D = window.StockData;
  const app = document.getElementById('stock-app');
  const params = new URLSearchParams(location.search);
  const market = params.get('market');
  const ticker = D.normalizeTicker(params.get('ticker'));
  const cycle = D.getCycle(params.get('cycle'));
  const KPI_API_BASE = 'http://34.81.30.50:8000/api/stock/';
  const KPI_API_ORIGIN = 'http://34.81.30.50:8000';

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function label(group) {
    if (group === 'confirmed') return '已確認受惠';
    if (group === 'unconfirmed') return '未確認直接受惠';
    return '分類待查核';
  }

  function field(key, value) {
    return `<div class="evidence-row"><dt>${key}</dt><dd>${esc(value || '資料未提供')}</dd></div>`;
  }

  function formatScore(value, fallback) {
    const score = Number(value);
    return Number.isFinite(score) ? score.toFixed(score % 1 ? 1 : 0) : fallback;
  }

  function formatRunDate(value) {
    return value ? String(value).replace('T', ' ') : '資料未提供';
  }

  function scoreClass(score, maxScore) {
    const ratio = maxScore ? Number(score) / Number(maxScore) : 0;
    if (ratio >= 0.66) return 'is-up';
    if (ratio <= 0.33) return 'is-down';
    return '';
  }

  function apiUrl(symbol) {
    return `${KPI_API_BASE}${encodeURIComponent(symbol)}/json/?_t=${Date.now()}`;
  }

  function backtestImageUrl(symbol, kpiData) {
    const imageUrl = kpiData && kpiData.backtest && kpiData.backtest.image_url;
    if (imageUrl && /^https?:\/\//i.test(imageUrl)) return imageUrl;
    if (imageUrl) return `${KPI_API_ORIGIN}${imageUrl}`;
    return `${KPI_API_ORIGIN}/api/stocks/${encodeURIComponent(symbol)}/backtest-image/`;
  }

  function loadKpi(symbol) {
    return fetch(apiUrl(symbol), { headers: { Accept: 'application/json' } })
      .then(response => {
        if (!response.ok) throw new Error(response.status === 404 ? '資料庫查無此股票代號' : `API 回應 ${response.status}`);
        return response.json();
      })
      .then(payload => {
        if (!payload || payload.success !== true || !payload.data) throw new Error(payload && payload.message ? payload.message : 'API 回傳格式不完整');
        return payload.data;
      });
  }

  function renderScoreCards(kpiData) {
    const categories = Array.isArray(kpiData.score_categories) ? kpiData.score_categories : [];
    const cards = categories.length ? categories : [
      { key: 'chip_score', label: '籌碼', score: kpiData.scores && kpiData.scores.chip_score, max_score: 7 },
      { key: 'sentiment_score', label: '情緒', score: kpiData.scores && kpiData.scores.sentiment_score, max_score: 4 },
      { key: 'fundamental_score', label: '基本面', score: kpiData.scores && kpiData.scores.fundamental_score, max_score: 6 },
      { key: 'technical_score', label: '技術面', score: kpiData.scores && kpiData.scores.technical_score, max_score: 3 }
    ];

    return cards.map(item => {
      const score = Number(item.score);
      const max = Number(item.max_score);
      const displayScore = formatScore(score, 'N/A');
      const displayMax = Number.isFinite(max) ? formatScore(max, '') : '';
      const stars = item.stars && item.stars.text ? item.stars.text : '';
      return `<article class="kpi-score-card ${scoreClass(score, max)}">
        <span>${esc(item.label || item.key || '評分')}</span>
        <strong>${esc(displayScore)}${displayMax ? `<small> / ${esc(displayMax)}</small>` : ''}</strong>
        ${stars ? `<em>${esc(stars)}</em>` : ''}
      </article>`;
    }).join('');
  }

  function renderKpiRows(kpiData) {
    const rows = Array.isArray(kpiData.kpis) ? kpiData.kpis : [];
    if (!rows.length) return '<div class="kpi-empty">API 未提供 KPI 明細。</div>';
    return rows.map(item => `<article class="kpi-row">
      <div class="kpi-row__head">
        <span>KPI-${esc(item.code || '')}</span>
        <strong>${esc(item.name || '未命名指標')}</strong>
      </div>
      <dl>
        <div><dt>數值</dt><dd>${esc(item.display_value || item.value || '資料未提供')}</dd></div>
        <div><dt>得分</dt><dd>${esc(formatScore(item.score, 'N/A'))}</dd></div>
        <div><dt>狀態</dt><dd>${esc(item.status || '資料未提供')}</dd></div>
        <div><dt>來源</dt><dd>${esc(item.source || '資料未提供')}</dd></div>
      </dl>
      ${item.detail ? `<p>${esc(item.detail)}</p>` : ''}
    </article>`).join('');
  }

  function renderBacktestSummary(kpiData) {
    const summary = kpiData.backtest && kpiData.backtest.summary;
    if (!summary) return '';
    const latest = summary.latest_judgments || {};
    return `<section class="kpi-backtest">
      <header>
        <p class="eyebrow">BACKTEST</p>
        <h2>技術回測摘要</h2>
      </header>
      <div class="kpi-backtest__grid">
        ${field('最新日期', summary.latest_date)}
        ${field('最新收盤價', summary.latest_close == null ? '' : Number(summary.latest_close).toFixed(2))}
        ${field('觸發次數', summary.trigger_count)}
        ${field('勝率', summary.win_rate == null ? '' : `${summary.win_rate}%`)}
        ${field('半年平均報酬', summary.avg_ret_h == null ? '' : `${summary.avg_ret_h}%`)}
        ${field('一年平均報酬', summary.avg_ret_y == null ? '' : `${summary.avg_ret_y}%`)}
        ${field('KPI-18', latest.kpi18)}
        ${field('KPI-19', latest.kpi19)}
        ${field('KPI-20', latest.kpi20)}
      </div>
    </section>`;
  }

  function logoMarkup(stock) {
    const symbol = esc(stock.ticker);
    const name = esc(stock.companyName);
    return `<div class="cinema-logo" aria-label="${symbol} ${name}">
      <img src="https://financialmodelingprep.com/image-stock/${symbol}.png" alt="${name} logo" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
      <span hidden>${symbol.slice(0, 2)}</span>
    </div>`;
  }

  function chartPath(points, width, height, key, xFor, yFor) {
    const usable = points.filter(point => Number.isFinite(Number(point[key])));
    if (!usable.length) return '';
    return usable.map((point, index) => `${index ? 'L' : 'M'} ${xFor(point)} ${yFor(Number(point[key]))}`).join(' ');
  }

  let activeChartInstance = null;
  let lastFetchedTime = null;

  function formatTime(date) {
    if (!date) return '';
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }

  function renderMarketChart(kpiState, record) {
    if (!kpiState || kpiState.status === 'loading') {
      return `<div class="price-context-panel">
        <div class="kpi-empty">正在讀取 ${esc(record.ticker)} 資料庫 KPI 回測數據...</div>
      </div>`;
    }

    if (kpiState.status === 'error') {
      return `<div class="price-context-panel">
        <div class="kpi-empty" style="text-align:left">
          <strong style="color:var(--red);display:block;margin-bottom:6px">⚠️ 資料庫連線失敗：${esc(kpiState.message)}</strong>
          <span style="font-size:0.82rem;color:var(--muted);line-height:1.6;display:block">
            <strong>可能原因（CORS 跨網域限制）：</strong><br>
            當前網頁位址 (127.0.0.1:8000) 跨網域請求 API (34.81.30.50:8000) 時，因 API 伺服器末設定 <code>Access-Control-Allow-Origin</code> 標頭被瀏覽器阻擋。<br><br>
            <strong>解決方法：</strong><br>
            1. 後端 Django 伺服器需配置 <code>django-cors-headers</code> 允許存取。<br>
            2. 本地開發測試可開啟 Chrome 擴充套件「Allow CORS: Access-Control-Allow-Origin」。
          </span>
        </div>
      </div>`;
    }

    const kpiData = kpiState.data;
    if (!kpiData) {
      return `<div class="price-context-panel">
        <div class="kpi-empty">資料庫 API 未回傳 ${esc(record.ticker)} 數據。</div>
      </div>`;
    }

    const summary = kpiData.backtest && kpiData.backtest.summary;
    const latestDate = summary ? (summary.latest_date || 'N/A') : 'N/A';
    const latestClose = summary && summary.latest_close != null ? Number(summary.latest_close).toFixed(2) : 'N/A';
    const triggerCount = summary ? (summary.trigger_count ?? 'N/A') : 'N/A';
    const winRate = summary && summary.win_rate != null ? `${summary.win_rate}%` : 'N/A';
    const winLoss = summary ? (summary.win_loss || 'N/A') : 'N/A';
    const avgRetH = summary && summary.avg_ret_h != null ? `${summary.avg_ret_h > 0 ? '+' : ''}${summary.avg_ret_h}%` : 'N/A';
    const avgRetY = summary && summary.avg_ret_y != null ? `${summary.avg_ret_y > 0 ? '+' : ''}${summary.avg_ret_y}%` : 'N/A';
    const avgRet2Y = summary && summary.avg_ret_2y != null ? `${summary.avg_ret_2y > 0 ? '+' : ''}${summary.avg_ret_2y}%` : 'N/A';

    const updateTimeString = lastFetchedTime ? `最後更新 ${formatTime(lastFetchedTime)}` : '';

    return `<div class="price-context-panel" aria-label="${esc(record.ticker)} 回測圖表">
      <header class="price-context-header">
        <div class="price-context-title">
          <h3>回測圖表</h3>
          <span>KPI-18~20 Backtest ・ Chart1 - Price Context</span>
        </div>
        <div class="price-context-badges">
          ${updateTimeString ? `<span class="last-updated-tag">${esc(updateTimeString)}</span>` : ''}
          <button id="refresh-kpi-btn" class="refresh-btn" type="button" title="向資料庫重新擷取最新數據">
            <svg class="refresh-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.3"/>
            </svg>
            <span>刷新數據</span>
          </button>
          <span class="badge-tag">INTERACTIVE CHART</span>
        </div>
      </header>
      <div class="price-context-stats">
        <div class="stat-box">
          <span class="stat-label">最新日期</span>
          <strong class="stat-val">${esc(latestDate)}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-label">最新股價 P0</span>
          <strong class="stat-val">$${esc(latestClose)}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-label">觸發點</span>
          <strong class="stat-val">${esc(triggerCount)}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-label">勝率</span>
          <strong class="stat-val">${esc(winRate)}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-label">Win / Loss</span>
          <strong class="stat-val">${esc(winLoss)}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-label">回報率 (半年)</span>
          <strong class="stat-val ${summary && summary.avg_ret_h < 0 ? 'is-down' : summary && summary.avg_ret_h > 0 ? 'is-up' : ''}">${esc(avgRetH)}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-label">回報率 (1年)</span>
          <strong class="stat-val ${summary && summary.avg_ret_y < 0 ? 'is-down' : summary && summary.avg_ret_y > 0 ? 'is-up' : ''}">${esc(avgRetY)}</strong>
        </div>
        <div class="stat-box">
          <span class="stat-label">回報率 (2年)</span>
          <strong class="stat-val ${summary && summary.avg_ret_2y < 0 ? 'is-down' : summary && summary.avg_ret_2y > 0 ? 'is-up' : ''}">${esc(avgRet2Y)}</strong>
        </div>
      </div>
      <div class="price-context-chart-wrap">
        <canvas id="priceContextCanvas"></canvas>
      </div>
    </div>`;
  }

  function initPriceContextChart(kpiData) {
    const canvas = document.getElementById('priceContextCanvas');
    if (!canvas || typeof Chart === 'undefined') return;

    if (activeChartInstance) {
      activeChartInstance.destroy();
      activeChartInstance = null;
    }

    const backtest = kpiData && kpiData.backtest;
    if (!backtest || !backtest.series || !Array.isArray(backtest.series.price)) return;

    const priceSeries = backtest.series.price;
    const triggers = Array.isArray(backtest.triggers) ? backtest.triggers : [];
    const triggerDateMap = new Map();
    triggers.forEach(t => {
      if (t.date) triggerDateMap.set(t.date, t);
    });

    const labels = priceSeries.map(p => p.date);
    const closeData = priceSeries.map(p => Number.isFinite(Number(p.close)) ? Number(p.close) : null);
    const maData = priceSeries.map(p => Number.isFinite(Number(p.price_50ma)) ? Number(p.price_50ma) : null);

    const triggerPoints = [];
    priceSeries.forEach((p) => {
      const t = triggerDateMap.get(p.date);
      if (t) {
        triggerPoints.push({
          x: p.date,
          y: Number(p.close),
          triggerInfo: t
        });
      }
    });

    const ctx = canvas.getContext('2d');
    const gradient = ctx.createLinearGradient(0, 0, 0, 340);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.28)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    activeChartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Close (收盤價)',
            data: closeData,
            borderColor: '#38bdf8',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: '#38bdf8',
            tension: 0.1,
            fill: true,
            backgroundColor: gradient,
            order: 2
          },
          {
            label: 'Price 50MA',
            data: maData,
            borderColor: '#f97316',
            borderWidth: 1.8,
            borderDash: [5, 4],
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#f97316',
            tension: 0.2,
            fill: false,
            order: 3
          },
          {
            label: 'KPI18-20 觸發點',
            data: triggerPoints,
            type: 'scatter',
            backgroundColor: '#4ade80',
            borderColor: '#0f172a',
            borderWidth: 2,
            pointRadius: 6,
            pointHoverRadius: 9,
            pointHoverBackgroundColor: '#4ade80',
            pointHoverBorderColor: '#ffffff',
            order: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'nearest',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#94a3b8',
              font: { family: 'Outfit, sans-serif', size: 12 },
              usePointStyle: true,
              padding: 20
            }
          },
          tooltip: {
            backgroundColor: '#0f172a',
            titleColor: '#f8fafc',
            bodyColor: '#e2e8f0',
            borderColor: '#334155',
            borderWidth: 1,
            padding: 12,
            boxPadding: 4,
            usePointStyle: true,
            callbacks: {
              title: function(items) {
                if (!items.length) return '';
                const item = items[0];
                const dateStr = item.label || (item.raw && item.raw.x) || '';
                return `日期: ${dateStr}`;
              },
              label: function(context) {
                if (context.dataset.label === 'KPI18-20 觸發點') {
                  const info = context.raw && context.raw.triggerInfo;
                  if (info) {
                    return [
                      `🎯 KPI18-20 三指標成立 (觸發價: $${Number(info.close).toFixed(2)})`,
                      `  • KPI-18: ${info.kpi18 || '成立'}`,
                      `  • KPI-19: ${info.kpi19 || '成立'}`,
                      `  • KPI-20: ${info.kpi20 || '成立'}`
                    ];
                  }
                  return '🎯 KPI18-20 三指標成立';
                }
                const val = context.parsed.y;
                return `${context.dataset.label}: $${val != null ? val.toFixed(2) : 'N/A'}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: '#64748b',
              font: { family: 'Outfit, sans-serif', size: 11 },
              maxTicksLimit: 8,
              maxRotation: 0
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.07)'
            },
            ticks: {
              color: '#64748b',
              font: { family: 'Outfit, sans-serif', size: 11 },
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
  }

  function renderValidationPanel(kpiState) {
    if (!kpiState || kpiState.status === 'loading') {
      return `<aside class="cinema-validation"><div class="kpi-empty">正在讀取資料庫指標...</div></aside>`;
    }
    if (kpiState.status === 'error') {
      return `<aside class="cinema-validation"><div class="kpi-empty">資料庫 KPI 暫時無法載入：${esc(kpiState.message)}</div></aside>`;
    }

    const kpiData = kpiState.data;
    const rows = Array.isArray(kpiData.kpis) ? kpiData.kpis : [];
    const validated = rows.filter(row => Number(row.score) > 0 && String(row.status || '').toUpperCase() === 'OK').length;
    const total = rows.length || 20;
    const totalScore = kpiData.scores && kpiData.scores.total_score;

    return `<aside class="cinema-validation">
      <header>
        <div>
          <p class="eyebrow">MARKET VALIDATION</p>
          <h2>${total} 項指標，持續驗證強勢</h2>
          <p>政策提供方向；價格、籌碼與技術面由資料庫 KPI 交叉確認。</p>
        </div>
        <div class="validation-score"><strong>${validated}</strong><span>/ ${total} 項正向</span></div>
      </header>
      <div class="validation-grid">
        ${rows.map(row => {
          const scorePercent = Number(row.score_percent);
          const tone = Number(row.score) > 0 ? 'is-up' : 'is-down';
          return `<div class="validation-row ${tone}">
            <span></span>
            <div><strong>${esc(row.name || `KPI-${row.code}`)}</strong><small>${esc(row.score_label || row.status || '資料庫指標')}</small></div>
            <b>${esc(row.display_value || formatScore(scorePercent, 'N/A'))}</b>
          </div>`;
        }).join('')}
      </div>
      <footer><span></span>總分 ${esc(formatScore(totalScore, 'N/A'))} / 16，資料更新 ${esc(formatRunDate(kpiData.run_date))}</footer>
    </aside>`;
  }

  function renderCinematicStudy(stock, record, kpiState, returnCycle, industry, change) {
    const kpiData = kpiState && kpiState.status === 'ready' ? kpiState.data : null;
    const summary = kpiData && kpiData.backtest && kpiData.backtest.summary;
    const latestClose = summary && summary.latest_close != null ? Number(summary.latest_close).toFixed(2) : '';
    return `<section class="cinema-study">
      <div class="cinema-topbar">
        <div class="cinema-brand">${logoMarkup(stock)}<div><strong>${esc(stock.companyName)}</strong><span>POLICY INTELLIGENCE</span></div></div>
        <p>${esc(stock.ticker)} ・ CASE STUDY</p>
      </div>
      <div class="cinema-layout">
        <section class="cinema-left">
          <p class="eyebrow">POLICY EVENT ・ MARKET RESPONSE</p>
          <div class="cinema-return ${change > 0 ? 'is-up' : change < 0 ? 'is-down' : ''}">
            <strong>${esc(record.returnRaw || 'N/A')}</strong>
            <span>政策事件後區間報酬</span>
            <small>${esc(record.eventDate || '資料未提供')} - ${esc(summary && summary.latest_date ? summary.latest_date : '最新資料')}</small>
          </div>
          ${renderMarketChart(kpiState, record)}
          <dl class="cinema-facts">
            ${field('產業大類', industry)}
            ${field('事件日期', record.eventDate)}
            ${field('政策狀態', record.policyStatus)}
            ${field('最新收盤', latestClose)}
          </dl>
          <section class="cinema-evidence">
            <p class="eyebrow">POLICY EVIDENCE CHAIN</p>
            <dl>
              ${field('政策名稱', record.policyName)}
              ${field('證據文件', record.evidence)}
              ${field('正式政策', record.formalPolicy)}
            </dl>
          </section>
        </section>
        ${renderValidationPanel(kpiState)}
      </div>
    </section>`;
  }

  function renderKpiSection(kpiState, symbol) {
    if (!kpiState) return '';
    if (kpiState.status === 'loading') {
      return `<section class="kpi-panel"><div class="kpi-empty">正在讀取 ${esc(symbol)} 的資料庫 KPI...</div></section>`;
    }
    if (kpiState.status === 'error') {
      return `<section class="kpi-panel"><div class="kpi-empty">資料庫 KPI 暫時無法載入：${esc(kpiState.message)}</div></section>`;
    }

    const kpiData = kpiState.data;
    const totalScore = kpiData.scores && kpiData.scores.total_score;
    return `<section class="kpi-panel">
      <header class="kpi-panel__header">
        <div>
          <p class="eyebrow">DATABASE KPI</p>
          <h2>資料庫個股評分</h2>
        </div>
        <div class="kpi-total">
          <span>總分</span>
          <strong>${esc(formatScore(totalScore, 'N/A'))}<small> / 16</small></strong>
        </div>
      </header>
      <dl class="kpi-meta">
        ${field('API 股票名稱', kpiData.stock_name)}
        ${field('資料更新時間', formatRunDate(kpiData.run_date))}
        ${field('政策分類', kpiData.policy_subsector)}
        ${field('來源區塊', kpiData.source_section)}
      </dl>
      <div class="kpi-score-grid">${renderScoreCards(kpiData)}</div>
      <div class="kpi-list">${renderKpiRows(kpiData)}</div>
      ${renderBacktestSummary(kpiData)}
    </section>`;
  }

  D.loadData('../').then(data => {
    const stock = D.getStock(data.stocks, market, ticker);
    if (!stock) {
      app.innerHTML = '<div class="r-empty"><h1>找不到這檔股票</h1><p>請確認市場與股票代號。</p></div>';
      return;
    }

    document.title = `${stock.ticker} ${stock.companyName}｜Alpha`;
    const returnCycle = cycle || D.CYCLES.find(item => item.industries.some(industry => stock.industries.includes(industry))) || D.CYCLES[0];
    const industry = D.normalizeIndustryName(params.get('industry') || stock.industries[0]);
    const backCycle = document.getElementById('back-cycle');
    backCycle.href = `industry.html?cycle=${returnCycle.id}&market=${market}&industry=${encodeURIComponent(industry)}`;

    let selected = 0;
    let kpiState = market === 'us' ? { status: 'loading' } : null;

    function render() {
      const record = stock.records[selected];
      const isUS = market === 'us';
      const change = record.returnValue;
      const siblings = data.stocks
        .filter(item => item.market === market && item.industries.includes(industry) && item.ticker)
        .sort((a, b) => a.ticker.localeCompare(b.ticker, undefined, { numeric: true }));
      const currentIndex = siblings.findIndex(item => item.ticker === stock.ticker);
      const prev = siblings[currentIndex - 1];
      const next = siblings[currentIndex + 1];

      const legacyStudy = `<section class="detail-grid">
  <div class="detail-lead">
    <p class="eyebrow">${market === 'tw' ? 'TAIWAN STOCK' : 'U.S. STOCK'} / POLICY RESEARCH</p>
    <h1>${esc(stock.ticker)}</h1>
    <h2>${esc(stock.companyName)}</h2>
    <span class="benefit-badge ${stock.benefitGroup}">${label(stock.benefitGroup)}</span>
    ${isUS ? `<div class="hero-return ${change > 0 ? 'is-up' : change < 0 ? 'is-down' : ''}"><small>事件日至今總漲幅</small><strong>${esc(record.returnRaw || '資料未提供')}</strong><span>事件日期 ${esc(record.eventDate || '資料未提供')}</span></div>` : ''}
    <dl class="lead-facts">
      ${field('市場', market === 'tw' ? '台股' : '美股')}
      ${field('所屬循環', `${returnCycle.title}｜${returnCycle.subtitle}`)}
      ${field('產業大類', stock.industries.join('、'))}
      ${field(isUS ? '主要事件日期' : '查核截止日', isUS ? record.eventDate : record.checkedAt)}
      ${isUS ? field('政策狀態', record.policyStatus) : ''}
    </dl>
  </div>
  <div class="detail-evidence">
    <header><p class="eyebrow">POLICY & EVIDENCE</p><h2>政策／受惠驗證</h2></header>
    ${stock.records.length > 1 ? `<div class="event-tabs" role="tablist" aria-label="政策事件">${stock.records.map((item, index) => `<button role="tab" aria-selected="${index === selected}" data-event="${index}">${esc(item.eventDate || item.checkedAt || `紀錄 ${index + 1}`)}</button>`).join('')}</div>` : ''}
    <dl>
      ${isUS ? `${field('政策名稱', record.policyName)}${field('政策狀態', record.policyStatus)}${field('證據文件', record.evidence)}${field('正式政策', record.formalPolicy)}${field('原始受惠標示', record.rawBenefit)}${field('事件漲幅', record.returnRaw)}` : `${field('原始受惠標示', record.rawBenefit)}${field('原始受惠分類', record.rawBenefitLabel)}${field('判定依據', record.rationale)}${field('主要證據文件', record.evidence)}${field('查核截止日', record.checkedAt)}`}
    </dl>
    <aside class="source-note">
      <h3>資料來源說明</h3>
      <p>政策研究內容取自${isUS ? '美股.csv' : '台股.csv'}。${isUS ? '資料庫 KPI 區塊由 GCP Django API 即時載入。' : '台股目前尚未提供 KPI API。'}</p>
    </aside>
  </div>
</section>
${renderKpiSection(kpiState, stock.ticker)}`;
      const study = isUS ? renderCinematicStudy(stock, record, kpiState, returnCycle, industry, change) : legacyStudy;

      app.innerHTML = `<nav class="breadcrumb"><a href="../index.html">首頁</a><span>/</span><a href="${backCycle.href}">${returnCycle.title}</a><span>/</span><span>${esc(stock.ticker)}</span></nav>
${study}
${isUS && stock.records.length > 1 ? `<div class="event-tabs event-tabs--cinema" role="tablist" aria-label="政策事件">${stock.records.map((item, index) => `<button role="tab" aria-selected="${index === selected}" data-event="${index}">${esc(item.eventDate || item.checkedAt || `紀錄 ${index + 1}`)}</button>`).join('')}</div>` : ''}
<nav class="stock-pager"><a href="${backCycle.href}">返回產業</a><div>${prev ? `<a href="?market=${market}&ticker=${prev.ticker}&cycle=${returnCycle.id}&industry=${encodeURIComponent(industry)}">上一檔 ${prev.ticker}</a>` : ''}${next ? `<a href="?market=${market}&ticker=${next.ticker}&cycle=${returnCycle.id}&industry=${encodeURIComponent(industry)}">下一檔 ${next.ticker}</a>` : ''}</div></nav>
<footer class="disclaimer">這是依來源資料建立的政策研究分類與資料庫 KPI 呈現，不構成投資建議。不同政策事件的漲幅各自呈現，未加總或平均。</footer>`;

      app.querySelectorAll('[data-event]').forEach(button => {
        button.onclick = () => {
          selected = Number(button.dataset.event);
          render();
        };
      });

      if (kpiState && kpiState.status === 'ready') {
        initPriceContextChart(kpiState.data);
      }

      const refreshBtn = app.querySelector('#refresh-kpi-btn');
      if (refreshBtn) {
        refreshBtn.onclick = () => {
          const icon = refreshBtn.querySelector('.refresh-icon');
          if (icon) icon.classList.add('is-spinning');
          refreshBtn.disabled = true;

          loadKpi(stock.ticker)
            .then(apiData => {
              lastFetchedTime = new Date();
              kpiState = { status: 'ready', data: apiData };
              render();
            })
            .catch(error => {
              kpiState = { status: 'error', message: error.message || '請稍後再試，或確認 API CORS 設定' };
              render();
            });
        };
      }
    }

    render();

    if (market === 'us') {
      loadKpi(stock.ticker)
        .then(apiData => {
          lastFetchedTime = new Date();
          kpiState = { status: 'ready', data: apiData };
          render();
        })
        .catch(error => {
          kpiState = { status: 'error', message: error.message || '請稍後再試，或確認 API CORS 設定' };
          render();
        });
    }
  }).catch(error => {
    app.innerHTML = `<div class="r-empty"><h1>資料載入失敗</h1><p>${esc(error.message)}</p></div>`;
  });
})();
