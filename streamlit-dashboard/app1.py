from flask import Flask, render_template, jsonify, send_file, request, Response
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import json
import io
import plotly.graph_objects as go
import plotly.io as pio

app = Flask(__name__)


class HVACDataGenerator:
    """HVAC系统数据生成器"""

    def __init__(self):
        self.base_temperature = 24.0
        self.base_humidity = 50.0
        self.base_energy = 8.5
        self.base_airflow = 1600.0
        self.base_pressure = 101.3

        # 系统状态
        self.system_modes = ['cooling', 'heating', 'auto', 'off']
        self.alert_types = ['info', 'warning', 'error']

    def generate_current_data(self):
        """生成当前时刻的HVAC数据"""
        now = datetime.now()

        # 添加随机波动
        temperature = self.base_temperature + np.random.normal(0, 2)
        humidity = self.base_humidity + np.random.normal(0, 5)
        energy = self.base_energy + np.random.normal(0, 1)
        airflow = self.base_airflow + np.random.normal(0, 100)
        pressure = self.base_pressure + np.random.normal(0, 0.5)

        # 系统状态
        system_online = random.random() > 0.05  # 95%在线率
        mode = random.choice(self.system_modes)
        efficiency = 85 + np.random.normal(0, 5)

        # 生成报警信息
        alerts = self._generate_alerts()

        return {
            'timestamp': now.isoformat(),
            'temperature': max(0, temperature),
            'humidity': max(0, min(100, humidity)),
            'energy': max(0, energy),
            'airflow': max(0, airflow),
            'pressure': max(0, pressure),
            'system_online': system_online,
            'mode': mode,
            'efficiency': max(0, min(100, efficiency)),
            'alerts': alerts
        }

    def generate_history_data(self, time_range="最近24小时"):
        """生成历史数据"""
        # 根据时间范围确定数据点数量
        if time_range == "最近1小时":
            periods = 60
            freq = '1T'  # 1分钟
        elif time_range == "最近24小时":
            periods = 24
            freq = '1H'  # 1小时
        elif time_range == "最近7天":
            periods = 7 * 24
            freq = '1H'  # 1小时
        else:  # 最近30天
            periods = 30
            freq = '1D'  # 1天

        # 生成时间序列
        end_time = datetime.now()
        timestamps = pd.date_range(
            end=end_time,
            periods=periods,
            freq=freq
        )

        # 生成数据
        data = {
            'timestamp': timestamps,
            'temperature': self._generate_time_series(
                self.base_temperature, periods, 2, seasonal=True
            ),
            'humidity': self._generate_time_series(
                self.base_humidity, periods, 5, seasonal=True
            ),
            'energy': self._generate_time_series(
                self.base_energy, periods, 1, trend=0.1
            ),
            'airflow': self._generate_time_series(
                self.base_airflow, periods, 100, seasonal=True
            ),
            'pressure': self._generate_time_series(
                self.base_pressure, periods, 0.5
            )
        }

        return data

    def _generate_time_series(self, base_value, periods, noise_std,
                              trend=0, seasonal=False):
        """生成时间序列数据"""
        # 基础随机游走
        noise = np.random.normal(0, noise_std, periods)

        # 添加趋势
        if trend != 0:
            trend_component = np.linspace(0, trend * periods, periods)
        else:
            trend_component = np.zeros(periods)

        # 添加季节性
        if seasonal:
            seasonal_component = np.sin(
                2 * np.pi * np.arange(periods) / (periods / 4)
            ) * noise_std
        else:
            seasonal_component = np.zeros(periods)

        # 组合所有组件
        values = base_value + trend_component + seasonal_component + noise

        # 确保值在合理范围内
        if 'temperature' in str(base_value):
            values = np.clip(values, -10, 50)
        elif 'humidity' in str(base_value):
            values = np.clip(values, 0, 100)
        elif 'energy' in str(base_value):
            values = np.clip(values, 0, 20)
        elif 'airflow' in str(base_value):
            values = np.clip(values, 0, 3000)
        elif 'pressure' in str(base_value):
            values = np.clip(values, 95, 105)

        return values.tolist()

    def _generate_alerts(self):
        """生成报警信息"""
        alerts = []

        # 随机生成0-3个报警
        num_alerts = random.randint(0, 3)

        alert_messages = [
            "温度传感器读数异常",
            "湿度超出正常范围",
            "能耗异常增高",
            "空气流量不足",
            "系统压力异常",
            "设备需要维护",
            "过滤器需要更换",
            "系统运行正常",
            "定期检查完成",
            "系统优化建议"
        ]

        for i in range(num_alerts):
            alert_type = random.choice(self.alert_types)
            message = random.choice(alert_messages)

            alerts.append({
                'id': f"alert_{i}_{datetime.now().timestamp()}",
                'type': alert_type,
                'message': message,
                'timestamp': (
                        datetime.now() - timedelta(
                    minutes=random.randint(0, 1440)
                )
                ).isoformat()
            })

        return alerts

    def generate_weather_data(self):
        """生成天气数据"""
        weather_conditions = ['晴', '多云', '阴', '雨', '雪']

        return {
            'temperature': 20 + np.random.normal(0, 8),
            'humidity': 60 + np.random.normal(0, 15),
            'condition': random.choice(weather_conditions),
            'wind_speed': max(0, np.random.normal(10, 5)),
            'forecast': [
                {
                    'date': (datetime.now() + timedelta(days=i)).strftime('%Y-%m-%d'),
                    'temperature': {
                        'min': 15 + np.random.normal(0, 5),
                        'max': 25 + np.random.normal(0, 8)
                    },
                    'condition': random.choice(weather_conditions),
                    'humidity': 50 + np.random.normal(0, 20)
                }
                for i in range(5)
            ]
        }

    def generate_energy_analysis(self):
        """生成能耗分析数据"""
        return {
            'daily_consumption': [
                {
                    'date': (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d'),
                    'consumption': 150 + np.random.normal(0, 30)
                }
                for i in range(30)
            ],
            'monthly_trend': [
                {
                    'month': (datetime.now() - timedelta(days=i * 30)).strftime('%Y-%m'),
                    'consumption': 4500 + np.random.normal(0, 800)
                }
                for i in range(12)
            ],
            'breakdown': {
                'cooling': 0.4,
                'heating': 0.3,
                'ventilation': 0.2,
                'other': 0.1
            }
        }


class HVACChartGenerator:
    """HVAC图表生成器"""

    def __init__(self, data_generator):
        self.data_generator = data_generator

    def create_temperature_chart(self, time_range="最近24小时", theme="plotly_white"):
        """生成温度图表"""
        history_data = self.data_generator.generate_history_data(time_range)
        fig = go.Figure()

        fig.add_trace(go.Scatter(
            x=history_data['timestamp'],
            y=history_data['temperature'],
            mode='lines+markers',
            name='实际温度',
            line=dict(color='#1f77b4', width=3),
            fill='tonexty',
            fillcolor='rgba(31, 119, 180, 0.2)'
        ))

        fig.add_hline(y=24, line_dash="dash", line_color="red",
                      annotation_text="目标温度: 24°C")

        fig.update_layout(
            title="温度变化趋势",
            xaxis_title="时间",
            yaxis_title="温度 (°C)",
            template=theme,
            hovermode='x unified'
        )

        return fig

    def create_humidity_chart(self, time_range="最近24小时", theme="plotly_white"):
        """生成湿度图表"""
        history_data = self.data_generator.generate_history_data(time_range)
        fig = go.Figure()

        fig.add_trace(go.Scatter(
            x=history_data['timestamp'],
            y=history_data['humidity'],
            mode='lines+markers',
            name='湿度',
            line=dict(color='#2ca02c', width=3),
            fill='tozeroy',
            fillcolor='rgba(44, 160, 44, 0.2)'
        ))

        fig.add_hrect(y0=45, y1=55, line_width=0, fillcolor="rgba(0, 255, 0, 0.1)",
                      annotation_text="理想范围", annotation_position="top left")

        fig.update_layout(
            title="湿度变化监控",
            xaxis_title="时间",
            yaxis_title="湿度 (%)",
            template=theme,
            hovermode='x unified'
        )

        return fig

    def create_energy_chart(self, time_range="最近24小时", theme="plotly_white"):
        """生成能耗图表"""
        history_data = self.data_generator.generate_history_data(time_range)
        fig = go.Figure()

        fig.add_trace(go.Bar(
            x=history_data['timestamp'],
            y=history_data['energy'],
            name='能耗',
            marker_color='rgba(255, 165, 0, 0.8)'
        ))

        fig.update_layout(
            title="能耗变化趋势",
            xaxis_title="时间",
            yaxis_title="能耗 (kW)",
            template=theme,
            showlegend=False
        )

        return fig

    def create_energy_pie_chart(self, theme="plotly_white"):
        """生成能耗饼图"""
        current_data = self.data_generator.generate_current_data()
        labels = ['制冷', '供暖', '通风', '其他']
        values = [
            current_data['energy'] * 0.4,
            current_data['energy'] * 0.3,
            current_data['energy'] * 0.2,
            current_data['energy'] * 0.1
        ]

        fig = go.Figure(data=[go.Pie(
            labels=labels,
            values=values,
            hole=.3,
            marker_colors=['#ff9999', '#66b3ff', '#99ff99', '#ffcc99']
        )])

        fig.update_layout(
            title="能耗分布",
            template=theme
        )

        return fig

    def create_airflow_chart(self, time_range="最近24小时", theme="plotly_white"):
        """生成空气流量图表"""
        history_data = self.data_generator.generate_history_data(time_range)
        fig = go.Figure()

        fig.add_trace(go.Scatter(
            x=history_data['timestamp'],
            y=history_data['airflow'],
            mode='lines+markers',
            name='空气流量',
            line=dict(color='#9467bd', width=3),
            fill='tonexty',
            fillcolor='rgba(148, 103, 189, 0.2)'
        ))

        fig.update_layout(
            title="空气流量监控",
            xaxis_title="时间",
            yaxis_title="流量 (m³/h)",
            template=theme,
            hovermode='x unified'
        )

        return fig

    def create_system_status_card(self, theme="plotly_white"):
        """生成系统状态卡片"""
        current_data = self.data_generator.generate_current_data()

        # 创建仪表图
        fig = go.Figure(go.Indicator(
            mode="gauge+number",
            value=current_data['efficiency'],
            domain={'x': [0, 1], 'y': [0, 1]},
            title={'text': "系统效率"},
            gauge={
                'axis': {'range': [None, 100]},
                'steps': [
                    {'range': [0, 60], 'color': "lightgray"},
                    {'range': [60, 80], 'color': "gray"},
                    {'range': [80, 100], 'color': "lightgreen"}],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': 90}
            }
        ))

        fig.update_layout(
            template=theme,
            height=300,
            margin=dict(l=20, r=20, t=50, b=20)
        )

        return fig


# 初始化数据生成器和图表生成器
data_generator = HVACDataGenerator()
chart_generator = HVACChartGenerator(data_generator)


# @app.route('/')
# def dashboard():
#     """主仪表板页面"""
#     return render_template('dashboard.html')


@app.route('/api/current_data')
def get_current_data():
    """获取当前HVAC数据"""
    current_data = data_generator.generate_current_data()
    return jsonify(current_data)

import pandas as pd
import plotly.express as px
import plotly.io as pio
import base64
from io import BytesIO

@app.route('/api/chart/temperature')
def get_temperature_chart():
    """获取温度图表"""
    time_range = request.args.get('time_range', '最近24小时')
    fig = chart_generator.create_temperature_chart(time_range)
    # 1. 在内存中生成图像
    # img_buffer = BytesIO()
    # pio.write_image(fig, img_buffer, format='png', width=1000, height=600)
    #
    # # 2. 获取二进制数据并重置指针
    # img_data = img_buffer.getvalue()
    # img_buffer.seek(0)  # 重置指针位置
    #
    # # 3. 转换为Base64编码[7,8](@ref)
    # base64_img = base64.b64encode(img_data).decode('utf-8')
    #
    # # 4. 生成可直接嵌入HTML的Data URL[1](@ref)
    # data_url = f"data:image/png;base64,{base64_img}"

    # 生成HTML内容
    html_buffer = io.StringIO()
    fig.write_html(html_buffer, include_plotlyjs=True, full_html=True)  # 关键修改：使用 full_html=True
    html_content = html_buffer.getvalue()


    return Response(html_content, mimetype='text/html')


@app.route('/api/chart/humidity')
def get_humidity_chart():
    """获取湿度图表"""
    time_range = request.args.get('time_range', '最近24小时')
    fig = chart_generator.create_humidity_chart(time_range)
    # # 1. 在内存中生成图像
    # img_buffer = BytesIO()
    # pio.write_image(fig, img_buffer, format='png', width=1000, height=600)
    #
    # # 2. 获取二进制数据并重置指针
    # img_data = img_buffer.getvalue()
    # img_buffer.seek(0)  # 重置指针位置
    #
    # # 3. 转换为Base64编码[7,8](@ref)
    # base64_img = base64.b64encode(img_data).decode('utf-8')
    #
    # # 4. 生成可直接嵌入HTML的Data URL[1](@ref)
    # data_url = f"data:image/png;base64,{base64_img}"
    #
    #
    # return base64_img
    html_buffer = io.StringIO()
    fig.write_html(html_buffer, include_plotlyjs=True, full_html=True)  # 关键修改：使用 full_html=True
    html_content = html_buffer.getvalue()


    return Response(html_content, mimetype='text/html')


@app.route('/api/chart/energy')
def get_energy_chart():
    """获取能耗图表"""
    time_range = request.args.get('time_range', '最近24小时')
    fig = chart_generator.create_energy_chart(time_range)
    # # 1. 在内存中生成图像
    # img_buffer = BytesIO()
    # pio.write_image(fig, img_buffer, format='png', width=1000, height=600)
    #
    # # 2. 获取二进制数据并重置指针
    # img_data = img_buffer.getvalue()
    # img_buffer.seek(0)  # 重置指针位置
    #
    # # 3. 转换为Base64编码[7,8](@ref)
    # base64_img = base64.b64encode(img_data).decode('utf-8')
    #
    # # 4. 生成可直接嵌入HTML的Data URL[1](@ref)
    # data_url = f"data:image/png;base64,{base64_img}"


    # return base64_img
    html_buffer = io.StringIO()
    fig.write_html(html_buffer, include_plotlyjs=True, full_html=True)  # 关键修改：使用 full_html=True
    html_content = html_buffer.getvalue()


    return Response(html_content, mimetype='text/html')


@app.route('/api/chart/energy_pie')
def get_energy_pie_chart():
    """获取能耗饼图"""
    fig = chart_generator.create_energy_pie_chart()
    # # 1. 在内存中生成图像
    # img_buffer = BytesIO()
    # pio.write_image(fig, img_buffer, format='png', width=1000, height=600)
    #
    # # 2. 获取二进制数据并重置指针
    # img_data = img_buffer.getvalue()
    # img_buffer.seek(0)  # 重置指针位置
    #
    # # 3. 转换为Base64编码[7,8](@ref)
    # base64_img = base64.b64encode(img_data).decode('utf-8')
    #
    # # 4. 生成可直接嵌入HTML的Data URL[1](@ref)
    # data_url = f"data:image/png;base64,{base64_img}"
    html_buffer = io.StringIO()
    fig.write_html(html_buffer, include_plotlyjs=True, full_html=True)  # 关键修改：使用 full_html=True
    html_content = html_buffer.getvalue()


    return Response(html_content, mimetype='text/html')


    # return base64_img


@app.route('/api/chart/airflow')
def get_airflow_chart():
    """获取空气流量图表"""
    time_range = request.args.get('time_range', '最近24小时')
    fig = chart_generator.create_airflow_chart(time_range)
    # # 1. 在内存中生成图像
    # img_buffer = BytesIO()
    # pio.write_image(fig, img_buffer, format='png', width=1000, height=600)
    #
    # # 2. 获取二进制数据并重置指针
    # img_data = img_buffer.getvalue()
    # img_buffer.seek(0)  # 重置指针位置
    #
    # # 3. 转换为Base64编码[7,8](@ref)
    # base64_img = base64.b64encode(img_data).decode('utf-8')
    #
    # # 4. 生成可直接嵌入HTML的Data URL[1](@ref)
    # data_url = f"data:image/png;base64,{base64_img}"
    #
    #
    # return base64_img
    html_buffer = io.StringIO()
    fig.write_html(html_buffer, include_plotlyjs=True, full_html=True)  # 关键修改：使用 full_html=True
    html_content = html_buffer.getvalue()


    return Response(html_content, mimetype='text/html')


@app.route('/api/chart/system_status')
def get_system_status_chart():
    """获取系统状态图表"""
    fig = chart_generator.create_system_status_card()
    # # 1. 在内存中生成图像
    # img_buffer = BytesIO()
    # pio.write_image(fig, img_buffer, format='png', width=1000, height=600)
    #
    # # 2. 获取二进制数据并重置指针
    # img_data = img_buffer.getvalue()
    # img_buffer.seek(0)  # 重置指针位置
    #
    # # 3. 转换为Base64编码[7,8](@ref)
    # base64_img = base64.b64encode(img_data).decode('utf-8')
    #
    # # 4. 生成可直接嵌入HTML的Data URL[1](@ref)
    # data_url = f"data:image/png;base64,{base64_img}"
    #
    #
    # return base64_img
    html_buffer = io.StringIO()
    fig.write_html(html_buffer, include_plotlyjs=True, full_html=True)  # 关键修改：使用 full_html=True
    html_content = html_buffer.getvalue()


    return Response(html_content, mimetype='text/html')


@app.route('/api/chart/temperature_image')
def get_temperature_chart_image():
    """获取温度图表图片"""
    time_range = request.args.get('time_range', '最近24小时')
    fig = chart_generator.create_temperature_chart(time_range)

    img_bytes = io.BytesIO()
    pio.write_image(fig, img_bytes, format='png')
    img_bytes.seek(0)

    return send_file(img_bytes, mimetype='image/png')


if __name__ == '__main__':
    app.run(debug=True)