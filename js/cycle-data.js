(function () {
  'use strict';

  const INDUSTRY_ALIASES = {
    '資安／聯邦IT現代化': '資安／聯邦 IT 現代化',
    '資安／聯邦 IT 現代化': '資安／聯邦 IT 現代化',
    '半導體／美國製造／AI晶片': '半導體／美國製造／AI 晶片',
    '半導體／美國製造／AI 晶片': '半導體／美國製造／AI 晶片'
  };

  const CYCLES = [
    { id:'cycle-1', number:'01', title:'第一循環', subtitle:'已驗證領漲', description:'政策、資本支出或訂單已形成可觀察需求，屬成熟主線。', industries:['AI／資料中心／電力基建','半導體／美國製造／AI 晶片','造船／海運／海事工業'] },
    { id:'cycle-2', number:'02', title:'第二循環', subtitle:'政策資金擴散', description:'政策需求由核心受惠者向設備、服務與供應鏈擴散。', industries:['國防／太空／情報','傳統能源／LNG','傳統能源／油氣','汽車／零組件／製造回流','製藥／製造回流','邊境安全／拘留設施','資安／聯邦 IT 現代化'] },
    { id:'cycle-3', number:'03', title:'第三循環', subtitle:'預期／待驗證', description:'政策方向已出現，但營收、訂單或相對強勢仍需持續驗證。', industries:['關鍵礦物／國安材料','核能／鈾／先進電力','量子科技','煤炭／冶金煤','EV／電池／回收','無人機／反無人機','數位資產／加密金融','林木／木材／建材','住宅建築／建材','銀行／房貸／金融科技'] }
  ];

  function clean(value) { return String(value == null ? '' : value).replace(/^\uFEFF/, '').trim(); }
  function normalizeIndustryName(value) {
    let name = clean(value).replace(/[\/／]+/g, '／').replace(/\s*／\s*/g, '／').replace(/\s+/g, ' ');
    return INDUSTRY_ALIASES[name] || name;
  }
  function normalizeTicker(value) {
    const ticker = clean(value);
    if (!ticker || /^(nan|null|undefined)$/i.test(ticker)) return '';
    return ticker.replace(/\.0+$/, '').toUpperCase();
  }
  function parsePercent(value) {
    const raw = clean(value);
    if (!raw || /^(n\/a|na|—|-)$/i.test(raw)) return null;
    const number = Number(raw.replace(/[,%＋]/g, '').replace('−', '-'));
    return Number.isFinite(number) ? number : null;
  }
  function parseCSV(text) {
    const rows=[]; let row=[]; let field=''; let quoted=false;
    text=String(text).replace(/^\uFEFF/, '');
    for(let i=0;i<text.length;i++) { const c=text[i];
      if(quoted) { if(c==='"' && text[i+1]==='"'){field+='"';i++;} else if(c==='"') quoted=false; else field+=c; }
      else if(c==='"') quoted=true; else if(c===','){row.push(field);field='';} else if(c==='\n'){row.push(field);rows.push(row);row=[];field='';} else if(c!=='\r') field+=c;
    }
    if(field || row.length){row.push(field);rows.push(row);}
    const headers=(rows.shift()||[]).map(clean);
    return rows.filter(r=>r.some(v=>clean(v))).map(r=>Object.fromEntries(headers.map((h,i)=>[h,clean(r[i])])));
  }
  function classifyTW(row) {
    if(row['受惠股']==='有（紅色）' && ['直接受惠（個股關係已確認）','間接受惠（產業帶動）'].includes(row['受惠分類'])) return 'confirmed';
    if(row['受惠股']==='沒有（灰色）' || row['受惠分類']==='未確認政策曝險') return 'unconfirmed';
    return 'unclassified';
  }
  function classifyUS(row) {
    if(row['受惠股']==='有(紅色)') return 'confirmed';
    if(row['受惠股']==='沒有(灰色)' || row['政策狀態']==='未確認') return 'unconfirmed';
    return 'unclassified';
  }
  function normalizeRecord(row, market, index) {
    const industry=normalizeIndustryName(row['產業大類']);
    const ticker=normalizeTicker(row['股票代號']);
    const group=market==='tw'?classifyTW(row):classifyUS(row);
    return { id:`${market}-${index}`, market, ticker, companyName:clean(row['公司名稱'])||'公司名稱未提供', industry, benefitGroup:group,
      rawBenefit:clean(row['受惠股']), rawBenefitLabel:market==='tw'?clean(row['受惠分類']):clean(row['政策狀態']),
      rationale:clean(row['判定依據']), evidence:clean(row[market==='tw'?'主要證據文件':'證據文件']), checkedAt:clean(row['查核截止日']),
      eventDate:clean(row['公布或事件日期']), policyStatus:clean(row['政策狀態']), policyName:clean(row['政策名稱']), formalPolicy:clean(row['正式政策']),
      returnRaw:clean(row['事件日至今總漲幅（截至2026-07-17）']), returnValue:parsePercent(row['事件日至今總漲幅（截至2026-07-17）']), raw:row };
  }
  function mergeRecords(records) {
    const map=new Map();
    records.forEach((record,index)=>{
      const key=record.ticker?`${record.market}:${record.ticker}`:`${record.market}:missing:${index}`;
      if(!map.has(key)) map.set(key,{market:record.market,ticker:record.ticker,companyName:record.companyName,industries:[],benefitGroup:record.benefitGroup,rawBenefitLabels:[],records:[]});
      const stock=map.get(key); stock.records.push(record);
      if(!stock.industries.includes(record.industry)) stock.industries.push(record.industry);
      if(record.rawBenefitLabel && !stock.rawBenefitLabels.includes(record.rawBenefitLabel)) stock.rawBenefitLabels.push(record.rawBenefitLabel);
      if(record.benefitGroup==='confirmed') stock.benefitGroup='confirmed'; else if(stock.benefitGroup!=='confirmed' && record.benefitGroup==='unclassified') stock.benefitGroup='unclassified';
    });
    return [...map.values()].map(stock=>{ stock.records.sort((a,b)=>(b.eventDate||b.checkedAt).localeCompare(a.eventDate||a.checkedAt)); return stock; });
  }
  let dataPromise;
  function loadData(basePath) {
    if(!dataPromise) dataPromise=Promise.all([
      fetch(`${basePath||''}台股.csv`).then(r=>{if(!r.ok)throw new Error('無法讀取台股.csv');return r.text();}),
      fetch(`${basePath||''}美股.csv`).then(r=>{if(!r.ok)throw new Error('無法讀取美股.csv');return r.text();})
    ]).then(([tw,us])=>{
      const twRows=parseCSV(tw), usRows=parseCSV(us);
      const records=[...twRows.map((r,i)=>normalizeRecord(r,'tw',i)),...usRows.map((r,i)=>normalizeRecord(r,'us',i))];
      return {twRows,usRows,records,stocks:mergeRecords(records)};
    });
    return dataPromise;
  }
  function getCycle(id){return CYCLES.find(c=>c.id===id);}
  function getStock(stocks,market,ticker){return stocks.find(s=>s.market===market&&s.ticker===normalizeTicker(ticker));}
  window.StockData={INDUSTRY_ALIASES,CYCLES,normalizeIndustryName,normalizeTicker,parsePercent,parseCSV,classifyTW,classifyUS,loadData,getCycle,getStock};
})();
