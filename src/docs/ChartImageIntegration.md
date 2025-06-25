# HVAC 图表图片集成说明

## 概述

本项目已集成了从外部 API 获取 base64 图片的功能，替换了原有的图表组件，现在可以从指定的服务器获取实时的图表图片。

## API 配置

### 服务器地址

```
http://f211504.r16.cpolar.top
```

### API 端点

- **温度图表**: `/api/chart/temperature`
- **湿度图表**: `/api/chart/humidity`
- **能耗图表**: `/api/chart/energy`
- **能耗饼图**: `/api/chart/energy_pie`
- **空气流量图**: `/api/chart/airflow`
- **系统状态图**: `/api/chart/system_status`

## 新增文件

### 1. 服务层

- `src/services/chartImageService.ts` - 图片 API 服务
- `src/store/chartImageStore.ts` - 图片数据状态管理

### 2. 组件层

- `src/components/ChartImage.tsx` - 图片展示组件
- `src/components/ChartImage.css` - 图片组件样式

### 3. 类型定义

- `src/types/chartTypes.ts` - 图表相关类型定义

## 使用方法

### 在组件中使用图片服务

```typescript
import { useChartImageStore } from "../store/chartImageStore";

const MyComponent = () => {
  const {
    chartImages,
    isLoading,
    error,
    fetchAllImages,
    startRealTimeUpdates,
  } = useChartImageStore();

  useEffect(() => {
    fetchAllImages();
    startRealTimeUpdates(5000); // 5秒更新一次
  }, []);

  return (
    <ChartImage
      title="温度趋势"
      imageData={chartImages.temperature}
      loading={isLoading}
      error={error || undefined}
      height={300}
    />
  );
};
```

### 修改 API 服务器地址

如需更改 API 服务器地址，请修改 `src/services/chartImageService.ts` 文件中的 `BASE_URL` 常量：

```typescript
const BASE_URL = "http://your-new-server.com";
```

## 功能特性

### 1. 实时更新

- 支持设置自定义更新间隔（1 秒-30 秒）
- 可开启/关闭实时更新功能

### 2. 错误处理

- 网络请求失败处理
- 图片加载失败处理
- 友好的错误提示信息

### 3. 加载状态

- 图片加载时显示加载动画
- 优雅的加载状态过渡

### 4. 响应式设计

- 图片自适应容器大小
- 移动端友好的显示效果

## 模板配置

现在支持以下模板：

### Template 1 - 经典监控模板

- 温度趋势图 (8/24)
- 湿度趋势图 (8/24)
- 空气流量图 (8/24)
- 能耗统计图 (12/24)
- 系统状态图 (12/24)

### Template 2 - 能耗分析模板

- 能耗统计图 (16/24)
- 天气小部件 (8/24)
- 温度趋势图 (6/24)
- 湿度趋势图 (6/24)
- 能耗饼图 (6/24)
- 告警面板 (6/24)

### Template 3 - 系统状态模板

- 系统状态图 (24/24)
- 实时数据 (8/24)
- 空气流量图 (8/24)
- 温度趋势图 (8/24)

## 故障排查

### 常见问题

1. **图片不显示**

   - 检查网络连接
   - 确认 API 服务器是否可访问
   - 查看浏览器控制台错误信息

2. **图片加载缓慢**

   - 可能是网络问题
   - 可以调整更新间隔

3. **API 返回错误**
   - 检查 API 服务器状态
   - 确认 API 端点是否正确

### 开发调试

在开发模式下，可以在浏览器控制台查看详细的 API 请求日志和错误信息。

## 注意事项

1. 确保 API 服务器返回的是有效的 base64 图片数据
2. 如果 API 返回的数据格式不同，可能需要调整 `chartImageService.ts` 中的数据解析逻辑
