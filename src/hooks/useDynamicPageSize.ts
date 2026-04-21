import { type RefObject, useEffect, useState } from "react";

interface UseDynamicPageSizeOptions {
  /** 행 높이의 fallback 추정값(px). 실제 tbody 첫 행을 측정하지 못했을 때만 쓴다. */
  rowHeight: number;
  /**
   * 테이블 바디 외 영역이 차지하는 예상 높이(px) — thead, pagination, padding 합계.
   * 컨테이너 안의 `[data-row-reserved]` 요소들을 측정해 덮어쓸 수도 있다.
   */
  reservedHeight: number;
  /** 최소 페이지 크기. 기본 5. */
  minSize?: number;
  /** 측정 전 초기 페이지 크기. 기본 20. */
  initialSize?: number;
}

/**
 * 컨테이너 높이에 맞춰 한 페이지에 표시할 행 수를 계산한다.
 *
 * 실제 DOM의 thead, tbody 첫 행, 페이지네이션 높이를 측정해
 * 모니터 크기에 따라 테이블이 세로 공백 없이 꽉 차도록 `pageSize`를 동적으로 조정한다.
 * 실측이 어려울 때 props의 `rowHeight` / `reservedHeight` 를 fallback 으로 사용한다.
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
      const style = window.getComputedStyle(el);
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

      const thead = el.querySelector("thead");
      const theadH = thead?.getBoundingClientRect().height ?? 0;

      const firstRow = el.querySelector("tbody tr");
      const measuredRowH = firstRow?.getBoundingClientRect().height ?? 0;
      const effectiveRowH = measuredRowH > 0 ? measuredRowH : rowHeight;

      // pagination (또는 컨테이너 하단 고정 영역) — 테이블 뒤쪽 형제 전부 합산.
      const tableEl = el.querySelector("table");
      let trailingH = 0;
      if (tableEl) {
        let sib = tableEl.nextElementSibling as HTMLElement | null;
        while (sib) {
          trailingH += sib.getBoundingClientRect().height;
          sib = sib.nextElementSibling as HTMLElement | null;
        }
      }

      const measuredReserved = paddingY + theadH + trailingH;
      const effectiveReserved =
        measuredReserved > 0 ? measuredReserved : reservedHeight;

      const available = el.clientHeight - effectiveReserved;
      const next = Math.max(minSize, Math.floor(available / effectiveRowH));
      setSize((prev) => (prev === next ? prev : next));
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [containerRef, rowHeight, reservedHeight, minSize]);

  return size;
}
