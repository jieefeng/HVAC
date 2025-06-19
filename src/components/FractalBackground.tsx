import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

const FractalBackground: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    const width = window.innerWidth;
    const height = window.innerHeight;

    svg.attr("width", width).attr("height", height);

    // 清除之前的内容
    svg.selectAll("*").remove();

    // 创建渐变定义
    const defs = svg.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "fractal-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");

    gradient
      .append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#1890ff")
      .attr("stop-opacity", 0.3);

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#36cfc9")
      .attr("stop-opacity", 0.1);

    // 分形树函数
    function drawFractalTree(
      x: number,
      y: number,
      angle: number,
      length: number,
      depth: number
    ) {
      if (depth === 0 || length < 2) return;

      const x2 = x + Math.cos(angle) * length;
      const y2 = y + Math.sin(angle) * length;

      svg
        .append("line")
        .attr("x1", x)
        .attr("y1", y)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "url(#fractal-gradient)")
        .attr("stroke-width", depth * 0.5)
        .attr("opacity", depth * 0.2)
        .style("filter", "blur(0.5px)");

      // 递归绘制分支
      drawFractalTree(x2, y2, angle - Math.PI / 6, length * 0.7, depth - 1);
      drawFractalTree(x2, y2, angle + Math.PI / 6, length * 0.7, depth - 1);
    }

    // 创建多个分形树
    const trees = [
      {
        x: width * 0.1,
        y: height * 0.8,
        angle: -Math.PI / 2,
        length: 80,
        depth: 8,
      },
      {
        x: width * 0.9,
        y: height * 0.8,
        angle: -Math.PI / 2,
        length: 70,
        depth: 7,
      },
      {
        x: width * 0.3,
        y: height * 0.9,
        angle: -Math.PI / 3,
        length: 60,
        depth: 6,
      },
      {
        x: width * 0.7,
        y: height * 0.9,
        angle: (-2 * Math.PI) / 3,
        length: 60,
        depth: 6,
      },
    ];

    trees.forEach((tree) => {
      drawFractalTree(tree.x, tree.y, tree.angle, tree.length, tree.depth);
    });

    // 创建漂浮的粒子效果
    const particles = svg
      .selectAll(".particle")
      .data(d3.range(30))
      .enter()
      .append("circle")
      .attr("class", "particle")
      .attr("r", () => Math.random() * 3 + 1)
      .attr("cx", () => Math.random() * width)
      .attr("cy", () => Math.random() * height)
      .attr("fill", "url(#fractal-gradient)")
      .attr("opacity", 0.6);

    // 粒子动画
    function animateParticles() {
      particles
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr("cx", () => Math.random() * width)
        .attr("cy", () => Math.random() * height)
        .attr("opacity", () => Math.random() * 0.8 + 0.2)
        .on("end", animateParticles);
    }

    animateParticles();

    // 响应窗口大小变化
    const handleResize = () => {
      const newWidth = window.innerWidth;
      const newHeight = window.innerHeight;
      svg.attr("width", newWidth).attr("height", newHeight);

      // 重新绘制分形
      svg.selectAll("*").remove();
      // 重新执行绘制逻辑...
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="fractal-container">
      <svg
        ref={svgRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default FractalBackground;
