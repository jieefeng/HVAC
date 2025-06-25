// 图表图片服务
// 使用代理路径而不是直接跨域访问
const BASE_URL = "/external-api";

export interface ChartImageResponse {
  success: boolean;
  data?: string; // base64图片数据
  error?: string;
}

export interface ChartImages {
  temperature?: string;
  humidity?: string;
  energy?: string;
  energy_pie?: string;
  airflow?: string;
  system_status?: string;
}

// 图表类型映射
export const CHART_ENDPOINTS = {
  temperature: "/api/chart/temperature",
  humidity: "/api/chart/humidity",
  energy: "/api/chart/energy",
  energy_pie: "/api/chart/energy_pie",
  airflow: "/api/chart/airflow",
  system_status: "/api/chart/system_status",
} as const;

export type ChartType = keyof typeof CHART_ENDPOINTS;

/**
 * 获取单个图表图片
 */
export const fetchChartImage = async (
  chartType: ChartType
): Promise<ChartImageResponse> => {
  const url = `${BASE_URL}${CHART_ENDPOINTS[chartType]}`;
  console.log(`🔄 正在获取图表: ${chartType}, URL: ${url}`);
  console.log(`🌐 使用代理访问外部API以解决CORS问题`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json, */*",
      },
    });

    console.log(`📡 API响应状态: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${response.statusText}`
      );
    }

    // 先获取原始文本
    const rawText = await response.text();
    console.log(`📄 原始响应长度: ${rawText.length} 字符`);
    console.log(`📄 原始响应前100字符: ${rawText.substring(0, 100)}...`);

    let data;
    try {
      // 尝试解析为JSON
      data = JSON.parse(rawText);
      console.log(`🔍 解析后的数据类型: ${typeof data}`);
      console.log(`🔍 数据结构:`, Object.keys(data));
    } catch (jsonError) {
      console.log(`⚠️  无法解析为JSON，当作纯文本处理`);
      data = rawText;
    }

    // 尝试多种可能的数据格式
    let imageData;
    if (typeof data === "string") {
      // 直接是base64字符串
      imageData = data;
      console.log(`✅ 数据格式: 直接字符串`);
    } else if (data && typeof data === "object") {
      // 可能的对象格式
      imageData =
        data.image || data.data || data.base64 || data.content || data.chart;
      console.log(
        `✅ 数据格式: 对象，提取到的键: ${imageData ? "有数据" : "无数据"}`
      );

      // 如果以上都没有，尝试获取第一个字符串值
      if (!imageData) {
        const values = Object.values(data);
        imageData = values.find(
          (value) => typeof value === "string" && value.length > 100
        );
        console.log(
          `🔍 尝试提取第一个长字符串: ${imageData ? "找到" : "未找到"}`
        );
      }
    }

    if (!imageData) {
      console.error(`❌ 无法从API响应中提取图片数据`);
      console.error(`❌ 响应数据结构:`, data);
      return {
        success: false,
        error: "API响应中没有找到图片数据",
      };
    }

    console.log(`📊 提取到的图片数据长度: ${imageData.length} 字符`);
    console.log(`📊 数据开头: ${imageData.substring(0, 50)}...`);

    return {
      success: true,
      data: imageData,
    };
  } catch (error) {
    console.error(`❌ 获取${chartType}图表失败:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误",
    };
  }
};

/**
 * 批量获取所有图表图片
 */
export const fetchAllChartImages = async (): Promise<ChartImages> => {
  const chartTypes: ChartType[] = [
    "temperature",
    "humidity",
    "energy",
    "energy_pie",
    "airflow",
    "system_status",
  ];

  console.log(`🚀 开始批量获取所有图表图片`);

  const results = await Promise.allSettled(
    chartTypes.map((type) => fetchChartImage(type))
  );

  const images: ChartImages = {};

  results.forEach((result, index) => {
    const chartType = chartTypes[index];
    if (result.status === "fulfilled" && result.value.success) {
      images[chartType] = result.value.data;
      console.log(`✅ ${chartType} 图表获取成功`);
    } else {
      console.warn(
        `❌ ${chartType} 图表获取失败:`,
        result.status === "fulfilled" ? result.value.error : result.reason
      );
    }
  });

  console.log(`📊 批量获取完成，成功获取 ${Object.keys(images).length} 个图表`);
  return images;
};

/**
 * 格式化base64图片数据
 */
export const formatBase64Image = (base64Data: string): string => {
  console.log(`🖼️  格式化图片数据，长度: ${base64Data.length}`);

  // 如果已经包含data:image前缀，直接返回
  if (base64Data.startsWith("data:image")) {
    console.log(`✅ 数据已包含data:image前缀`);
    return base64Data;
  }

  // 检查是否是纯base64（无前缀）
  if (base64Data.match(/^[A-Za-z0-9+/]*={0,2}$/)) {
    console.log(`✅ 检测到纯base64数据，添加PNG前缀`);
    return `data:image/png;base64,${base64Data}`;
  }

  // 如果以/9j/开头，通常是JPEG
  if (base64Data.startsWith("/9j/")) {
    console.log(`✅ 检测到JPEG格式，添加JPEG前缀`);
    return `data:image/jpeg;base64,${base64Data}`;
  }

  // 如果以iVBOR开头，通常是PNG
  if (base64Data.startsWith("iVBOR")) {
    console.log(`✅ 检测到PNG格式，添加PNG前缀`);
    return `data:image/png;base64,${base64Data}`;
  }

  // 默认作为PNG处理
  console.log(`⚠️  未识别格式，默认作为PNG处理`);
  return `data:image/png;base64,${base64Data}`;
};
