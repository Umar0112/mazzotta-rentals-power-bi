import { useState, useEffect, useMemo } from 'react';
import { ReservationAndContractService } from '../../services/api/ReservationAndContractService';

interface EquipmentQtyReportViewProps {
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
            const isTotalRow = row["WHAT"] === "TOTALS";
            return (
              <tr key={rowIndex} className={`${rowIndex % 2 === 1 ? 'bg-[#fafafa]' : 'bg-white'} border-b border-[#f8fafc] hover:bg-slate-50 transition-colors ${isTotalRow ? 'bg-slate-100/50' : ''}`} style={{ height: '38px' }}>
                {tableHeaders.map((h, colIndex) => {
                  const value = row[h];
                  return (
                    <td key={colIndex} className={`px-[12px] py-[6px] whitespace-nowrap`}>
                      <span className={`${isTotalRow ? "font-bold text-[#c72e23]" : "font-['Inter:Medium',sans-serif] font-medium text-[#0f172a]"} text-[13px]`}>
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

export default function EquipmentQtyReportView({ location, title }: EquipmentQtyReportViewProps) {
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
        console.error('Error fetching equipment qty report:', error);
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

    // Headers: WHAT, Item#, Total Qty, then the date labels
    const headers = ["WHAT", "Item#", "Total Qty", ...dateLabels];

    const transformSection = (section: any) => {
      if (!section || !section.byEquipment) return [];

      const rows = section.byEquipment.map((item: any) => {
        const row: any = {
          "WHAT": item.WHAT,
          "Item#": item["Item#"],
          "Total Qty": item.totalQty
        };

        // Map perDate values to dateLabels
        dates.forEach((dateKey: number, index: number) => {
          const label = dateLabels[index];
          row[label] = item.perDate[dateKey.toString()] ?? 0;
        });

        return row;
      });

      // Add Total Row
      if (section.dateTotals) {
        const totalRow: any = {
          "WHAT": "TOTALS",
          "Item#": "",
          "Total Qty": section.grandTotal ?? 0
        };
        dates.forEach((dateKey: number, index: number) => {
          const label = dateLabels[index];
          totalRow[label] = section.dateTotals[dateKey.toString()] ?? 0;
        });
        rows.push(totalRow);
      }

      return rows;
    };

    return {
      headers,
      reservations: transformSection(data.reservations),
      contracts: transformSection(data.contracts),
      resTotal: data.reservations?.grandTotal ?? 0,
      conTotal: data.contracts?.grandTotal ?? 0
    };
  }, [data]);

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
        {/* Reservations Table */}
        <div className="bg-white shrink-0 flex flex-col rounded-[16px] relative overflow-hidden ring-1 ring-slate-200/50 shadow-sm">
          <div className="h-[68px] relative shrink-0 w-full border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between h-full px-[20px]">
              <div className="flex items-center gap-[12px]">
                <div className="h-[20px] rounded-full shrink-0 w-[4px] bg-[#c72e23]" />
                <div className="flex flex-col">
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[17px] text-[#0f172a] leading-tight">Reservations</span>
                  <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#94a3b8]">Equipment Quantity</span>
                </div>
                <div className="bg-[#f1f5f9] px-[8px] py-[2px] rounded-[6px] ml-1">
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#64748b]">{transformedData.resTotal}</span>
                </div>
              </div>
            </div>
          </div>
          <GenericTable data={transformedData.reservations} headers={transformedData.headers} />
        </div>

        {/* Contracts Table */}
        <div className="bg-white shrink-0 flex flex-col rounded-[16px] relative overflow-hidden ring-1 ring-slate-200/50 shadow-sm">
          <div className="h-[68px] relative shrink-0 w-full border-b border-slate-100 bg-white">
            <div className="flex items-center justify-between h-full px-[20px]">
              <div className="flex items-center gap-[12px]">
                <div className="h-[20px] rounded-full shrink-0 w-[4px] bg-[#1d50ad]" />
                <div className="flex flex-col">
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[17px] text-[#0f172a] leading-tight">Contracts</span>
                  <span className="font-['Inter:Regular',sans-serif] font-normal text-[14px] text-[#94a3b8]">Equipment Quantity</span>
                </div>
                <div className="bg-[#f1f5f9] px-[8px] py-[2px] rounded-[6px] ml-1">
                  <span className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-[14px] text-[#64748b]">{transformedData.conTotal}</span>
                </div>
              </div>
            </div>
          </div>
          <GenericTable data={transformedData.contracts} headers={transformedData.headers} />
        </div>
      </div>
    </div>
  );
}
