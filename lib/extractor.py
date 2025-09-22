from pypdf import PdfReader, PdfWriter
import tabula
import json
import sys
from io import BytesIO

if len(sys.argv) > 1:
    reader = PdfReader(sys.argv[1])
else:
    data = sys.stdin.buffer.read()
    stream = BytesIO(data)
    reader = PdfReader(stream)
writer = PdfWriter()

reader.pages[0].cropbox.upper_right = (20, 80)
reader.pages[0].cropbox.lower_left = (570, 760)
writer.add_page(reader.pages[0])

buffer = BytesIO()
writer.write(buffer)
buffer.seek(0)

# Read pdf from buffer into list of DataFrame
dfs = tabula.read_pdf(buffer, pages='all', encoding='big5')

index = 0
array = [
    [],
    [],
    [],
    [],
    [],
    [],
    []
]

for key in dfs[0].keys():
    if (index == 0):
        index += 1
        continue

    items = dfs[0][key].tolist()
    processed_items = []
    
    split_keywords = [
        '線上', 'A區', 'B區', 'C219', 'C區', 'D區', '一研', '二研', '人社', '戶外',
        '田徑場', '育成中心', '其他', '研究室', '洄瀾學院', '原民院', '教D133', '教D233',
        '教D420', '教D424', '教D430', '教D431', '教D433', '教育學院', '教室研究室',
        '理工', '圖資中心', '實驗室', '管理學院', '線上授課', '線上課程', '環境學院',
        '藝術工坊', '藝術學院', '體育館網球場'  
    ]
    
    for item in items:
        if isinstance(item, str):
            item = item.replace('\n', '').replace('\r', '').strip()
            split_point = -1
            for keyword in split_keywords:
                if keyword in item:
                    split_point = item.find(keyword)
                    break
            
            if split_point != -1:
                name = item[:split_point].strip()
                class_info = item[split_point:].strip()
                processed_items.append({"name": name, "class": class_info})
            else:
                # If no keyword found, treat entire string as name
                processed_items.append({"name": item.strip(), "class": ""})
        else:
            processed_items.append(None)
    
    array[index - 1] = processed_items
    index += 1

sys.stdout.write(json.dumps(array, ensure_ascii=True))
