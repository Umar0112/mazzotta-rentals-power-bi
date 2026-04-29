import { useState, useEffect, useMemo } from 'react';
import { ReservationAndContractService, ReservationAndContractData } from '../../services/api/ReservationAndContractService';
import { KpiCard } from './KpiCard';

interface ReservationAndContractViewProps {
  type: 'contracts' | 'all-res-contracts' | 'day-1' | 'day-2' | 'day-3' | 'day-4' | 'day-5';
  title: string;
}

const formatApiDate = (dateStr: string) => {
  if (!dateStr || dateStr.length !== 8) return dateStr;
  const year = dateStr.substring(2, 4);
  const month = dateStr.substring(4, 6);
  const day = dateStr.substring(6, 8);
  return `${month}/${day}/${year}`;
};

const GenericTable = ({ data, headers }: { data: any[]; headers?: string[] }) => {
  if (!data || data.length === 0) return (
    <div className="p-8 text-center text-gray-400 font-['Inter',sans-serif]">No data found.</div>
  );

  // Fix: Check for length of headers array
  const tableHeaders = headers && headers.length > 0 ? headers : Object.keys(data[0]);

  return (
    <div className="flex-1 overflow-auto relative w-full no-scrollbar">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <table className="w-full border-collapse" style={{ minWidth: '900px' }}>
        <thead className="sticky top-0 z-10">
          <tr className="bg-[#f8fafc] shadow-[0_1px_0_0_#f1f5f9]">
            {tableHeaders.map((h, i) => (
              <th key={i} className={`px-[12px] py-[8px] font-['Inter:Bold',sans-serif] font-bold text-[12px] text-[#94a3b8] tracking-[0.7px] uppercase whitespace-nowrap ${['Units', 'Rental Days', 'UNITS', 'DAYS'].includes(h) ? 'text-center' : 'text-left'}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={`${rowIndex % 2 === 1 ? 'bg-[#fafafa]' : 'bg-white'} border-b border-[#f8fafc] hover:bg-slate-50 transition-colors`} style={{ height: '38px' }}>
              {tableHeaders.map((h, colIndex) => {
                const rawValue = row[h];
                const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
                const isItemNum = h.toLowerCase().includes('item#');
                const isRep = h === 'REP' || h === 'SALES REP';
                const isNotes = h.toLowerCase() === 'notes' || h === 'NOTES';
                const isOut = h === 'OUT' || h === 'Rental Days' || h === 'Date Out';

                return (
                  <td key={colIndex} className={`px-[12px] py-[6px] whitespace-nowrap ${['Units', 'Rental Days', 'UNITS', 'DAYS'].includes(h) ? 'text-center' : ''}`}>
                    {isItemNum && (value === null || value === '' || value === 'OPEN') ? (
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
                        {isOut && value && value.toString().length === 8 && !value.toString().includes('/') ? formatApiDate(value.toString()) : (value ?? '—')}
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

const DynamicTable = ({ title, date, data, headers, color = '#c72e23' }: { title: string; date: string; data: any[]; headers?: string[]; color?: string }) => {
  const openItems = (data || []).filter(item => {
    const itemKey = Object.keys(item).find(k => k.toLowerCase().includes('item#'));
    if (!itemKey) return false;
    const val = item[itemKey];
    return val === null || (typeof val === 'string' && val.trim() === '') || (typeof val === 'string' && val.trim().toUpperCase() === 'OPEN');
  }).length;

  return (
    <div className="bg-white flex-1 min-h-0 flex flex-col rounded-[16px] relative overflow-hidden ring-1 ring-slate-200/50 shadow-sm">
      <div className="h-[68px] relative shrink-0 w-full border-b border-slate-100 bg-white">
        <div className="flex items-center justify-between h-full px-[20px]">
          <div className="flex items-center gap-[12px]">
            <div className="h-[20px] rounded-full shrink-0 w-[4px]" style={{ backgroundColor: color }} />
            <div className="flex flex-col">
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[17px] text-[#0f172a] leading-tight">{title}</span>
              <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#94a3b8]">{date}</span>
            </div>
            <div className="bg-[#f1f5f9] px-[8px] py-[2px] rounded-[6px] ml-1">
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#64748b]">{data.length}</span>
            </div>
          </div>
          {openItems > 0 && (
            <div className="bg-[#fef2f2] border border-[#fecaca] px-[9px] py-[3px] rounded-[6px]">
              <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#c72e23]">{openItems} OPEN</span>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        <GenericTable data={data} headers={headers} />
      </div>
    </div>
  );
};

export default function ReservationAndContractView({ type, title }: ReservationAndContractViewProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        let result;
        switch (type) {
          case 'contracts':
            result = await ReservationAndContractService.getAllContracts();
            break;
          case 'all-res-contracts':
            result = await ReservationAndContractService.getAllReservationsContracts();
            break;
          case 'day-1':
            result = await ReservationAndContractService.getNextDayReservationsContracts();
            break;
          case 'day-2':
            result = await ReservationAndContractService.getDay2ReservationsContracts();
            break;
          case 'day-3':
            result = await ReservationAndContractService.getDay3ReservationsContracts();
            break;
          case 'day-4':
            result = await ReservationAndContractService.getDay4ReservationsContracts();
            break;
          case 'day-5':
            result = await ReservationAndContractService.getDay5ReservationsContracts();
            break;
          default:
            result = { success: false, data: [] };
        }
        setData(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type]);

  const groupedData = useMemo(() => {
    if (!data) return null;

    // Check if it's the dual structure (provided in the example JSON)
    const hasDualStructure = data.reservations !== undefined && data.contracts !== undefined;

    return {
      hasDualStructure,
      summary: data.summary || null,
      reservations: hasDualStructure ? (data.reservations?.data || []) : (type !== 'contracts' ? (data.data || []) : []),
      contracts: hasDualStructure ? (data.contracts?.data || []) : (type === 'contracts' ? (data.data || []) : []),
      dateLabel: data.dateLabel || '',
      headers: data.headers || []
    };
  }, [data, type]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-slate-200 border-t-[#c72e23] rounded-full animate-spin" />
          <span className="font-['Inter:Medium',sans-serif] font-medium text-slate-500 text-sm animate-pulse">Loading {title}...</span>
        </div>
      </div>
    );
  }

  if (!groupedData) return null;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#f8fafc]">
      {groupedData.summary && (
        <div className="shrink-0 pt-[4px] pb-[20px] px-[24px]">
          <KpiCard
            todayTitle="Reservations"
            todayCount={groupedData.summary.reservations?.count ?? 0}
            todayUnits={groupedData.summary.reservations?.units ?? 0}
            nextDayTitle="Contracts"
            nextDayCount={groupedData.summary.contracts?.count ?? 0}
            nextDayUnits={groupedData.summary.contracts?.units ?? 0}
            totalTitle="Total"
            totalCount={groupedData.summary.total?.count ?? 0}
            totalUnits={groupedData.summary.total?.units ?? 0}
          />
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col gap-[20px] px-[24px] pb-6 no-scrollbar overflow-y-auto">
        {(groupedData.hasDualStructure || type !== 'contracts') && groupedData.reservations.length > 0 && (
          <DynamicTable
            title="Reservations"
            date={groupedData.dateLabel}
            data={groupedData.reservations}
            headers={groupedData.headers}
            color="#c72e23"
          />
        )}

        {(groupedData.hasDualStructure || type === 'contracts') && groupedData.contracts.length > 0 && (
          <DynamicTable
            title="Contracts"
            date={groupedData.dateLabel}
            data={groupedData.contracts}
            headers={groupedData.headers}
            color="#1d50ad"
          />
        )}

        {!groupedData.hasDualStructure && groupedData.reservations.length === 0 && groupedData.contracts.length === 0 && (
          <div className="bg-white flex-1 min-h-0 flex flex-col rounded-[16px] items-center justify-center p-12 ring-1 ring-slate-200/50 shadow-sm">
            <span className="font-['Inter:Medium',sans-serif] font-medium text-slate-400">No data available for this view.</span>
          </div>
        )}
      </div>
    </div>
  );
}
