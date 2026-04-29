// ─── KpiCard ─────────────────────────────────────────────────────────────────
// Reusable KPI summary card matching the Figma design (BackgroundBorder.tsx).
// Renders two side-by-side panels inside a single white rounded card:
//   Left panel  → Today's reservations with Count + Units
//   Right panel → Next Work Day reservations with Count + Units

interface KpiPanelProps {
  title: string;
  count: number | string;
  units: number | string;
  /** Adds a left divider border (used for panels after the first) */
  bordered?: boolean;
  headerColor?: string;
}

function KpiPanel({ title, count, units, bordered = false, headerColor = "#c72e23" }: KpiPanelProps) {
  return (
    <div
      className="flex flex-[1_0_0] flex-col items-start min-w-0 relative self-stretch"
      style={bordered ? { borderLeft: "1px solid #e8edf3" } : undefined}
    >
      {/* Header */}
      <div className="relative shrink-0 w-full" style={{ backgroundColor: headerColor }}>
        {bordered && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.25)" }}
          />
        )}
        <div className="flex flex-col items-center px-4 py-[12px] w-full">
          <span
            className="text-white text-center whitespace-nowrap"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(13px, 1.3vw, 19px)",
              lineHeight: "28px",
            }}
          >
            {title}
          </span>
        </div>
      </div>

      {/* Count | Units row */}
      <div className="flex items-stretch w-full">
        {/* Count column */}
        <div className="flex flex-[1_0_0] flex-col items-start min-w-0">
          <div
            className="h-[40px] relative w-full flex flex-col items-center justify-center"
            style={{ borderBottom: "1px solid #e8edf3" }}
          >
            <span
              className="text-[#475569] whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: "22px",
              }}
            >
              Count
            </span>
          </div>
          <div className="h-[50px] w-full flex flex-col items-center justify-center px-2 py-[8px]">
            <span
              className="text-[#1a1a1a] text-center whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "34px",
              }}
            >
              {count}
            </span>
          </div>
        </div>

        {/* Units column */}
        <div
          className="flex flex-[1_0_0] flex-col items-start min-w-0"
          style={{ borderLeft: "1px solid #e8edf3" }}
        >
          <div
            className="h-[40px] relative w-full flex flex-col items-center justify-center"
            style={{ borderBottom: "1px solid #e8edf3" }}
          >
            <span
              className="text-[#475569] whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "15px",
                lineHeight: "22px",
              }}
            >
              Units
            </span>
          </div>
          <div
            className="h-[50px] w-full flex flex-col items-center justify-center px-2 py-[8px]"
          >
            <span
              className="text-[#1a1a1a] text-center whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "24px",
                lineHeight: "34px",
              }}
            >
              {units}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────
export interface KpiCardProps {
  /** Label + date for the left panel */
  todayTitle: string;
  todayCount: number | string;
  todayUnits: number | string;
  /** Label + date for the middle panel */
  nextDayTitle: string;
  nextDayCount: number | string;
  nextDayUnits: number | string;
  /** Optional Label + date for the third panel */
  totalTitle?: string;
  totalCount?: number | string;
  totalUnits?: number | string;
}

// ─── KpiCard (the exported component) ────────────────────────────────────────
export function KpiCard({
  todayTitle,
  todayCount,
  todayUnits,
  nextDayTitle,
  nextDayCount,
  nextDayUnits,
  totalTitle,
  totalCount,
  totalUnits,
}: KpiCardProps) {
  return (
    <div className="bg-white relative rounded-[12px] w-full" data-name="KpiCard">
      <div className="overflow-clip rounded-[inherit] w-full">
        <div className="flex items-start w-full">
          <KpiPanel
            title={todayTitle}
            count={todayCount}
            units={todayUnits}
          />
          <KpiPanel
            title={nextDayTitle}
            count={nextDayCount}
            units={nextDayUnits}
            bordered
          />
          {totalTitle !== undefined && (
            <KpiPanel
              title={totalTitle}
              count={totalCount ?? 0}
              units={totalUnits ?? 0}
              bordered
            />
          )}
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none rounded-[12px]"
        style={{
          border: "1px solid rgba(226,232,240,0.8)",
          boxShadow:
            "0px 1px 3px 0px rgba(0,0,0,0.04), 0px 1px 2px -1px rgba(0,0,0,0.04)",
        }}
      />
    </div>
  );
}
