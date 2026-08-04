(function(){'use strict';
  const D = window.StockData;
  const app = document.getElementById('cycle-app');

  // Macro calendar schedule toggle handlers
  const scheduleToggle = document.getElementById('macro-schedule-toggle');
  const schedulePanel = document.getElementById('macro-schedule-panel');
  const scheduleBackdrop = document.getElementById('macro-schedule-backdrop');
  const scheduleClose = document.getElementById('macro-schedule-close');

  function setScheduleOpen(open) {
    if (!scheduleToggle || !schedulePanel || !scheduleBackdrop) return;
    scheduleToggle.setAttribute('aria-expanded', String(open));
    schedulePanel.setAttribute('aria-hidden', String(!open));
    scheduleBackdrop.setAttribute('aria-hidden', String(!open));
    schedulePanel.classList.toggle('is-open', open);
    scheduleBackdrop.classList.toggle('is-open', open);
    document.body.classList.toggle('macro-schedule-open', open);
  }

  if (scheduleToggle) {
    scheduleToggle.addEventListener('click', () => setScheduleOpen(scheduleToggle.getAttribute('aria-expanded') !== 'true'));
    scheduleClose?.addEventListener('click', () => { setScheduleOpen(false); scheduleToggle.focus(); });
    scheduleBackdrop?.addEventListener('click', () => { setScheduleOpen(false); scheduleToggle.focus(); });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape' && scheduleToggle.getAttribute('aria-expanded') === 'true') {
        setScheduleOpen(false); scheduleToggle.focus();
      }
    });
  }

  // Parse state from URL
  function getStateFromUrl() {
    const p = new URLSearchParams(location.search);
    let cId = p.get('cycle') || 'cycle-1';
    let c = D.getCycle(cId) || D.CYCLES[0];
    let m = ['tw', 'us'].includes(p.get('market')) ? p.get('market') : 'us';
    let ind = D.normalizeIndustryName(p.get('industry') || '');
    if (!c.industries.map(D.normalizeIndustryName).includes(ind)) {
      ind = D.normalizeIndustryName(c.industries[0]);
    }
    return { cycle: c, market: m, industry: ind };
  }

  let state = getStateFromUrl();
  let search = '', sort = 'ticker';

  function esc(v) {
    return String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function syncState(newState) {
    if (newState.cycle) state.cycle = newState.cycle;
    if (newState.market) state.market = newState.market;
    if (newState.industry) state.industry = D.normalizeIndustryName(newState.industry);

    const normCycleIndustries = state.cycle.industries.map(D.normalizeIndustryName);
    if (!normCycleIndustries.includes(state.industry)) {
      state.industry = normCycleIndustries[0];
    }

    const p = new URLSearchParams({ cycle: state.cycle.id, market: state.market, industry: state.industry });
    history.pushState(null, '', `?${p}`);
    render();
  }

  function stockHref(s) {
    return `stock.html?market=${s.market}&ticker=${encodeURIComponent(s.ticker)}&cycle=${state.cycle.id}&industry=${encodeURIComponent(state.industry)}`;
  }
  function companyLogoUrl(s) {
    const symbol = s.market === 'tw' ? `${s.ticker}.TW` : s.ticker;
    return `https://financialmodelingprep.com/image-stock/${encodeURIComponent(symbol)}.png`;
  }
  function logoMarkup(s) {
    const fallback = esc((s.ticker || s.companyName || 'CO').slice(0, 2).toUpperCase());
    if (!s.ticker) return `<span class="stock-card__logo is-fallback" role="img" aria-label="${esc(s.companyName)} Logo"><b>${fallback}</b></span>`;
    return `<span class="stock-card__logo" role="img" aria-label="${esc(s.companyName)} Logo"><img src="${companyLogoUrl(s)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><b>${fallback}</b></span>`;
  }
  function topStockHref(item) {
    return `stock.html?market=${item.stock.market}&ticker=${encodeURIComponent(item.stock.ticker)}&cycle=${state.cycle.id}&industry=${encodeURIComponent(item.record.industry)}`;
  }
  function topLogoMarkup(s) {
    const fallback = esc((s.ticker || s.companyName || 'CO').slice(0, 2).toUpperCase());
    return `<span class="cycle-top-stock__logo" role="img" aria-label="${esc(s.companyName)} Logo"><img src="${companyLogoUrl(s)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer"><b>${fallback}</b></span>`;
  }
  function cycleTopGainers(stocks) {
    const normCycleInds = state.cycle.industries.map(D.normalizeIndustryName);
    return stocks.map(stock => {
      const record = stock.records.filter(r => normCycleInds.includes(D.normalizeIndustryName(r.industry)) && Number.isFinite(r.returnValue)).sort((a, b) => b.returnValue - a.returnValue)[0];
      return record && stock.ticker ? { stock, record } : null;
    }).filter(Boolean).sort((a, b) => b.record.returnValue - a.record.returnValue).slice(0, 5);
  }
  function topFiveMarkup(items) {
    if (!items.length) return '';
    return `<section class="cycle-top-five" aria-label="${esc(state.cycle.title)}至今漲幅前五名"><header><span>TOP 5</span><small>CYCLE GAINERS</small></header><div class="cycle-top-five__grid">${items.map((item, index) => `<a class="cycle-top-stock" href="${topStockHref(item)}" aria-label="第 ${index + 1} 名，${esc(item.stock.companyName)}，至今漲幅 ${esc(item.record.returnRaw)}"><span class="cycle-top-stock__rank" aria-hidden="true">${index + 1}</span>${topLogoMarkup(item.stock)}<span class="cycle-top-stock__name">${esc(item.stock.ticker)}</span><strong>${esc(item.record.returnRaw)}</strong><span class="cycle-top-stock__fire" aria-hidden="true"><i></i><i></i><i></i></span></a>`).join('')}</div></section>`;
  }
  function bindStockLogoFallbacks() {
    app.querySelectorAll('.stock-card__logo img,.cycle-top-stock__logo img').forEach(img => {
      const showFallback = () => img.parentElement?.classList.add('is-fallback');
      img.addEventListener('error', showFallback, { once: true });
      if (img.complete && img.naturalWidth === 0) showFallback();
    });
  }
  function card(s) {
    const records = s.records.filter(r => D.normalizeIndustryName(r.industry) === state.industry), latest = records[0] || s.records[0], labels = [...new Set(records.map(r => r.rawBenefitLabel).filter(Boolean))];
    const extra = s.market === 'tw' ? `<p>${esc((latest.rationale || '資料未提供').slice(0, 90))}</p><dl><div><dt>原始分類</dt><dd>${esc(labels.join('、') || '分類待查核')}</dd></div><div><dt>查核截止日</dt><dd>${esc(latest.checkedAt || '資料未提供')}</dd></div></dl>` : `<dl><div><dt>最新政策狀態</dt><dd>${esc(latest.policyStatus || '資料未提供')}</dd></div><div><dt>最新事件日期</dt><dd>${esc(latest.eventDate || '資料未提供')}</dd></div><div><dt>政策事件</dt><dd>${records.length} 筆</dd></div><div><dt>事件日至今漲幅</dt><dd class="${latest.returnValue > 0 ? 'is-up' : latest.returnValue < 0 ? 'is-down' : ''}">${esc(latest.returnRaw || '資料未提供')}</dd></div></dl>`;
    const inner = `<div class="stock-card__top"><span class="market-pill">${s.market === 'tw' ? '台股' : '美股'}</span><span>${s.benefitGroup === 'confirmed' ? '已確認受惠' : s.benefitGroup === 'unconfirmed' ? '未確認直接受惠' : '分類待查核'}</span></div><div class="stock-card__identity"><div><strong>${esc(s.ticker || '股票代號未提供')}</strong><h3>${esc(s.companyName)}</h3><small>${esc(state.industry)}</small></div>${logoMarkup(s)}</div>${extra}<span class="stock-card__more">${s.ticker ? '查看個股研究 →' : '不可建立個股連結'}</span>`;
    return s.ticker ? `<a class="stock-card" href="${stockHref(s)}">${inner}</a>` : `<article class="stock-card is-disabled">${inner}</article>`;
  }

  function render() {
    const stocks = window.__stocks || [];
    let list = stocks.filter(s => s.market === state.market && s.industries.map(D.normalizeIndustryName).includes(state.industry) && (!search || `${s.ticker} ${s.companyName}`.toLowerCase().includes(search.toLowerCase())));
    list.sort((a, b) => {
      if (sort === 'company') return a.companyName.localeCompare(b.companyName, 'zh-Hant');
      if (sort === 'date') {
        const br = b.records.find(r => D.normalizeIndustryName(r.industry) === state.industry), ar = a.records.find(r => D.normalizeIndustryName(r.industry) === state.industry);
        return ((br?.eventDate || br?.checkedAt) || '').localeCompare((ar?.eventDate || ar?.checkedAt) || '');
      }
      return a.ticker.localeCompare(b.ticker, undefined, { numeric: true });
    });
    const groups = ['confirmed', 'unconfirmed', 'unclassified'], topGainers = cycleTopGainers(stocks);
    app.innerHTML = `<nav class="breadcrumb"><a href="../index.html">首頁</a><span>/</span><span>${state.cycle.title}</span></nav><div class="cycle-overview"><section class="cycle-hero"><p>CYCLE ${state.cycle.number} / 03</p><h1>${state.cycle.title}</h1><h2>${state.cycle.subtitle}</h2><p>${state.cycle.description}</p></section>${topFiveMarkup(topGainers)}</div>
  <nav class="market-tabs cycle-switcher" style="display:flex;margin-bottom:10px" aria-label="循環切換">${D.CYCLES.map(c => `<button type="button" aria-selected="${c.id === state.cycle.id}" data-cycle="${c.id}">循環 ${String(c.number).padStart(2, '0')}｜${esc(c.title)}</button>`).join('')}</nav>
  <div class="market-tabs" role="tablist" aria-label="市場切換"><button type="button" role="tab" aria-selected="${state.market === 'us'}" data-market="us">美股</button><button type="button" role="tab" aria-selected="${state.market === 'tw'}" data-market="tw">台股</button></div>
  <section class="cycle-layout"><aside><h2>選擇產業</h2><div class="industry-tabs" role="tablist" aria-label="${state.cycle.title}產業">${state.cycle.industries.map(i => `<button type="button" role="tab" aria-selected="${D.normalizeIndustryName(i) === state.industry}" data-industry="${esc(i)}"><span>${esc(i)}</span></button>`).join('')}</div></aside>
  <div class="stocks-panel"><header><div><p class="eyebrow">${state.market === 'tw' ? 'TAIWAN' : 'UNITED STATES'} / ${list.length} STOCKS</p><h2>${esc(state.industry)}</h2></div><div class="tools"><label>搜尋<input id="stock-search" type="search" value="${esc(search)}" placeholder="代號或公司名稱"></label><label>排序<select id="stock-sort"><option value="ticker" ${sort === 'ticker' ? 'selected' : ''}>股票代號</option><option value="company" ${sort === 'company' ? 'selected' : ''}>公司名稱</option><option value="date" ${sort === 'date' ? 'selected' : ''}>事件日期</option></select></label></div></header>
  ${groups.map(g => { const items = list.filter(s => s.benefitGroup === g); const title = g === 'confirmed' ? '已確認受惠' : g === 'unconfirmed' ? '未確認直接受惠' : '分類待查核'; return `<section class="benefit-group"><h3>${title} <span>${items.length}</span></h3>${items.length ? `<div class="stock-grid">${items.map(card).join('')}</div>` : '<div class="r-empty">此市場與產業目前沒有這類資料。</div>'}</section>`; }).join('')}</div></section>
  <footer class="disclaimer">資料查核日期依各筆來源檔案記載；美股漲幅截至 2026-07-17。本頁為依來源資料建立的研究分類，不構成投資建議。來源檔案未提供每日行情與技術指標。</footer>`;

    bindStockLogoFallbacks();

    const searchInput = document.getElementById('stock-search');
    if (searchInput) {
      searchInput.oninput = e => {
        if (e.isComposing) return;
        const caret = e.target.selectionStart;
        search = e.target.value;
        render();
        const nextInput = document.getElementById('stock-search');
        if (nextInput) {
          nextInput.focus();
          if (typeof nextInput.setSelectionRange === 'function') {
            const nextCaret = Number.isInteger(caret) ? caret : nextInput.value.length;
            nextInput.setSelectionRange(nextCaret, nextCaret);
          }
        }
      };
      searchInput.oncompositionend = e => {
        const caret = e.target.selectionStart;
        search = e.target.value;
        render();
        const nextInput = document.getElementById('stock-search');
        if (nextInput) {
          nextInput.focus();
          if (typeof nextInput.setSelectionRange === 'function') {
            const nextCaret = Number.isInteger(caret) ? caret : nextInput.value.length;
            nextInput.setSelectionRange(nextCaret, nextCaret);
          }
        }
      };
    }
    const sortSelect = document.getElementById('stock-sort');
    if (sortSelect) {
      sortSelect.onchange = e => { sort = e.target.value; render(); };
    }
  }

  // Global Event Delegation for clicks on cycle-app
  app.addEventListener('click', e => {
    const cycleBtn = e.target.closest('[data-cycle]');
    if (cycleBtn) {
      const nextC = D.getCycle(cycleBtn.dataset.cycle);
      if (nextC) {
        syncState({ cycle: nextC, industry: nextC.industries[0] });
      }
      return;
    }

    const marketBtn = e.target.closest('[data-market]');
    if (marketBtn) {
      syncState({ market: marketBtn.dataset.market });
      return;
    }

    const industryBtn = e.target.closest('[data-industry]');
    if (industryBtn) {
      syncState({ industry: industryBtn.dataset.industry });
      return;
    }
  });

  window.addEventListener('popstate', () => {
    state = getStateFromUrl();
    render();
  });

  D.loadData('../').then(data => {
    window.__stocks = data.stocks;
    render();
  }).catch(e => {
    app.innerHTML = `<div class="r-empty"><h1>資料載入失敗</h1><p>${esc(e.message)}</p></div>`;
  });
})();
