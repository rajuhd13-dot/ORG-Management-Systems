import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Search, Filter, FileText, ChevronDown, Check, X, Download, RefreshCw, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7FLsOGJDUluBeLYm85VU-HyOM8yZ2pjcpzzX4Oz7N80IPFVAgL6uv788SZM4LfuilgA/exec';

const SUBJECT_KEYS = [
  { key: 'english', label: 'English' },
  { key: 'bangla', label: 'Bangla' },
  { key: 'physics', label: 'Physics' },
  { key: 'chemistry', label: 'Chemistry' },
  { key: 'math', label: 'Math' },
  { key: 'biology', label: 'Biology' },
  { key: 'ict', label: 'ICT' }
];

export default function AssessmentAllowList() {
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState({
    institute: [] as string[],
    department: [] as string[],
    batch: [] as string[],
    trainingsSelected: [] as string[],
    campusesSelected: [] as string[],
    tpinsSelected: [] as string[],
    subjectsSelected: [] as string[],
    subjectLogic: 'any' as 'any' | 'all',
    onlyAllowed: true,
    allowEnglish: 55,
    allowOthers: 48
  });

  // UI state for dropdowns
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'getOptions' })
      });
      const text = await res.text();
      try {
        const result = JSON.parse(text);
        if (result.success) {
          setOptions(result);
          setFilters(prev => ({
            ...prev,
            allowEnglish: result.allow?.ENGLISH || prev.allowEnglish,
            allowOthers: result.allow?.BANGLA || prev.allowOthers // Using Bangla as representative for others
          }));
        } else {
          setError(result.error || 'Failed to load options from sheet');
        }
      } catch (e) {
        console.error("Failed to parse response:", text);
        if (!options) setError('Invalid response format. The Google Apps Script URL may be incorrect or needs re-deployment.');
      }
    } catch (err) {
      console.error("Connection error:", err);
      if (!options) {
        setError('Connection error. Please ensure your Google Apps Script has a "doPost" function to handle requests, and is deployed as "Execute as: Me" and "Who has access: Anyone".');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError(null);
      setData(null);
      
      const payload = {
        action: 'getFilteredDataFast', // Match the function name in the provided GAS
        filters: {
          ...filters,
          subjectsSelected: filters.subjectsSelected.length > 0 
            ? filters.subjectsSelected.map(s => s.toLowerCase())
            : []
        },
        page: 1,
        pageSize: 500
      };

      const res = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify(payload)
      });
      
      const text = await res.text();
      try {
        const result = JSON.parse(text);
        if (result.success) {
          setData(result);
        } else {
          setError(result.error || 'The spreadsheet script returned an error. Please ensure the sheet name "Examiner Information" matches exactly.');
        }
      } catch (e) {
        console.error("Parse error:", e, text);
        setError('Invalid response from server. Check if your Apps Script includes "doPost" and is deployed correctly.');
      }
    } catch (err) {
      console.error("List Fetch Error:", err);
      setError('Connection failed. Please ensure your Google Apps Script has a "doPost" function and is deployed with access "Anyone".');
    } finally {
      setLoading(false);
    }
  };

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters(prev => {
      const current = prev[type] as string[];
      const next = current.includes(value) 
        ? current.filter(v => v !== value) 
        : [...current, value];
      return { ...prev, [type]: next };
    });
  };

  const renderMultiSelect = (label: string, type: keyof typeof filters, items: string[]) => {
    const selected = filters[type] as string[];
    const isOpen = activeDropdown === type;

    return (
      <div className="relative w-full">
        <label className="text-[12px] font-bold text-gray-600 block mb-1">{label}</label>
        <div 
          onClick={() => setActiveDropdown(isOpen ? null : type)}
          className="w-full border border-gray-300 rounded-sm bg-white px-2 py-1.5 text-[13px] flex justify-between items-center cursor-pointer hover:border-blue-400 transition-colors h-[34px]"
        >
          <span className="truncate pr-4">
            {selected.length === 0 ? `-- Select ${label} --` : `${selected.length} Selected`}
          </span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
              <motion.div 
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg z-20 max-h-60 overflow-y-auto"
              >
                <div className="p-1 px-2 border-b border-gray-100 bg-gray-50 flex justify-between">
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, [type]: items }));
                    }}
                    className="text-[11px] text-blue-600 font-bold hover:bg-white px-2 py-1 rounded"
                  >
                    Select All
                  </button>
                  <button 
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFilters(prev => ({ ...prev, [type]: [] }));
                    }}
                    className="text-[11px] text-red-600 font-bold hover:bg-white px-2 py-1 rounded"
                  >
                    Clear
                  </button>
                </div>
                {items.map(item => (
                  <label key={item} className="flex items-center px-3 py-2 hover:bg-blue-50 cursor-pointer text-[13px]">
                    <div className="mr-3 w-4 h-4 border border-gray-300 rounded-sm flex items-center justify-center bg-white">
                      {selected.includes(item) && <Check size={12} className="text-blue-600 stroke-[3]" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={selected.includes(item)}
                      onChange={() => toggleFilter(type, item)}
                    />
                    <span className="truncate">{item}</span>
                  </label>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const handleExportExcel = () => {
    if (!data || !data.header || !data.rows) return;
    
    // Create worksheet data
    const wsData = [
      data.header,
      ...data.rows
    ];
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, "Matched Records");
    
    // Trigger download
    XLSX.writeFile(wb, "Assessment_Allow_List.xlsx");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500 font-['Segoe_UI',sans-serif]">
      {/* Search Section */}
      <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden">
        <div className="bg-[#002B49] text-white px-4 py-2 font-semibold text-[14px] flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Filter size={16} />
            <span>Assessment Allow List Filters</span>
          </div>
          <div className="flex items-center gap-4">
            {options?.rowCount && (
               <div className="flex items-center gap-2 text-[11px] font-normal text-green-300">
                  <Database size={14} />
                  {options.rowCount} records ready
               </div>
            )}
            <button 
              onClick={fetchOptions}
              className="flex items-center gap-1.5 text-[11px] font-normal text-blue-200 hover:text-white transition-colors"
            >
              <RefreshCw size={14} className={loading && !data ? 'animate-spin' : ''} />
              {options ? 'Reload Options' : 'Loading Options...'}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Multi Selects */}
            {renderMultiSelect("Institute", "institute", options?.institutes || [])}
            {renderMultiSelect("Department", "department", options?.departments || [])}
            {renderMultiSelect("HSC Batch", "batch", options?.batches || [])}
            
            {renderMultiSelect("Physical Campus", "campusesSelected", options?.campuses || [])}
            {renderMultiSelect("Training Report", "trainingsSelected", options?.trainings || [])}
            
            {renderMultiSelect("T-PIN", "tpinsSelected", options?.tpins || [])}
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
            {/* Subjects Selection */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-[13px] font-bold text-[#002B49] flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-blue-600" />
                  Select Subjects for Assessment
                </label>
                <div className="flex gap-4">
                  <button 
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, subjectsSelected: SUBJECT_KEYS.map(s => s.key) }))}
                    className="text-[11px] text-blue-600 font-bold hover:underline"
                  >
                    Select All
                  </button>
                  <button 
                    type="button"
                    onClick={() => setFilters(prev => ({ ...prev, subjectsSelected: [] }))}
                    className="text-[11px] text-red-600 font-bold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {SUBJECT_KEYS.map(({ key, label }) => (
                  <label key={key} className="flex items-center gap-2 p-2 border border-gray-100 rounded-sm hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className={`w-4 h-4 rounded-sm border flex items-center justify-center transition-colors ${
                      filters.subjectsSelected.includes(key) ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {filters.subjectsSelected.includes(key) && <Check size={12} className="text-white stroke-[3]" />}
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden"
                      checked={filters.subjectsSelected.includes(key)}
                      onChange={() => toggleFilter('subjectsSelected', key)}
                    />
                    <span className="text-[12px] font-medium text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Thresholds & Logic */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-gray-600 block mb-1">Threshold (%)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">English</span>
                      <input 
                        type="number" 
                        value={filters.allowEnglish}
                        onChange={(e) => setFilters(prev => ({ ...prev, allowEnglish: parseInt(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[13px] font-bold text-center h-[34px]"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-gray-400 font-bold uppercase">Others</span>
                      <input 
                        type="number" 
                        value={filters.allowOthers}
                        onChange={(e) => setFilters(prev => ({ ...prev, allowOthers: parseInt(e.target.value) }))}
                        className="w-full border border-gray-300 rounded-sm px-2 py-1 text-[13px] font-bold text-center h-[34px]"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-gray-600 block mb-2">Filters Options</label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-3.5 h-3.5 border-2 rounded-full flex items-center justify-center transition-colors ${
                        filters.subjectLogic === 'any' ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {filters.subjectLogic === 'any' && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                      </div>
                      <input type="radio" className="hidden" name="logic" checked={filters.subjectLogic === 'any'} onChange={() => setFilters(prev => ({ ...prev, subjectLogic: 'any' }))} />
                      <span className="text-[12px] font-bold text-gray-600">Any Matches</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <div className={`w-3.5 h-3.5 border-2 rounded-full flex items-center justify-center transition-colors ${
                        filters.subjectLogic === 'all' ? 'border-blue-600' : 'border-gray-300 group-hover:border-blue-400'
                      }`}>
                        {filters.subjectLogic === 'all' && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                      </div>
                      <input type="radio" className="hidden" name="logic" checked={filters.subjectLogic === 'all'} onChange={() => setFilters(prev => ({ ...prev, subjectLogic: 'all' }))} />
                      <span className="text-[12px] font-bold text-gray-600">All Must Match</span>
                    </label>
                  </div>
                </div>
                <label className="flex items-center gap-2 p-2 bg-blue-50 border border-blue-100 rounded-sm cursor-pointer hover:bg-blue-100 transition-colors">
                  <input 
                    type="checkbox" 
                    checked={filters.onlyAllowed}
                    onChange={(e) => setFilters(prev => ({ ...prev, onlyAllowed: e.target.checked }))}
                    className="w-4 h-4 text-blue-600 rounded-sm border-gray-300 focus:ring-blue-500" 
                  />
                  <span className="text-[12px] font-bold text-blue-800">Only Show Allowed</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSearch}
              disabled={loading}
              className="bg-[#4a89c5] text-white px-12 py-2 rounded-sm text-[15px] font-bold hover:bg-blue-600 transition-all shadow-md disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <RefreshCw size={18} className="animate-spin" /> : <Search size={18} />}
              Search
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0 }}
            className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-sm flex items-center gap-3 text-[14px] font-bold"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {data && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden"
          >
            <div className="bg-[#002B49] text-white px-4 py-2 font-bold text-[13px] flex justify-between items-center">
              <span>Results: {data.total} Matched Records</span>
              <button 
                onClick={handleExportExcel}
                className="flex items-center gap-1 text-[11px] bg-green-700 hover:bg-green-600 px-3 py-1 rounded transition-colors text-white uppercase tracking-wider cursor-pointer"
              >
                <Download size={13} />
                Export Excel
              </button>
            </div>
            
            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-center border-collapse text-[12px]">
                <thead className="bg-gray-100 sticky top-0 z-10">
                  <tr>
                    {data.header?.map((h: string, idx: number) => (
                      <th key={idx} className="px-3 py-2 border-b border-r border-[#ddd] font-bold text-gray-700 whitespace-nowrap bg-gray-100 text-center">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.rows?.map((row: any[], rIdx: number) => (
                    <tr key={rIdx} className="hover:bg-blue-50/40 transition-colors">
                      {row.map((cell: any, cIdx: number) => {
                        const isStatus = data.header[cIdx] === 'Allow Status';
                        return (
                          <td key={cIdx} className={`px-3 py-2 border-r border-gray-100 text-center ${isStatus ? 'font-bold' : ''}`}>
                            {isStatus ? (
                              <div className="flex items-center justify-center gap-1.5">
                                {cell === 'ALLOWED' ? (
                                  <><CheckCircle2 size={14} className="text-green-600" /><span className="text-green-600">ALLOWED</span></>
                                ) : (
                                  <><X size={14} className="text-red-500" /><span className="text-red-500">NOT ALLOWED</span></>
                                )}
                              </div>
                            ) : cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {data.total === 0 && (
              <div className="p-20 text-center text-gray-500 font-medium italic flex flex-col items-center gap-2">
                <p>No records match your current filter criteria.</p>
                <p className="text-sm font-normal text-gray-400 max-w-sm">
                  Tip: Test scores in Google Sheets may be formatted with "%" signs or spaces which require stripping. Try unchecking "Only Show Allowed" or updating your Google Apps Script using the provided updated file.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
