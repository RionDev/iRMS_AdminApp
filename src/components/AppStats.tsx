import { useThemeStore } from "@common/stores/themeStore";
import type { Theme } from "@common/styles/theme";
import { useEffect, useState, type ReactNode } from "react";
import { getAppStatistics } from "../services/appService";

/** 도넛 차트 영역의 최소 높이 (px). ActiveAppPage.DASHBOARD_MIN_HEIGHT 와 연동. */
const CHART_MIN_HEIGHT = 160;

interface AppStatsProps {
  /** 값이 바뀌면 통계를 다시 가져온다 (예: 허용/차단 토글 후). */
  reloadKey?: number;
}

type SegmentKey = "active" | "blocked";

interface Segment {
  key: SegmentKey;
  label: string;
  description: string;
  value: number;
  color: string;
  tint: string;
  icon: ReactNode;
}

export function AppStats({ reloadKey }: AppStatsProps) {
  const { theme, isDarkMode } = useThemeStore();
  const [total, setTotal] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setError(null);
    getAppStatistics()
      .then((stats) => {
        if (!mounted) return;
        setTotal(stats.total);
        setActive(stats.active);
        setBlocked(stats.blocked);
      })
      .catch(() => {
        if (!mounted) return;
        setError("통계를 불러오지 못했습니다");
      });

    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  const segments: Segment[] = [
    {
      key: "active",
      label: "활성",
      description: "허용된 앱",
      value: active ?? 0,
      color: theme.colors.primary,
      tint: "rgba(37, 99, 235, 0.12)",
      icon: <GridIcon />,
    },
    {
      key: "blocked",
      label: "비활성",
      description: "차단된 앱",
      value: blocked ?? 0,
      color: theme.colors.danger,
      tint: "rgba(220, 38, 38, 0.12)",
      icon: <ShieldIcon />,
    },
  ];

  const innerBoxBg = isDarkMode ? theme.colors.pageBackground : "#eef2fb";
  const innerBoxStyle = {
    backgroundColor: innerBoxBg,
    borderRadius: theme.radius.md,
    padding: "12px",
  } as const;

  const percent = (v: number) =>
    total && total > 0 ? ((v / total) * 100).toFixed(1) : "0.0";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* 전체 앱 (그라디언트 카드) */}
      <div
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "20px 24px",
          borderRadius: theme.radius.md,
          color: "#ffffff",
          background: "linear-gradient(135deg, #4f6ee6 0%, #7a6ae8 100%)",
          boxShadow: theme.shadow.card,
          flexShrink: 0,
        }}
      >
        <div style={{ fontSize: theme.fontSize.lg, opacity: 0.9 }}>전체 앱</div>
        <div
          style={{
            fontSize: "42px",
            fontWeight: 800,
            lineHeight: 1.1,
            marginTop: "4px",
          }}
        >
          {total ?? "—"}
        </div>
        <div style={{ fontSize: theme.fontSize.base, opacity: 0.85 }}>전체</div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "20px",
            top: "50%",
            transform: "translateY(-50%)",
            width: "76px",
            height: "76px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <BigGridIcon />
        </div>
      </div>

      {/* 앱 상태 분포 (도넛 + 범례) */}
      <div
        style={{
          ...innerBoxStyle,
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <h4
          style={{
            margin: 0,
            marginBottom: "8px",
            fontSize: theme.fontSize.xl,
            fontWeight: 700,
            color: theme.colors.text,
            flexShrink: 0,
          }}
        >
          앱 상태 분포
        </h4>
        <div
          style={{
            flex: 1,
            minHeight: `${CHART_MIN_HEIGHT}px`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "4px 0 8px",
          }}
        >
          <DonutChart
            segments={segments}
            centerLabel={total ?? 0}
            centerSub="전체"
            theme={theme}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {segments.map((seg, i) => (
            <div
              key={seg.key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 4px",
                borderTop:
                  i === 0 ? "none" : `1px solid ${theme.colors.border}`,
                fontSize: theme.fontSize.base,
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: theme.colors.text,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    backgroundColor: seg.color,
                  }}
                />
                {seg.label}
              </span>
              <span>
                <span style={{ fontWeight: 700, color: seg.color }}>
                  {seg.value}
                </span>
                <span
                  style={{
                    marginLeft: "6px",
                    color: theme.colors.textMuted,
                  }}
                >
                  ({percent(seg.value)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Stat 리스트 */}
      <div style={{ ...innerBoxStyle, flexShrink: 0 }}>
        {segments.map((seg, i) => (
          <div
            key={seg.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 0",
              borderTop: i === 0 ? "none" : `1px solid ${theme.colors.border}`,
              color: theme.colors.text,
            }}
          >
            <span
              aria-hidden
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                backgroundColor: seg.tint,
                color: seg.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              {seg.icon}
            </span>
            <span style={{ display: "flex", flexDirection: "column", flex: 1 }}>
              <span
                style={{
                  fontSize: theme.fontSize.lg,
                  fontWeight: 700,
                  color: theme.colors.text,
                }}
              >
                {seg.label}
              </span>
              <span
                style={{
                  fontSize: theme.fontSize.sm,
                  color: theme.colors.textMuted,
                }}
              >
                {seg.description}
              </span>
            </span>
            <span
              style={{
                fontSize: theme.fontSize.xl,
                fontWeight: 700,
                color: seg.color,
              }}
            >
              {seg.value}
            </span>
          </div>
        ))}
      </div>

      {error && (
        <span
          style={{ fontSize: theme.fontSize.sm, color: theme.colors.danger }}
        >
          {error}
        </span>
      )}
    </div>
  );
}

function DonutChart({
  segments,
  centerLabel,
  centerSub,
  theme,
}: {
  segments: Segment[];
  centerLabel: number;
  centerSub: string;
  theme: Theme;
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 40;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minWidth: 0,
        minHeight: 0,
      }}
    >
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          display: "block",
          transform: "rotate(-90deg)",
        }}
      >
        <circle
          cx={50}
          cy={50}
          r={radius}
          fill="none"
          stroke={theme.colors.surfaceMuted}
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          segments.map((seg) => {
            const len = (seg.value / total) * circumference;
            const dashoffset = -offset;
            offset += len;
            return (
              <circle
                key={seg.key}
                cx={50}
                cy={50}
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${len} ${circumference - len}`}
                strokeDashoffset={dashoffset}
              />
            );
          })}
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        <span
          style={{
            fontSize: "28px",
            fontWeight: 800,
            color: theme.colors.text,
            lineHeight: 1,
          }}
        >
          {centerLabel}
        </span>
        <span
          style={{
            fontSize: theme.fontSize.sm,
            color: theme.colors.textMuted,
            marginTop: "4px",
          }}
        >
          {centerSub}
        </span>
      </div>
    </div>
  );
}

// ──── 인라인 아이콘 ────

function BigGridIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#ffffff"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function GridIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 3l8 3v6c0 5-3.5 8.5-8 9-4.5-.5-8-4-8-9V6l8-3z" />
      <line x1="9" y1="12" x2="15" y2="12" />
    </svg>
  );
}
