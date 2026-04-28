import { useState, useEffect, useMemo } from 'react';
import svgPaths from "./svg-uvl1ln4px5";
import mazzottaLogo from "./mazzotta-logo.png";
import { Sidebar as CollapsibleSidebar } from "./Sidebar";
import { KpiCard } from "../app/components/KpiCard";
import { authService } from '../services/authService/authService';
import { useParams, useLocation } from 'react-router';
import Eyeball from '../app/components/Eyeball';
import ReservationAndContractView from '../app/components/ReservationAndContractView';
import LocationReservationView from '../app/components/LocationReservationView';

const formatApiDate = (dateStr: string) => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = dateStr.substring(2, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${month}/${day}/${year}`;
};

const GenericTable = ({ data, headers }: { data: any[]; headers?: string[] }) => {
  if (!data || data.length === 0) return (
    <div className="p-8 text-center text-gray-400 font-['Inter',sans-serif]">No reservations found.</div>
  );

  const tableHeaders = headers || (data.length > 0 ? Object.keys(data[0]) : []);

  return (
    <div className="flex-1 overflow-auto relative w-full no-scrollbar" data-name="GenericTable">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <table className="w-full border-collapse" style={{ minWidth: '900px' }}>
        <thead className="sticky top-0 z-10">
          <tr className="bg-[#f8fafc] shadow-[0_1px_0_0_#f1f5f9]">
            {tableHeaders.map((h, i) => (
              <th key={i} className={`px-[12px] py-[10px] font-['Inter:Bold',sans-serif] font-bold text-[12px] text-[#94a3b8] tracking-[0.7px] uppercase whitespace-nowrap ${['Units', 'Rental Days', 'UNITS', 'DAYS'].includes(h) ? 'text-center' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${rowIndex % 2 === 1 ? 'bg-[#fafafa]' : 'bg-white'} border-b border-[#f8fafc] hover:bg-slate-50 transition-colors`} style={{ height: '60px' }}>
              {tableHeaders.map((h, colIndex) => {
                const rawValue = row[h];
                const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
                const isItemNum = h.toLowerCase().includes('item#');
                const isRep = h === 'REP';
                const isNotes = h.toLowerCase() === 'notes';
                const isOut = h === 'OUT' || h === 'Rental Days';

                return (
                  <td key={colIndex} className={`px-[12px] py-[8px] whitespace-nowrap ${['Units', 'Rental Days', 'UNITS', 'DAYS'].includes(h) ? 'text-center' : ''}`}>
                    {isItemNum && (value === null || value === '') ? (
                      <span className="inline-flex items-center bg-[#fef2f2] border border-[#fecaca] rounded-[4px] px-[5px] py-[1px] font-['Inter:Bold',sans-serif] font-bold text-[12px] text-[#c72e23] whitespace-nowrap">OPEN</span>
                    ) : isRep ? (
                      <span className="inline-flex items-center bg-[#f1f5f9] rounded-[4px] px-[5px] py-[1px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[12px] text-[#334155] whitespace-nowrap">{value}</span>
                    ) : isNotes ? (
                      <span
                        className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[#475569]"
                        title={value?.toString()}
                      >
                        {value && value.toString().length > 50
                          ? `${value.toString().substring(0, 50)}...`
                          : (value ?? '—')}
                      </span>
                    ) : (
                      <span className={`font-['Inter:Medium',sans-serif] font-medium text-[13px] ${isRep ? 'text-[#334155]' : 'text-[#0f172a]'}`}>
                        {isOut && value && value.toString().length === 8 ? formatApiDate(value.toString()) : (value ?? '—')}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DynamicReservationTable = ({ title, date, data, headers }: { title: string; date: string; data: any[]; headers?: string[] }) => {
  const openItems = (data || []).filter(item => {
    const itemKey = Object.keys(item).find(k => k.toLowerCase().includes('item#'));
    if (!itemKey) return false;
    const val = item[itemKey];
    return val === null || (typeof val === 'string' && val.trim() === '');
  }).length;

  return (
    <div className="bg-white flex-1 min-h-0 flex flex-col rounded-[16px] relative overflow-hidden ring-1 ring-slate-200/50 shadow-sm" data-name="TableCard">
      <div className="h-[68px] relative shrink-0 w-full border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between h-full px-[20px]">
          <div className="flex items-center gap-[12px]">
            <div className={`h-[20px] rounded-full shrink-0 w-[4px] ${title.includes('Today') ? 'bg-[#c72e23]' : 'bg-[#1d50ad]'}`} />
            <div className="flex flex-col">
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[17px] text-[#0f172a] leading-tight">{title}</span>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#94a3b8]">{date}</span>
            </div>
            <div className="bg-[#f1f5f9] px-[8px] py-[2px] rounded-[6px] ml-1">
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#64748b]">{data.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            {openItems > 0 && (
              <div className="bg-[#fef2f2] border border-[#fecaca] px-[9px] py-[3px] rounded-[6px]">
                <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#c72e23]">{openItems} OPEN</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 opacity-80">
              <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#c72e23]">All up to date</span>
              <svg className="size-3.5 text-[#c72e23]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <GenericTable data={data} headers={headers} />
      </div>
    </div>
  );
};
;


function Icon() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p17c05080} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 3V12" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button({ onClick }: { onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle sidebar"
      className="relative rounded-[10px] shrink-0 size-[34px] hover:bg-[#F1F5F9] transition-colors cursor-pointer"
      data-name="Button"
    >
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9.5px] relative size-full">
        <Icon />
      </div>
    </button>
  );
}

function Icon1() {
  return (
    <div className="relative shrink-0 size-[15px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15 15">
        <g id="Icon">
          <path d={svgPaths.p2d0efb00} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p211b2c80} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p19025a00} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3d1c9500} id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div className="flex-[1_0_0] h-[34px] min-h-px min-w-px relative rounded-[10px]" data-name="Button">
      <div className="flex flex-row items-center justify-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[9.5px] relative size-full">
          <Icon1 />
        </div>
      </div>
    </div>
  );
}

function Container1({ onToggle }: { onToggle?: () => void }) {
  return (
    <div className="h-[34px] relative shrink-0 w-[74px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[6px] items-center relative size-full">
        <Button onClick={onToggle} />
        <Button1 />
      </div>
    </div>
  );
}

function Icon2() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p137c7200} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p254f3200} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button2() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] rounded-[10px] size-[34px]" data-name="Button">
      <Icon2 />
    </div>
  );
}

function Icon3() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p1c7ad000} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M5.25 7.5L9 11.25L12.75 7.5" id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 11.25V2.25" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button3() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] rounded-[10px] size-[34px]" data-name="Button">
      <Icon3 />
    </div>
  );
}

function Icon4() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_655)" id="Icon">
          <path d={svgPaths.p3dc49580} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3a62000} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M9 12.75H9.0075" id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_655">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Button4() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] rounded-[10px] size-[34px]" data-name="Button">
      <Icon4 />
    </div>
  );
}

function Icon5() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p2496bc40} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2f977180} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p32338200} id="Vector_3" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p144b9900} id="Vector_4" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2afac798} id="Vector_5" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div className="content-stretch flex items-center justify-center px-[8px] rounded-[10px] size-[34px]" data-name="Button">
      <Icon5 />
    </div>
  );
}

function Container3() {
  return <div className="bg-[rgba(216,224,236,0.6)] h-[20px] w-px mx-2" data-name="Container" />;
}

function Text() {
  return (
    <div className="h-[11px] relative shrink-0 w-[17.484px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="-translate-x-1/2 absolute font-['Inter:Bold',sans-serif] font-bold leading-[11px] left-[9px] not-italic text-[11px] text-center text-white top-[-1px] whitespace-nowrap">MR</p>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="bg-[#c72e23] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[7.25px] pr-[7.266px] relative size-full">
        <Text />
      </div>
    </div>
  );
}

function Text1() {
  return (
    <div className="shrink-0" data-name="Text">
      <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic text-[#475569] text-[13px] whitespace-nowrap">Manager</p>
    </div>
  );
}

function Icon6() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d="M3.5 5.25L7 8.75L10.5 5.25" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button6() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div className="relative">
      <div
        className="flex gap-[8px] h-[44px] items-center px-[8px] py-[6px] rounded-[10px] cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        data-name="Button"
      >
        <Container4 />
        <Text1 />
        <Icon6 />
      </div>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors text-left"
          >
            <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

function Icon7() {
  return (
    <div className="absolute left-[8px] size-[18px] top-[8px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p985d280} id="Vector" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p2ac55e70} id="Vector_2" stroke="var(--stroke-0, #64748B)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Text2() {
  return (
    <div className="absolute bg-[#c72e23] content-stretch flex items-center justify-center left-[14px] px-[3px] rounded-[33554400px] size-[16px] top-[5px]" data-name="Text">
      <p className="font-['Inter:Bold',sans-serif] font-bold leading-[9px] not-italic relative shrink-0 text-[9px] text-center text-white whitespace-nowrap">17</p>
    </div>
  );
}

function Button7() {
  return (
    <div className="relative rounded-[10px] size-[34px]" data-name="Button">
      <Icon7 />
      <Text2 />
    </div>
  );
}

function Container2() {
  return (
    <div className="flex items-center gap-0 h-[44px]" data-name="Container">
      {/* Hidden Notification, Download, and Settings icons as requested */}
      {/* <Button7 /> */}
      {/* <Button2 /> */}
      {/* <Button3 /> */}
      {/* <Button4 /> */}
      {/* <Button5 /> */}
      <Container3 />
      <Button6 />
    </div>
  );
}

function EditButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex items-center gap-2 px-4 py-2 bg-[#c72e23] text-white rounded-lg hover:bg-[#a82519] active:scale-95 transition-all">
      <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
      <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-sm">Edit</span>
    </button>
  );
}

function FullscreenButton({ onClick, isFullscreen }: { onClick: () => void; isFullscreen: boolean }) {
  return (
    <button
      onClick={onClick}
      title={isFullscreen ? 'Exit Fullscreen (Esc)' : 'Enter Fullscreen'}
      className="flex items-center justify-center size-[34px] rounded-lg border border-[#e2e8f0] bg-white text-[#475569] hover:bg-[#f1f5f9] active:scale-95 transition-all"
    >
      {isFullscreen ? (
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 15v4.5M9 15H4.5M15 9h4.5M15 9V4.5M15 15h4.5M15 15v4.5" />
        </svg>
      ) : (
        <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        </svg>
      )}
    </button>
  );
}

function TopHeader({ onEditClick, onMenuClick, onToggle, onFullscreen, isFullscreen }: { onEditClick: () => void; onMenuClick: () => void; onToggle?: () => void; onFullscreen: () => void; isFullscreen: boolean }) {
  if (isFullscreen) return null;
  return (
    <div className="absolute bg-white h-[60px] left-0 pb-px px-[20px] top-0 w-full flex items-center justify-between z-10" data-name="TopHeader">
      <div aria-hidden="true" className="absolute border-[rgba(216,224,236,0.4)] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex items-center gap-2">
        <MobileMenuButton onClick={onMenuClick} />
        <Container1 onToggle={onToggle} />
      </div>
      <div className="flex items-center gap-3 relative">
        <FullscreenButton onClick={onFullscreen} isFullscreen={isFullscreen} />
        {/* <EditButton onClick={onEditClick} /> */}
        <Container2 />
      </div>
    </div>
  );
}



function KpiTiles({ todayCount, nextDayCount, todayUnits, nextDayUnits }: { todayCount: number; nextDayCount: number; todayUnits: number; nextDayUnits: number }) {
  return (
    <div className="relative shrink-0 w-full" data-name="KPITiles">
      <KpiCard
        todayTitle="Reservations Today - All Locations"
        todayCount={todayCount}
        todayUnits={todayUnits}
        nextDayTitle="Reservations Next Work Day - All Locations"
        nextDayCount={nextDayCount}
        nextDayUnits={nextDayUnits}
      />
    </div>
  );
}

function Container21() {
  return <div className="bg-[#c72e23] h-[20px] rounded-[33554400px] shrink-0 w-[4px]" data-name="Container" />;
}

function Container22() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] left-0 not-italic text-[#0f172a] text-[0px] top-[3px] whitespace-nowrap">
          <span className="leading-[20px] text-[14px]">{`Today's Reservations`}</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] text-[#94a3b8] text-[12px]">All Locations · 04/14/2026</span>
        </p>
      </div>
    </div>
  );
}

function Text3() {
  return (
    <div className="bg-[#f1f5f9] h-[20px] relative rounded-[6px] shrink-0 w-[23.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] py-[2px] relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">6</p>
      </div>
    </div>
  );
}

function Container20() {
  return (
    <div className="h-[24px] relative shrink-0 w-[354.438px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container21 />
        <Container22 />
        <Text3 />
      </div>
    </div>
  );
}

function Text4() {
  return (
    <div className="bg-[#fef2f2] h-[22px] relative rounded-[6px] shrink-0 w-[58.203px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[#fecaca] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[9px] py-[3px] relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#c72e23] text-[11px] whitespace-nowrap">2 OPEN</p>
      </div>
    </div>
  );
}

function Text5() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#c72e23] text-[12px] text-center whitespace-nowrap">All up to date</p>
      </div>
    </div>
  );
}

