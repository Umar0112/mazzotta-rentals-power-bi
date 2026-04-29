import { useState, useEffect, useMemo } from 'react';
import { ReservationAndContractService } from '../../services/api/ReservationAndContractService';

interface CombinedEquipmentQtyReportViewProps {
  location?: string;
  title: string;
}

const GenericTable = ({ data, headers }: { data: any[]; headers?: string[] }) => {
  if (!data || data.length === 0) return (
    <div className="p-8 text-center text-gray-400 font-['Inter',sans-serif]">No data found.</div>
  );

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
              <th key={i} className={`px-[12px] py-[6px] font-['Inter:Bold',sans-serif] font-bold text-[12px] text-[#94a3b8] tracking-[0.7px] uppercase whitespace-nowrap text-left`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => {
            const isGroupHeader = row.isGroupHeader;
            const isTotalRow = row.isTotalRow;
            
            if (isGroupHeader) {
              return (
                <tr key={rowIndex} className="bg-slate-50/80 border-b border-[#f8fafc]" style={{ height: '32px' }}>
                  <td colSpan={tableHeaders.length} className="px-[12px] py-[4px]">
                    <div className="flex items-center gap-2">
                       <div className={`size-2 rounded-full ${row.group === 'Contracts' ? 'bg-[#1d50ad]' : 'bg-[#c72e23]'}`} />
                       <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[13px] text-[#0f172a] uppercase tracking-wider">{row.group}</span>
                       <span className="bg-white/50 px-1.5 py-0.5 rounded text-[11px] text-slate-500 font-bold ml-1">{row.count}</span>
                    </div>
                  </td>
                </tr>
              );
            }

            return (
              <tr key={rowIndex} className={`${rowIndex % 2 === 1 ? 'bg-[#fafafa]' : 'bg-white'} border-b border-[#f8fafc] hover:bg-slate-50 transition-colors ${isTotalRow ? 'bg-slate-100 font-bold' : ''}`} style={{ height: '38px' }}>
                {tableHeaders.map((h, colIndex) => {
                  const value = row[h];
                  return (
                    <td key={colIndex} className={`px-[12px] py-[6px] whitespace-nowrap`}>
                      <span className={`${isTotalRow ? "font-bold text-[#0f172a]" : "font-['Inter:Medium',sans-serif] font-medium text-[#0f172a]"} text-[13px]`}>
                        {value ?? '—'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default function CombinedEquipmentQtyReportView({ location, title }: CombinedEquipmentQtyReportViewProps) {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const result = await ReservationAndContractService.getEquipmentQtyNext6WorkingDays(location);
        if (result.success) {
          setData(result);
        }
      } catch (error) {
        console.error('Error fetching combined equipment qty report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, [location]);

  const transformedData = useMemo(() => {
    if (!data || !data.window) return null;

    const dates = data.window.dates || [];
    const dateLabels = data.window.dateLabels || [];
    const headers = ["WHAT", "Total Qty", ...dateLabels];

    const allRows: any[] = [];

    const processSection = (section: any, groupName: string) => {
      if (!section || !section.byEquipment) return;

      // Group Header Row
      allRows.push({
        isGroupHeader: true,
        group: groupName,
        count: section.grandTotal ?? 0
      });

      // Data Rows
      section.byEquipment.forEach((item: any) => {
        const row: any = {
          "WHAT": item.WHAT,
          "Total Qty": item.totalQty
        };
        dates.forEach((dateKey: number, index: number) => {
          row[dateLabels[index]] = item.perDate[dateKey.toString()] ?? 0;
        });
        allRows.push(row);
      });
    };

    processSection(data.reservations, "Reservations");
    processSection(data.contracts, "Contracts");

    // Grand Total Row
    const grandTotalRow: any = {
      isTotalRow: true,
      "WHAT": "Total",
      "Total Qty": (data.contracts?.grandTotal ?? 0) + (data.reservations?.grandTotal ?? 0)
    };
    dates.forEach((dateKey: number, index: number) => {
      const dKey = dateKey.toString();
      grandTotalRow[dateLabels[index]] = (data.contracts?.dateTotals?.[dKey] || 0) + (data.reservations?.dateTotals?.[dKey] || 0);
    });
    allRows.push(grandTotalRow);

    return { headers, rows: allRows, total: grandTotalRow["Total Qty"] };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="size-10 border-4 border-slate-200 border-t-[#c72e23] rounded-full animate-spin" />
          <span className="font-['Inter:Medium',sans-serif] font-medium text-slate-500 text-sm animate-pulse">Loading Combined Report...</span>
        </div>
      </div>
    );
  }

  if (!transformedData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#f8fafc] h-full min-h-[400px]">
         <span className="text-slate-400">No data available.</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-[#f8fafc]">
      <div className="shrink-0 pt-[12px] px-[24px]">
        <h2 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[20px] text-[#0f172a]">{title}</h2>
      </div>

      <div className="flex-1 min-h-0 flex flex-col gap-6 px-[24px] pb-6 overflow-y-auto no-scrollbar">
         <div className="bg-white shrink-0 flex flex-col rounded-[16px] relative overflow-hidden ring-1 ring-slate-200/50 shadow-sm">
            <div className="h-[68px] relative shrink-0 w-full border-b border-slate-100 bg-white">
              <div className="flex items-center justify-between h-full px-[20px]">
                <div className="flex items-center gap-[12px]">
                  <div className="h-[20px] rounded-full shrink-0 w-[4px] bg-[#6366f1]" />
                  <div className="flex flex-col">
                    <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[17px] text-[#0f172a] leading-tight">Combined Reservations & Contracts</span>
                    <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#94a3b8]">Equipment Quantity Summary</span>
                  </div>
                  <div className="bg-[#f1f5f9] px-[8px] py-[2px] rounded-[6px] ml-1">
                    <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#64748b]">{transformedData.total}</span>
                  </div>
                </div>
              </div>
            </div>
            <GenericTable data={transformedData.rows} headers={transformedData.headers} />
         </div>
      </div>
    </div>
  );
}
