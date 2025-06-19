#!/bin/bash

echo "🚀 启动HVAC数据可视化系统"
echo "================================"

# 检查是否安装了 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未检测到 Node.js，请先安装 Node.js"
    exit 1
fi

# 检查是否安装了 Python
if ! command -v python &> /dev/null && ! command -v python3 &> /dev/null; then
    echo "❌ 未检测到 Python，请先安装 Python"
    exit 1
fi

echo "✅ 环境检查通过"

# 安装前端依赖
echo "📦 安装前端依赖..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ 前端依赖安装失败"
    exit 1
fi

# 安装Python依赖
echo "🐍 安装Python依赖..."
cd streamlit-dashboard
pip install -r requirements.txt

if [ $? -ne 0 ]; then
    echo "❌ Python依赖安装失败"
    exit 1
fi

cd ..

echo "✅ 所有依赖安装完成"

# 询问用户要启动哪个服务
echo ""
echo "请选择要启动的服务："
echo "1) React前端 (端口3000)"
echo "2) Streamlit仪表盘 (端口8501)"
echo "3) 同时启动两个服务"
echo ""

read -p "请输入选择 (1-3): " choice

case $choice in
    1)
        echo "🌐 启动React前端..."
        npm run dev
        ;;
    2)
        echo "📊 启动Streamlit仪表盘..."
        cd streamlit-dashboard
        streamlit run app.py
        ;;
    3)
        echo "🚀 同时启动两个服务..."
        echo "📊 启动Streamlit仪表盘（后台运行）..."
        cd streamlit-dashboard
        nohup streamlit run app.py &
        cd ..
        echo "🌐 启动React前端..."
        npm run dev
        ;;
    *)
        echo "❌ 无效选择"
        exit 1
        ;;
esac

echo ""
echo "✅ 启动完成！"
echo ""
echo "📖 访问地址："
echo "   React前端: http://localhost:3000"
echo "   Streamlit仪表盘: http://localhost:8501"
echo ""
echo "🛑 按 Ctrl+C 停止服务" 