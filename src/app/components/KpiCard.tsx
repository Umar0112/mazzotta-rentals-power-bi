// ─── KpiCard ─────────────────────────────────────────────────────────────────
// Reusable KPI summary card matching the Figma design (BackgroundBorder.tsx).
// Renders two side-by-side panels inside a single white rounded card:
//   Left panel  → Today's reservations with Count + Units
//   Right panel → Next Work Day reservations with Count + Units

interface KpiPanelProps {
  title: string;
  count: number | string;
  units: number | string;
  /** Adds a left divider border (used for the right panel) */
  bordered?: boolean;
}

function KpiPanel({ title, count, units, bordered = false }: KpiPanelProps) {
  return (
    <div
      className="flex flex-[1_0_0] flex-col items-start min-w-0 relative self-stretch"
      style={bordered ? { borderLeft: "1px solid #e8edf3" } : undefined}
    >
      {/* Red header */}
      <div className="bg-[#c72e23] relative shrink-0 w-full">
        {bordered && (
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ borderLeft: "1px solid rgba(255,255,255,0.25)" }}
          />
        )}
        <div className="flex flex-col items-center px-4 py-[10px] w-full">
          <span
            className="text-white text-center whitespace-nowrap"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(11px, 1.1vw, 16px)",
              lineHeight: "24px",
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
          {/* Label */}
          <div
            className="h-[33px] relative w-full flex flex-col items-center justify-center"
            style={{ borderBottom: "1px solid #e8edf3" }}
          >
            <span
              className="text-[#475569] whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                lineHeight: "19.5px",
              }}
            >
              Count
            </span>
          </div>
          {/* Value */}
          <div className="h-[40px] w-full flex flex-col items-center justify-center px-2 py-[6px]">
            <span
              className="text-[#1a1a1a] text-center whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "28px",
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
          {/* Label */}
          <div
            className="h-[33px] relative w-full flex flex-col items-center justify-center"
            style={{ borderBottom: "1px solid #e8edf3" }}
          >
            <span
              className="text-[#475569] whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "13px",
                lineHeight: "19.5px",
              }}
            >
              Units
            </span>
          </div>
          {/* Value */}
          <div
            className="h-[40px] w-full flex flex-col items-center justify-center px-2 py-[6px]"
          >
            <span
              className="text-[#1a1a1a] text-center whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "20px",
                lineHeight: "28px",
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
  /** Label + date for the left (Today) panel, e.g. "Reservations Today - All Locations (04/14/2026)" */
  todayTitle: string;
  todayCount: number | string;
  todayUnits: number | string;
  /** Label + date for the right (Next Work Day) panel */
  nextDayTitle: string;
  nextDayCount: number | string;
  nextDayUnits: number | string;
}

// ─── KpiCard (the exported component) ────────────────────────────────────────
export function KpiCard({
  todayTitle,
  todayCount,
  todayUnits,
  nextDayTitle,
  nextDayCount,
  nextDayUnits,
}: KpiCardProps) {
  return (
    <div className="bg-white relative rounded-[12px] w-full" data-name="KpiCard">
      {/* Overflow clip keeps panels inside the rounded corners */}
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
        </div>
      </div>
      {/* Border + shadow overlay */}
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