function Icon12() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p33b0c200} id="Vector" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p22ad4980} id="Vector_2" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text5 />
        <Icon12 />
      </div>
    </div>
  );
}

function Container23() {
  return (
    <div className="h-[22px] relative shrink-0 w-[159.469px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text4 />
        <Button8 />
      </div>
    </div>
  );
}

function Container19() {
  return (
    <div className="h-[57px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f1f5f9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[20px] relative size-full">
          <Container20 />
          <Container23 />
        </div>
      </div>
    </div>
  );
}

function TableRow() {
  return (
    <div className="absolute bg-[#f8fafc] border-[#f1f5f9] border-b border-solid font-['Inter:Bold',sans-serif] font-bold h-[34.5px] leading-[14px] left-0 not-italic text-[#94a3b8] text-[10px] top-0 tracking-[0.7px] w-[1279px] whitespace-nowrap" data-name="Table Row">
      <p className="absolute left-[16px] top-[10px]">WHAT</p>
      <p className="absolute left-[228.63px] top-[10px]">RESV# — CUSTOMER</p>
      <p className="absolute left-[494.41px] top-[10px]">ITEM#</p>
      <p className="absolute left-[600.72px] top-[10px]">WHERE</p>
      <p className="absolute left-[733.61px] top-[10px]">REP</p>
      <p className="absolute left-[827.25px] top-[10px]">OUT</p>
      <p className="absolute left-[938.05px] top-[10px]">UNITS</p>
      <p className="absolute left-[1026.31px] top-[10px]">DAYS</p>
      <p className="absolute left-[1108.89px] top-[10px]">NOTES</p>
    </div>
  );
}

function TableCell() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.625px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Aerial Lift 40ft</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.625px]">AL-1042</p>
    </div>
  );
}

function TableCell1() {
  return (
    <div className="absolute h-[58px] left-[212.63px] not-italic top-0 w-[265.781px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Bridgeton Construction</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.781px]">R-88231 · C-1041</p>
    </div>
  );
}

function TableCell2() {
  return (
    <div className="absolute h-[58px] left-[478.41px] top-0 w-[106.313px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5501</p>
    </div>
  );
}

function TableCell3() {
  return (
    <div className="absolute h-[58px] left-[584.72px] top-0 w-[132.891px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0001</p>
    </div>
  );
}

function Text6() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[733.61px] rounded-[6px] top-[21px] w-[38.469px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">JDM</p>
    </div>
  );
}

function TableCell4() {
  return (
    <div className="absolute h-[58px] left-[811.25px] top-0 w-[110.797px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/14/26</p>
    </div>
  );
}

function TableCell5() {
  return (
    <div className="absolute h-[58px] left-[922.05px] top-0 w-[88.266px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.88px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell6() {
  return (
    <div className="absolute h-[58px] left-[1010.31px] top-0 w-[82.578px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.58px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">3</p>
    </div>
  );
}

function TableCell7() {
  return (
    <div className="absolute h-[58px] left-[1092.89px] top-0 w-[186.109px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">Deliver by 8am</p>
    </div>
  );
}

function TableRow1() {
  return (
    <div className="absolute bg-white border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[34.5px] w-[1279px]" data-name="Table Row">
      <TableCell />
      <TableCell1 />
      <TableCell2 />
      <TableCell3 />
      <Text6 />
      <TableCell4 />
      <TableCell5 />
      <TableCell6 />
      <TableCell7 />
    </div>
  );
}

function TableCell8() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.625px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Skid Steer</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.625px]">SS-0892</p>
    </div>
  );
}

function TableCell9() {
  return (
    <div className="absolute h-[58px] left-[212.63px] not-italic top-0 w-[265.781px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Trenton Road LLC</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.781px]">R-88232 · C-2214</p>
    </div>
  );
}

function Text7() {
  return (
    <div className="absolute bg-[#fef2f2] border border-[#fecaca] border-solid h-[22px] left-[494.41px] rounded-[6px] top-[19.5px] w-[46.672px]" data-name="Text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[7px] not-italic text-[#c72e23] text-[11px] top-[2px] whitespace-nowrap">OPEN</p>
    </div>
  );
}

function TableCell10() {
  return (
    <div className="absolute h-[58px] left-[584.72px] top-0 w-[132.891px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0002</p>
    </div>
  );
}

function Text8() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[733.61px] rounded-[6px] top-[21px] w-[37.547px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">MRL</p>
    </div>
  );
}

function TableCell11() {
  return (
    <div className="absolute h-[58px] left-[811.25px] top-0 w-[110.797px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/14/26</p>
    </div>
  );
}

function TableCell12() {
  return (
    <div className="absolute h-[58px] left-[922.05px] top-0 w-[88.266px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.58px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell13() {
  return (
    <div className="absolute h-[58px] left-[1010.31px] top-0 w-[82.578px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[40.84px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell14() {
  return (
    <div className="absolute h-[58px] left-[1092.89px] top-0 w-[186.109px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow2() {
  return (
    <div className="absolute bg-[#fafafa] border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[92.5px] w-[1279px]" data-name="Table Row">
      <TableCell8 />
      <TableCell9 />
      <Text7 />
      <TableCell10 />
      <Text8 />
      <TableCell11 />
      <TableCell12 />
      <TableCell13 />
      <TableCell14 />
    </div>
  );
}

function TableCell15() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.625px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Boom Lift 60ft</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.625px]">BL-0315</p>
    </div>
  );
}

function TableCell16() {
  return (
    <div className="absolute h-[58px] left-[212.63px] not-italic top-0 w-[265.781px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Summit Electric</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.781px]">R-88233 · C-3301</p>
    </div>
  );
}

function TableCell17() {
  return (
    <div className="absolute h-[58px] left-[478.41px] top-0 w-[106.313px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5502</p>
    </div>
  );
}

function TableCell18() {
  return (
    <div className="absolute h-[58px] left-[584.72px] top-0 w-[132.891px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0001</p>
    </div>
  );
}

function Text9() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[733.61px] rounded-[6px] top-[21px] w-[36.094px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">KPT</p>
    </div>
  );
}

function TableCell19() {
  return (
    <div className="absolute h-[58px] left-[811.25px] top-0 w-[110.797px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/14/26</p>
    </div>
  );
}

function TableCell20() {
  return (
    <div className="absolute h-[58px] left-[922.05px] top-0 w-[88.266px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.88px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell21() {
  return (
    <div className="absolute h-[58px] left-[1010.31px] top-0 w-[82.578px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.72px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">5</p>
    </div>
  );
}

function TableCell22() {
  return (
    <div className="absolute h-[58px] left-[1092.89px] top-0 w-[186.109px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">Operator required</p>
    </div>
  );
}

function TableRow3() {
  return (
    <div className="absolute bg-white border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[150.5px] w-[1279px]" data-name="Table Row">
      <TableCell15 />
      <TableCell16 />
      <TableCell17 />
      <TableCell18 />
      <Text9 />
      <TableCell19 />
      <TableCell20 />
      <TableCell21 />
      <TableCell22 />
    </div>
  );
}

function TableCell23() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.625px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Mini Excavator</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.625px]">ME-2211</p>
    </div>
  );
}

function TableCell24() {
  return (
    <div className="absolute h-[58px] left-[212.63px] not-italic top-0 w-[265.781px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Atlantic Landscaping</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.781px]">R-88234 · C-0774</p>
    </div>
  );
}

function Text10() {
  return (
    <div className="absolute bg-[#fef2f2] border border-[#fecaca] border-solid h-[22px] left-[494.41px] rounded-[6px] top-[19.5px] w-[46.672px]" data-name="Text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[7px] not-italic text-[#c72e23] text-[11px] top-[2px] whitespace-nowrap">OPEN</p>
    </div>
  );
}

function TableCell25() {
  return (
    <div className="absolute h-[58px] left-[584.72px] top-0 w-[132.891px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0003</p>
    </div>
  );
}

function Text11() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[733.61px] rounded-[6px] top-[21px] w-[34.906px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">BFR</p>
    </div>
  );
}

function TableCell26() {
  return (
    <div className="absolute h-[58px] left-[811.25px] top-0 w-[110.797px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/14/26</p>
    </div>
  );
}

function TableCell27() {
  return (
    <div className="absolute h-[58px] left-[922.05px] top-0 w-[88.266px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.88px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell28() {
  return (
    <div className="absolute h-[58px] left-[1010.31px] top-0 w-[82.578px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.63px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell29() {
  return (
    <div className="absolute h-[58px] left-[1092.89px] top-0 w-[186.109px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow4() {
  return (
    <div className="absolute bg-[#fafafa] border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[208.5px] w-[1279px]" data-name="Table Row">
      <TableCell23 />
      <TableCell24 />
      <Text10 />
      <TableCell25 />
      <Text11 />
      <TableCell26 />
      <TableCell27 />
      <TableCell28 />
      <TableCell29 />
    </div>
  );
}

function TableCell30() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.625px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Forklift 5T</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.625px]">FK-1190</p>
    </div>
  );
}

function TableCell31() {
  return (
    <div className="absolute h-[58px] left-[212.63px] not-italic top-0 w-[265.781px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Metro Warehouse Co.</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.781px]">R-88235 · C-5512</p>
    </div>
  );
}

function TableCell32() {
  return (
    <div className="absolute h-[58px] left-[478.41px] top-0 w-[106.313px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5503</p>
    </div>
  );
}

function TableCell33() {
  return (
    <div className="absolute h-[58px] left-[584.72px] top-0 w-[132.891px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0004</p>
    </div>
  );
}

function Text12() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[733.61px] rounded-[6px] top-[21px] w-[38.469px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">JDM</p>
    </div>
  );
}

function TableCell34() {
  return (
    <div className="absolute h-[58px] left-[811.25px] top-0 w-[110.797px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/14/26</p>
    </div>
  );
}

function TableCell35() {
  return (
    <div className="absolute h-[58px] left-[922.05px] top-0 w-[88.266px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.58px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell36() {
  return (
    <div className="absolute h-[58px] left-[1010.31px] top-0 w-[82.578px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.39px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">7</p>
    </div>
  );
}

function TableCell37() {
  return (
    <div className="absolute h-[58px] left-[1092.89px] top-0 w-[186.109px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">Side-shift attach.</p>
    </div>
  );
}

function TableRow5() {
  return (
    <div className="absolute bg-white border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[266.5px] w-[1279px]" data-name="Table Row">
      <TableCell30 />
      <TableCell31 />
      <TableCell32 />
      <TableCell33 />
      <Text12 />
      <TableCell34 />
      <TableCell35 />
      <TableCell36 />
      <TableCell37 />
    </div>
  );
}

function TableCell38() {
  return (
    <div className="absolute h-[57.5px] left-0 not-italic top-0 w-[212.625px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Compactor Plate</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.625px]">CP-0041</p>
    </div>
  );
}

function TableCell39() {
  return (
    <div className="absolute h-[57.5px] left-[212.63px] not-italic top-0 w-[265.781px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Garden State Paving</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.781px]">R-88236 · C-6623</p>
    </div>
  );
}

function TableCell40() {
  return (
    <div className="absolute h-[57.5px] left-[478.41px] top-0 w-[106.313px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5504</p>
    </div>
  );
}

function TableCell41() {
  return (
    <div className="absolute h-[57.5px] left-[584.72px] top-0 w-[132.891px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0005</p>
    </div>
  );
}

function Text13() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[733.61px] rounded-[6px] top-[21px] w-[37.547px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">MRL</p>
    </div>
  );
}

