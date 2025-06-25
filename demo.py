import pandas as pd
import plotly.express as px
from io import StringIO

# 创建DataFrame
data = pd.DataFrame({"姓名": ["小明", "小杨", "小李", "小宋", "小赵",
                          "小孙", "小杜", "小马", "小朱", "小吴"],
                    "成绩": [65, 94, 67, 78, 85, 24, 36, 99, 89, 45]})

# 创建图表
fig = px.bar(data, x='姓名', y='成绩', color='成绩', text='成绩')
fig.update_layout(template="plotly_dark")

# 生成HTML内容
html_buffer = StringIO()
fig.write_html(html_buffer, include_plotlyjs='cdn', full_html=True)  # 关键修改：使用 full_html=True
html_content = html_buffer.getvalue()

# 保存为完整HTML文件
with open("score_chart.html", "w", encoding="utf-8") as f:
    f.write(html_content)

print("HTML文件已保存为 score_chart.html")