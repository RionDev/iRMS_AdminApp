import { Button } from "@common/components/Button";
import { useThemeStore } from "@common/stores/themeStore";
import { TEAM_OPTIONS } from "@common/types/constants";
import { useEffect, useState } from "react";
import { getAppFeatures, updateAppFeature } from "../services/appService";
import { TEAM_FULL, type AppFeature, type AppTeam } from "../types/app";

/** 기능 최소 등급 options. 1:ADMIN … 4:GUEST(전체) */
const MIN_ROLE_OPTIONS: ReadonlyArray<{ value: string; label: string }> = [
  { value: "1", label: "관리자 이상" },
  { value: "2", label: "리드 이상" },
  { value: "3", label: "멤버 이상" },
  { value: "4", label: "전체" },
];

interface AppFeatureListProps {
  appIdx: number;
}

/**
 * 앱 안의 기능(API 묶음)별 권한 편집.
 * 기능 목록은 BE 서비스 코드가 정하므로 여기선 최소 등급·허용 팀만 바꾼다.
 * JWT·API 키 모두 저장 즉시 반영된다.
 */
export function AppFeatureList({ appIdx }: AppFeatureListProps) {
  const { theme } = useThemeStore();
  const [features, setFeatures] = useState<AppFeature[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setFeatures(null);
    setError(null);
    getAppFeatures(appIdx)
      .then((list) => {
        if (active) setFeatures(list);
      })
      .catch(() => {
        if (active) setError("기능 목록을 불러오지 못했습니다.");
      });
    return () => {
      active = false;
    };
  }, [appIdx]);

  const handleSaved = (updated: AppFeature) => {
    setFeatures((prev) => prev?.map((f) => (f.idx === updated.idx ? updated : f)) ?? null);
  };

  const mutedStyle = { fontSize: theme.fontSize.sm, color: theme.colors.textMuted } as const;

  return (
    <section style={{ marginTop: "28px" }}>
      <h3 style={{ margin: "0 0 4px", fontSize: theme.fontSize.lg, color: theme.colors.text }}>
        기능 권한
      </h3>
      <p style={{ ...mutedStyle, margin: "0 0 12px" }}>
        앱에 들어올 수 있는 사용자 중에서 기능별로 다시 제한합니다. 로그인(JWT)과 API 키 모두 같은 규칙이 바로
        적용됩니다. 새로 추가된 기능은 열어 주기 전까지 관리자만 쓸 수 있습니다.
      </p>
      {error && <p style={{ ...mutedStyle, color: theme.colors.danger }}>{error}</p>}
      {!error && features === null && <p style={mutedStyle}>불러오는 중...</p>}
      {features !== null && features.length === 0 && (
        <p style={mutedStyle}>이 앱에 등록된 기능이 없습니다.</p>
      )}
      {features?.map((f) => (
        <FeatureRow key={f.idx} feature={f} onSaved={handleSaved} />
      ))}
    </section>
  );
}

function FeatureRow({
  feature,
  onSaved,
}: {
  feature: AppFeature;
  onSaved: (updated: AppFeature) => void;
}) {
  const { theme } = useThemeStore();
  const [minRole, setMinRole] = useState(String(feature.min_role));
  const [team, setTeam] = useState<AppTeam>(feature.team);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMinRole(String(feature.min_role));
    setTeam(feature.team);
  }, [feature]);

  const isDirty = minRole !== String(feature.min_role) || team !== feature.team;

  const handleSave = async () => {
    if (!isDirty || saving) return;
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateAppFeature(feature.idx, { min_role: Number(minRole), team });
      onSaved(updated);
      setSaved(true);
    } catch {
      // interceptor 가 처리 — 값은 그대로 두어 다시 시도할 수 있게 한다
    } finally {
      setSaving(false);
    }
  };

  const selectStyle = {
    flex: 1,
    minWidth: 0,
    padding: "6px 8px",
    borderRadius: theme.radius.sm,
    border: `1px solid ${theme.colors.border}`,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize.sm,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  } as const;

  return (
    <div
      style={{
        padding: "10px 12px",
        marginBottom: "8px",
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.border}`,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "8px" }}>
        <span style={{ fontSize: theme.fontSize.base, fontWeight: 700, color: theme.colors.text }}>
          {feature.name}
        </span>
        <code style={{ fontSize: theme.fontSize.sm, color: theme.colors.textMuted }}>
          {feature.feature_key}
        </code>
        {saved && !isDirty && (
          <span style={{ marginLeft: "auto", fontSize: theme.fontSize.sm, color: theme.colors.success }}>
            저장됨
          </span>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <select
          aria-label={`${feature.name} 최소 등급`}
          value={minRole}
          onChange={(e) => {
            setMinRole(e.target.value);
            setSaved(false);
          }}
          style={selectStyle}
        >
          {MIN_ROLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          aria-label={`${feature.name} 허용 팀`}
          value={team}
          onChange={(e) => {
            setTeam(e.target.value as AppTeam);
            setSaved(false);
          }}
          style={selectStyle}
        >
          <option value={TEAM_FULL}>전체 팀</option>
          {TEAM_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <Button onClick={handleSave} disabled={!isDirty || saving}>
          {saving ? "저장 중..." : "저장"}
        </Button>
      </div>
    </div>
  );
}
