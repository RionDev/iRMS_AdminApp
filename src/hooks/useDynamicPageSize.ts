import { type RefObject, useEffect, useState } from "react";

interface UseDynamicPageSizeOptions {
  /** 한 행의 대략적인 높이(px). */
  rowHeight: number;
  /** 테이블 바디 외 영역이 차지하는 예상 높이(px) — thead, pagination, padding 합계. */
  reservedHeight: number;
  /** 최소 페이지 크기. 기본 5. */
  minSize?: number;
  /** 측정 전 초기 페이지 크기. 기본 20. */
  initialSize?: number;
}

/**
 * 컨테이너 높이에 맞춰 한 페이지에 표시할 행 수를 계산한다.
 * 모니터 크기에 따라 테이블이 세로 공백 없이 꽉 차도록 `pageSize`를 동적으로 조정한다.
 */
export function useDynamicPageSize(
  containerRef: RefObject<HTMLElement | null>,
  {
    rowHeight,
    reservedHeight,
    minSize = 5,
    initialSize = 20,
  }: UseDynamicPageSizeOptions,
): number {
  const [size, setSize] = useState(initialSize);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const available = el.clientHeight - reservedHeight;
      const next = Math.max(minSize, Math.floor(available / rowHeight));
      setSize((prev) => (prev === next ? prev : next));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, rowHeight, reservedHeight, minSize]);

  return size;
}