function TableCell42() {
  return (
    <div className="absolute h-[57.5px] left-[811.25px] top-0 w-[110.797px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/14/26</p>
    </div>
  );
}

function TableCell43() {
  return (
    <div className="absolute h-[57.5px] left-[922.05px] top-0 w-[88.266px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.88px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell44() {
  return (
    <div className="absolute h-[57.5px] left-[1010.31px] top-0 w-[82.578px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[40.84px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell45() {
  return (
    <div className="absolute h-[57.5px] left-[1092.89px] top-0 w-[186.109px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow6() {
  return (
    <div className="absolute bg-[#fafafa] h-[57.5px] left-0 top-[324.5px] w-[1279px]" data-name="Table Row">
      <TableCell38 />
      <TableCell39 />
      <TableCell40 />
      <TableCell41 />
      <Text13 />
      <TableCell42 />
      <TableCell43 />
      <TableCell44 />
      <TableCell45 />
    </div>
  );
}

function TableCard1() {
  const rows = [
    { bg: 'bg-white', name: 'Aerial Lift 40ft', code: 'AL-1042', customer: 'Bridgeton Construction', resv: 'R-88231 · C-1041', item: 'IT-5501', itemOpen: false, where: 'Loc 0001', rep: 'JDM', out: '04/14/26', units: '1', days: '3', notes: 'Deliver by 8am' },
    { bg: 'bg-[#fafafa]', name: 'Skid Steer', code: 'SS-0892', customer: 'Trenton Road LLC', resv: 'R-88232 · C-2214', item: 'OPEN', itemOpen: true, where: 'Loc 0002', rep: 'MRL', out: '04/14/26', units: '2', days: '1', notes: '' },
    { bg: 'bg-white', name: 'Boom Lift 60ft', code: 'BL-0315', customer: 'Summit Electric', resv: 'R-88233 · C-3301', item: 'IT-5502', itemOpen: false, where: 'Loc 0001', rep: 'KPT', out: '04/14/26', units: '1', days: '5', notes: 'Operator required' },
    { bg: 'bg-[#fafafa]', name: 'Mini Excavator', code: 'ME-2211', customer: 'Atlantic Landscaping', resv: 'R-88234 · C-0774', item: 'OPEN', itemOpen: true, where: 'Loc 0003', rep: 'BFR', out: '04/14/26', units: '1', days: '2', notes: '' },
    { bg: 'bg-white', name: 'Forklift 5T', code: 'FK-1190', customer: 'Metro Warehouse Co.', resv: 'R-88235 · C-5512', item: 'IT-5503', itemOpen: false, where: 'Loc 0004', rep: 'JDM', out: '04/14/26', units: '2', days: '7', notes: 'Side-shift attach.' },
    { bg: 'bg-[#fafafa]', name: 'Compactor Plate', code: 'CP-0041', customer: 'Garden State Paving', resv: 'R-88236 · C-6623', item: 'IT-5504', itemOpen: false, where: 'Loc 0005', rep: 'MRL', out: '04/14/26', units: '1', days: '1', notes: '' },
  ];
  return (
    <div className="overflow-x-auto relative shrink-0 w-full" data-name="TableCard">
      <table className="w-full border-collapse" style={{ minWidth: '780px' }}>
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
            {['WHAT', 'RESV# — CUSTOMER', 'ITEM#', 'WHERE', 'REP', 'OUT', 'UNITS', 'DAYS', 'NOTES'].map((h, i) => (
              <th key={i} className={`px-[12px] py-[6px] font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#94a3b8] tracking-[0.7px] uppercase whitespace-nowrap ${['UNITS', 'DAYS'].includes(h) ? 'text-center' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`${row.bg} border-b border-[#f8fafc]`} style={{ height: '32px' }}>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px] text-[#0f172a]">{row.name}</span>
                <span className="font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#94a3b8] ml-[6px]">{row.code}</span>
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px] text-[#0f172a]">{row.customer}</span>
                <span className="font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#94a3b8] ml-[6px]">{row.resv}</span>
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                {row.itemOpen ? (
                  <span className="inline-flex items-center bg-[#fef2f2] border border-[#fecaca] rounded-[4px] px-[5px] py-[1px] font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#c72e23] whitespace-nowrap">OPEN</span>
                ) : (
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px] text-[#475569]">{row.item}</span>
                )}
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#334155]">{row.where}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                <span className="inline-flex items-center bg-[#f1f5f9] rounded-[4px] px-[5px] py-[1px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[10px] text-[#334155] whitespace-nowrap">{row.rep}</span>
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#64748b]">{row.out}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap text-center font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-[#0f172a]">{row.units}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap text-center font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#475569]">{row.days}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap font-['Inter:Regular',sans-serif] font-normal text-[11px]">
                {row.notes ? <span className="text-[#475569]">{row.notes}</span> : <span className="text-[#cbd5e1]">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Container25() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <TableCard1 />
    </div>
  );
}

function Container24() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container25 />
    </div>
  );
}

function TableCard() {
  return (
    <div className="bg-white flex-1 min-h-0 flex flex-col rounded-[16px] relative overflow-hidden" data-name="TableCard">
      <Container19 />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <Container24 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(226,232,240,0.8)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),0px_1px_2px_-1px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function Container28() {
  return <div className="bg-[#1d50ad] h-[20px] rounded-[33554400px] shrink-0 w-[4px]" data-name="Container" />;
}

function Container29() {
  return (
    <div className="flex-[1_0_0] h-[24px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[0] left-0 not-italic text-[#0f172a] text-[0px] top-[3px] whitespace-nowrap">
          <span className="leading-[20px] text-[14px]">{`Tomorrow's Reservations`}</span>
          <span className="font-['Inter:Regular',sans-serif] font-normal leading-[16px] text-[#94a3b8] text-[12px]">All Locations · 04/15/2026</span>
        </p>
      </div>
    </div>
  );
}

function Text14() {
  return (
    <div className="bg-[#f1f5f9] h-[20px] relative rounded-[6px] shrink-0 w-[23.688px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[8px] py-[2px] relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#64748b] text-[12px] whitespace-nowrap">8</p>
      </div>
    </div>
  );
}

function Container27() {
  return (
    <div className="h-[24px] relative shrink-0 w-[381.156px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[12px] items-center relative size-full">
        <Container28 />
        <Container29 />
        <Text14 />
      </div>
    </div>
  );
}

function Text15() {
  return (
    <div className="bg-[#fef2f2] h-[22px] relative rounded-[6px] shrink-0 w-[58.344px]" data-name="Text">
      <div aria-hidden="true" className="absolute border border-[#fecaca] border-solid inset-0 pointer-events-none rounded-[6px]" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center px-[9px] py-[3px] relative size-full">
        <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] not-italic relative shrink-0 text-[#c72e23] text-[11px] whitespace-nowrap">3 OPEN</p>
      </div>
    </div>
  );
}

function Text16() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <p className="font-['Inter:Medium',sans-serif] font-medium leading-[16px] not-italic relative shrink-0 text-[#c72e23] text-[12px] text-center whitespace-nowrap">All up to date</p>
      </div>
    </div>
  );
}

function Icon13() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 14 14">
        <g id="Icon">
          <path d={svgPaths.p33b0c200} id="Vector" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          <path d={svgPaths.p22ad4980} id="Vector_2" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
        </g>
      </svg>
    </div>
  );
}

function Button9() {
  return (
    <div className="flex-[1_0_0] h-[16px] min-h-px min-w-px relative" data-name="Button">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[4px] items-center relative size-full">
        <Text16 />
        <Icon13 />
      </div>
    </div>
  );
}

function Container30() {
  return (
    <div className="h-[22px] relative shrink-0 w-[159.609px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[8px] items-center relative size-full">
        <Text15 />
        <Button9 />
      </div>
    </div>
  );
}

function Container26() {
  return (
    <div className="h-[57px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f1f5f9] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex items-center justify-between pb-[17px] pt-[16px] px-[20px] relative size-full">
          <Container27 />
          <Container30 />
        </div>
      </div>
    </div>
  );
}

function TableRow7() {
  return (
    <div className="absolute bg-[#f8fafc] border-[#f1f5f9] border-b border-solid font-['Inter:Bold',sans-serif] font-bold h-[34.5px] leading-[14px] left-0 not-italic text-[#94a3b8] text-[10px] top-0 tracking-[0.7px] w-[1279px] whitespace-nowrap" data-name="Table Row">
      <p className="absolute left-[16px] top-[10px]">WHAT</p>
      <p className="absolute left-[228.77px] top-[10px]">RESV# — CUSTOMER</p>
      <p className="absolute left-[494.73px] top-[10px]">ITEM#</p>
      <p className="absolute left-[601.11px] top-[10px]">WHERE</p>
      <p className="absolute left-[734.09px] top-[10px]">REP</p>
      <p className="absolute left-[827.8px] top-[10px]">OUT</p>
      <p className="absolute left-[937.81px] top-[10px]">UNITS</p>
      <p className="absolute left-[1026.14px] top-[10px]">DAYS</p>
      <p className="absolute left-[1108.77px] top-[10px]">NOTES</p>
    </div>
  );
}

function TableCell46() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Telehandler 42ft</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">TH-3301</p>
    </div>
  );
}

function TableCell47() {
  return (
    <div className="absolute h-[58px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Iron Horse Steel</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88237 · C-1102</p>
    </div>
  );
}

function TableCell48() {
  return (
    <div className="absolute h-[58px] left-[478.73px] top-0 w-[106.375px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5510</p>
    </div>
  );
}

function TableCell49() {
  return (
    <div className="absolute h-[58px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0001</p>
    </div>
  );
}

function Text17() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[36.094px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">KPT</p>
    </div>
  );
}

function TableCell50() {
  return (
    <div className="absolute h-[58px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell51() {
  return (
    <div className="absolute h-[58px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.91px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell52() {
  return (
    <div className="absolute h-[58px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.75px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">5</p>
    </div>
  );
}

function TableCell53() {
  return (
    <div className="absolute h-[58px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow8() {
  return (
    <div className="absolute bg-white border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[34.5px] w-[1279px]" data-name="Table Row">
      <TableCell46 />
      <TableCell47 />
      <TableCell48 />
      <TableCell49 />
      <Text17 />
      <TableCell50 />
      <TableCell51 />
      <TableCell52 />
      <TableCell53 />
    </div>
  );
}

function TableCell54() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Scissor Lift 26ft</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">SL-0821</p>
    </div>
  );
}

function TableCell55() {
  return (
    <div className="absolute h-[58px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Pinnacle Interiors</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88238 · C-2290</p>
    </div>
  );
}

function Text18() {
  return (
    <div className="absolute bg-[#fef2f2] border border-[#fecaca] border-solid h-[22px] left-[494.73px] rounded-[6px] top-[19.5px] w-[46.672px]" data-name="Text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[7px] not-italic text-[#c72e23] text-[11px] top-[2px] whitespace-nowrap">OPEN</p>
    </div>
  );
}

function TableCell56() {
  return (
    <div className="absolute h-[58px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0002</p>
    </div>
  );
}

function Text19() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[34.906px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">BFR</p>
    </div>
  );
}

function TableCell57() {
  return (
    <div className="absolute h-[58px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell58() {
  return (
    <div className="absolute h-[58px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.52px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">3</p>
    </div>
  );
}

function TableCell59() {
  return (
    <div className="absolute h-[58px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.64px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell60() {
  return (
    <div className="absolute h-[58px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">Indoor only</p>
    </div>
  );
}

function TableRow9() {
  return (
    <div className="absolute bg-[#fafafa] border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[92.5px] w-[1279px]" data-name="Table Row">
      <TableCell54 />
      <TableCell55 />
      <Text18 />
      <TableCell56 />
      <Text19 />
      <TableCell57 />
      <TableCell58 />
      <TableCell59 />
      <TableCell60 />
    </div>
  );
}

function TableCell61() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">RT Forklift</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">RT-0504</p>
    </div>
  );
}

function TableCell62() {
  return (
    <div className="absolute h-[58px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Bayshore Contractors</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88239 · C-3390</p>
    </div>
  );
}

function TableCell63() {
  return (
    <div className="absolute h-[58px] left-[478.73px] top-0 w-[106.375px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5511</p>
    </div>
  );
}

function TableCell64() {
  return (
    <div className="absolute h-[58px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0003</p>
    </div>
  );
}

function Text20() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[38.469px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">JDM</p>
    </div>
  );
}

