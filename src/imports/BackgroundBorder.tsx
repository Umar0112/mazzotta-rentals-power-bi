function Heading() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Reservations Today - All Locations (04/14/2026)</p>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="bg-[#c72e23] relative shrink-0 w-full" data-name="Background">
      <div className="content-stretch flex flex-col items-start px-[16px] py-[10px] relative size-full">
        <Heading />
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e8edf3] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[7.5px] pt-[9.5px] px-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap">Count</p>
        </div>
      </div>
    </div>
  );
}

function Container2() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[8px] py-[6px] relative size-full">
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[20px] text-center whitespace-nowrap">
            <p className="leading-[28px]">6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
      <HorizontalBorder />
      <Container2 />
    </div>
  );
}

function Border() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Border">
      <div aria-hidden="true" className="absolute border-[#e8edf3] border-b border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[7.5px] pl-[9px] pr-[8px] pt-[9.5px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap">Units</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#e8edf3] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pl-[9px] pr-[8px] py-[6px] relative size-full">
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[20px] text-center whitespace-nowrap">
            <p className="leading-[28px]">6</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
      <Border />
      <VerticalBorder />
    </div>
  );
}

function Frame4() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame />
      <Frame1 />
    </div>
  );
}

function Container1() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Container">
      <Background />
      <Frame4 />
    </div>
  );
}

function Heading1() {
  return (
    <div className="content-stretch flex flex-col items-center relative shrink-0 w-full" data-name="Heading 3">
      <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-center text-white whitespace-nowrap">
        <p className="leading-[24px]">Reservations Next Work Day - All Locations (04/15/2026)</p>
      </div>
    </div>
  );
}

function Background1() {
  return (
    <div className="bg-[#c72e23] relative shrink-0 w-full" data-name="Background">
      <div aria-hidden="true" className="absolute border-l border-solid border-white inset-0 pointer-events-none" />
      <div className="content-stretch flex flex-col items-start px-[16px] py-[10px] relative size-full">
        <Heading1 />
      </div>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="HorizontalBorder">
      <div aria-hidden="true" className="absolute border-[#e8edf3] border-b border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[7.5px] pt-[9.5px] px-[8px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap">Count</p>
        </div>
      </div>
    </div>
  );
}

function Container4() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="Container">
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center px-[8px] py-[6px] relative size-full">
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[20px] text-center whitespace-nowrap">
            <p className="leading-[28px]">25</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame2() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
      <HorizontalBorder1 />
      <Container4 />
    </div>
  );
}

function Border1() {
  return (
    <div className="h-[33px] relative shrink-0 w-full" data-name="Border">
      <div aria-hidden="true" className="absolute border-[#e8edf3] border-b border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pb-[7.5px] pl-[9px] pr-[8px] pt-[9.5px] relative size-full">
          <p className="font-['Inter:Semi_Bold',sans-serif] font-semibold leading-[19.5px] not-italic relative shrink-0 text-[#475569] text-[13px] whitespace-nowrap">Units</p>
        </div>
      </div>
    </div>
  );
}

function VerticalBorder1() {
  return (
    <div className="h-[40px] relative shrink-0 w-full" data-name="VerticalBorder">
      <div aria-hidden="true" className="absolute border-[#e8edf3] border-l border-solid inset-0 pointer-events-none" />
      <div className="flex flex-col items-center size-full">
        <div className="content-stretch flex flex-col items-center pl-[9px] pr-[8px] py-[6px] relative size-full">
          <div className="flex flex-col font-['Inter:Bold',sans-serif] font-bold justify-center leading-[0] not-italic relative shrink-0 text-[#1a1a1a] text-[20px] text-center whitespace-nowrap">
            <p className="leading-[28px]">29</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Frame3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative">
      <Border1 />
      <VerticalBorder1 />
    </div>
  );
}

function Frame5() {
  return (
    <div className="content-stretch flex items-center justify-between relative shrink-0 w-full">
      <Frame2 />
      <Frame3 />
    </div>
  );
}

function Container3() {
  return (
    <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative self-stretch" data-name="Container">
      <div aria-hidden="true" className="absolute border-[#e8edf3] border-l border-solid inset-0 pointer-events-none" />
      <Background1 />
      <Frame5 />
    </div>
  );
}

function Container() {
  return (
    <div className="h-[117px] relative shrink-0 w-full" data-name="Container">
      <div className="bg-clip-padding border-0 border-[transparent] border-solid content-stretch flex items-start justify-center relative size-full">
        <Container1 />
        <Container3 />
      </div>
    </div>
  );
}

export default function BackgroundBorder() {
  return (
    <div className="bg-white relative rounded-[12px] size-full" data-name="Background+Border">
      <div className="content-stretch flex flex-col items-start overflow-clip p-px relative rounded-[inherit] size-full">
        <Container />
      </div>
      <div aria-hidden="true" className="absolute border border-[rgba(226,232,240,0.8)] border-solid inset-0 pointer-events-none rounded-[12px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.04),0px_1px_2px_-1px_rgba(0,0,0,0.04)]" />
    </div>
  );
}