(function () {
  'use strict';

  const D = window.StockData;
  const app = document.getElementById('stock-app');
  const params = new URLSearchParams(location.search);
  if (typeof Chart !== 'undefined') Chart.defaults.font.family = "'Taipei Sans TC','Noto Sans TC',sans-serif";
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
  let activeTechnicalChart = null;

  function findKpi(kpiData, code) {
    const rows = kpiData && Array.isArray(kpiData.kpis) ? kpiData.kpis : [];
    return rows.find(item => String(item.code).padStart(2, '0') === String(code).padStart(2, '0')) || {};
  }

  function lastSeriesItem(series) {
    return Array.isArray(series) && series.length ? series[series.length - 1] : {};
  }

  function compactNumber(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return 'N/A';
    return new Intl.NumberFormat('zh-TW', {
      notation: Math.abs(number) >= 1000000 ? 'compact' : 'standard',
      maximumFractionDigits: Math.abs(number) >= 1000 ? 1 : 2
    }).format(number);
  }

  function indicatorTone(text, fallbackPositive) {
    const value = String(text || '');
    if (/走弱|偏弱|警訊|落後|空頭|超賣/.test(value)) return 'is-negative';
    if (/領跑|轉強|偏多|強勢|正向|同步|超越|吸籌/.test(value) || fallbackPositive) return 'is-positive';
    return 'is-neutral';
  }

  function gaugeMarkup(label, sublabel, displayValue, judgment, position) {
    const safePosition = Math.max(0, Math.min(1, Number(position) || 0));
    const angle = -76 + safePosition * 152;
    const tone = indicatorTone(judgment, safePosition >= 0.58);
    return `<article class="tech-gauge ${tone}">
      <header><h3>${esc(label)}</h3><span>${esc(sublabel)}</span></header>
      <div class="tech-gauge__dial" style="--needle-angle:${angle}deg">
        <i class="tech-gauge__needle"></i><b></b>
      </div>
      <div class="tech-gauge__scale"><span>弱勢</span><span>強勢</span></div>
      <strong>${esc(displayValue)}</strong>
      <em>${esc(judgment || '資料待確認')}</em>
    </article>`;
  }

  function renderTechnicalDashboard(stock, kpiState) {
    const closeButton = `<button class="tech-dashboard__close" type="button" data-tech-close aria-label="關閉技術指標頁面"><span>返回個股</span> ×</button>`;
    if (!kpiState || kpiState.status === 'loading') {
      return `<section id="technical-dashboard" class="tech-dashboard" role="dialog" aria-modal="true" aria-labelledby="technical-dashboard-title" hidden>
        ${closeButton}<div class="tech-dashboard__state"><span></span><h2 id="technical-dashboard-title">正在讀取 ${esc(stock.ticker)} 技術指標</h2><p>從資料庫整理 RSI、Composite RS、OBV 與價格趨勢…</p></div>
      </section>`;
    }
    if (kpiState.status === 'error') {
      return `<section id="technical-dashboard" class="tech-dashboard" role="dialog" aria-modal="true" aria-labelledby="technical-dashboard-title" hidden>
        ${closeButton}<div class="tech-dashboard__state is-error"><h2 id="technical-dashboard-title">技術指標暫時無法載入</h2><p>${esc(kpiState.message)}</p></div>
      </section>`;
    }

    const kpiData = kpiState.data;
    const backtest = kpiData.backtest || {};
    const series = backtest.series || {};
    const summary = backtest.summary || {};
    const judgments = summary.latest_judgments || {};
    const price = lastSeriesItem(series.price);
    const rsi = lastSeriesItem(series.rsi14);
    const rs = lastSeriesItem(series.rs_composite);
    const obv = lastSeriesItem(series.obv55);
    const alpha = lastSeriesItem(series.kpi21_alpha);
    const kpi18 = findKpi(kpiData, '18');
    const kpi19 = findKpi(kpiData, '19');
    const kpi20 = findKpi(kpiData, '20');
    const kpi21 = findKpi(kpiData, '21');
    const totalScore = Number(kpiData.scores && kpiData.scores.total_score);
    const positiveScore = Number.isFinite(totalScore) ? Math.round(totalScore) : 0;
    const indicatorTotal = Array.isArray(kpiData.kpis) && kpiData.kpis.length ? kpiData.kpis.length : 21;
    const technicalScore = Number(kpiData.scores && kpiData.scores.technical_score);
    const confluenceEstablished = Number.isFinite(technicalScore) && technicalScore >= 3;
    const closeAboveMa = Number(price.close) >= Number(price.price_50ma);
    const benchmarkAhead = Number(alpha.excess_return ?? kpi21.value) > 0;
    const rsiValue = Number(rsi.value ?? kpi18.value);
    const rsValue = Number(rs.value ?? kpi19.value);
    const obvValue = Number(obv.value ?? kpi20.value);
    const rsiJudgment = rsi.judgment || judgments.kpi18 || kpi18.score_label;
    const rsJudgment = rs.judgment || judgments.kpi19 || kpi19.score_label;
    const obvJudgment = obv.judgment || judgments.kpi20 || kpi20.score_label;
    const obvRange = Number(obv.high55);
    const obvPosition = Number.isFinite(obvRange) && obvRange !== 0 ? obvValue / obvRange : Number(kpi20.score_percent) / 100;
    const mainAction = confluenceEstablished ? '適合追蹤' : '等待確認';
    const signalText = confluenceEstablished ? '訊號成立 ｜ 條件轉強' : '訊號觀察 ｜ 條件未齊';
    const riskText = technicalScore >= 3 ? '可分批布局' : technicalScore >= 2 ? '控制部位' : '暫緩布局';
    const benchmarkText = benchmarkAhead ? '跑贏大盤' : '落後大盤';

    return `<section id="technical-dashboard" class="tech-dashboard" role="dialog" aria-modal="true" aria-labelledby="technical-dashboard-title" hidden>
      <div class="tech-dashboard__glow"></div>
      ${closeButton}
      <div class="tech-dashboard__inner">
        <header class="tech-dashboard__header">
          <div class="tech-dashboard__title">
            <p>TECHNICAL VALIDATION ・ ${esc(stock.ticker)}</p>
            <h2 id="technical-dashboard-title">技術指標總覽</h2>
            <span>資料庫指標，持續驗證趨勢</span>
          </div>
          <div class="tech-benchmark ${benchmarkAhead ? 'is-positive' : 'is-negative'}">
            <span>★</span><div><small>${esc(benchmarkText)}</small><strong>S&amp;P 500</strong></div>
          </div>
          <div class="tech-score"><strong>${esc(positiveScore)}</strong><span>/ ${esc(indicatorTotal)} 項正向</span></div>
        </header>

        <section class="tech-verdict ${confluenceEstablished ? 'is-established' : ''}">
          <div><small>FOUR-CHART CONFLUENCE</small><strong>${confluenceEstablished ? '四圖共振成立' : '四圖條件<span class="tech-verdict__confirm-line">再確認</span>'}</strong></div>
          <i></i>
          <div class="tech-verdict__main"><strong>${esc(mainAction)}</strong><span>${esc(signalText)}</span></div>
          <i></i>
          <div><small>風險狀態</small><strong>${esc(riskText)}</strong></div>
          <footer>
            <span class="${closeAboveMa ? 'is-positive' : 'is-negative'}"><b>✓</b> Price Context <em>${closeAboveMa ? '趨勢向上，價格高於 50MA' : '價格低於 50MA'}</em></span>
            <span class="${indicatorTone(rsiJudgment, rsiValue >= 50)}"><b>✓</b> RSI 14 <em>${esc(rsiJudgment)}</em></span>
            <span class="${indicatorTone(rsJudgment, benchmarkAhead)}"><b>✓</b> Composite RS <em>${esc(benchmarkText)} S&amp;P 500</em></span>
            <span class="${indicatorTone(obvJudgment, Number(kpi20.score) > 0.5)}"><b>✓</b> OBV <em>${esc(obvJudgment)}</em></span>
          </footer>
        </section>

        <section class="tech-gauges">
          ${gaugeMarkup('動能指標', 'RSI 14', Number.isFinite(rsiValue) ? rsiValue.toFixed(2) : kpi18.display_value || 'N/A', rsiJudgment, rsiValue / 100)}
          ${gaugeMarkup('綜合評等', 'Composite RS Line', Number.isFinite(rsValue) ? rsValue.toFixed(2) : kpi19.display_value || 'N/A', rsJudgment, (rsValue + 10) / 20)}
          ${gaugeMarkup('量價驗證', 'OBV / Money Flow', Number.isFinite(obvValue) ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(obvValue) : kpi20.display_value || 'N/A', obvJudgment, obvPosition)}
        </section>

        <section class="tech-chart-panel">
          <div class="tech-chart-tabs" role="tablist" aria-label="技術指標圖表">
            <button type="button" role="tab" aria-selected="true" data-tech-chart="price">Price Context</button>
            <button type="button" role="tab" aria-selected="false" data-tech-chart="rsi">RSI 14</button>
            <button type="button" role="tab" aria-selected="false" data-tech-chart="rs">Composite RS</button>
            <button type="button" role="tab" aria-selected="false" data-tech-chart="obv">OBV</button>
          </div>
          <div class="tech-chart-panel__body">
            <div class="tech-chart-canvas"><canvas id="technicalChartCanvas"></canvas></div>
            <aside>
              <div><span>趨勢</span><strong class="${closeAboveMa ? 'is-positive' : 'is-negative'}">${closeAboveMa ? '正向' : '轉弱'}</strong></div>
              <div><span>動能</span><strong class="${indicatorTone(rsiJudgment, rsiValue >= 50)}">${esc(rsiJudgment || '待確認')}</strong></div>
              <div><span>量價</span><strong class="${indicatorTone(obvJudgment, false)}">${esc(obvJudgment || '待確認')}</strong></div>
            </aside>
          </div>
        </section>
        <footer class="tech-dashboard__notice">ⓘ 指標僅供趨勢驗證，不構成投資建議 ・ 資料更新 ${esc(formatRunDate(kpiData.run_date))}</footer>
      </div>
    </section>`;
  }

  function initTechnicalDashboardChart(kpiData, chartType) {
    const canvas = document.getElementById('technicalChartCanvas');
    if (!canvas || typeof Chart === 'undefined' || !kpiData) return;
    if (activeTechnicalChart) {
      activeTechnicalChart.destroy();
      activeTechnicalChart = null;
    }

    const series = (kpiData.backtest && kpiData.backtest.series) || {};
    const types = {
      price: {
        rows: series.price || [],
        datasets: [
          { label: 'Close', key: 'close', borderColor: '#00cfff', backgroundColor: 'rgba(0,207,255,.08)', fill: true },
          { label: 'Price 50MA', key: 'price_50ma', borderColor: '#f0c419', borderWidth: 2 }
        ]
      },
      rsi: {
        rows: series.rsi14 || [],
        datasets: [{ label: 'RSI 14', key: 'value', borderColor: '#91ff32', backgroundColor: 'rgba(145,255,50,.08)', fill: true }]
      },
      rs: {
        rows: series.rs_composite || [],
        datasets: [
          { label: 'Composite RS', key: 'value', borderColor: '#91ff32' },
          { label: '21MA', key: 'ma21', borderColor: '#f0c419', borderWidth: 2 }
        ]
      },
      obv: {
        rows: series.obv55 || [],
        datasets: [
          { label: 'OBV', key: 'value', borderColor: '#91ff32', backgroundColor: 'rgba(145,255,50,.08)', fill: true },
          { label: '55D High', key: 'high55', borderColor: '#f0c419', borderWidth: 2 }
        ]
      }
    };
    const config = types[chartType] || types.price;
    const rows = config.rows;
    activeTechnicalChart = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels: rows.map(item => item.date),
        datasets: config.datasets.map(item => ({
          label: item.label,
          data: rows.map(row => Number.isFinite(Number(row[item.key])) ? Number(row[item.key]) : null),
          borderColor: item.borderColor,
          backgroundColor: item.backgroundColor || 'transparent',
          borderWidth: item.borderWidth || 1.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          tension: .18,
          fill: Boolean(item.fill),
          spanGaps: true
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        animation: { duration: 260 },
        plugins: {
          legend: { position: 'bottom', align: 'start', labels: { color: '#b7b7b7', boxWidth: 24, boxHeight: 2, padding: 15 } },
          tooltip: { backgroundColor: 'rgba(4,6,4,.96)', borderColor: 'rgba(145,255,50,.45)', borderWidth: 1 }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: '#86c9d8', maxTicksLimit: 7, maxRotation: 0 } },
          y: {
            border: { color: 'rgba(255,255,255,.16)' },
            grid: { color: 'rgba(255,255,255,.07)' },
            ticks: { color: '#86c9d8', callback: value => compactNumber(value) }
          }
        }
      }
    });
  }

  function initTechnicalDashboard(kpiData) {
    const dashboard = document.getElementById('technical-dashboard');
    const trigger = document.querySelector('[data-tech-open]');
    if (!dashboard || !trigger) return;
    const closeButton = dashboard.querySelector('[data-tech-close]');

    function closeDashboard() {
      dashboard.hidden = true;
      document.body.classList.remove('is-technical-open');
      if (activeTechnicalChart) {
        activeTechnicalChart.destroy();
        activeTechnicalChart = null;
      }
      trigger.focus({ preventScroll: true });
    }

    trigger.addEventListener('click', () => {
      dashboard.hidden = false;
      document.body.classList.add('is-technical-open');
      if (kpiData) requestAnimationFrame(() => initTechnicalDashboardChart(kpiData, 'price'));
      if (closeButton) closeButton.focus({ preventScroll: true });
    });
    if (closeButton) closeButton.addEventListener('click', closeDashboard);
    dashboard.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeDashboard();
    });
    dashboard.querySelectorAll('[data-tech-chart]').forEach(button => {
      button.addEventListener('click', () => {
        dashboard.querySelectorAll('[data-tech-chart]').forEach(item => item.setAttribute('aria-selected', String(item === button)));
        initTechnicalDashboardChart(kpiData, button.dataset.techChart);
      });
    });
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

    return `<div class="price-context-panel" aria-label="${esc(record.ticker)} 回測圖表">
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

    const rawPriceSeries = backtest.series.price;
    const firstValidMaIndex = rawPriceSeries.findIndex(point =>
      point.price_50ma != null &&
      point.price_50ma !== '' &&
      Number.isFinite(Number(point.price_50ma)) &&
      Number(point.price_50ma) > 0
    );
    const priceSeries = firstValidMaIndex >= 0
      ? rawPriceSeries.slice(firstValidMaIndex)
      : rawPriceSeries;
    const triggers = Array.isArray(backtest.triggers) ? backtest.triggers : [];
    const triggerDateMap = new Map();
    triggers.forEach(t => {
      if (t.date) triggerDateMap.set(t.date, t);
    });

    const labels = priceSeries.map(p => p.date);
    const closeData = priceSeries.map(p =>
      p.close != null && p.close !== '' && Number.isFinite(Number(p.close))
        ? Number(p.close)
        : null
    );
    const maData = priceSeries.map(p =>
      p.price_50ma != null && p.price_50ma !== '' && Number.isFinite(Number(p.price_50ma))
        ? Number(p.price_50ma)
        : null
    );

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
            beginAtZero: false,
            grace: '6%',
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
    const total = rows.length || 21;
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
            <div><strong>${esc(row.name || `KPI-${row.code}`)}</strong><small>${esc(row.display_value || formatScore(scorePercent, 'N/A'))}</small></div>
            <b>${esc(row.score_label || row.status || '資料庫指標')}</b>
          </div>`;
        }).join('')}
      </div>
      <footer><span></span>總分 ${esc(formatScore(totalScore, 'N/A'))} / 16，資料更新 ${esc(formatRunDate(kpiData.run_date))}</footer>
    </aside>`;
  }

  function renderIndustryStockRail(stocks, currentIndex, returnCycle, industry) {
    return `<aside class="industry-stock-rail" aria-label="${esc(industry)}同產業股票">
      <header class="industry-stock-rail__header">
        <div>
          <p class="eyebrow">INDUSTRY INDEX</p>
          <h2>同產業個股</h2>
        </div>
        <span>${currentIndex + 1} / ${stocks.length}</span>
      </header>
      <nav class="industry-stock-list" aria-label="切換同產業個股">
        ${stocks.map((item, index) => {
          const isCurrent = index === currentIndex;
          const symbol = esc(item.ticker);
          const name = esc(item.companyName);
          const href = `?market=${encodeURIComponent(market)}&ticker=${encodeURIComponent(item.ticker)}&cycle=${encodeURIComponent(returnCycle.id)}&industry=${encodeURIComponent(industry)}`;
          return `<a class="industry-stock-item${isCurrent ? ' is-current' : ''}" href="${href}" data-stock-index="${index}" ${isCurrent ? 'aria-current="page"' : ''}>
            <span class="industry-stock-logo">
              <img src="https://financialmodelingprep.com/image-stock/${symbol}.png" alt="${name} logo" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false">
              <span hidden>${symbol.slice(0, 2)}</span>
            </span>
            <span class="industry-stock-copy"><strong>${symbol}</strong><small>${name}</small></span>
            <span class="industry-stock-arrow" aria-hidden="true">↗</span>
          </a>`;
        }).join('')}
      </nav>
      <footer><span>SCROLL</span><i></i><small>滾輪切換</small></footer>
    </aside>`;
  }

  function initIndustryStockRail(currentIndex) {
    const rail = document.querySelector('.industry-stock-list');
    if (!rail) return;

    const items = [...rail.querySelectorAll('.industry-stock-item')];
    const currentItem = items[currentIndex];
    if (currentItem) {
      requestAnimationFrame(() => currentItem.scrollIntoView({ block: 'center', behavior: 'instant' }));
    }

    let wheelDelta = 0;
    let wheelLocked = false;
    let wheelResetTimer = null;

    function navigateTo(item, direction) {
      if (!item || item.classList.contains('is-current') || wheelLocked) return;
      wheelLocked = true;
      item.classList.add('is-target');
      item.scrollIntoView({ block: 'center', behavior: 'smooth' });
      document.body.classList.add('is-switching-stock', direction < 0 ? 'is-switching-prev' : 'is-switching-next');
      window.setTimeout(() => {
        window.location.href = item.href;
      }, 280);
    }

    rail.addEventListener('wheel', event => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      event.preventDefault();
      if (wheelLocked) return;

      wheelDelta += event.deltaY;
      window.clearTimeout(wheelResetTimer);
      wheelResetTimer = window.setTimeout(() => {
        wheelDelta = 0;
      }, 140);

      if (Math.abs(wheelDelta) < 42) return;
      const direction = wheelDelta > 0 ? 1 : -1;
      wheelDelta = 0;
      const targetIndex = Math.max(0, Math.min(items.length - 1, currentIndex + direction));

      if (targetIndex === currentIndex) {
        rail.animate(
          [{ transform: 'translateY(0)' }, { transform: `translateY(${direction * -5}px)` }, { transform: 'translateY(0)' }],
          { duration: 260, easing: 'cubic-bezier(.22,.8,.26,1)' }
        );
        return;
      }
      navigateTo(items[targetIndex], direction);
    }, { passive: false });

    items.forEach((item, index) => {
      item.addEventListener('click', event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault();
        navigateTo(item, index < currentIndex ? -1 : 1);
      });
    });
  }

  function renderMarketReturnValue(value) {
    const raw = String(value || 'N/A').trim();
    const match = raw.match(/^(.*?)(%)$/);
    const number = esc(match ? match[1] : raw);
    const symbol = match ? '<span class="market-return-symbol">%</span>' : '';
    const glyphs = `${number}${symbol}`;

    return `<strong class="market-return-value" aria-label="${esc(raw)}">
      <span class="market-return-layer market-return-extrusion" aria-hidden="true">${glyphs}</span>
      <span class="market-return-layer market-return-face" aria-hidden="true">${glyphs}</span>
      <span class="market-return-layer market-return-reflection" aria-hidden="true">${glyphs}</span>
    </strong>`;
  }

  function renderCinematicStudy(stock, record, kpiState, returnCycle, industry, change, siblings, currentIndex) {
    const kpiData = kpiState && kpiState.status === 'ready' ? kpiState.data : null;
    const summary = kpiData && kpiData.backtest && kpiData.backtest.summary;
    const latestClose = summary && summary.latest_close != null ? Number(summary.latest_close).toFixed(2) : '';
    const classificationEffectiveFrom = kpiData && kpiData.classification_effective_from
      ? kpiData.classification_effective_from
      : kpiState && kpiState.status === 'loading'
        ? '資料載入中'
        : '資料庫未提供';
    return `<section class="cinema-study">
      <div class="cinema-topbar">
        <div class="cinema-brand">${logoMarkup(stock)}<div><strong>${esc(stock.companyName)}</strong><span>POLICY INTELLIGENCE</span></div><button class="technical-indicator-btn" type="button" data-tech-open><span>技術指標</span><b aria-hidden="true">↗</b></button></div>
        <p>${esc(stock.ticker)} ・ CASE STUDY</p>
      </div>
      <div class="cinema-layout">
        <section class="cinema-left">
          <p class="eyebrow">POLICY EVENT ・ MARKET RESPONSE</p>
          <div class="cinema-return ${change > 0 ? 'is-up' : change < 0 ? 'is-down' : ''}">
            ${renderMarketReturnValue(record.returnRaw)}
            <span>政策事件後區間報酬</span>
            <small>${esc(classificationEffectiveFrom)} - ${esc(summary && summary.latest_date ? summary.latest_date : '最新資料')}</small>
          </div>
          ${renderMarketChart(kpiState, record)}
          <dl class="cinema-facts">
            ${field('產業大類', industry)}
            ${field('事件日期', classificationEffectiveFrom)}
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
        ${renderIndustryStockRail(siblings, currentIndex, returnCycle, industry)}
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
      const study = isUS ? renderCinematicStudy(stock, record, kpiState, returnCycle, industry, change, siblings, currentIndex) : legacyStudy;

      app.innerHTML = `<nav class="breadcrumb"><a href="../index.html">首頁</a><span>/</span><a href="${backCycle.href}">${returnCycle.title}</a><span>/</span><span>${esc(stock.ticker)}</span></nav>
${study}
${isUS ? renderTechnicalDashboard(stock, kpiState) : ''}
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

      if (isUS) {
        initIndustryStockRail(currentIndex);
        initTechnicalDashboard(kpiState && kpiState.status === 'ready' ? kpiState.data : null);
      }

    }

    render();

    if (market === 'us') {
      loadKpi(stock.ticker)
        .then(apiData => {
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
