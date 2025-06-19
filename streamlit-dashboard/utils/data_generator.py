import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import json

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
                    'month': (datetime.now() - timedelta(days=i*30)).strftime('%Y-%m'),
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
    
    def export_to_json(self, filename, data):
        """导出数据为JSON文件"""
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    def export_to_csv(self, filename, data):
        """导出数据为CSV文件"""
        df = pd.DataFrame(data)
        df.to_csv(filename, index=False, encoding='utf-8')

# 使用示例
if __name__ == "__main__":
    generator = HVACDataGenerator()
    
    # 生成当前数据
    current_data = generator.generate_current_data()
    print("当前数据:", current_data)
    
    # 生成历史数据
    history_data = generator.generate_history_data("最近24小时")
    print("历史数据点数:", len(history_data['timestamp']))
    
    # 生成天气数据
    weather_data = generator.generate_weather_data()
    print("天气数据:", weather_data)
    
    # 导出数据
    generator.export_to_json("hvac_current.json", current_data)
    generator.export_to_csv("hvac_history.csv", history_data) 