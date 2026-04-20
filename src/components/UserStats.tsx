import { useThemeStore } from '@common/stores/themeStore';
import { useEffect, useState } from 'react';
import { getUsers } from '../services/userService';

interface UserStatsProps {
  /** 값이 바뀌면 통계를 다시 가져온다 (예: 계정 삭제/상태 변경 후). */
  reloadKey?: number;
}

interface StatItem {
  label: string;
  value: number | null;
  accent: string;
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

  const items: StatItem[] = [
    { label: '전체 계정', value: total, accent: theme.colors.text },
    { label: '활성', value: active, accent: theme.colors.primary },
    { label: '승인 대기', value: pending, accent: theme.colors.warning },
    { label: '차단', value: blocked, accent: theme.colors.danger },
  ];

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
      {items.map((item) => (
        <div
          key={item.label}
          style={{
            flex: 1,
            minHeight: 0,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 16px',
            borderRadius: theme.radius.sm,
            border: `1px solid ${theme.colors.border}`,
            backgroundColor: theme.colors.pageBackground,
          }}
        >
          <span
            style={{
              fontSize: theme.fontSize.base,
              color: theme.colors.textMuted,
            }}
          >
            {item.label}
          </span>
          <span
            style={{
              fontSize: theme.fontSize.xxl,
              fontWeight: 700,
              color: item.accent,
            }}
          >
            {item.value ?? '—'}
          </span>
        </div>
      ))}
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
