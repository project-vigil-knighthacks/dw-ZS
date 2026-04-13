"use client";

import { useEffect, useRef, useCallback, useState, type RefObject } from "react";

interface GridHeroProps {
  className?: string;
  gridSize?: number;
  gridColor?: string;
  particleColor?: string;
  gridOpacity?: number;
  containerRef?: RefObject<HTMLElement | null>;
  rippleCenterRef?: RefObject<{ x: number; y: number } | null>;
  scrollDirection?: "tr" | "tl" | "br" | "bl";
  scrollSpeed?: number;
}

export function GridHero({
  className = "",
  gridSize = 40,
  gridColor = "#6b21a8",
  particleColor = "#9333ea",
  gridOpacity = 0.18,
  containerRef,
  rippleCenterRef,
  scrollDirection = "tr",
  scrollSpeed = 18,
}: GridHeroProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(undefined);
  const lastTimeRef = useRef(0);
  const scrollXRef = useRef(0);
  const scrollYRef = useRef(0);
  const ripplesRef = useRef<{ cx: number; cy: number; start: number }[]>([]);
  const wasHoveringRef = useRef(false);
  const [mounted, setMounted] = useState(false);

  const dx = scrollDirection.includes("r") ? 1 : -1;
  const dy = scrollDirection.includes("b") ? 1 : -1;

  useEffect(() => setMounted(true), []);

  const hexToRgb = useCallback(
    (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    }),
    []
  );

  const gridOffset = useCallback(
    (scroll: number) => ((scroll % gridSize) + gridSize) % gridSize,
    [gridSize]
  );

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const gRgb = hexToRgb(gridColor);
    const pRgb = hexToRgb(particleColor);
    let currentW = 0;
    let currentH = 0;

    const applySize = (w: number, h: number) => {
      if (w === 0 || h === 0) return;
      canvas.width = w * window.devicePixelRatio;
      canvas.height = h * window.devicePixelRatio;
      ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
      currentW = w;
      currentH = h;
    };

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        applySize(width, height);
      }
    });
    ro.observe(canvas);

    const wave = (x: number, y: number, cx: number, cy: number, size: number) => {
      const d = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      return Math.sin(d * 0.02) * 12 * Math.max(0, 1 - d / (size * 0.85));
    };

    const drawGrid = (w: number, h: number, cx: number, cy: number) => {
      const ox = gridOffset(scrollXRef.current);
      const oy = gridOffset(scrollYRef.current);
      ctx.strokeStyle = `rgba(${gRgb.r},${gRgb.g},${gRgb.b},${gridOpacity})`;
      ctx.lineWidth = 1;
      for (let gx = ox - gridSize; gx <= w + gridSize; gx += gridSize) {
        ctx.beginPath();
        for (let gy = 0; gy <= h; gy += 2) {
          const ax = gx + wave(gx, gy, cx, cy, w);
          gy === 0 ? ctx.moveTo(ax, gy) : ctx.lineTo(ax, gy);
        }
        ctx.stroke();
      }
      for (let gy = oy - gridSize; gy <= h + gridSize; gy += gridSize) {
        ctx.beginPath();
        for (let gx = 0; gx <= w; gx += 2) {
          const ay = gy + wave(gx, gy, cx, cy, h);
          gx === 0 ? ctx.moveTo(gx, ay) : ctx.lineTo(gx, ay);
        }
        ctx.stroke();
      }
    };

    const RIPPLE_MAX_RADIUS = 22;
    const RIPPLE_EXPAND_SPEED = 14;
    const RIPPLE_RING_WIDTH = 4;

    const drawRipples = (w: number, h: number, now: number, ox: number, oy: number) => {
      const isHovering = rippleCenterRef?.current != null;
      if (isHovering && !wasHoveringRef.current && rippleCenterRef?.current) {
        ripplesRef.current.push({
          cx: rippleCenterRef.current.x,
          cy: rippleCenterRef.current.y,
          start: now,
        });
      }
      wasHoveringRef.current = isHovering;

      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        const elapsed = (now - ripple.start) / 1000;
        const wavefront = elapsed * RIPPLE_EXPAND_SPEED;
        if (wavefront > RIPPLE_MAX_RADIUS + RIPPLE_RING_WIDTH) return false;

        for (let gx = ox - gridSize; gx <= w + gridSize; gx += gridSize) {
          for (let gy = oy - gridSize; gy <= h + gridSize; gy += gridSize) {
            const cellCenterX = gx + gridSize / 2;
            const cellCenterY = gy + gridSize / 2;
            const distFromCenter =
              Math.sqrt(
                (cellCenterX - ripple.cx) ** 2 + (cellCenterY - ripple.cy) ** 2
              ) / gridSize;
            const distFromWavefront = Math.abs(distFromCenter - wavefront);
            if (distFromWavefront < RIPPLE_RING_WIDTH) {
              const alpha =
                (1 - distFromWavefront / RIPPLE_RING_WIDTH) *
                Math.max(0, 1 - wavefront / RIPPLE_MAX_RADIUS) *
                0.25;
              if (alpha > 0.01) {
                ctx.fillStyle = `rgba(${pRgb.r},${pRgb.g},${pRgb.b},${alpha})`;
                ctx.fillRect(gx, gy, gridSize, gridSize);
              }
            }
          }
        }
        return true;
      });
    };

    const animate = (now: number) => {
      const dt = lastTimeRef.current ? (now - lastTimeRef.current) / 1000 : 0.016;
      lastTimeRef.current = now;

      scrollXRef.current += dx * scrollSpeed * dt;
      scrollYRef.current += dy * scrollSpeed * dt;

      const w = currentW;
      const h = currentH;
      if (w === 0 || h === 0) {
        animRef.current = requestAnimationFrame(animate);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      const mouseX = w / 2;
      const mouseY = h / 2;
      const ox = gridOffset(scrollXRef.current);
      const oy = gridOffset(scrollYRef.current);

      drawGrid(w, h, mouseX, mouseY);
      drawRipples(w, h, now, ox, oy);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      ro.disconnect();
    };
  }, [mounted, gridColor, particleColor, gridOpacity, gridSize, scrollSpeed, dx, dy, hexToRgb, gridOffset, rippleCenterRef]);

  if (!mounted) return null;

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ display: "block" }}
    />
  );
}
