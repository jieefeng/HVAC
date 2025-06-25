# CORS 问题解决方案

## 问题描述

之前遇到了 CORS（跨域资源共享）错误：

```
Access to fetch at 'http://7af0b3f3.r16.cpolar.top/api/chart/temperature' from origin 'http://localhost:3000' has been blocked by CORS policy
```

## 解决方案

通过配置 Vite 开发服务器代理来解决跨域问题。

### 1. 修改了 `vite.config.ts`

添加了外部 API 代理配置：

```typescript
"/external-api": {
  target: "http://7af0b3f3.r16.cpolar.top",
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/external-api/, ""),
}
```

### 2. 修改了 `src/services/chartImageService.ts`

将 API 调用从直接访问外部服务器改为使用代理：

```typescript
// 之前: const BASE_URL = "http://7af0b3f3.r16.cpolar.top";
// 现在: const BASE_URL = "/external-api";
```

## 如何使用

### 步骤 1: 重启开发服务器

**重要**: 必须重启开发服务器才能使代理配置生效

```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
```

### 步骤 2: 测试 API 连接

1. 打开浏览器访问 `http://localhost:3000/debug`
2. 点击"获取图片"按钮
3. 查看控制台日志

## 预期结果

- ✅ 不再出现 CORS 错误
- ✅ 可以成功获取 API 数据
- ✅ 代理服务器会自动转发请求到外部 API

## 如何验证代理是否工作

在浏览器开发者工具的 Network 面板中，你应该看到：

- 请求 URL: `http://localhost:3000/external-api/api/chart/temperature`
- 状态码: 200 (如果 API 正常)
- 没有 CORS 错误

## 故障排查

如果仍然有问题：

1. 确保开发服务器已重启
2. 检查外部 API 服务器是否正常运行
3. 查看控制台的代理日志
4. 检查 Network 面板的请求详情

## 生产环境注意事项

这个代理配置只在开发环境有效。在生产环境中，你需要：

1. 配置 nginx 或其他反向代理
2. 或者让后端 API 服务器添加 CORS 头部支持
