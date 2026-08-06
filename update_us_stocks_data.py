import json
import os
import re
import sys
import time
import urllib.request
from concurrent.futures import ThreadPoolExecutor

sys.stdout.reconfigure(encoding='utf-8')

BASE_DIR = r"d:\20260804"
US_STOCK_DIR = os.path.join(BASE_DIR, "questionforAIBOT", "USstock")
REPORT_DIR = os.path.join(BASE_DIR, "questionforAIBOT-report")

REPORT_API_URL = "http://34.81.30.50:8000/api/api/reports/us/json/"
SINGLE_STOCK_API_PREFIX = "http://34.81.30.50:8000/api/stock/"

def format_5_steps(item):
    sym = item['symbol']
    name = item.get('company_name', sym)
    
    # Step 1
    p_info = item.get('item_1_latest_price', {})
    price = p_info.get('price', 0.0)
    q_date = p_info.get('query_date', '2026-08-05')
    s1 = f"1. 📈 **最新股價**：$ {price:.2f} (USD) (數據日期: {q_date})"
    
    # Step 2
    s2 = f"2. 🔗 **個股分析連結**：👉 [點此查看 {name} ({sym}) 儀表板](http://127.0.0.1:5500/pages/stock.html?market=us&ticker={sym})"
    
    # Step 3
    pol = item.get('item_3_policy_and_cycle', {})
    cycle = pol.get('cycle_name', '執行中')
    sec = pol.get('source_section', '')
    status = pol.get('benefit_status', '受惠中')
    b_desc = pol.get('benefit_description', '')
    doc_ref = pol.get('official_document_ref', '')
    
    if not b_desc:
        b_desc = f"受惠於 {sec}" if sec else "受惠於相關政策扶持"
    doc_str = f"，官方證明文件：{doc_ref}" if doc_ref else ""
    s3 = f"3. 🏛️ **政策與產業循環定位**：\n   - **分類產業循環**：{cycle} | {status}（{sec}）\n   - **政策受惠狀況**：【{status}】{b_desc}{doc_str}。"
    
    # Step 4
    tech = item.get('item_4_technical_and_rating', {})
    score_val = tech.get('score', 50.0)
    score_100 = int(round(score_val))
    kpi_score = tech.get('kpi_21_score', 10.0)
    stars = tech.get('star_rating', '★★★☆☆')
    t_sum = tech.get('technical_summary', '')
    s4 = f"4. 📊 **技術分析與個股綜合評分**：\n   - **技術面狀況**：量化指標總分 {kpi_score:.1f}/21；{t_sum}\n   - **綜合評分**：{score_100} / 100（星級推薦：{stars}）"
    
    # Step 5
    act = item.get('item_5_action_recommendation', '')
    s5 = f"5. 💡 **實質操作建議**：{act}"
    
    full_answer = f"📊 **{name} ({sym})**\n\n{s1}\n{s2}\n{s3}\n{s4}\n{s5}"
    return {
        'step1_price': s1,
        'step2_link': s2,
        'step3_policy': s3,
        'step4_rating': s4,
        'step5_suggestion': s5
    }, full_answer, price, q_date, score_100, stars, sec

def fetch_single_stock_json(sym):
    url = f"{SINGLE_STOCK_API_PREFIX}{sym}/json/"
    file_path = os.path.join(US_STOCK_DIR, f"{sym}.json")
    try:
        req = urllib.request.urlopen(url, timeout=15)
        raw_content = req.read()
        parsed = json.loads(raw_content.decode('utf-8'))
        with open(file_path, 'wb') as f:
            f.write(raw_content)
        return sym, True, len(raw_content)
    except Exception as e:
        return sym, False, str(e)

