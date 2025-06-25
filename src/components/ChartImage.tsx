import React, { useState, useEffect } from "react";
import { Card, Spin, Alert, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { formatBase64Image } from "../services/chartImageService";
import "./ChartImage.css";

interface ChartImageProps {
  title: string;
  imageData?: string;
  loading?: boolean;
  error?: string;
  height?: number;
  className?: string;
}

const ChartImage: React.FC<ChartImageProps> = ({
  title,
  imageData,
  loading = false,
  error,
  height = 300,
  className,
}) => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  // 重置图片错误状态
  useEffect(() => {
    if (imageData) {
      setImageError(null);
    }
  }, [imageData]);

  // 调试信息
  useEffect(() => {
    console.log(`🖼️  ChartImage [${title}]:`, {
      hasImageData: !!imageData,
      imageDataLength: imageData?.length || 0,
      loading,
      error,
      imageError,
    });
  }, [title, imageData, loading, error, imageError]);

  const handleImageLoad = () => {
    console.log(`✅ 图片加载成功: ${title}`);
    setIsImageLoading(false);
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    console.error(`❌ 图片加载失败: ${title}`, e);
    setImageError("图片加载失败");
    setIsImageLoading(false);
  };

  const handleImageLoadStart = () => {
    console.log(`🔄 开始加载图片: ${title}`);
    setIsImageLoading(true);
  };

  const handleRetry = () => {
    setImageError(null);
    setIsImageLoading(false);
    // 这里可以触发重新获取图片的逻辑
    console.log(`🔄 重试加载图片: ${title}`);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="chart-image-loading" style={{ height }}>
          <Spin size="large" tip="加载图表中..." />
        </div>
      );
    }

    if (error) {
      return (
        <div className="chart-image-error" style={{ height }}>
          <Alert
            message="图表加载失败"
            description={error}
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={handleRetry}>
                重试
              </Button>
            }
          />
        </div>
      );
    }

    if (!imageData) {
      return (
        <div className="chart-image-empty" style={{ height }}>
          <div style={{ textAlign: "center" }}>
            <p>暂无图表数据</p>
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={handleRetry}
            >
              重新加载
            </Button>
          </div>
        </div>
      );
    }

    if (imageError) {
      return (
        <div className="chart-image-error" style={{ height }}>
          <Alert
            message="图片显示失败"
            description={imageError}
            type="error"
            showIcon
            action={
              <Button size="small" danger onClick={handleRetry}>
                重试
              </Button>
            }
          />
        </div>
      );
    }

    const formattedImageData = formatBase64Image(imageData);
    console.log(`🖼️  渲染图片 [${title}]:`, {
      originalLength: imageData.length,
      formattedLength: formattedImageData.length,
      startsWithDataImage: formattedImageData.startsWith("data:image"),
    });

    return (
      <div className="chart-image-container" style={{ height, overflow: "" }}>
        {isImageLoading && (
          <div
            className="chart-image-loading"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(255, 255, 255, 0.8)",
              zIndex: 1,
            }}
          >
            <Spin size="large" tip="加载图片中..." />
          </div>
        )}
        <img
          src={formattedImageData}
          alt={title}
          className="chart-image-img"
          onLoad={handleImageLoad}
          onError={handleImageError}
          onLoadStart={handleImageLoadStart}
          style={{
            opacity: isImageLoading ? 0.5 : 1,
            transition: "opacity 0.3s ease",
          }}
        />
      </div>
    );
  };

  return (
    <Card
      title={title}
      className={className}
      bodyStyle={{ padding: 0 }}
      size="small"
      extra={
        imageData && (
          <Button
            size="small"
            icon={<ReloadOutlined />}
            onClick={handleRetry}
            style={{ marginRight: 8 }}
          >
            刷新
          </Button>
        )
      }
    >
      {renderContent()}
    </Card>
  );
};

export default ChartImage;