function TableCell65() {
  return (
    <div className="absolute h-[58px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell66() {
  return (
    <div className="absolute h-[58px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.61px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell67() {
  return (
    <div className="absolute h-[58px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.59px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">3</p>
    </div>
  );
}

function TableCell68() {
  return (
    <div className="absolute h-[58px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow10() {
  return (
    <div className="absolute bg-white border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[150.5px] w-[1279px]" data-name="Table Row">
      <TableCell61 />
      <TableCell62 />
      <TableCell63 />
      <TableCell64 />
      <Text20 />
      <TableCell65 />
      <TableCell66 />
      <TableCell67 />
      <TableCell68 />
    </div>
  );
}

function TableCell69() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Generator 100kW</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">GN-1203</p>
    </div>
  );
}

function TableCell70() {
  return (
    <div className="absolute h-[58px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">NJ Events Group</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88240 · C-4410</p>
    </div>
  );
}

function Text21() {
  return (
    <div className="absolute bg-[#fef2f2] border border-[#fecaca] border-solid h-[22px] left-[494.73px] rounded-[6px] top-[19.5px] w-[46.672px]" data-name="Text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[7px] not-italic text-[#c72e23] text-[11px] top-[2px] whitespace-nowrap">OPEN</p>
    </div>
  );
}

function TableCell71() {
  return (
    <div className="absolute h-[58px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0004</p>
    </div>
  );
}

function Text22() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[37.547px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">MRL</p>
    </div>
  );
}

function TableCell72() {
  return (
    <div className="absolute h-[58px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell73() {
  return (
    <div className="absolute h-[58px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.91px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell74() {
  return (
    <div className="absolute h-[58px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.42px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">4</p>
    </div>
  );
}

function TableCell75() {
  return (
    <div className="absolute h-[58px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">Power cable incl.</p>
    </div>
  );
}

function TableRow11() {
  return (
    <div className="absolute bg-[#fafafa] border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[208.5px] w-[1279px]" data-name="Table Row">
      <TableCell69 />
      <TableCell70 />
      <Text21 />
      <TableCell71 />
      <Text22 />
      <TableCell72 />
      <TableCell73 />
      <TableCell74 />
      <TableCell75 />
    </div>
  );
}

function TableCell76() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Concrete Pump</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">CP-0312</p>
    </div>
  );
}

function TableCell77() {
  return (
    <div className="absolute h-[58px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Horizon Build Corp</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88241 · C-5501</p>
    </div>
  );
}

function TableCell78() {
  return (
    <div className="absolute h-[58px] left-[478.73px] top-0 w-[106.375px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5512</p>
    </div>
  );
}

function TableCell79() {
  return (
    <div className="absolute h-[58px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0001</p>
    </div>
  );
}

function Text23() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[36.094px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">KPT</p>
    </div>
  );
}

function TableCell80() {
  return (
    <div className="absolute h-[58px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell81() {
  return (
    <div className="absolute h-[58px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.91px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell82() {
  return (
    <div className="absolute h-[58px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.58px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">6</p>
    </div>
  );
}

function TableCell83() {
  return (
    <div className="absolute h-[58px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow12() {
  return (
    <div className="absolute bg-white border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[266.5px] w-[1279px]" data-name="Table Row">
      <TableCell76 />
      <TableCell77 />
      <TableCell78 />
      <TableCell79 />
      <Text23 />
      <TableCell80 />
      <TableCell81 />
      <TableCell82 />
      <TableCell83 />
    </div>
  );
}

function TableCell84() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Aerial Lift 80ft</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">AL-2080</p>
    </div>
  );
}

function TableCell85() {
  return (
    <div className="absolute h-[58px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Skyline Electric LLC</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88242 · C-6610</p>
    </div>
  );
}

function TableCell86() {
  return (
    <div className="absolute h-[58px] left-[478.73px] top-0 w-[106.375px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5513</p>
    </div>
  );
}

function TableCell87() {
  return (
    <div className="absolute h-[58px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0005</p>
    </div>
  );
}

function Text24() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[34.906px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">BFR</p>
    </div>
  );
}

