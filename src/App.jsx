import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const colors = [
  {
    label: "灵感紫",
    color: "#C7B6E6",
    video: "/videos/purple.mp4",
    svg: "/zilingzi.svg",
  },
  {
    label: "深空黑",
    color: "#2B2B2B",
    video: "/videos/black.mp4",
    svg: "/shenkonghei.svg",
  },
  {
    label: "告白",
    color: "#EDEDED",
    video: "/videos/white.mp4",
    svg: "/baibai.svg",
  },
];

const DURATION = 5000; // 5秒倒计时

// 进度环组件
function ProgressRing({ progress, size = 28, strokeWidth = 2 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      style={{
        position: "absolute",
        transform: "rotate(-90deg)",
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#007AFF"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        style={{
          transition: "stroke-dashoffset 0.05s linear",
        }}
      />
    </svg>
  );
}

export default function App() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(0);
  const lastTimeRef = useRef(Date.now());
  const rafRef = useRef(null);

  // 预加载视频
  useEffect(() => {
    colors.forEach((c) => {
      const v = document.createElement("video");
      v.src = c.video;
      v.preload = "auto";
    });
  }, []);

  // 自动切换动画
  useEffect(() => {
    const animate = () => {
      const now = Date.now();
      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      progressRef.current += (delta / DURATION) * 100;

      if (progressRef.current >= 100) {
        progressRef.current = 0;
        setActive((prev) => (prev + 1) % colors.length);
      }

      setProgress(progressRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = Date.now();
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [active]);

  // 手动切换
  const handleClick = (index) => {
    progressRef.current = 0;
    setProgress(0);
    setActive(index);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "414px",
        height: "896px",
        margin: "0 auto",
        background: "#F5F6FA",
        overflow: "hidden",
      }}
    >
      {/* 背景图 */}
      <img
        src="/背景图.png"
        alt="背景"
        style={{
          width: "414px",
          height: "896px",
          objectFit: "cover",
        }}
      />

      {/* 组件覆盖在灰色区域 */}
      <div
        style={{
          position: "absolute",
          top: "425px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <motion.div
          style={{
            width: 380,
            height: 380,
            borderRadius: 9,
            background: "#fff",
            overflow: "hidden",
          }}
        >
          {/* 视频区域 */}
          <div
            style={{ height: 285 }}
            className="flex items-center justify-center bg-white"
          >
            <AnimatePresence mode="wait">
              <motion.video
                key={colors[active].video}
                src={colors[active].video}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="h-full object-contain"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.08 }}
              />
            </AnimatePresence>
          </div>

          {/* 底部信息区 */}
          <div
            style={{
              height: 95,
              background: "#F5F6FA",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px 0 18px",
            }}
          >
            {/* 左侧 SVG */}
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* vivo S60 Logo */}
              <img
                src="/vivo-s60.svg"
                alt="vivo S60"
                style={{ height: "24px" }}
              />
              {/* 分隔竖线 */}
              <span
                style={{
                  width: "1px",
                  height: "20px",
                  backgroundColor: "#000000",
                  margin: "0 4px",
                }}
              />
              {/* 颜色手写体 */}
              <img
                src={colors[active].svg}
                alt={colors[active].label}
                style={{ height: "24px" }}
              />
            </div>

            {/* 颜色选择 */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: 'auto' }}>
              {colors.map((c, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleClick(i)}
                  whileTap={{ scale: 0.9 }}
                  style={{ 
                    width: "28px", 
                    height: "28px",
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "none",
                    background: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {/* 进度环 - 只在选中时显示 */}
                  {active === i && (
                    <ProgressRing progress={progress} size={28} strokeWidth={2} />
                  )}

                  {/* 色点 */}
                  <span
                    style={{ 
                      background: c.color,
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      display: "block",
                    }}
                  />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
