// ─── KpiCard ─────────────────────────────────────────────────────────────────
// Reusable KPI summary card matching the Figma design (BackgroundBorder.tsx).
// Renders two side-by-side panels inside a single white rounded card:
//   Left panel  → Today's reservations with Count + Units
//   Right panel → Next Work Day reservations with Count + Units

interface KpiPanelProps {
  title: string;
  date?: string;
  count: number | string;
  units: number | string;
  /** Adds a left divider border (used for panels after the first) */
  bordered?: boolean;
  headerColor?: string;
}

function KpiPanel({ title, date, count, units, bordered = false, headerColor = "#c72e23" }: KpiPanelProps) {
  return (
    <div
      className="flex flex-[1_0_0] flex-col items-start min-w-0 relative self-stretch"
      style={bordered ? { borderLeft: "1px solid black" } : undefined}
    >
      {/* Header */}
      <div className="relative shrink-0 w-full border-b border-black" style={{ backgroundColor: headerColor }}>
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{ borderBottom: "1px solid black" }}
        />
        <div className="flex flex-col items-center px-4 py-[5px] w-full h-[64px]">
          <span
            className="text-white text-center whitespace-nowrap"
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 700,
              fontSize: "clamp(13px, 1.3vw, 22px)",
              lineHeight: "28px",
            }}
          >
            {title}
          </span>
          <span className="text-white" style={{
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            fontSize: "clamp(13px, 1.3vw, 22px)",
            lineHeight: "28px",
          }}>{date}</span>
        </div>
      </div>

      {/* Count | Units row */}
      <div className="flex items-stretch w-full">
        {/* Count column */}
        <div className="flex flex-[1_0_0] flex-col items-start min-w-0">
          <div
            className="h-[30px] relative w-full flex flex-col items-center justify-center"
            style={{ borderBottom: "1px solid black" }}
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
          <div className="h-[38px] w-full flex flex-col items-center justify-center px-2 py-[3px]">
            <span
              className="text-[#1a1a1a] text-center whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "34px",
              }}
            >
              {count !== 0 ? count : "Completed"}
            </span>
          </div>
        </div>

        {/* Units column */}
        <div
          className="flex flex-[1_0_0] flex-col items-start min-w-0"
          style={{ borderLeft: "1px solid black" }}
        >
          <div
            className="h-[30px] relative w-full flex flex-col items-center justify-center"
            style={{ borderBottom: "1px solid black" }}
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
            className="h-[38px] w-full flex flex-col items-center justify-center px-2 py-[8px]"
          >
            <span
              className="text-[#1a1a1a] text-center whitespace-nowrap"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 600,
                fontSize: "24px",
                lineHeight: "34px",
              }}
            >
              {units !== 0 ? units : "Completed"}
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
  todayDate: string;
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
  todayDate,
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
    <div className="bg-white relative w-full border-b border-r border-black" data-name="KpiCard">
      <div className="overflow-clip w-full">
        <div className="flex items-start w-full">
          <KpiPanel
            title={todayTitle}
            date={todayDate}
            count={todayCount}
            units={todayUnits}
            bordered
          />
          <KpiPanel
            title={nextDayTitle}
            date={todayDate}
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
    </div>
  );
}