function TableCell88() {
  return (
    <div className="absolute h-[58px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell89() {
  return (
    <div className="absolute h-[58px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.61px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell90() {
  return (
    <div className="absolute h-[58px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.59px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">3</p>
    </div>
  );
}

function TableCell91() {
  return (
    <div className="absolute h-[58px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow13() {
  return (
    <div className="absolute bg-[#fafafa] border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[324.5px] w-[1279px]" data-name="Table Row">
      <TableCell84 />
      <TableCell85 />
      <TableCell86 />
      <TableCell87 />
      <Text24 />
      <TableCell88 />
      <TableCell89 />
      <TableCell90 />
      <TableCell91 />
    </div>
  );
}

function TableCell92() {
  return (
    <div className="absolute h-[58px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Trencher Chain</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">TC-0190</p>
    </div>
  );
}

function TableCell93() {
  return (
    <div className="absolute h-[58px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Garden State Paving</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88243 · C-6623</p>
    </div>
  );
}

function Text25() {
  return (
    <div className="absolute bg-[#fef2f2] border border-[#fecaca] border-solid h-[22px] left-[494.73px] rounded-[6px] top-[19.5px] w-[46.672px]" data-name="Text">
      <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16px] left-[7px] not-italic text-[#c72e23] text-[11px] top-[2px] whitespace-nowrap">OPEN</p>
    </div>
  );
}

function TableCell94() {
  return (
    <div className="absolute h-[58px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0002</p>
    </div>
  );
}

function Text26() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[37.547px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">MRL</p>
    </div>
  );
}

function TableCell95() {
  return (
    <div className="absolute h-[58px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell96() {
  return (
    <div className="absolute h-[58px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.91px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell97() {
  return (
    <div className="absolute h-[58px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[40.86px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">1</p>
    </div>
  );
}

function TableCell98() {
  return (
    <div className="absolute h-[58px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow14() {
  return (
    <div className="absolute bg-white border-[#f8fafc] border-b border-solid h-[58px] left-0 top-[382.5px] w-[1279px]" data-name="Table Row">
      <TableCell92 />
      <TableCell93 />
      <Text25 />
      <TableCell94 />
      <Text26 />
      <TableCell95 />
      <TableCell96 />
      <TableCell97 />
      <TableCell98 />
    </div>
  );
}

function TableCell99() {
  return (
    <div className="absolute h-[57.5px] left-0 not-italic top-0 w-[212.766px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Mini Excavator</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[180.766px]">ME-2215</p>
    </div>
  );
}

function TableCell100() {
  return (
    <div className="absolute h-[57.5px] left-[212.77px] not-italic top-0 w-[265.969px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] text-[#0f172a] text-[13px] top-[12.5px] whitespace-nowrap">Atlantic Landscaping</p>
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[15px] left-[16px] text-[#94a3b8] text-[11px] top-[30.5px] w-[233.969px]">R-88244 · C-0774</p>
    </div>
  );
}

function TableCell101() {
  return (
    <div className="absolute h-[57.5px] left-[478.73px] top-0 w-[106.375px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[18px] left-[16px] not-italic text-[#475569] text-[12px] top-[22px] whitespace-nowrap">IT-5514</p>
    </div>
  );
}

function TableCell102() {
  return (
    <div className="absolute h-[57.5px] left-[585.11px] top-0 w-[132.984px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[19.5px] left-[16px] not-italic text-[#334155] text-[13px] top-[21px] whitespace-nowrap">Loc 0003</p>
    </div>
  );
}

function Text27() {
  return (
    <div className="absolute bg-[#f1f5f9] h-[20px] left-[734.09px] rounded-[6px] top-[21px] w-[38.469px]" data-name="Text">
      <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[16px] left-[7px] not-italic text-[#334155] text-[11px] top-[2px] whitespace-nowrap">JDM</p>
    </div>
  );
}

function TableCell103() {
  return (
    <div className="absolute h-[57.5px] left-[811.8px] top-0 w-[110.016px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#64748b] text-[12px] top-[22px] whitespace-nowrap">04/15/26</p>
    </div>
  );
}

function TableCell104() {
  return (
    <div className="absolute h-[57.5px] left-[921.81px] top-0 w-[88.328px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-[44.61px] not-italic text-[#0f172a] text-[13px] text-center top-[21px] whitespace-nowrap">2</p>
    </div>
  );
}

function TableCell105() {
  return (
    <div className="absolute h-[57.5px] left-[1010.14px] top-0 w-[82.625px]" data-name="Table Cell">
      <p className="-translate-x-1/2 absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[41.75px] not-italic text-[#475569] text-[12px] text-center top-[22px] whitespace-nowrap">5</p>
    </div>
  );
}

function TableCell106() {
  return (
    <div className="absolute h-[57.5px] left-[1092.77px] top-0 w-[186.234px]" data-name="Table Cell">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-[16px] not-italic text-[#cbd5e1] text-[12px] top-[22px] whitespace-nowrap">—</p>
    </div>
  );
}

function TableRow15() {
  return (
    <div className="absolute bg-[#fafafa] h-[57.5px] left-0 top-[440.5px] w-[1279px]" data-name="Table Row">
      <TableCell99 />
      <TableCell100 />
      <TableCell101 />
      <TableCell102 />
      <Text27 />
      <TableCell103 />
      <TableCell104 />
      <TableCell105 />
      <TableCell106 />
    </div>
  );
}

function TableCard3() {
  const rows = [
    { bg: 'bg-white', name: 'Telehandler 42ft', code: 'TH-3301', customer: 'Iron Horse Steel', resv: 'R-88237 · C-1102', item: 'IT-5510', itemOpen: false, where: 'Loc 0001', rep: 'KPT', out: '04/15/26', units: '1', days: '5', notes: '' },
    { bg: 'bg-[#fafafa]', name: 'Scissor Lift 26ft', code: 'SL-0821', customer: 'Pinnacle Interiors', resv: 'R-88238 · C-2290', item: 'OPEN', itemOpen: true, where: 'Loc 0002', rep: 'BFR', out: '04/15/26', units: '3', days: '2', notes: 'Indoor only' },
    { bg: 'bg-white', name: 'RT Forklift', code: 'RT-0504', customer: 'Bayshore Contractors', resv: 'R-88239 · C-3390', item: 'IT-5511', itemOpen: false, where: 'Loc 0003', rep: 'JDM', out: '04/15/26', units: '2', days: '3', notes: '' },
    { bg: 'bg-[#fafafa]', name: 'Generator 100kW', code: 'GN-1203', customer: 'NJ Events Group', resv: 'R-88240 · C-4410', item: 'OPEN', itemOpen: true, where: 'Loc 0004', rep: 'MRL', out: '04/15/26', units: '1', days: '4', notes: 'Power cable incl.' },
    { bg: 'bg-white', name: 'Concrete Pump', code: 'CP-0312', customer: 'Horizon Build Corp', resv: 'R-88241 · C-5501', item: 'IT-5512', itemOpen: false, where: 'Loc 0001', rep: 'KPT', out: '04/15/26', units: '1', days: '6', notes: '' },
    { bg: 'bg-[#fafafa]', name: 'Aerial Lift 80ft', code: 'AL-2080', customer: 'Skyline Electric LLC', resv: 'R-88242 · C-6610', item: 'IT-5513', itemOpen: false, where: 'Loc 0005', rep: 'BFR', out: '04/15/26', units: '2', days: '3', notes: '' },
    { bg: 'bg-white', name: 'Trencher Chain', code: 'TC-0190', customer: 'Garden State Paving', resv: 'R-88243 · C-6623', item: 'OPEN', itemOpen: true, where: 'Loc 0002', rep: 'MRL', out: '04/15/26', units: '1', days: '1', notes: '' },
    { bg: 'bg-[#fafafa]', name: 'Mini Excavator', code: 'ME-2215', customer: 'Atlantic Landscaping', resv: 'R-88244 · C-0774', item: 'IT-5514', itemOpen: false, where: 'Loc 0003', rep: 'JDM', out: '04/15/26', units: '2', days: '5', notes: '' },
  ];
  return (
    <div className="overflow-x-auto relative shrink-0 w-full" data-name="TableCard">
      <table className="w-full border-collapse" style={{ minWidth: '780px' }}>
        <thead>
          <tr className="bg-[#f8fafc] border-b border-[#f1f5f9]">
            {['WHAT', 'RESV# — CUSTOMER', 'ITEM#', 'WHERE', 'REP', 'OUT', 'UNITS', 'DAYS', 'NOTES'].map((h, i) => (
              <th key={i} className={`px-[12px] py-[6px] font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#94a3b8] tracking-[0.7px] uppercase whitespace-nowrap ${['UNITS', 'DAYS'].includes(h) ? 'text-center' : 'text-left'}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={`${row.bg} border-b border-[#f8fafc]`} style={{ height: '32px' }}>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px] text-[#0f172a]">{row.name}</span>
                <span className="font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#94a3b8] ml-[6px]">{row.code}</span>
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px] text-[#0f172a]">{row.customer}</span>
                <span className="font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#94a3b8] ml-[6px]">{row.resv}</span>
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                {row.itemOpen ? (
                  <span className="inline-flex items-center bg-[#fef2f2] border border-[#fecaca] rounded-[4px] px-[5px] py-[1px] font-['Inter:Bold',sans-serif] font-bold text-[10px] text-[#c72e23] whitespace-nowrap">OPEN</span>
                ) : (
                  <span className="font-['Inter:Medium',sans-serif] font-medium text-[11px] text-[#475569]">{row.item}</span>
                )}
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#334155]">{row.where}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap">
                <span className="inline-flex items-center bg-[#f1f5f9] rounded-[4px] px-[5px] py-[1px] font-['Inter:Semi_Bold',sans-serif] font-semibold text-[10px] text-[#334155] whitespace-nowrap">{row.rep}</span>
              </td>
              <td className="px-[12px] py-[5px] whitespace-nowrap font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#64748b]">{row.out}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap text-center font-['Inter:Semi_Bold',sans-serif] font-semibold text-[11px] text-[#0f172a]">{row.units}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap text-center font-['Inter:Regular',sans-serif] font-normal text-[11px] text-[#475569]">{row.days}</td>
              <td className="px-[12px] py-[5px] whitespace-nowrap font-['Inter:Regular',sans-serif] font-normal text-[11px]">
                {row.notes ? <span className="text-[#475569]">{row.notes}</span> : <span className="text-[#cbd5e1]">—</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Container32() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <TableCard3 />
    </div>
  );
}

function Container31() {
  return (
    <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-name="Container">
      <Container32 />
    </div>
  );
}

function TableCard2() {
  return (
    <div className="bg-white flex-1 min-h-0 flex flex-col rounded-[16px] relative overflow-hidden" data-name="TableCard">
      <Container26 />
      <div className="flex-1 min-h-0 overflow-y-auto overflow-x-auto">
        <Container31 />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(226,232,240,0.8)] border-solid inset-0 pointer-events-none rounded-[16px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),0px_1px_2px_-1px_rgba(0,0,0,0.04)]" />
    </div>
  );
}

function ReservationTables({ todayData, tomorrowData, headers }: { todayData: any[]; tomorrowData: any[]; headers?: string[] }) {
  const allData = [...(todayData || []), ...(tomorrowData || [])];
  return (
    <div className="flex-1 min-h-0 flex flex-col gap-[20px] w-full" data-name="ReservationTables">
      <DynamicReservationTable title="All Reservations" date={`All Locations · Total: ${allData.length}`} data={allData} headers={headers} />
    </div>
  );
}

function ScrollAreaViewport({ todayData, tomorrowData, todayDisplayDate, tomorrowDisplayDate, todayCount, tomorrowCount, todayUnits, tomorrowUnits, headers, isLoading }: { todayData: any[]; tomorrowData: any[]; todayDisplayDate: string; tomorrowDisplayDate: string; todayCount: number; tomorrowCount: number; todayUnits: number; tomorrowUnits: number; headers?: string[]; isLoading: boolean }) {
  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-slate-200 border-t-[#c72e23] rounded-full animate-spin" />
          <span className="font-['Inter:Medium',sans-serif] font-medium text-slate-500 text-sm animate-pulse">Fetching latest reservations...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" data-name="ScrollAreaViewport">
      <div className="flex-1 min-h-0 flex flex-col px-[24px] py-[24px]">
        <ReservationTables todayData={todayData} tomorrowData={tomorrowData} headers={headers} />
      </div>
    </div>
  );
}

function Container6({ todayData, tomorrowData, todayDisplayDate, tomorrowDisplayDate, todayCount, tomorrowCount, todayUnits, tomorrowUnits, headers, isLoading }: { todayData: any[]; tomorrowData: any[]; todayDisplayDate: string; tomorrowDisplayDate: string; todayCount: number; tomorrowCount: number; todayUnits: number; tomorrowUnits: number; headers?: string[]; isLoading: boolean }) {
  return (
    <div className="flex-1 min-h-0 flex flex-col w-full overflow-hidden" data-name="Container">
      <ScrollAreaViewport todayData={todayData} tomorrowData={tomorrowData} todayDisplayDate={todayDisplayDate} tomorrowDisplayDate={tomorrowDisplayDate} todayCount={todayCount} tomorrowCount={tomorrowCount} todayUnits={todayUnits} tomorrowUnits={tomorrowUnits} headers={headers} isLoading={isLoading} />
    </div>
  );
}

function Container5({ isFullscreen, todayData, tomorrowData, todayDisplayDate, tomorrowDisplayDate, todayCount, tomorrowCount, todayUnits, tomorrowUnits, headers, isLoading, location, path, reportType }: { isFullscreen: boolean; todayData: any[]; tomorrowData: any[]; todayDisplayDate: string; tomorrowDisplayDate: string; todayCount: number; tomorrowCount: number; todayUnits: number; tomorrowUnits: number; headers?: string[]; isLoading: boolean; location?: string; path?: string; reportType?: string }) {
  const renderContent = () => {
    // Priority: Dynamic location reports
    if (location && reportType) {
      let title = "";
      switch (reportType) {
        case "today": title = "Today Reservations & Contracts"; break;
        case "next-work-day": title = "Next Day Reservations & Contracts"; break;
        case "day-2": title = "Day 2 Reservations & Contracts"; break;
        case "day-3": title = "Day 3 Reservations & Contracts"; break;
        case "day-4": title = "Day 4 Reservations & Contracts"; break;
        case "day-5": title = "Day 5 Reservations & Contracts"; break;
        case "next-6-days-summary": title = "6-Day Summary"; break;
      }
      return <LocationReservationView location={location} type={reportType as any} title={`${title} - Location ${location}`} />;
    }

    if (location) {
      return (
        <div className="flex-1 p-6 overflow-auto">
          <Eyeball location={location} />
        </div>
      );
    }

    switch (path) {
      case '/all-contracts':
        return <ReservationAndContractView type="contracts" title="All Contracts" />;
      case '/all-reservations-contracts':
        return <ReservationAndContractView type="all-res-contracts" title="All Reservations & Contracts" />;
      case '/res-contracts-1-day':
        return <ReservationAndContractView type="day-1" title="Reservations & Contracts 1 Day" />;
      case '/res-contracts-2-days':
        return <ReservationAndContractView type="day-2" title="Reservations & Contracts 2 Days" />;
      case '/res-contracts-3-days':
        return <ReservationAndContractView type="day-3" title="Reservations & Contracts 3 Days" />;
      case '/res-contracts-4-days':
        return <ReservationAndContractView type="day-4" title="Reservations & Contracts 4 Days" />;
      case '/res-contracts-5-days':
        return <ReservationAndContractView type="day-5" title="Reservations & Contracts 5 Days" />;
      default:
        return <Container6 todayData={todayData} tomorrowData={tomorrowData} todayDisplayDate={todayDisplayDate} tomorrowDisplayDate={tomorrowDisplayDate} todayCount={todayCount} tomorrowCount={tomorrowCount} todayUnits={todayUnits} tomorrowUnits={tomorrowUnits} headers={headers} isLoading={isLoading} />;
    }
  };

  return (
    <div
      className="absolute left-0 right-0 bottom-0 overflow-hidden flex flex-col"
      style={{ top: isFullscreen ? 0 : 60 }}
      data-name="Container"
    >
      {renderContent()}
    </div>
  );
}

function Container({ onEditClick, onMenuClick, collapsed, onToggle, isFullscreen, onFullscreen, todayData, tomorrowData, todayDisplayDate, tomorrowDisplayDate, todayCount, tomorrowCount, todayUnits, tomorrowUnits, headers, isLoading, location, path, reportType, sidebarWidth, isResizing }: { onEditClick: () => void; onMenuClick: () => void; collapsed: boolean; onToggle?: () => void; isFullscreen: boolean; onFullscreen: () => void; todayData: any[]; tomorrowData: any[]; todayDisplayDate: string; tomorrowDisplayDate: string; todayCount: number; tomorrowCount: number; todayUnits: number; tomorrowUnits: number; headers?: string[]; isLoading: boolean; location?: string; path?: string; reportType?: string; sidebarWidth: number; isResizing: boolean }) {
  return (
    <div
      className="absolute h-full overflow-clip top-0 right-0"
      style={{
        left: isFullscreen ? 0 : (collapsed ? 60 : sidebarWidth),
        transition: isFullscreen || isResizing ? 'none' : "left 0.28s cubic-bezier(0.4,0,0.2,1)",
      }}
      data-name="Container"
    >
      <TopHeader onEditClick={onEditClick} onMenuClick={onMenuClick} onToggle={onToggle} onFullscreen={onFullscreen} isFullscreen={isFullscreen} />
      <Container5 isFullscreen={isFullscreen} todayData={todayData} tomorrowData={tomorrowData} todayDisplayDate={todayDisplayDate} tomorrowDisplayDate={tomorrowDisplayDate} todayCount={todayCount} tomorrowCount={tomorrowCount} todayUnits={todayUnits} tomorrowUnits={tomorrowUnits} headers={headers} isLoading={isLoading} location={location} path={path} reportType={reportType} />
    </div>
  );
}

function ImageMazzottaEquipmentRentals() {
  return (
    <div className="h-[60px] shrink-0 w-[247px] flex items-center justify-center px-4" data-name="Image (Mazzotta Equipment Rentals)">
      <img src={mazzottaLogo} alt="Mazzotta Equipment Rentals" className="h-auto max-h-[50px] w-auto max-w-full" />
    </div>
  );
}

function Container33() {
  return (
    <div className="h-[38px] relative shrink-0 w-[223px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[14px] left-[4px] not-italic text-[#94a3b8] text-[10px] top-[15px] tracking-[0.9px] uppercase whitespace-nowrap">Reports</p>
      </div>
    </div>
  );
}

function Icon14() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g id="Icon">
          <path d={svgPaths.p625a980} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p18c84c80} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
      </svg>
    </div>
  );
}

function Sidebar1() {
  return (
    <div className="flex-[145_0_0] h-[19.5px] min-h-px min-w-px relative" data-name="Sidebar">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">All Locations</p>
      </div>
    </div>
  );
}

function Icon15() {
  return (
    <div className="relative shrink-0 size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone() {
  return (
    <div className="h-[33.5px] relative rounded-[10px] shrink-0 w-full" data-name="SlotClone">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center px-[12px] py-[7px] relative size-full">
          <Icon14 />
          <Sidebar1 />
          <Icon15 />
        </div>
      </div>
    </div>
  );
}

function Icon16() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/2 left-[12.5%] right-[87.46%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[12.5%] right-[87.46%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[12.5%] right-[87.46%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/2 left-[33.33%] right-[12.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.58px_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 1.16667">
            <path d="M0.583333 0.583333H8.16667" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[33.33%] right-[12.5%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.58px_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 1.16667">
            <path d="M0.583333 0.583333H8.16667" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[12.5%] top-1/4" data-name="Vector">
        <div className="absolute inset-[-0.58px_-7.69%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 8.75 1.16667">
            <path d="M0.583333 0.583333H8.16667" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text28() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon16 />
      </div>
    </div>
  );
}

function Text29() {
  return (
    <div className="h-[18px] relative shrink-0 w-[90.922px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#64748b] text-[12px] top-0 whitespace-nowrap">All Reservations</p>
      </div>
    </div>
  );
}

function SubNavItem() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-[201px]" data-name="SubNavItem">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center px-[8px] py-[7px] relative size-full">
        <Text28 />
        <Text29 />
      </div>
    </div>
  );
}

function Icon17() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute bottom-1/2 left-[41.67%] right-[37.5%] top-1/2" data-name="Vector">
        <div className="absolute inset-[-0.58px_-20%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08333 1.16667">
            <path d="M3.5 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[33.33%_37.5%_66.67%_41.67%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-20%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.08333 1.16667">
            <path d="M3.5 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_20.83%_29.17%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-6.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 9.91667 9.33333">
            <path d={svgPaths.p1605f500} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[12.5%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-5.56%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8333 11.6667">
            <path d={svgPaths.p21d8b000} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text30() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon17 />
      </div>
    </div>
  );
}

function Text31() {
  return (
    <div className="h-[18px] relative shrink-0 w-[72.703px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#64748b] text-[12px] top-0 whitespace-nowrap">All Contracts</p>
      </div>
    </div>
  );
}

function SubNavItem1() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-[201px]" data-name="SubNavItem">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center px-[8px] py-[7px] relative size-full">
        <Text30 />
        <Text31 />
      </div>
    </div>
  );
}

function Icon18() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[20.84%_8.33%]" data-name="Vector">
        <div className="absolute inset-[-7.14%_-5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12.8339 9.33261">
            <path d={svgPaths.p375bb800} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 4.66667">
            <path d={svgPaths.p22c75d80} id="Vector" stroke="var(--stroke-0, white)" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.8" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text32() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon18 />
      </div>
    </div>
  );
}

function Text33() {
  return (
    <div className="h-[18px] relative shrink-0 w-[134.781px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[18px] left-0 not-italic text-[12px] text-white top-0 whitespace-nowrap">Eyeball — All Locations</p>
      </div>
    </div>
  );
}

function SubNavItem2() {
  return (
    <div className="bg-[#c72e23] flex-[1_0_0] min-h-px min-w-px relative rounded-[8px] shadow-[0px_4px_6px_0px_rgba(199,46,35,0.25),0px_2px_4px_0px_rgba(199,46,35,0.2)] w-[201px]" data-name="SubNavItem">
      <div className="flex flex-row items-center size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center px-[8px] py-[7px] relative size-full">
          <Text32 />
          <Text33 />
        </div>
      </div>
    </div>
  );
}

function Container36() {
  return (
    <div className="h-[100px] relative shrink-0 w-full" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#f1f5f9] border-l-2 border-solid inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col gap-[2px] items-start pl-[14px] relative size-full">
        <SubNavItem />
        <SubNavItem1 />
        <SubNavItem2 />
      </div>
    </div>
  );
}

function Container35() {
  return (
    <div className="h-[102px] relative shrink-0 w-full" data-name="Container">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="content-stretch flex flex-col items-start pl-[8px] pt-[2px] relative size-full">
          <Container36 />
        </div>
      </div>
    </div>
  );
}

function Container34() {
  return (
    <div className="h-[135.5px] relative shrink-0 w-[223px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <SlotClone />
        <Container35 />
      </div>
    </div>
  );
}

function Icon19() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_16.67%]" data-name="Vector">
        <div className="absolute inset-[-5%_-6.25%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.5 12.8333">
            <path d={svgPaths.p255b5a00} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[8.33%_16.67%_66.67%_58.33%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 4.66667">
            <path d={svgPaths.p16bde880} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%_58.33%_62.5%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-50%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 2.33333 1.16667">
            <path d="M1.75 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[54.17%_33.33%_45.83%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.83333 1.16667">
            <path d="M5.25 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[70.83%_33.33%_29.17%_33.33%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-12.5%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 5.83333 1.16667">
            <path d="M5.25 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text34() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon19 />
      </div>
    </div>
  );
}

function Text35() {
  return (
    <div className="h-[18px] relative shrink-0 w-[135px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#64748b] text-[12px] top-0 whitespace-nowrap">Combined Reservations</p>
      </div>
    </div>
  );
}

function SubNavItem3() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-[223px]" data-name="SubNavItem">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center px-[12px] py-[7px] relative size-full">
        <Text34 />
        <Text35 />
      </div>
    </div>
  );
}

function Icon20() {
  return (
    <div className="h-[14px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[16.67%_12.5%_8.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 11.6667">
            <path d={svgPaths.pdf40b00} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[66.67%] right-[33.33%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 0.583333V2.91667" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[41.67%_12.5%_58.33%_12.5%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-5.56%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 11.6667 1.16667">
            <path d="M0.583333 0.583333H11.0833" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-3/4 left-[33.33%] right-[66.67%] top-[8.33%]" data-name="Vector">
        <div className="absolute inset-[-25%_-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.16667 3.5">
            <path d="M0.583333 0.583333V2.91667" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_29.17%_41.67%_45.83%]" data-name="Vector">
        <div className="absolute inset-[-0.58px_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 1.16667">
            <path d="M4.08333 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[29.17%] right-[45.83%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.58px_-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 4.66667 1.16667">
            <path d="M4.08333 0.583333H0.583333" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[58.33%_70.79%_41.67%_29.17%]" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
      <div className="absolute bottom-1/4 left-[70.83%] right-[29.12%] top-3/4" data-name="Vector">
        <div className="absolute inset-[-0.58px]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 1.1725 1.16667">
            <path d="M0.583333 0.583333H0.589167" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.16667" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text36() {
  return (
    <div className="relative shrink-0 size-[14px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon20 />
      </div>
    </div>
  );
}

function Text37() {
  return (
    <div className="h-[18px] relative shrink-0 w-[92.313px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[18px] left-0 not-italic text-[#64748b] text-[12px] top-0 whitespace-nowrap">6-Day Summary</p>
      </div>
    </div>
  );
}

function SubNavItem4() {
  return (
    <div className="h-[32px] relative rounded-[8px] shrink-0 w-[223px]" data-name="SubNavItem">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[10px] items-center px-[12px] py-[7px] relative size-full">
        <Text36 />
        <Text37 />
      </div>
    </div>
  );
}

function Container37() {
  return (
    <div className="h-[46px] relative shrink-0 w-[223px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[14px] left-[4px] not-italic text-[#94a3b8] text-[10px] top-[23px] tracking-[0.9px] uppercase whitespace-nowrap">Locations</p>
      </div>
    </div>
  );
}

function Icon21() {
  return (
    <div className="absolute left-[12px] size-[18px] top-[7.75px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_753)" id="Icon">
          <path d={svgPaths.p3cb50b00} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3f23a000} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1f67c900} id="Vector_3" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 4.5H10.5" id="Vector_4" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 7.5H10.5" id="Vector_5" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 10.5H10.5" id="Vector_6" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 13.5H10.5" id="Vector_7" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_753">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar2() {
  return (
    <div className="absolute h-[19.5px] left-[42px] top-[7px] w-[145px]" data-name="Sidebar">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">Location 0001</p>
    </div>
  );
}

function Icon22() {
  return (
    <div className="relative size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone1() {
  return (
    <div className="h-[33.5px] relative rounded-[10px] shrink-0 w-[223px]" data-name="SlotClone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon21 />
        <Sidebar2 />
        <div className="absolute flex items-center justify-center left-[199px] size-[12px] top-[10.75px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none">
            <Icon22 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon23() {
  return (
    <div className="absolute left-[12px] size-[18px] top-[7.75px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_753)" id="Icon">
          <path d={svgPaths.p3cb50b00} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3f23a000} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1f67c900} id="Vector_3" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 4.5H10.5" id="Vector_4" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 7.5H10.5" id="Vector_5" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 10.5H10.5" id="Vector_6" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 13.5H10.5" id="Vector_7" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_753">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar3() {
  return (
    <div className="absolute h-[19.5px] left-[42px] top-[7px] w-[145px]" data-name="Sidebar">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">Location 0002</p>
    </div>
  );
}

function Icon24() {
  return (
    <div className="relative size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone2() {
  return (
    <div className="h-[33.5px] relative rounded-[10px] shrink-0 w-[223px]" data-name="SlotClone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon23 />
        <Sidebar3 />
        <div className="absolute flex items-center justify-center left-[199px] size-[12px] top-[10.75px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none">
            <Icon24 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon25() {
  return (
    <div className="absolute left-[12px] size-[18px] top-[7.75px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_753)" id="Icon">
          <path d={svgPaths.p3cb50b00} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3f23a000} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1f67c900} id="Vector_3" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 4.5H10.5" id="Vector_4" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 7.5H10.5" id="Vector_5" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 10.5H10.5" id="Vector_6" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 13.5H10.5" id="Vector_7" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_753">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar4() {
  return (
    <div className="absolute h-[19.5px] left-[42px] top-[7px] w-[145px]" data-name="Sidebar">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">Location 0003</p>
    </div>
  );
}

function Icon26() {
  return (
    <div className="relative size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone3() {
  return (
    <div className="h-[33.5px] relative rounded-[10px] shrink-0 w-[223px]" data-name="SlotClone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon25 />
        <Sidebar4 />
        <div className="absolute flex items-center justify-center left-[199px] size-[12px] top-[10.75px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none">
            <Icon26 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon27() {
  return (
    <div className="absolute left-[12px] size-[18px] top-[7.75px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_753)" id="Icon">
          <path d={svgPaths.p3cb50b00} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3f23a000} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1f67c900} id="Vector_3" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 4.5H10.5" id="Vector_4" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 7.5H10.5" id="Vector_5" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 10.5H10.5" id="Vector_6" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 13.5H10.5" id="Vector_7" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_753">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar5() {
  return (
    <div className="absolute h-[19.5px] left-[42px] top-[7px] w-[145px]" data-name="Sidebar">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">Location 0004</p>
    </div>
  );
}

function Icon28() {
  return (
    <div className="relative size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone4() {
  return (
    <div className="h-[33.5px] relative rounded-[10px] shrink-0 w-[223px]" data-name="SlotClone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon27 />
        <Sidebar5 />
        <div className="absolute flex items-center justify-center left-[199px] size-[12px] top-[10.75px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none">
            <Icon28 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Icon29() {
  return (
    <div className="absolute left-[12px] size-[18px] top-[7.75px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 18 18">
        <g clipPath="url(#clip0_1_753)" id="Icon">
          <path d={svgPaths.p3cb50b00} id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p3f23a000} id="Vector_2" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d={svgPaths.p1f67c900} id="Vector_3" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 4.5H10.5" id="Vector_4" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 7.5H10.5" id="Vector_5" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 10.5H10.5" id="Vector_6" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          <path d="M7.5 13.5H10.5" id="Vector_7" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
        </g>
        <defs>
          <clipPath id="clip0_1_753">
            <rect fill="white" height="18" width="18" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}

function Sidebar6() {
  return (
    <div className="absolute h-[19.5px] left-[42px] top-[7px] w-[145px]" data-name="Sidebar">
      <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">Location 0005</p>
    </div>
  );
}

function Icon30() {
  return (
    <div className="relative size-[12px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
        <g id="Icon">
          <path d="M3 4.5L6 7.5L9 4.5" id="Vector" stroke="var(--stroke-0, #94A3B8)" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}

function SlotClone5() {
  return (
    <div className="h-[33.5px] relative rounded-[10px] shrink-0 w-[223px]" data-name="SlotClone">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <Icon29 />
        <Sidebar6 />
        <div className="absolute flex items-center justify-center left-[199px] size-[12px] top-[10.75px]" style={{ "--transform-inner-width": "1185", "--transform-inner-height": "21" } as React.CSSProperties}>
          <div className="-rotate-90 flex-none">
            <Icon30 />
          </div>
        </div>
      </div>
    </div>
  );
}

function Navigation() {
  return (
    <div className="flex-[767.5_0_0] min-h-px min-w-px relative w-[247px]" data-name="Navigation">
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[2px] items-start px-[12px] py-[4px] relative size-full">
          <Container33 />
          <Container34 />
          <SubNavItem3 />
          <SubNavItem4 />
          <Container37 />
          <SlotClone1 />
          <SlotClone2 />
          <SlotClone3 />
          <SlotClone4 />
          <SlotClone5 />
        </div>
      </div>
    </div>
  );
}

function Icon31() {
  return (
    <div className="h-[18px] overflow-clip relative shrink-0 w-full" data-name="Icon">
      <div className="absolute inset-[8.33%_12.43%]" data-name="Vector">
        <div className="absolute inset-[-5%_-5.54%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 15.0264 16.5">
            <path d={svgPaths.p2a7dbaf0} id="Vector" stroke="var(--stroke-0, #475569)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
      <div className="absolute inset-[37.5%]" data-name="Vector">
        <div className="absolute inset-[-16.67%]">
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 6 6">
            <path d={svgPaths.p93ea200} id="Vector" stroke="var(--stroke-0, #475569)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Text38() {
  return (
    <div className="relative shrink-0 size-[18px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Icon31 />
      </div>
    </div>
  );
}

function Text39() {
  return (
    <div className="flex-[169_0_0] h-[19.5px] min-h-px min-w-px relative" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Medium',sans-serif] font-medium leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">Settings</p>
      </div>
    </div>
  );
}

function NavItem() {
  return (
    <div className="h-[43.5px] relative rounded-[10px] shrink-0 w-full" data-name="NavItem">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[12px] items-center pb-[8px] pt-[16px] px-[12px] relative size-full">
          <Text38 />
          <Text39 />
        </div>
      </div>
    </div>
  );
}

function Text40() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[17.484px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[16.5px] left-0 not-italic text-[11px] text-white top-0 whitespace-nowrap">MR</p>
      </div>
    </div>
  );
}

function Container40() {
  return (
    <div className="bg-[#c72e23] relative rounded-[33554400px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center pl-[7.25px] pr-[7.266px] relative size-full">
        <Text40 />
      </div>
    </div>
  );
}

function Text41() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative w-[123px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] left-0 not-italic text-[#475569] text-[13px] top-0 whitespace-nowrap">Manager</p>
      </div>
    </div>
  );
}

function Text42() {
  return (
    <div className="h-[16.5px] relative shrink-0 w-[123px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid overflow-clip relative rounded-[inherit] size-full">
        <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[16.5px] left-0 not-italic text-[11px] text-[rgba(71,85,105,0.5)] top-0 whitespace-nowrap">mazzotta.com</p>
      </div>
    </div>
  );
}

function Container41() {
  return (
    <div className="flex-[123_0_0] h-[36px] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col items-start relative size-full">
        <Text41 />
        <Text42 />
      </div>
    </div>
  );
}

function Text43() {
  return (
    <div className="h-[12px] relative shrink-0 w-[13.469px]" data-name="Text">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid relative size-full">
        <p className="absolute font-['Inter:Bold',sans-serif] font-bold leading-[12px] left-0 not-italic text-[8px] text-white top-0 whitespace-nowrap">GM</p>
      </div>
    </div>
  );
}

function Container42() {
  return (
    <div className="relative rounded-[33554400px] shrink-0 size-[24px]" style={{ backgroundImage: "linear-gradient(135deg, rgb(199, 46, 35) 0%, rgb(239, 68, 68) 100%)" }} data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[5.266px] relative size-full">
        <Text43 />
      </div>
    </div>
  );
}

function Container39() {
  return (
    <div className="bg-[rgba(226,232,240,0.5)] h-[56px] relative rounded-[10px] shrink-0 w-full" data-name="Container">
      <div className="flex flex-row items-center size-full">
        <div className="content-stretch flex gap-[10px] items-center px-[12px] py-[10px] relative size-full">
          <Container40 />
          <Container41 />
          <Container42 />
        </div>
      </div>
    </div>
  );
}

function Container38() {
  return (
    <div className="h-[116.5px] relative shrink-0 w-[247px]" data-name="Container">
      <div aria-hidden="true" className="absolute border-[rgba(216,224,236,0.15)] border-solid border-t inset-0 pointer-events-none" />
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex flex-col gap-[4px] items-start pt-px px-[12px] relative size-full">
        <NavItem />
        <Container39 />
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="absolute bg-white content-stretch flex flex-col h-full items-start left-0 pr-px top-0 w-[248px] hidden z-30" data-name="Sidebar">
      <div aria-hidden="true" className="absolute border-[rgba(216,224,236,0.5)] border-r border-solid inset-0 pointer-events-none" />
      <ImageMazzottaEquipmentRentals />
      <Navigation />
      <Container38 />
    </div>
  );
}

// ─── Toggle Switch ───────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-5 w-9 flex-shrink-0 items-center rounded-full transition-colors focus:outline-none ${checked ? 'bg-[#c72e23]' : 'bg-[#cbd5e1]'}`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-[18px]' : 'translate-x-[2px]'}`}
      />
    </button>
  );
}

// ─── Chart Icon Definitions ───────────────────────────────────────────────────
const chartIconDefs = [
  { label: 'Table', d: 'table' },
  { label: 'Bar', d: 'bar' },
  { label: 'Stacked Bar', d: 'stacked' },
  { label: 'Line', d: 'line' },
  { label: 'Area', d: 'area' },
  { label: 'Pie', d: 'pie' },
  { label: 'Donut', d: 'donut' },
  { label: 'Scatter', d: 'scatter' },
  { label: 'Map', d: 'map' },
  { label: 'Matrix', d: 'matrix' },
  { label: 'Waterfall', d: 'waterfall' },
  { label: 'Treemap', d: 'treemap' },
  { label: 'Gauge', d: 'gauge' },
  { label: 'Combo', d: 'combo' },
  { label: 'Ribbon', d: 'ribbon' },
  { label: 'More', d: 'more' },
];

function ChartIcon({ type }: { type: string }) {
  const s = { strokeWidth: 1.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  switch (type) {
    case 'table': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <rect x="2" y="4" width="16" height="12" rx="1" {...s} />
        <line x1="2" y1="8.5" x2="18" y2="8.5" {...s} />
        <line x1="7" y1="8.5" x2="7" y2="16" {...s} />
        <line x1="13" y1="8.5" x2="13" y2="16" {...s} />
      </svg>
    );
    case 'bar': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
        <rect x="4" y="7" width="3" height="9" rx="0.5" {...s} />
        <rect x="8.5" y="10" width="3" height="6" rx="0.5" {...s} />
        <rect x="13" y="5" width="3" height="11" rx="0.5" {...s} />
      </svg>
    );
    case 'stacked': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
        <rect x="4" y="11" width="4" height="5" rx="0.5" {...s} />
        <rect x="4" y="7" width="4" height="4" rx="0.5" {...s} />
        <rect x="10" y="9" width="4" height="7" rx="0.5" {...s} />
        <rect x="10" y="5" width="4" height="4" rx="0.5" {...s} />
      </svg>
    );
    case 'line': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
        <polyline points="3,13 7,9 11,11 15,5 17,7" {...s} />
      </svg>
    );
    case 'area': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <polyline points="3,13 7,9 11,11 15,5 17,7 17,15 3,15" {...s} />
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
      </svg>
    );
    case 'pie': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <circle cx="10" cy="10" r="7" {...s} />
        <line x1="10" y1="10" x2="10" y2="3" {...s} />
        <line x1="10" y1="10" x2="16" y2="13.5" {...s} />
        <line x1="10" y1="10" x2="4" y2="14" {...s} />
      </svg>
    );
    case 'donut': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <circle cx="10" cy="10" r="7" {...s} />
        <circle cx="10" cy="10" r="3.5" {...s} />
        <line x1="10" y1="3" x2="10" y2="6.5" {...s} />
      </svg>
    );
    case 'scatter': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
        <line x1="3" y1="3" x2="3" y2="16" {...s} />
        <circle cx="7" cy="13" r="1.3" {...s} />
        <circle cx="10" cy="9" r="1.3" {...s} />
        <circle cx="14" cy="7" r="1.3" {...s} />
        <circle cx="12" cy="13" r="1.3" {...s} />
      </svg>
    );
    case 'map': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <polygon points="3,4 8,2 13,5 17,3 17,17 13,15 8,18 3,16" {...s} />
        <line x1="8" y1="2" x2="8" y2="18" {...s} />
        <line x1="13" y1="5" x2="13" y2="15" {...s} />
      </svg>
    );
    case 'matrix': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <rect x="2" y="2" width="16" height="16" rx="1" {...s} />
        <line x1="2" y1="7" x2="18" y2="7" {...s} />
        <line x1="2" y1="12" x2="18" y2="12" {...s} />
        <line x1="7" y1="2" x2="7" y2="18" {...s} />
        <line x1="13" y1="2" x2="13" y2="18" {...s} />
      </svg>
    );
    case 'waterfall': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
        <rect x="4" y="6" width="2.5" height="5" rx="0.5" {...s} />
        <rect x="7.5" y="4" width="2.5" height="7" rx="0.5" {...s} />
        <rect x="11" y="8" width="2.5" height="3" rx="0.5" {...s} />
        <rect x="14.5" y="5" width="2" height="6" rx="0.5" {...s} />
      </svg>
    );
    case 'treemap': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <rect x="2" y="2" width="16" height="16" rx="1" {...s} />
        <line x1="10" y1="2" x2="10" y2="18" {...s} />
        <line x1="10" y1="11" x2="18" y2="11" {...s} />
        <line x1="2" y1="9" x2="10" y2="9" {...s} />
      </svg>
    );
    case 'gauge': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <path d="M3 14 A7 7 0 0 1 17 14" {...s} />
        <path d="M5.5 14 A4.5 4.5 0 0 1 14.5 14" {...s} />
        <line x1="10" y1="14" x2="7.5" y2="9.5" {...s} strokeWidth={1.6} strokeLinecap="round" />
      </svg>
    );
    case 'combo': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
        <rect x="4" y="10" width="3" height="6" rx="0.5" {...s} />
        <rect x="8.5" y="8" width="3" height="8" rx="0.5" {...s} />
        <rect x="13" y="6" width="3" height="10" rx="0.5" {...s} />
        <polyline points="5.5,10 10,7 14.5,5" {...s} />
      </svg>
    );
    case 'ribbon': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <line x1="3" y1="16" x2="17" y2="16" {...s} />
        <path d="M4 6 Q7 9 10 7 Q13 5 16 8" {...s} />
        <path d="M4 10 Q7 13 10 11 Q13 9 16 12" {...s} />
      </svg>
    );
    case 'more': return (
      <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" className="size-full">
        <circle cx="5" cy="10" r="1.5" {...s} />
        <circle cx="10" cy="10" r="1.5" {...s} />
        <circle cx="15" cy="10" r="1.5" {...s} />
      </svg>
    );
    default: return null;
  }
}

