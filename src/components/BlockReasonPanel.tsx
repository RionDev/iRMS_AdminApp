import { useThemeStore } from "@common/stores/themeStore";

interface BlockReasonPanelProps {
  /** `"{adminName}:{ISO time}:{reason}"` 포맷 문자열. UserForm 에서 저장한 형식. */
  raw: string;
}

interface ParsedReason {
  adminName: string;
  blockedAt: string | null;
  reason: string;
}

function parseBlockedReason(raw: string): ParsedReason {
  // "admin:ISO-with-colons:reason" 을 앞 두 구분자만으로 분할
  const first = raw.indexOf(":");
  if (first < 0) return { adminName: "", blockedAt: null, reason: raw };
  const second = raw.indexOf(":", first + 1);
  // ISO 8601 타임스탬프 안에 콜론이 더 있을 수 있으므로 "reason" 시작을 찾기 위해
  // 마지막 ISO 콜론 뒤(= 초 단위) 이후의 첫 콜론을 본문 시작으로 본다.
  if (second < 0) return { adminName: raw.slice(0, first), blockedAt: null, reason: raw.slice(first + 1) };
  const isoEnd = findIsoEnd(raw, first + 1);
  if (isoEnd < 0 || raw[isoEnd] !== ":") {
    return {
      adminName: raw.slice(0, first),
      blockedAt: null,
      reason: raw.slice(first + 1),
    };
  }
  return {
    adminName: raw.slice(0, first),
    blockedAt: raw.slice(first + 1, isoEnd),
    reason: raw.slice(isoEnd + 1),
  };
}

/** ISO 8601 문자열 끝 인덱스(= 다음 ':' 위치)를 찾는다. 실패 시 -1. */
function findIsoEnd(raw: string, start: number): number {
  // 최소 "YYYY-MM-DDTHH:MM:SS" = 19자. Z / offset / ms 는 선택.
  const iso = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?/;
  const match = raw.slice(start).match(iso);
  if (!match) return -1;
  return start + match[0].length;
}

function formatTimestamp(value: string | null): string {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString();
}

export function BlockReasonPanel({ raw }: BlockReasonPanelProps) {
  const { theme } = useThemeStore();
  const parsed = parseBlockedReason(raw);

  const rowStyle = {
    display: "flex",
    gap: "8px",
    marginBottom: "4px",
    fontSize: theme.fontSize.base,
    color: theme.colors.text,
  } as const;

  const labelStyle = {
    minWidth: "72px",
    color: theme.colors.textMuted,
  } as const;

  return (
    <div
      style={{
        padding: "12px 16px",
        marginBottom: "16px",
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surfaceMuted,
      }}
    >
      <div
        style={{
          fontSize: theme.fontSize.base,
          fontWeight: 600,
          color: theme.colors.danger,
          marginBottom: "8px",
        }}
      >
        차단 정보
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>차단자</span>
        <span>{parsed.adminName || "N/A"}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>차단 시각</span>
        <span>{formatTimestamp(parsed.blockedAt)}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>사유</span>
        <span style={{ wordBreak: "break-all" }}>{parsed.reason || "N/A"}</span>
      </div>
    </div>
  );
}
