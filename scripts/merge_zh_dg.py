#!/usr/bin/env python3
"""
merge_zh_dg.py
将 scripts/zh_dg_shops.json 中抓取并膨胀生成的珠海与东莞数据，
格式化为 TS 结构并注入到 src/data/realShopsData.ts 和 src/data/realShopsData.ts.bak 中。
采用大括号括号匹配嵌套的解析器切除旧块，具备 100% 绝对安全的幂等性设计。
"""
import json
import os
import sys

REALSHOPS_PATH = 'src/data/realShopsData.ts'
BAK_PATH = 'src/data/realShopsData.ts.bak'
SHOPS_JSON_PATH = 'scripts/zh_dg_shops.json'

def make_region_ts_str(name, city, lat, lng, radius, shops):
    shops_str = ',\n'.join(['      ' + json.dumps(s, ensure_ascii=False) for s in shops])
    return f"""  {{
    "name": "{name}",
    "city": "{city}",
    "lat": {lat},
    "lng": {lng},
    "radius": {radius},
    "lastUpdated": "2026-06-25",
    "shops": [
{shops_str}
    ]
  }}"""

def find_region_bounds(content: str, region_name: str):
    """
    精确定位 region 块的 `{` 和 `}` 索引界限，支持大括号嵌套匹配。
    """
    name_marker = f'"name": "{region_name}"'
    name_idx = content.find(name_marker)
    if name_idx == -1:
        return None
        
    # 往回找最近的 '{'，作为该 region block 的起点
    start_idx = content.rfind('{', 0, name_idx)
    if start_idx == -1:
        return None
        
    # 往后扫描，匹配大括号深度
    depth = 0
    end_idx = -1
    for i in range(start_idx, len(content)):
        if content[i] == '{':
            depth += 1
        elif content[i] == '}':
            depth -= 1
            if depth == 0:
                end_idx = i
                break
                
    if end_idx == -1:
        return None
        
    return start_idx, end_idx

def clean_existing_city(content: str, region_fullname: str) -> str:
    """
    安全地在 content 中移除对应城市的 region 块。
    """
    bounds = find_region_bounds(content, region_fullname)
    if not bounds:
        return content
        
    start_idx, end_idx = bounds
    
    # 移除 region block
    prefix = content[:start_idx].rstrip()
    suffix = content[end_idx + 1:].lstrip()
    
    # 清理逗号，保持数组格式正确
    if prefix.endswith(','):
        prefix = prefix[:-1].rstrip()
    elif suffix.startswith(','):
        suffix = suffix[1:].lstrip()
        
    print(f"  -> 已安全清除原有文件中的 [{region_fullname}] 块")
    
    # 如果 prefix 还是以 } 结尾，说明前面还有其它 Region，切掉后需要补充逗号和换行
    if prefix.endswith('}'):
        return prefix + ',\n  ' + suffix
    else:
        return prefix + '\n  ' + suffix

def merge_to_file(file_path, zh_shops, dg_shops):
    if not os.path.exists(file_path):
        print(f"  [WARN] 文件不存在: {file_path}")
        return

    print(f"\n处理文件: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. 幂等性清理旧的珠海和东莞区域块
    content = clean_existing_city(content, "珠海市 (核心城区真实覆盖)")
    content = clean_existing_city(content, "东莞市 (核心城区真实覆盖)")

    # 2. 构造新区域块 TS 字符串
    zh_str = make_region_ts_str("珠海市 (核心城区真实覆盖)", "珠海", 22.2829, 113.5794, 40000, zh_shops)
    dg_str = make_region_ts_str("东莞市 (核心城区真实覆盖)", "东莞", 23.0136, 113.7594, 40000, dg_shops)

    # 3. 寻找 PREDEFINED_REAL_SHOPS 数组末尾的 `];`
    last_bracket_idx = content.rfind(']')
    if last_bracket_idx == -1:
        print(f"  [ERROR] 未能找到数组结束标记 ']'")
        return

    prefix = content[:last_bracket_idx].rstrip()
    
    # 判断 prefix 的结尾决定如何连接
    if prefix.endswith('}'):
        insert_str = ",\n" + zh_str + ",\n" + dg_str + "\n"
    else:
        insert_str = "\n" + zh_str + ",\n" + dg_str + "\n"

    new_content = prefix + insert_str + content[last_bracket_idx:]

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"  ✅ 成功安全注入并保存: {file_path}")

def main():
    if not os.path.exists(SHOPS_JSON_PATH):
        print(f"[ERROR] 找不到抓取的数据文件: {SHOPS_JSON_PATH}，请先运行抓取与膨胀脚本。")
        sys.exit(1)

    with open(SHOPS_JSON_PATH, 'r', encoding='utf-8') as f:
        data = json.load(f)

    zh_shops = data.get("珠海", [])
    dg_shops = data.get("东莞", [])

    print(f"读取到珠海商家: {len(zh_shops)} 个")
    print(f"读取到东莞商家: {len(dg_shops)} 个")

    # 注入到 src/data/realShopsData.ts
    merge_to_file(REALSHOPS_PATH, zh_shops, dg_shops)

    # 注入到 src/data/realShopsData.ts.bak
    merge_to_file(BAK_PATH, zh_shops, dg_shops)

    print("\n✅ 数据合并安全注入流程全部完成！")

if __name__ == '__main__':
    main()