def main():
    print("=== Step 1: Fetching Report API ===")
    req = urllib.request.urlopen(REPORT_API_URL, timeout=30)
    report_data = json.loads(req.read().decode('utf-8'))
    api_stocks_data = report_data.get('data', [])
    api_stock_map = {item['symbol']: item for item in api_stocks_data}
    print(f"Report API fetched successfully! Total stocks in API: {len(api_stock_map)}")

    db_path = os.path.join(REPORT_DIR, "us_stocks_433_db.json")
    with open(db_path, 'r', encoding='utf-8') as f:
        existing_db = json.load(f)

    db_stocks = existing_db.get('stocks', [])
    print(f"Existing DB stock count: {len(db_stocks)}")

    updated_db_stocks = []
    updated_count = 0

    print("=== Step 2: Updating 433 US Stock DB & Answers ===")
    for stock in db_stocks:
        sym = stock['symbol']
        api_item = api_stock_map.get(sym)
        if api_item:
            five_steps, full_answer, price, q_date, score_100, stars, industry = format_5_steps(api_item)
            stock['latest_close'] = price
            stock['latest_date'] = q_date
            stock['score_100'] = score_100
            stock['stars'] = stars
            if industry:
                stock['industry'] = industry.split('.')[-1] if '.' in industry else industry
            stock['five_steps'] = five_steps
            stock['full_bot_answer'] = full_answer
            updated_count += 1
        updated_db_stocks.append(stock)

    existing_db['stocks'] = updated_db_stocks
    existing_db['stock_count'] = len(updated_db_stocks)
    existing_db['api_fetched_count'] = updated_count
    existing_db['disclaimer'] = "本報告與數據由系統自動整合美股 KPI Dashboard API 與美股政策資料庫，不構成直接投資建議。"

    full_json_path = os.path.join(REPORT_DIR, "433美股_AI_Bot_完整解答版.json")
    with open(full_json_path, 'w', encoding='utf-8') as f:
        json.dump(existing_db, f, ensure_ascii=False, indent=2)
    with open(db_path, 'w', encoding='utf-8') as f:
        json.dump(existing_db, f, ensure_ascii=False, indent=2)

    print(f"Updated {updated_count} / {len(db_stocks)} stocks in 433美股_AI_Bot_完整解答版.json & us_stocks_433_db.json")

    print("=== Step 3: Re-generating 433美股_AI_Bot_完整報告.md ===")
    md_lines = [
        "# 433 美股 AI Bot 5 大步驟標準檢索與分析報告\n",
        f"> **資料庫規模**：{len(updated_db_stocks)} 檔美股  ",
        f"> **即時 API 成功連結數**：{updated_count} 檔  ",
        f"> **生成時間**：{time.strftime('%Y-%m-%d')}  \n",
        "---\n"
    ]
    for idx, stock in enumerate(updated_db_stocks, 1):
        md_lines.append(f"## {idx}. {stock['stock_name']} ({stock['symbol']})\n")
        md_lines.append(f"{stock['full_bot_answer']}\n")
        md_lines.append("---\n")

    md_path = os.path.join(REPORT_DIR, "433美股_AI_Bot_完整報告.md")
    with open(md_path, 'w', encoding='utf-8') as f:
        f.writelines('\n'.join(md_lines))
    print(f"Markdown report updated at {md_path}")

    print("=== Step 4: Updating individual stock JSON files in questionforAIBOT/USstock/ ===")
    existing_json_files = [f[:-5] for f in os.listdir(US_STOCK_DIR) if f.endswith('.json')]
    print(f"Total individual stock JSON files to update: {len(existing_json_files)}")

    fetch_success = 0
    fetch_failed = 0
    t0 = time.time()
    with ThreadPoolExecutor(max_workers=15) as executor:
        results = list(executor.map(fetch_single_stock_json, existing_json_files))

    for sym, ok, info in results:
        if ok:
            fetch_success += 1
        else:
            fetch_failed += 1

    t1 = time.time()
    print(f"Single stock API fetch completed in {t1-t0:.2f}s! Success: {fetch_success}, Failed: {fetch_failed}")

    print("=== Update Process Completed Successfully! ===")

if __name__ == "__main__":
    main()
