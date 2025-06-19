import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime, timedelta
import time
import json
from utils.data_generator import HVACDataGenerator
from utils.websocket_client import WebSocketClient

# 页面配置
st.set_page_config(
    page_title="HVAC数据分析仪表盘",
    page_icon="🌡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 自定义CSS
st.markdown("""
<style>
.main > div {
    padding-top: 1rem;
}
.stMetric {
    background-color: rgba(28, 131, 225, 0.1);
    border: 1px solid rgba(28, 131, 225, 0.1);
    padding: 1rem;
    border-radius: 0.5rem;
    margin: 0.5rem 0;
}
.metric-card {
    background: linear-gradient(145deg, #1e3a8a, #3b82f6);
    color: white;
    padding: 1rem;
    border-radius: 10px;
    margin: 0.5rem 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
""", unsafe_allow_html=True)

# 初始化数据生成器
@st.cache_resource
def get_data_generator():
    return HVACDataGenerator()

# 初始化WebSocket客户端
@st.cache_resource
def get_websocket_client():
    return WebSocketClient("ws://localhost:8000/ws")

def main():
    st.title("🌡️ HVAC系统数据分析仪表盘")
    st.markdown("---")
    
    # 侧边栏控制
    with st.sidebar:
        st.header("⚙️ 控制面板")
        
        # 实时数据控制
        auto_refresh = st.checkbox("自动刷新数据", value=True)
        refresh_interval = st.slider("刷新间隔(秒)", 1, 30, 5)
        
        # 数据源选择
        data_source = st.selectbox(
            "数据源",
            ["模拟数据", "WebSocket实时数据", "数据库"]
        )
        
        # 时间范围选择
        time_range = st.selectbox(
            "时间范围",
            ["最近1小时", "最近24小时", "最近7天", "最近30天"]
        )
        
        # 显示组件选择
        st.subheader("📊 显示组件")
        show_temperature = st.checkbox("温度监控", value=True)
        show_humidity = st.checkbox("湿度监控", value=True)
        show_energy = st.checkbox("能耗分析", value=True)
        show_airflow = st.checkbox("空气流量", value=True)
        show_alerts = st.checkbox("报警信息", value=True)
        show_forecast = st.checkbox("预测分析", value=False)
        
        st.markdown("---")
        st.subheader("🎨 样式设置")
        chart_theme = st.selectbox("图表主题", ["plotly", "plotly_white", "plotly_dark"])
        
    # 获取数据
    data_generator = get_data_generator()
    
    if auto_refresh:
        # 自动刷新数据
        placeholder = st.empty()
        
        while True:
            hvac_data = data_generator.generate_current_data()
            history_data = data_generator.generate_history_data(time_range)
            
            with placeholder.container():
                render_dashboard(
                    hvac_data, history_data, 
                    show_temperature, show_humidity, show_energy, 
                    show_airflow, show_alerts, show_forecast,
                    chart_theme
                )
            
            time.sleep(refresh_interval)
    else:
        # 手动刷新
        if st.button("🔄 刷新数据"):
            hvac_data = data_generator.generate_current_data()
            history_data = data_generator.generate_history_data(time_range)
        else:
            hvac_data = data_generator.generate_current_data()
            history_data = data_generator.generate_history_data(time_range)
            
        render_dashboard(
            hvac_data, history_data,
            show_temperature, show_humidity, show_energy,
            show_airflow, show_alerts, show_forecast,
            chart_theme
        )

def render_dashboard(hvac_data, history_data, show_temp, show_hum, show_energy, 
                    show_airflow, show_alerts, show_forecast, theme):
    # 关键指标卡片
    col1, col2, col3, col4, col5 = st.columns(5)
    
    with col1:
        st.metric(
            label="🌡️ 当前温度",
            value=f"{hvac_data['temperature']:.1f}°C",
            delta=f"{hvac_data['temperature'] - 24:.1f}°C"
        )
    
    with col2:
        st.metric(
            label="💧 当前湿度",
            value=f"{hvac_data['humidity']:.1f}%",
            delta=f"{hvac_data['humidity'] - 50:.1f}%"
        )
    
    with col3:
        st.metric(
            label="⚡ 能耗",
            value=f"{hvac_data['energy']:.1f}kW",
            delta=f"{hvac_data['energy'] - 8.5:.1f}kW"
        )
    
    with col4:
        st.metric(
            label="🌪️ 风量",
            value=f"{hvac_data['airflow']:.0f}m³/h",
            delta=f"{hvac_data['airflow'] - 1600:.0f}m³/h"
        )
    
    with col5:
        system_status = "🟢 正常" if hvac_data['system_online'] else "🔴 离线"
        st.metric(
            label="🔧 系统状态",
            value=system_status,
            delta=f"效率: {hvac_data['efficiency']:.1f}%"
        )
    
    st.markdown("---")
    
    # 图表区域
    if show_temp:
        st.subheader("🌡️ 温度趋势分析")
        temp_chart = create_temperature_chart(history_data, theme)
        st.plotly_chart(temp_chart, use_container_width=True)
    
    if show_hum:
        st.subheader("💧 湿度变化监控")
        humidity_chart = create_humidity_chart(history_data, theme)
        st.plotly_chart(humidity_chart, use_container_width=True)
    
    if show_energy:
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("⚡ 能耗分析")
            energy_chart = create_energy_chart(history_data, theme)
            st.plotly_chart(energy_chart, use_container_width=True)
        
        with col2:
            st.subheader("📊 能耗分布")
            energy_pie = create_energy_pie_chart(hvac_data, theme)
            st.plotly_chart(energy_pie, use_container_width=True)
    
    if show_airflow:
        st.subheader("🌪️ 空气流量监控")
        airflow_chart = create_airflow_chart(history_data, theme)
        st.plotly_chart(airflow_chart, use_container_width=True)
    
    if show_alerts:
        st.subheader("⚠️ 系统报警")
        render_alerts_panel(hvac_data)
    
    if show_forecast:
        st.subheader("🔮 预测分析")
        render_forecast_analysis(history_data, theme)

def create_temperature_chart(history_data, theme):
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

def create_humidity_chart(history_data, theme):
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

def create_energy_chart(history_data, theme):
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

def create_energy_pie_chart(hvac_data, theme):
    labels = ['制冷', '供暖', '通风', '其他']
    values = [
        hvac_data['energy'] * 0.4,
        hvac_data['energy'] * 0.3,
        hvac_data['energy'] * 0.2,
        hvac_data['energy'] * 0.1
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

def create_airflow_chart(history_data, theme):
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

def render_alerts_panel(hvac_data):
    alerts = hvac_data.get('alerts', [])
    
    if not alerts:
        st.success("✅ 系统运行正常，无报警信息")
    else:
        for alert in alerts:
            if alert['type'] == 'error':
                st.error(f"🚨 {alert['message']}")
            elif alert['type'] == 'warning':
                st.warning(f"⚠️ {alert['message']}")
            else:
                st.info(f"ℹ️ {alert['message']}")

def render_forecast_analysis(history_data, theme):
    # 简单的线性预测
    df = pd.DataFrame(history_data)
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("📈 温度预测 (未来6小时)")
        # 使用简单移动平均进行预测
        temp_forecast = df['temperature'].rolling(window=5).mean().iloc[-1]
        st.metric("预测温度", f"{temp_forecast:.1f}°C")
        
        forecast_times = pd.date_range(
            start=df['timestamp'].iloc[-1], 
            periods=6, 
            freq='H'
        )[1:]
        
        fig = go.Figure()
        fig.add_trace(go.Scatter(
            x=df['timestamp'],
            y=df['temperature'],
            mode='lines',
            name='历史温度',
            line=dict(color='blue')
        ))
        
        fig.add_trace(go.Scatter(
            x=forecast_times,
            y=[temp_forecast] * len(forecast_times),
            mode='lines+markers',
            name='预测温度',
            line=dict(color='red', dash='dash')
        ))
        
        fig.update_layout(template=theme)
        st.plotly_chart(fig, use_container_width=True)
    
    with col2:
        st.write("⚡ 能耗预测")
        energy_forecast = df['energy'].rolling(window=5).mean().iloc[-1]
        st.metric("预测能耗", f"{energy_forecast:.1f}kW")
        
        # 能耗趋势分析
        energy_trend = "上升" if df['energy'].diff().iloc[-5:].mean() > 0 else "下降"
        st.write(f"📊 趋势: {energy_trend}")

if __name__ == "__main__":
    main() 