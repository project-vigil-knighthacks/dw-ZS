"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Footer } from "@/components/Footer";
import {
  CardContainer,
  CardBody,
  CardItem,
} from "@/components/ui/3d-card-effect";

const GridHero = dynamic(
  () =>
    import("@/components/ui/grid-hero-animated").then((m) => ({
      default: m.GridHero,
    })),
  { ssr: false }
);

const AnimatedTextCycle = dynamic(
  () =>
    import("@/components/ui/animated-text-cycle").then((m) => ({
      default: m.AnimatedTextCycle,
    })),
  { ssr: false }
);

/* ── Feature card data ──────────────────────────────────── */
const features = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" />
        <circle cx="12" cy="12" r="2" />
        <line x1="12" y1="2" x2="12" y2="4" />
        <line x1="12" y1="20" x2="12" y2="22" />
        <line x1="2" y1="12" x2="4" y2="12" />
        <line x1="20" y1="12" x2="22" y2="12" />
      </svg>
    ),
    title: "Real-Time Monitoring",
    description:
      "Every HTTP request is captured as an Apache Combined Log Format line and streamed to Vigil SIEM in real-time via edge middleware.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "AI Classification",
    description:
      "Grok pattern matching and LLM-powered auto-classification detect severity, extract attributes, and flag anomalies automatically.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5.636 18.364a9 9 0 0 1 0-12.728" />
        <path d="M8.464 15.536a5 5 0 0 1 0-7.072" />
        <circle cx="12" cy="12" r="1" />
        <path d="M15.536 8.464a5 5 0 0 1 0 7.072" />
        <path d="M18.364 5.636a9 9 0 0 1 0 12.728" />
      </svg>
    ),
    title: "Alerting & Subscriptions",
    description:
      "Threshold-based alerts notify subscribers via email when anomalous patterns emerge — configurable per severity level.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Threat Intelligence",
    description:
      "Correlate events across sources, identify brute-force patterns, detect anomalous geolocations, and surface zero-day indicators.",
  },
];

const stats = [
  { num: "001", value: "24", accent: "/7", label: "Continuous Monitoring" },
  { num: "002", value: "Grok", accent: "+", label: "AI Pattern Recognition" },
  { num: "003", value: "HTTP", accent: ".", label: "Apache Log Format" },
  { num: "004", value: "Edge", accent: ".", label: "Middleware Proxy" },
];

const techStrip = [
  ["Framework", "Next.js 16"],
  ["SIEM", "Vigil"],
  ["Logging", "Apache Combined"],
  ["Storage", "SQLite"],
  ["Alerts", "Email"],
];