// ─── Edit Drawer Content ──────────────────────────────────────────────────────
function EditDrawerContent({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'build' | 'format'>('build');
  const [keepFilters, setKeepFilters] = useState(true);
  const [crossReport, setCrossReport] = useState(false);
  const [drillKeepFilters, setDrillKeepFilters] = useState(true);
  const [drillCrossReport, setDrillCrossReport] = useState(false);

  return (
    <div className="flex flex-col size-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#f1f5f9] shrink-0">
        <div className="flex items-center gap-2">
          <svg className="size-4 text-[#64748b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" strokeWidth="2" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold" style={{ fontSize: '14px', color: '#0f172a' }}>Filters</span>
        </div>
        <button onClick={onClose} className="text-[#94a3b8] hover:text-[#475569] transition-colors p-1 rounded">
          <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">

        {/* Filters on this page */}
        <div className="px-4 pt-4 pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-['Inter:Medium',sans-serif] font-medium" style={{ fontSize: '12px', color: '#475569' }}>Filters on this page</span>
            <svg className="size-3 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6,9 12,15 18,9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <button className="font-['Inter:Regular',sans-serif] font-normal hover:underline" style={{ fontSize: '12px', color: '#c72e23' }}>
            + Add data fields here
          </button>
        </div>

        {/* Filters on all pages */}
        <div className="px-4 pt-3 pb-3 border-b border-[#f1f5f9]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-['Inter:Medium',sans-serif] font-medium" style={{ fontSize: '12px', color: '#475569' }}>Filters on all pages</span>
            <svg className="size-3 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <polyline points="6,9 12,15 18,9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <button className="font-['Inter:Regular',sans-serif] font-normal hover:underline" style={{ fontSize: '12px', color: '#c72e23' }}>
            + Add data fields here
          </button>
        </div>

        {/* Keep all filters + cross-report toggles */}
        <div className="px-4 py-3 border-b border-[#f1f5f9] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-['Inter:Regular',sans-serif] font-normal" style={{ fontSize: '12px', color: '#334155' }}>Keep all filters</span>
            <Toggle checked={keepFilters} onChange={() => setKeepFilters(!keepFilters)} />
          </div>
          <button className="font-['Inter:Regular',sans-serif] font-normal hover:underline text-left" style={{ fontSize: '12px', color: '#c72e23' }}>
            Add drill-through fields here
          </button>
          <div className="flex items-center justify-between">
            <span className="font-['Inter:Regular',sans-serif] font-normal" style={{ fontSize: '12px', color: '#334155' }}>Cross-report</span>
            <Toggle checked={crossReport} onChange={() => setCrossReport(!crossReport)} />
          </div>
        </div>

        {/* Visualizations section */}
        <div className="px-4 pt-4 pb-2">
          <span className="font-['Inter:Bold',sans-serif] font-bold" style={{ fontSize: '13px', color: '#0f172a', letterSpacing: '0.1px' }}>Visualizations</span>
        </div>

        {/* Tabs */}
        <div className="px-4 mb-3">
          <div className="flex border-b border-[#e2e8f0]">
            <button
              onClick={() => setActiveTab('build')}
              className="py-1.5 pr-4 font-['Inter:Medium',sans-serif] font-medium transition-colors relative"
              style={{ fontSize: '12px', color: activeTab === 'build' ? '#c72e23' : '#94a3b8' }}
            >
              Build visual
              {activeTab === 'build' && (
                <span className="absolute bottom-0 left-0 right-0 rounded-t" style={{ height: '2px', backgroundColor: '#c72e23' }} />
              )}
            </button>
            <button
              onClick={() => setActiveTab('format')}
              className="py-1.5 px-4 font-['Inter:Medium',sans-serif] font-medium transition-colors relative"
              style={{ fontSize: '12px', color: activeTab === 'format' ? '#c72e23' : '#94a3b8' }}
            >
              Format visual
              {activeTab === 'format' && (
                <span className="absolute bottom-0 left-0 right-0 rounded-t" style={{ height: '2px', backgroundColor: '#c72e23' }} />
              )}
            </button>
          </div>
        </div>

        {activeTab === 'build' && (
          <>
            {/* Drag hint */}
            <div className="px-4 mb-3">
              <p className="font-['Inter:Regular',sans-serif] font-normal" style={{ fontSize: '11px', color: '#c72e23' }}>
                Drag a visual onto the canvas
              </p>
            </div>

            {/* Chart icon grid */}
            <div className="px-3 mb-4">
              <div className="grid grid-cols-6 gap-0.5">
                {chartIconDefs.map((icon) => (
                  <button
                    key={icon.label}
                    title={icon.label}
                    className="flex items-center justify-center rounded-[5px] text-[#64748b] hover:bg-[#f1f5f9] hover:text-[#334155] transition-colors"
                    style={{ width: '36px', height: '36px' }}
                  >
                    <span style={{ width: '18px', height: '18px', display: 'block' }}>
                      <ChartIcon type={icon.d} />
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Values */}
            <div className="px-4 py-3 border-t border-[#f1f5f9] border-b">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-['Inter:Medium',sans-serif] font-medium" style={{ fontSize: '12px', color: '#475569' }}>Values</span>
                <svg className="size-3 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <line x1="12" y1="5" x2="12" y2="19" strokeWidth="2" strokeLinecap="round" />
                  <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <button className="font-['Inter:Regular',sans-serif] font-normal hover:underline" style={{ fontSize: '12px', color: '#c72e23' }}>
                + Add data fields here
              </button>
            </div>

            {/* Drill through */}
            <div className="px-4 py-3 border-b border-[#f1f5f9]">
              <span className="font-['Inter:Medium',sans-serif] font-medium block mb-3" style={{ fontSize: '12px', color: '#475569' }}>Drill through</span>
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-['Inter:Regular',sans-serif] font-normal" style={{ fontSize: '12px', color: '#334155' }}>Cross-report</span>
                  <Toggle checked={drillCrossReport} onChange={() => setDrillCrossReport(!drillCrossReport)} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-['Inter:Regular',sans-serif] font-normal" style={{ fontSize: '12px', color: '#334155' }}>Keep all filters</span>
                  <Toggle checked={drillKeepFilters} onChange={() => setDrillKeepFilters(!drillKeepFilters)} />
                </div>
                <button className="font-['Inter:Regular',sans-serif] font-normal hover:underline text-left" style={{ fontSize: '12px', color: '#c72e23' }}>
                  Add drill-through fields here
                </button>
              </div>
            </div>
          </>
        )}

        {activeTab === 'format' && (
          <div className="px-4 py-8 text-center">
            <svg className="size-10 text-[#cbd5e1] mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            <p className="font-['Inter:Regular',sans-serif] font-normal" style={{ fontSize: '12px', color: '#94a3b8' }}>Select a visual to format</p>
          </div>
        )}
      </div>
    </div>
  );
}

function MobileMenuButton({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} className="md:hidden flex items-center justify-center size-[34px] rounded-[10px] hover:bg-gray-100">
      <svg className="size-5" fill="none" stroke="#64748B" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
      </svg>
    </button>
  );
}

function App({ onEditClick, onMenuClick, collapsed, onToggle, isFullscreen, onFullscreen, todayData, tomorrowData, todayDisplayDate, tomorrowDisplayDate, todayCount, tomorrowCount, todayUnits, tomorrowUnits, headers, isLoading, location, path, reportType, sidebarWidth, onWidthChange, isResizing }: { onEditClick: () => void; onMenuClick: () => void; collapsed: boolean; onToggle: () => void; isFullscreen: boolean; onFullscreen: () => void; todayData: any[]; tomorrowData: any[]; todayDisplayDate: string; tomorrowDisplayDate: string; todayCount: number; tomorrowCount: number; todayUnits: number; tomorrowUnits: number; headers?: string[]; isLoading: boolean; location?: string; path?: string; reportType?: string; sidebarWidth: number; onWidthChange: (w: number) => void; isResizing: boolean }) {
  return (
    <div className="bg-[#f8fafc] h-screen overflow-hidden relative shrink-0 w-full flex" data-name="App">
      {/* Collapsible sidebar — desktop only, hidden in fullscreen */}
      {!isFullscreen && (
        <div className="hidden md:flex h-full shrink-0 fixed top-0 left-0 z-30" style={{ height: "100vh" }}>
          <CollapsibleSidebar collapsed={collapsed} onToggle={onToggle} width={sidebarWidth} onWidthChange={onWidthChange} />
        </div>
      )}
      <Container onEditClick={onEditClick} onMenuClick={onMenuClick} collapsed={collapsed} onToggle={onToggle} isFullscreen={isFullscreen} onFullscreen={onFullscreen} todayData={todayData} tomorrowData={tomorrowData} todayDisplayDate={todayDisplayDate} tomorrowDisplayDate={tomorrowDisplayDate} todayCount={todayCount} tomorrowCount={tomorrowCount} todayUnits={tomorrowUnits} headers={headers} isLoading={isLoading} location={location} path={path} reportType={reportType} sidebarWidth={sidebarWidth} isResizing={isResizing} />
    </div>
  );
}

export default function Mazzotta() {
  const { location, reportType } = useParams();
  const { pathname: path } = useLocation();
  const [isEditOpen, setIsEditOpen] = useState(false);
  // ... (rest of the component state and effects)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(248);
  const [isSidebarResizing, setIsSidebarResizing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reservationData, setReservationData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (location) {
      setIsLoading(false);
      return;
    }
    const fetchReservations = async () => {
      setIsLoading(true);
      try {
        const data = await authService.getPostgresOrdersReservationView();
        setReservationData(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReservations();

    const interval = setInterval(fetchReservations, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, [location]);

  useEffect(() => {
    if (!isSidebarResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.min(Math.max(e.clientX, 160), 400);
      setSidebarWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsSidebarResizing(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSidebarResizing]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Helper to group data using the new API structure
  const groupedData = useMemo(() => {
    if (!reservationData || !reservationData.success) {
      return { today: [], tomorrow: [], todayDate: '—', tomorrowDate: '—', todayCount: 0, tomorrowCount: 0, todayUnits: 0, tomorrowUnits: 0, headers: [] };
    }

    return {
      today: reservationData.data || [],
      tomorrow: reservationData.data?.nextWorkDay || reservationData.data?.tomorrow || [],
      todayDate: reservationData.dashboard?.today?.dateLabel || '—',
      tomorrowDate: reservationData.dashboard?.nextWorkDay?.dateLabel || reservationData.dashboard?.tomorrow?.dateLabel || '—',
      todayCount: reservationData.dashboard?.today?.count || 0,
      tomorrowCount: reservationData.dashboard?.nextWorkDay?.count || reservationData.dashboard?.tomorrow?.count || 0,
      todayUnits: reservationData.dashboard?.today?.units || 0,
      tomorrowUnits: reservationData.dashboard?.nextWorkDay?.units || reservationData.dashboard?.tomorrow?.units || 0,
      headers: reservationData.headers || [],
    };
  }, [reservationData]);

  return (
    <div className="bg-white relative w-full h-screen overflow-hidden" data-name="Mazzotta (2)">
      {/* Main dashboard */}
      <App
        onEditClick={() => setIsEditOpen(true)}
        onMenuClick={() => setIsMobileSidebarOpen(true)}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        isFullscreen={isFullscreen}
        onFullscreen={toggleFullscreen}
        todayData={groupedData.today}
        tomorrowData={groupedData.tomorrow}
        todayDisplayDate={groupedData.todayDate}
        tomorrowDisplayDate={groupedData.tomorrowDate}
        todayCount={groupedData.todayCount}
        tomorrowCount={groupedData.tomorrowCount}
        todayUnits={groupedData.todayUnits}
        tomorrowUnits={groupedData.tomorrowUnits}
        headers={groupedData.headers}
        isLoading={isLoading}
        location={location}
        path={path}
        reportType={reportType}
        sidebarWidth={sidebarWidth}
        onWidthChange={(w) => {
          setSidebarWidth(w);
          setIsSidebarResizing(true);
        }}
        isResizing={isSidebarResizing}
      />

      {/* Mobile sidebar overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 md:hidden" onClick={() => setIsMobileSidebarOpen(false)} />
      )}
      <div
        className={`fixed top-0 left-0 h-full w-[248px] bg-white z-50 md:hidden flex flex-col transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ borderRight: '1px solid rgba(216,224,236,0.5)' }}
      >
        <ImageMazzottaEquipmentRentals />
        <Navigation />
        <Container38 />
      </div>

      {/* Backdrop — rendered OUTSIDE overflow-clip so it covers the full view */}
      {isEditOpen && (
        <div
          className="absolute inset-0 bg-black/20 z-40"
          onClick={() => setIsEditOpen(false)}
        />
      )}

      {/* Drawer — slides in from the right side, collapsible */}
      <div
        className="absolute top-0 h-full bg-white flex flex-col z-50"
        style={{
          right: 0,
          width: '280px',
          boxShadow: isEditOpen ? '-4px 0 24px #00000024' : 'none',
          borderLeft: '1px solid #e2e8f0e6',
          transform: isEditOpen ? 'translateX(0)' : 'translateX(340px)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
          pointerEvents: isEditOpen ? 'auto' : 'none',
        }}
      >
        <EditDrawerContent onClose={() => setIsEditOpen(false)} />
      </div>
    </div>
  );
}