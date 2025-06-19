@echo off
chcp 65001 >nul
echo 🚀 启动HVAC数据可视化系统
echo ================================

:: 检查是否安装了 Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ 未检测到 Node.js，请先安装 Node.js
    pause
    exit /b 1
)

:: 检查是否安装了 Python
python --version >nul 2>&1
if errorlevel 1 (
    python3 --version >nul 2>&1
    if errorlevel 1 (
        echo ❌ 未检测到 Python，请先安装 Python
        pause
        exit /b 1
    )
)

echo ✅ 环境检查通过

:: 安装前端依赖
echo 📦 安装前端依赖...
call npm install
if errorlevel 1 (
    echo ❌ 前端依赖安装失败
    pause
    exit /b 1
)

:: 安装Python依赖
echo 🐍 安装Python依赖...
cd streamlit-dashboard
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Python依赖安装失败
    pause
    exit /b 1
)
cd ..

echo ✅ 所有依赖安装完成

:: 询问用户要启动哪个服务
echo.
echo 请选择要启动的服务：
echo 1) React前端 (端口3000)
echo 2) Streamlit仪表盘 (端口8501)
echo 3) 同时启动两个服务
echo.

set /p choice=请输入选择 (1-3): 

if "%choice%"=="1" (
    echo 🌐 启动React前端...
    call npm run dev
) else if "%choice%"=="2" (
    echo 📊 启动Streamlit仪表盘...
    cd streamlit-dashboard
    streamlit run app.py
) else if "%choice%"=="3" (
    echo 🚀 同时启动两个服务...
    echo 📊 启动Streamlit仪表盘（后台运行）...
    start cmd /k "cd streamlit-dashboard && streamlit run app.py"
    timeout /t 3 >nul
    echo 🌐 启动React前端...
    call npm run dev
) else (
    echo ❌ 无效选择
    pause
    exit /b 1
)

echo.
echo ✅ 启动完成！
echo.
echo 📖 访问地址：
echo    React前端: http://localhost:3000
echo    Streamlit仪表盘: http://localhost:8501
echo.
echo 🛑 按 Ctrl+C 停止服务
pause 