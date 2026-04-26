import React, { useState } from 'react';
import { Download, Search, RefreshCw, AlertCircle, Database } from 'lucide-react';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7FLsOGJDUluBeLYm85VU-HyOM8yZ2pjcpzzX4Oz7N80IPFVAgL6uv788SZM4LfuilgA/exec';

interface DataCollectionProps {}

const DataCollection: React.FC<DataCollectionProps> = () => {
  const [phoneNumbers, setPhoneNumbers] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[][]>([]);
  const [headers, setHeaders] = useState<string[]>([]);

  const handleSearch = async () => {
    if (!phoneNumbers.trim()) {
      setError('Please enter at least one mobile number.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ action: 'sync' })
      });

      const responseData = await response.json();
      if (responseData.ok) {
        const body = responseData.data || [];
        const head = responseData.header || [];
        
        const searchInput = phoneNumbers
          .split(/[\n,]+/)
          .map(n => n.trim())
          .filter(Boolean);

        const matched = body.filter((row: any[]) => {
          const mobile1 = String(row[9] || '').trim(); // Row J (index 9)
          const mobile2 = String(row[10] || '').trim(); // Row K (index 10)
          
          return searchInput.some(inputNum => 
            mobile1.includes(inputNum) || mobile2.includes(inputNum)
          );
        });

        setHeaders(head);
        setResults(matched);

        if (matched.length === 0) {
          setError('No records found for the given mobile numbers.');
        }
      } else {
        let msg = responseData.error || responseData.message || (typeof responseData === 'string' ? responseData : JSON.stringify(responseData));
        if (msg.includes('Invalid action: sync')) {
          msg = 'Script Error: Please copy the updated code from public/gas-script.js and deploy it to your Google Apps Script as a new version.';
        }
        setError(msg);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(`Network Error: ${err.message || 'Check console for details'}`);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!headers.length || !results.length) return;

    let csvContent = "";
    
    // Process headers
    csvContent += headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(',') + '\n';
    
    // Process rows
    results.forEach(row => {
      const rowString = row.map(cell => 
        `"${String(cell || '').replace(/"/g, '""')}"`
      ).join(',');
      csvContent += rowString + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "data_collection_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 animate-in fade-in duration-500 font-['Segoe_UI',sans-serif]">
      {/* Search Header - ORG Style */}
      <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm">
        <div className="bg-[#002B49] text-white px-4 py-2 font-semibold text-[14px] flex justify-between items-center">
            <div className="flex items-center gap-2">
                <Database size={16} />
                <span>Data Collection</span>
            </div>
            {results.length > 0 && (
              <button 
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-[12px] font-bold flex items-center gap-1 transition-colors"
                title="Export to CSV"
              >
                <Download size={14} /> Export Options
              </button>
            )}
        </div>
        
        <div className="p-6">
          <div className="space-y-4 w-full">
            <div>
                <label className="block text-[13px] font-bold text-gray-700 mb-2">
                    Mobile Numbers <span className="text-red-500">*</span>
                    <span className="text-gray-400 font-normal ml-2">(Enter multiple numbers separated by comma or new line)</span>
                </label>
                <textarea
                    value={phoneNumbers}
                    onChange={(e) => setPhoneNumbers(e.target.value)}
                    className="w-full border border-gray-300 rounded p-3 text-[14px] min-h-[120px] focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                    placeholder="e.g.&#10;01712345678&#10;01987654321, 01811223344"
                />
            </div>
            
            <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-2 rounded font-bold text-[14px] flex items-center justify-center gap-2 transition-colors disabled:opacity-50 min-w-[150px]"
            >
                {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
                {loading ? 'Searching...' : 'Search Records'}
            </button>
          </div>
          
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded flex items-start gap-3">
              <AlertCircle size={20} className="mt-0.5 flex-shrink-0" />
              <div className="text-[14px] font-bold">{error}</div>
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {results.length > 0 && (
         <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden">
             <div className="bg-[#002B49] text-white px-4 py-2 font-bold text-[13px] flex justify-between items-center">
                 <span>Results: {results.length} Records Found</span>
             </div>
             <div className="overflow-x-auto">
                 <table className="w-full text-center border-collapse text-[13px]">
                     <thead>
                         <tr className="bg-[#f8f9fa] border-b border-[#e5e5e5]">
                             {headers.map((h, idx) => (
                                 <th key={idx} className="px-3 py-2 border-r border-[#e5e5e5] last:border-r-0 font-bold text-gray-700 whitespace-nowrap">
                                     {h}
                                 </th>
                             ))}
                         </tr>
                     </thead>
                     <tbody>
                         {results.map((row, rowIdx) => (
                             <tr key={rowIdx} className="border-b border-[#e5e5e5] hover:bg-gray-50 transition-colors">
                                 {row.map((cell, cellIdx) => (
                                     <td key={cellIdx} className="px-3 py-2 border-r border-[#e5e5e5] last:border-r-0 whitespace-nowrap text-gray-600">
                                         {String(cell || '')}
                                     </td>
                                 ))}
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         </div>
      )}
    </div>
  );
};

export default DataCollection;