export default function HomePage() {
  const heroRef = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLElement>(null);
  const rippleCenterRef = useRef<{ x: number; y: number } | null>(null);
  const ctaRippleCenterRef = useRef<{ x: number; y: number } | null>(null);

  const handleButtonHover = useCallback(
    (e: React.MouseEvent) => {
      if (!heroRef.current) return;
      const sectionRect = heroRef.current.getBoundingClientRect();
      const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      rippleCenterRef.current = {
        x: btnRect.left + btnRect.width / 2 - sectionRect.left,
        y: btnRect.top + btnRect.height / 2 - sectionRect.top,
      };
    },
    []
  );

  const handleButtonLeave = useCallback(() => {
    rippleCenterRef.current = null;
  }, []);

  const handleCtaButtonHover = useCallback(
    (e: React.MouseEvent) => {
      if (!ctaRef.current) return;
      const sectionRect = ctaRef.current.getBoundingClientRect();
      const btnRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      ctaRippleCenterRef.current = {
        x: btnRect.left + btnRect.width / 2 - sectionRect.left,
        y: btnRect.top + btnRect.height / 2 - sectionRect.top,
      };
    },
    []
  );

  const handleCtaButtonLeave = useCallback(() => {
    ctaRippleCenterRef.current = null;
  }, []);

  return (
    <div className="min-h-screen pt-[70px]">
      {/* ═══ HERO ═══ */}
      <section
        ref={heroRef}
        className="relative min-h-[calc(100vh-70px)] flex flex-col justify-center px-6 md:px-[60px] py-12 md:py-20 overflow-hidden"
      >
        <GridHero
          gridColor="#6b21a8"
          particleColor="#9333ea"
          gridOpacity={0.15}
          containerRef={heroRef}
          rippleCenterRef={rippleCenterRef}
          scrollDirection="tr"
        />

        {/* HUD corners */}
        <div className="absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 border-[var(--accent)] opacity-30" />
        <div className="absolute top-5 right-5 w-5 h-5 border-t-2 border-r-2 border-[var(--accent)] opacity-30" />
        <div className="absolute bottom-5 left-5 w-5 h-5 border-b-2 border-l-2 border-[var(--accent)] opacity-30" />
        <div className="absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 border-[var(--accent)] opacity-30" />

        <div className="relative z-10 flex items-center">
          <div className="flex-1 min-w-0 md:max-w-[65%]">
            <div className="font-[family-name:var(--font-mono-alt)] text-[11px] md:text-[15px] text-[var(--accent-light)] tracking-[3px] uppercase mb-4 md:mb-6 flex items-center gap-3">
              <span className="w-6 md:w-10 h-px bg-[var(--accent)]" />
              Vigil SIEM · Deployed Test Site
            </div>

            <h1
              className="font-[family-name:var(--font-display)] font-extrabold text-[clamp(36px,10vw,110px)] leading-[0.92] tracking-[-2px] md:tracking-[-3px] uppercase max-w-[900px] mb-6 md:mb-8"
              style={{
                textShadow:
                  "0 0 30px rgba(147,51,234,0.15), 0 0 60px rgba(147,51,234,0.08)",
              }}
            >
              <span className="whitespace-nowrap">DW-ZS</span>
              <br />
              <em className="not-italic text-[var(--accent-light)]">
                <AnimatedTextCycle
                  words={[
                    "Security Monitoring.",
                    "Log Analysis.",
                    "Threat Detection.",
                  ]}
                  interval={3000}
                  className="text-[var(--accent-light)]"
                />
              </em>
            </h1>

            <div className="font-[family-name:var(--font-mono-alt)] text-[11px] md:text-[15px] text-[var(--accent-light)] tracking-[2px] md:tracking-[3px] uppercase leading-[2] md:leading-[2.2] mb-8 md:mb-12 opacity-70">
              Real-Time HTTP Traffic Capture
              <br />
              AI-Powered Log Classification & Severity Scoring
              <br />
              Edge Middleware Proxy · Zero Config Deployment
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <Link
                href="/dashboard"
                className="font-[family-name:var(--font-mono-alt)] text-xs bg-[var(--accent)] text-white px-6 md:px-8 py-3 md:py-3.5 font-medium tracking-[1.5px] uppercase shadow-none hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                Launch Dashboard
              </Link>
              <Link
                href="/login"
                className="font-[family-name:var(--font-mono-alt)] text-xs border border-[var(--accent)] text-[var(--accent-light)] px-6 md:px-8 py-3 md:py-3.5 font-medium tracking-[1.5px] uppercase hover:bg-[var(--accent)]/10 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
                onMouseEnter={handleButtonHover}
                onMouseLeave={handleButtonLeave}
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS BAR ═══ */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-b border-[var(--border)]">
        {stats.map((s, i) => (
          <div
            key={s.num}
            className={`relative px-6 md:px-10 py-6 md:py-10 border-b md:border-b-0 border-[var(--border)] ${
              i % 2 === 0 ? "border-r border-[var(--border)]" : ""
            } ${i < 2 ? "md:border-r" : ""} ${i === 3 ? "md:border-r-0" : ""}`}
          >
            <span className="absolute top-3 right-4 font-[family-name:var(--font-mono-alt)] text-[11px] md:text-[13px] text-[var(--muted-foreground)] tracking-wider">
              {s.num}
            </span>
            <div className="font-[family-name:var(--font-display)] text-3xl md:text-5xl font-extrabold tracking-[-2px] leading-none">
              {s.value}
              <span className="text-[var(--accent-light)]">{s.accent}</span>
            </div>
            <div className="font-[family-name:var(--font-mono-alt)] text-[11px] md:text-[15px] text-[var(--muted-foreground)] mt-2 tracking-wider uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* ═══ MARQUEE STRIP ═══ */}
      <div className="overflow-hidden border-b border-[var(--border)] py-5">
        <div
          className="flex animate-marquee-right"
          style={{ width: "max-content" }}
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="font-[family-name:var(--font-display)] font-extrabold uppercase text-[clamp(22px,2.5vw,36px)] tracking-[-1px] text-[var(--border)] whitespace-nowrap px-10"
            >
              DW-ZS
            </span>
          ))}
        </div>
      </div>

      {/* ═══ FEATURES GRID ═══ */}
      <section className="px-6 md:px-[60px] py-12 md:py-20">
        <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 md:mb-12 pb-5 border-b border-[var(--border)] gap-4">
          <div>
            <div className="font-[family-name:var(--font-mono-alt)] text-[14px] text-[var(--muted-foreground)] tracking-[2px] mb-2">
              002 ————
            </div>
            <div className="font-[family-name:var(--font-display)] text-2xl md:text-4xl font-bold tracking-[-1px] uppercase">
              Platform Capabilities
            </div>
          </div>
          <div className="font-[family-name:var(--font-mono-alt)] text-[12px] md:text-[15px] text-[var(--muted-foreground)] md:text-right leading-[1.8] tracking-wider">
            GROK PATTERN MATCHING + LLM CLASSIFICATION
            <br />
            POWERED BY VIGIL SIEM
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-[var(--border)]">
          {features.map((f, i) => (
            <CardContainer
              key={i}
              containerClassName="p-0"
              className="w-full h-full"
            >
              <CardBody
                className={`bg-[var(--surface)] p-7 h-[300px] flex flex-col group hover:bg-[var(--surface-raised)] transition-colors w-full ${
                  i < features.length - 1 ? "border-b md:border-b-0 md:border-r border-[var(--border)]" : ""
                }`}
              >
                <CardItem
                  translateZ={30}
                  className="font-[family-name:var(--font-mono-alt)] text-[14px] text-[var(--muted-foreground)] tracking-[2px] mb-4 group-hover:text-[var(--accent-light)] transition-colors"
                >
                  0{i + 1} / 04
                </CardItem>
                <CardItem translateZ={50} className="mb-3">
                  {f.icon}
                </CardItem>
                <CardItem
                  translateZ={40}
                  className="font-[family-name:var(--font-display)] text-[18px] font-bold uppercase tracking-tight mb-2.5"
                >
                  {f.title}
                </CardItem>
                <CardItem
                  translateZ={20}
                  className="text-[15px] text-[var(--muted-foreground)] leading-relaxed flex-1"
                >
                  {f.description}
                </CardItem>
                <CardItem
                  translateZ={35}
                  className="mt-4 font-[family-name:var(--font-mono-alt)] text-[14px] text-[var(--accent-light)] tracking-wider flex items-center gap-1.5"
                >
                  <span className="animate-blink">●</span> ONLINE
                </CardItem>
              </CardBody>
            </CardContainer>
          ))}
        </div>
      </section>

      {/* ═══ TECH STRIP ═══ */}
      <div className="flex flex-wrap md:flex-nowrap items-center border-t border-b border-[var(--border)]">
        {techStrip.map(([label, value], i, arr) => (
          <div
            key={label}
            className={`relative flex-1 min-w-[50%] md:min-w-0 px-5 md:px-8 py-4 md:py-5 font-[family-name:var(--font-mono-alt)] text-[11px] md:text-[13px] text-[var(--muted-foreground)] tracking-wider text-center md:hover:bg-[var(--surface-raised)] md:hover:shadow-[0_0_20px_rgba(147,51,234,0.1)] transition-all duration-200 border-b md:border-b-0 ${
              i < arr.length - 1
                ? "md:border-r border-[var(--border)]"
                : ""
            } ${
              i % 2 === 0 && i < arr.length - 1
                ? "border-r border-[var(--border)] md:border-r"
                : ""
            }`}
          >
            <span className="hidden md:block absolute -left-px -top-px size-2 border-l-2 border-t-2 border-[var(--accent)]" />
            <span className="hidden md:block absolute -right-px -top-px size-2 border-r-2 border-t-2 border-[var(--accent)]" />
            <span className="hidden md:block absolute -left-px -bottom-px size-2 border-l-2 border-b-2 border-[var(--accent)]" />
            <span className="hidden md:block absolute -right-px -bottom-px size-2 border-r-2 border-b-2 border-[var(--accent)]" />
            <strong className="block text-[var(--foreground)] font-medium mb-1">
              {value}
            </strong>
            {label}
          </div>
        ))}
      </div>

      {/* ═══ CTA ═══ */}
      <section
        ref={ctaRef}
        className="relative px-6 md:px-[60px] py-16 md:py-[120px] text-center"
      >
        <GridHero
          gridColor="#6b21a8"
          particleColor="#9333ea"
          gridOpacity={0.12}
          containerRef={ctaRef}
          rippleCenterRef={ctaRippleCenterRef}
          scrollDirection="bl"
        />
        <div className="relative z-10">
          <h2
            className="font-[family-name:var(--font-display)] text-[clamp(28px,5vw,64px)] font-extrabold uppercase tracking-[-2px] mb-5"
            style={{
              textShadow:
                "0 0 30px rgba(147,51,234,0.15), 0 0 60px rgba(147,51,234,0.08)",
            }}
          >
            Try It Live.
          </h2>
          <p className="text-[var(--muted-foreground)] mb-8 max-w-md mx-auto">
            Log in to the dashboard and click around. Every action generates
            real HTTP logs streamed to Vigil SIEM.
          </p>
          <Link
            href="/dashboard"
            className="inline-block font-[family-name:var(--font-mono-alt)] text-xs bg-[var(--accent)] text-white px-6 md:px-8 py-3 md:py-3.5 font-medium tracking-[1.5px] uppercase hover:brightness-110 hover:scale-[1.03] hover:-translate-y-0.5 transition-all duration-200"
            onMouseEnter={handleCtaButtonHover}
            onMouseLeave={handleCtaButtonLeave}
          >
            Open the Dashboard →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
