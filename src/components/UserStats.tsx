import { useThemeStore } from '@common/stores/themeStore';
import { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';

interface UserStatsProps {
  /** 값이 바뀌면 통계를 다시 가져온다 (예: 계정 삭제/상태 변경 후). */
  reloadKey?: number;
}

interface Segment {
  label: string;
  value: number;
  color: string;
}

export function UserStats({ reloadKey }: UserStatsProps) {
  const { theme } = useThemeStore();
  const [total, setTotal] = useState<number | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [pending, setPending] = useState<number | null>(null);
  const [blocked, setBlocked] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setError(null);
    const fetchTotal = (status: string[] | undefined) =>
      getUsers({ status }, undefined, undefined, 1).then((p) => p.total);

    Promise.all([
      fetchTotal(undefined),
      fetchTotal(['ACTIVE']),
      fetchTotal(['PENDING']),
      fetchTotal(['INACTIVE']),
    ])
      .then(([t, a, p, b]) => {
        if (!mounted) return;
        setTotal(t);
        setActive(a);
        setPending(p);
        setBlocked(b);
      })
      .catch(() => {
        if (!mounted) return;
        setError('통계를 불러오지 못했습니다');
      });

    return () => {
      mounted = false;
    };
  }, [reloadKey]);

  const segments: Segment[] = [
    { label: '활성', value: active ?? 0, color: theme.colors.primary },
    { label: '승인 대기', value: pending ?? 0, color: theme.colors.warning },
    { label: '차단', value: blocked ?? 0, color: theme.colors.danger },
  ];

  const blockStyle = {
    padding: '12px 16px',
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    backgroundColor: theme.colors.pageBackground,
  } as const;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
        minHeight: 0,
      }}
    >
      {/* 도넛 차트: 활성/대기/차단 비율 */}
      <div
        style={{
          ...blockStyle,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          minHeight: 0,
        }}
      >
        <DonutChart
          segments={segments}
          centerLabel={total ?? 0}
          centerSub="전체"
          theme={theme}
        />
      </div>

      {/* 전체 계정 요약 (차트 밑) */}
      <div
        style={{
          ...blockStyle,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontSize: theme.fontSize.base,
            color: theme.colors.textMuted,
          }}
        >
          전체 계정
        </span>
        <span
          style={{
            fontSize: theme.fontSize.xxl,
            fontWeight: 700,
            color: theme.colors.text,
          }}
        >
          {total ?? '—'}
        </span>
      </div>

      {/* 활성/대기/차단 stat 리스트 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {segments.map((seg) => (
          <div
            key={seg.label}
            style={{
              ...blockStyle,
              padding: '8px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: theme.fontSize.base,
                color: theme.colors.textMuted,
              }}
            >
              <span
                aria-hidden
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: seg.color,
                }}
              />
              {seg.label}
            </span>
            <span
              style={{
                fontSize: theme.fontSize.lg,
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
          style={{
            fontSize: theme.fontSize.sm,
            color: theme.colors.danger,
          }}
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
  theme: ReturnType<typeof useThemeStore>['theme'];
}) {
  const total = segments.reduce((s, seg) => s + seg.value, 0);
  const radius = 40;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '180px',
        aspectRatio: '1 / 1',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        width="100%"
        height="100%"
        style={{ transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={50}
          cy={50}
          r={radius}
          fill="none"
          stroke={theme.colors.border}
          strokeWidth={strokeWidth}
        />
        {total > 0 &&
          segments.map((seg) => {
            const len = (seg.value / total) * circumference;
            const dashoffset = -offset;
            offset += len;
            return (
              <circle
                key={seg.label}
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
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            fontSize: theme.fontSize.xxl,
            fontWeight: 700,
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
            marginTop: '4px',
          }}
        >
          {centerSub}
        </span>
      </div>
    </div>
  );
}
