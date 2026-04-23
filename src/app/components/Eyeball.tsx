import React, { useState, useEffect, useMemo } from 'react';
import { Eye, Loader2 } from 'lucide-react';
import { ApiService } from '../../services/api/apiService';
import { KpiCard } from './KpiCard';

interface EyeballProps {
  location: string;
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
                const isOut = h === 'OUT' || h === 'Rental Days';

                const isNotes = h.toLowerCase() === 'notes';

                return (
                  <td key={colIndex} className={`px-[12px] py-[8px] whitespace-nowrap ${['Units', 'Rental Days', 'UNITS', 'DAYS'].includes(h) ? 'text-center' : ''}`}>
                    {isItemNum && (value === null || value === '') ? (
                      <span className="inline-flex items-center bg-[#fef2f2] border border-[#fecaca] rounded-[4px] px-[5px] py-[1px] font-['Inter:Bold',sans-serif] font-bold text-[12px] text-[#c72e23] whitespace-nowrap">OPEN</span>
                    ) : isRep && value && value.toString().length > 10 ? ( // If REP is a long name, maybe just show text
                      <span className="font-['Inter:Medium',sans-serif] font-medium text-[13px] text-[#334155]">{value}</span>
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
              <span className="font-['Inter:Medium',sans-serif] font-medium text-[14px] text-[#c72e23]">Live Eyeball Data</span>
              <div className="size-2 bg-green-500 rounded-full animate-pulse" />
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

const Eyeball: React.FC<EyeballProps> = ({ location }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await ApiService.get(`/ibm-reservation-screen-eyeball?location=${location}`);
        setData(response);
      } catch (err: any) {
        console.error("Error fetching eyeball data:", err);
        setError(err.message || "Failed to load eyeball data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    const interval = setInterval(fetchData, 180000); // 3 minutes
    return () => clearInterval(interval);
  }, [location]);

  const groupedData = useMemo(() => {
    if (!data) return null;
    
    const todayReservations = data.data?.today || [];
    const nextWorkDayReservations = data.data?.nextWorkDay || [];
    
    return {
      today: todayReservations,
      nextWorkDay: nextWorkDayReservations,
      todayDate: data.dashboard?.today?.dateLabel || 'Today',
      nextWorkDayDate: data.dashboard?.nextWorkDay?.dateLabel || 'Next Work Day',
      todayCount: data.dashboard?.today?.count ?? todayReservations.length,
      nextWorkDayCount: data.dashboard?.nextWorkDay?.count ?? nextWorkDayReservations.length,
      todayUnits: data.dashboard?.today?.units ?? todayReservations.reduce((acc: number, curr: any) => acc + (parseInt(curr.Units) || 0), 0),
      nextWorkDayUnits: data.dashboard?.nextWorkDay?.units ?? nextWorkDayReservations.reduce((acc: number, curr: any) => acc + (parseInt(curr.Units) || 0), 0),
      todayTitle: data.dashboard?.today?.title || `Reservations Today - ${location}`,
      nextWorkDayTitle: data.dashboard?.nextWorkDay?.title || `Reservations Next Work Day - ${location}`,
      todaySectionLabel: data.dashboard?.today?.sectionLabel || `Today's Reservation - ${location}`,
      nextWorkDaySectionLabel: data.dashboard?.nextWorkDay?.sectionLabel || `Next Work Day's Reservation - ${location}`,
      headers: data.headers || []
    };
  }, [data, location]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px]">
        <Loader2 className="size-10 text-[#c72e23] animate-spin mb-4" />
        <span className="font-['Inter:Medium',sans-serif] font-medium text-slate-500 text-sm animate-pulse">
          Opening IBM Reservation Screen for Location {location}...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full min-h-[400px] text-center px-4">
        <div className="bg-red-50 p-4 rounded-full mb-4">
          <Eye className="size-8 text-red-500" />
        </div>
        <h3 className="font-['Inter:Semi_Bold',sans-serif] font-semibold text-slate-900 text-lg mb-2">Connection Failed</h3>
        <p className="text-slate-500 max-w-md mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-[#c72e23] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#b0281f] transition-colors shadow-sm"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  if (!groupedData) return null;

  return (
    <div className="flex flex-col h-full w-full overflow-hidden" data-name="EyeballPage">
      <div className="shrink-0 pt-[4px] pb-[20px]">
        <KpiCard
          todayTitle={groupedData.todayTitle}
          todayCount={groupedData.todayCount}
          todayUnits={groupedData.todayUnits}
          nextDayTitle={groupedData.nextWorkDayTitle}
          nextDayCount={groupedData.nextWorkDayCount}
          nextDayUnits={groupedData.nextWorkDayUnits}
        />
      </div>
      
      <div className="flex-1 min-h-0 flex flex-col gap-[20px] pb-6 no-scrollbar overflow-y-auto">
        <DynamicReservationTable 
          title={groupedData.todaySectionLabel} 
          date={groupedData.todayDate} 
          data={groupedData.today} 
          headers={groupedData.headers} 
        />
        
        <DynamicReservationTable 
          title={groupedData.nextWorkDaySectionLabel} 
          date={groupedData.nextWorkDayDate} 
          data={groupedData.nextWorkDay} 
          headers={groupedData.headers} 
        />
      </div>
    </div>
  );
};

export default Eyeball;
