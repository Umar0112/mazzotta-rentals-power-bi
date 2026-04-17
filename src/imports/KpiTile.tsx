import svgPaths from "./svg-6lvsikgnde";

function Icon() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="Icon">
      <svg className="absolute block inset-0 size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="Icon">
          <path d="M6.66667 1.66667V5" id="Vector" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 1.66667V5" id="Vector_2" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d={svgPaths.p1da67b80} id="Vector_3" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M2.5 8.33333H17.5" id="Vector_4" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 11.6667H6.675" id="Vector_5" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 11.6667H10.0083" id="Vector_6" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 11.6667H13.3417" id="Vector_7" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M6.66667 15H6.675" id="Vector_8" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M10 15H10.0083" id="Vector_9" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
          <path d="M13.3333 15H13.3417" id="Vector_10" stroke="var(--stroke-0, #C72E23)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.66667" />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div className="bg-[rgba(199,46,35,0.08)] relative rounded-[8px] shrink-0 size-[32px]" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-center justify-center px-[6px] relative size-full">
        <Icon />
      </div>
    </div>
  );
}

function Container() {
  return (
    <div className="h-[32px] relative shrink-0" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start relative size-full">
        <Container1 />
      </div>
    </div>
  );
}

function Paragraph() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] min-h-px min-w-px not-italic relative text-[#475569] text-[13px] uppercase">Today · Count</p>
    </div>
  );
}

function Paragraph1() {
  return (
    <div className="content-stretch flex h-[14px] items-start relative shrink-0 w-full" data-name="Paragraph">
      <p className="flex-[1_0_0] font-['Inter:Regular',sans-serif] font-normal leading-[14px] min-h-px min-w-px not-italic relative text-[#94a3b8] text-[11px]">All Locations · 04/14/26</p>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-between min-h-px min-w-px relative self-stretch">
      <Paragraph />
      <Paragraph1 />
    </div>
  );
}

function Container2() {
  return (
    <div className="flex-[1_0_0] min-h-px min-w-px relative" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex gap-[2px] items-start relative size-full">
        <Frame />
        <p className="font-['Inter:Extra_Bold',sans-serif] font-extrabold leading-[30.8px] not-italic relative shrink-0 text-[#c72e23] text-[28px] whitespace-nowrap">6</p>
      </div>
    </div>
  );
}

export default function KpiTile() {
  return (
    <div className="bg-white content-stretch flex gap-[8px] items-start p-[13px] relative rounded-[12px] size-full" data-name="KPITile">
      <div aria-hidden="true" className="absolute border border-[rgba(226,232,240,0.8)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),0px_1px_2px_0px_rgba(0,0,0,0.04)]" />
      <Container />
      <Container2 />
    </div>
  );
}