import React, { useState, useEffect } from 'react';
import { Search, Loader2, Save, X, RefreshCw, AlertCircle, CheckCircle2, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GAS_CODE_V9_2 } from '../lib/gasScript';

const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxye4gktctNZxpQsDxDwjwM_DEdR0rw998uGhcYBA1rzkVOjQtmO1diNdMSV_woQ8w/exec';

const AppScriptFixModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-red-50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-bold text-red-900">Action Required: Update Google Apps Script</h3>
          </div>
          <button onClick={onClose} className="text-red-400 hover:text-red-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <p className="mb-4 text-gray-800 text-lg">
            <strong>Critical Update (v9.2):</strong> A bug in the previous script caused edits to overwrite formulas in your Google Sheet (like the SL column adding hardcoded numbers instead of formulas). This version fixes that by only updating specific edited cells.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md mb-6 shadow-sm">
            <p className="text-yellow-800 font-medium">Please update your script to v9.2:</p>
            <ol className="list-decimal pl-6 mt-2 font-normal text-yellow-900 space-y-1">
              <li>Open your Google Sheet.</li>
              <li>Go to <strong>Extensions &gt; Apps Script</strong>.</li>
              <li>Copy the code below entirely and replace all code in <strong>Code.gs</strong>.</li>
              <li>Click <strong>Deploy &gt; Manage deployments</strong>.</li>
              <li>Click the pencil icon, choose <strong>New version</strong>, and click <strong>Deploy</strong>.</li>
            </ol>
          </div>
          <div className="relative">
            <div className="bg-slate-900 p-4 rounded text-xs sm:text-sm font-mono overflow-auto whitespace-pre text-slate-50 shadow-inner h-64">
              {GAS_CODE_V9_2}
            </div>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(GAS_CODE_V9_2);
                alert('Code copied to clipboard!');
              }}
              className="absolute top-2 right-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs transition-colors border border-white/20"
            >
              Copy Code
            </button>
          </div>
        </div>
        <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
          <button onClick={onClose} className="px-6 py-2 bg-red-600 text-white font-bold rounded-md shadow hover:bg-red-700 transition-colors">
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

// Column mapping (matching ExaminerSearchForm)
const COL = {
  NICK_NAME: 2, TPIN: 4, INST: 5, DEPT: 6, HSC_BATCH: 7, RM: 8,
  MOBILE_1: 10, MOBILE_2: 11, MOBILE_BANKING: 12,
  RUNNING_PROGRAM: 16, PREVIOUS_PROGRAM: 17,
  EMAIL: 22, TEAMS_ID: 23,
  HSC_ROLL: 28, HSC_REG: 29, HSC_BOARD: 30, HSC_GPA: 31,
  SUBJECT_1: 34, SUBJECT_2: 35, SUBJECT_3: 36, SUBJECT_4: 37, SUBJECT_5: 38,
  VERSION_INTERESTED: 39,
  FULL_NAME: 43, RELIGION: 45, GENDER: 46, DATE_OF_BIRTH: 47,
  FATHERS_NAME: 52, MOTHERS_NAME: 56, HOME_DISTRICT: 61,
  ENGLISH_PCT: 62, ENGLISH_SET: 63, ENGLISH_DATE: 64,
  BANGLA_PCT: 65, BANGLA_SET: 66, BANGLA_DATE: 67,
  PHYSICS_PCT: 68, PHYSICS_SET: 69, PHYSICS_DATE: 70,
  CHEMISTRY_PCT: 71, CHEMISTRY_SET: 72, CHEMISTRY_DATE: 73,
  MATH_PCT: 74, MATH_SET: 75, MATH_DATE: 76,
  BIOLOGY_PCT: 77, BIOLOGY_SET: 78, BIOLOGY_DATE: 79,
  ICT_PCT: 80, ICT_SET: 81, ICT_DATE: 82,
  TRAINING_REPORT: 83, TRAINING_DATE: 84,
  ID_CHECKED: 86, FORM_FILL_DATE: 88, PHYSICAL_CAMPUS_PREF: 89,
  SELECTED_SUBJECT: 92,
  REMARK_COMMENT: 93
};

export default function ExaminerSearchEditForm() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [allData, setAllData] = useState<any[][]>([]);
  const [editingRow, setEditingRow] = useState<any[] | null>(null);
  const [originalRow, setOriginalRow] = useState<any[] | null>(null);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  useEffect(() => {
    const cached = localStorage.getItem('examiner_sync_data');
    if (cached) {
      try {
        setAllData(JSON.parse(cached));
      } catch (e) {
        handleSync();
      }
    } else {
      handleSync();
    }
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    setStatus({ type: null, message: '' });
    try {
      const response = await fetch(`${SCRIPT_URL}?action=sync`);
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (result.ok && Array.isArray(result.data)) {
          setAllData(result.data);
          localStorage.setItem('examiner_sync_data', JSON.stringify(result.data));
        } else {
          setStatus({ type: 'error', message: 'Invalid data format received from the server.' });
        }
      } catch (err) {
        console.error('JSON Parse error', err);
        if (text.trim().startsWith('<')) {
          setStatus({ type: 'error', message: 'Received HTML instead of JSON. Please deploy the Google Apps Script Web App with access set to "Anyone".' });
        } else {
          setStatus({ type: 'error', message: 'Failed to parse response from server.' });
        }
      }
    } catch (err) {
      console.error('Sync failed', err);
      setStatus({ type: 'error', message: 'Network request failed during sync.' });
    } finally {
      setSyncing(false);
    }
  };

  const normSearch = (v: string) => v.replace(/\D/g, '').slice(-10);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const q = query.trim().toLowerCase();
    const qNorm = normSearch(q);

    const found = allData.find(row => {
      const tpin = String(row[COL.TPIN - 1] || '').toLowerCase();
      const m1 = String(row[COL.MOBILE_1 - 1] || '');
      const m2 = String(row[COL.MOBILE_2 - 1] || '');
      const nmb = String(row[COL.MOBILE_BANKING - 1] || '');

      return tpin === q || 
             normSearch(m1) === qNorm || 
             normSearch(m2) === qNorm || 
             normSearch(nmb) === qNorm;
    });

    if (found) {
      setEditingRow([...found]);
      setOriginalRow([...found]);
      setStatus({ type: null, message: '' });
    } else {
      setEditingRow(null);
      setStatus({ type: 'error', message: 'No examiner found with this T-PIN or Mobile.' });
    }
    setLoading(false);
  };

  const handleInputChange = (colIndex: number, value: string) => {
    if (!editingRow) return;
    const newRow = [...editingRow];
    newRow[colIndex - 1] = value;
    setEditingRow(newRow);
  };

  const handleSave = async () => {
    if (!editingRow || !originalRow) return;
    
    setIsSaving(true);
    setStatus({ type: null, message: '' });

    const originalTpin = String(originalRow[COL.TPIN - 1] || '').trim();
    const originalMobile = String(originalRow[COL.MOBILE_1 - 1] || '').trim();
    const originalMobile2 = String(originalRow[COL.MOBILE_2 - 1] || '').trim();
    const backupData = [...allData];

    // Build the updates object matching their GAS script exactly
    const updates: Record<string, string> = {};
    Object.keys(COL).forEach(key => {
      const idx = COL[key as keyof typeof COL] - 1;
      const newVal = String(editingRow[idx] || '').trim();
      const oldVal = String(originalRow[idx] || '').trim();
      if (newVal !== oldVal) {
        updates[key] = newVal;
      }
    });

    // Determine the tpin to send to the backend for identification
    // If they changed the TPIN, we MUST send the original TPIN so backend can find the record
    // If there was no TPIN initially, the backend script's updateRow fails with 'TPIN required'
    // but we will send the original TPIN (which is empty) and let backend handle it, or use mobile if we had to 
    // Wait, their update logic only uses TPIN: `updateRow(tpin, updates...`
    const searchTpin = originalTpin;

    if (!searchTpin && !originalMobile && !originalMobile2) {
      setStatus({ 
        type: 'error', 
        message: 'Could not identify record for updating.' 
      });
      setIsSaving(false);
      return;
    }

    // Optimistic Update: Update UI immediately
    const updatedLocal = allData.map(row => {
      const rowTpin = String(row[COL.TPIN - 1] || '').trim();
      const rowMobile = String(row[COL.MOBILE_1 - 1] || '').trim();
      const rowMobile2 = String(row[COL.MOBILE_2 - 1] || '').trim();
      
      if (originalTpin && rowTpin === originalTpin) return editingRow;
      if (originalMobile && rowMobile === originalMobile) return editingRow;
      if (originalMobile2 && rowMobile2 === originalMobile2) return editingRow;
      
      return row;
    });
    setAllData(updatedLocal);
    localStorage.setItem('examiner_sync_data', JSON.stringify(updatedLocal));

    try {
      const payload = {
        action: 'update',
        tpin: searchTpin,  // Finding the row (For backward compatibility with their actual V9 script)
        searchKey: searchTpin || originalMobile || originalMobile2, // Our new enhanced search key
        updates: updates   // Applying only changed values
      };

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload)
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch (e) {
        throw new Error('Database server returned an invalid response. Data might have been saved but confirmation failed.');
      }
      
      if (!result || !result.ok) {
        const backendMsg = result?.message || 'Database update failed';
        if (backendMsg.toLowerCase().includes('tpin required') || backendMsg.toLowerCase().includes('not found')) {
           setShowScriptModal(true);
           throw new Error(`Action Required: Please update your Google Apps Script to v9.1. Original Error: ${backendMsg}`);
        }
        throw new Error(backendMsg);
      }
      
      setStatus({ type: 'success', message: 'Database updated successfully!' });
      setOriginalRow([...editingRow]);
      
    } catch (err) {
      console.error('Update failed', err);
      // Revert on failure
      setAllData(backupData);
      localStorage.setItem('examiner_sync_data', JSON.stringify(backupData));
      
      setStatus({ 
        type: 'error', 
        message: err instanceof Error ? err.message : 'Connection to database failed. Please check your internet.' 
      });
    } finally {
      setIsSaving(false);
    }
  };

  const renderInput = (label: string, col: number, type: string = 'text') => {
    if (!editingRow) return null;
    return (
      <div className="flex items-center gap-4">
        <label className="w-40 text-right font-bold text-gray-600 text-[13px]">{label}</label>
        <input 
          type={type} 
          value={editingRow[col - 1] || ''} 
          onChange={(e) => handleInputChange(col, e.target.value)}
          className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400 text-[13px]" 
        />
      </div>
    );
  };

  const renderScoreSet = (label: string, colScore: number, colSet: number) => {
    if (!editingRow) return null;
    return (
      <div className="flex items-center gap-4">
        <label className="w-40 text-right font-bold text-gray-600 text-[13px]">{label}</label>
        <div className="flex-grow flex items-center gap-2">
          <input 
            type="text" 
            value={editingRow[colScore - 1] || ''} 
            onChange={(e) => handleInputChange(colScore, e.target.value)}
            className="w-1/2 border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400 text-[13px]" 
            placeholder="Score"
          />
          <span className="text-gray-400 text-sm font-light">/</span>
          <input 
            type="text" 
            value={editingRow[colSet - 1] || ''} 
            onChange={(e) => handleInputChange(colSet, e.target.value)}
            className="w-1/2 border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400 text-[13px]" 
            placeholder="Set"
          />
        </div>
      </div>
    );
  };

  const renderSelect = (label: string, col: number, options: string[]) => {
    if (!editingRow) return null;
    return (
      <div className="flex items-center gap-4">
        <label className="w-40 text-right font-bold text-gray-600 text-[13px]">{label}</label>
        <select 
          value={editingRow[col - 1] || ''} 
          onChange={(e) => handleInputChange(col, e.target.value)}
          className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400 bg-white text-[13px]"
        >
          <option value="">Select {label}</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
    );
  };

  return (
    <>
      <AppScriptFixModal isOpen={showScriptModal} onClose={() => setShowScriptModal(false)} />
      <div className="max-w-5xl mx-auto space-y-6 pb-20">
        {/* Search Header */}
        <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden">
          <div className="bg-[#002B49] text-white px-4 py-2 flex justify-between items-center">
            <div className="flex items-center gap-3">
             <Database size={16} className="text-yellow-400" />
             <h2 className="text-[14px] font-bold uppercase">Examiner Profile Edit</h2>
          </div>
          <button 
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 hover:text-yellow-400 transition-colors text-[12px] font-medium"
          >
            <RefreshCw size={14} className={syncing ? 'animate-spin' : ''} />
            {syncing ? 'Syncing..' : 'Sync Data'}
          </button>
        </div>

        <form onSubmit={handleSearch} className="p-6 flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center gap-5 w-full max-w-2xl">
            <label className="text-[14px] font-bold text-[#444] w-32 text-right shrink-0">T-PIN / Mobile</label>
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter T-PIN or Mobile Number"
              className="flex-grow border border-[#ccc] rounded-sm px-4 py-2 text-[14px] focus:outline-none focus:border-[#55a1d5] shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-[#55a1d5] hover:bg-[#4a8ebf] text-white px-8 py-2 rounded-sm text-[14px] font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            Search Examiner
          </button>
        </form>
      </div>

      <AnimatePresence>
        {status.type && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`p-4 rounded-sm border ${
              status.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'
            } flex items-center gap-3 text-[14px] font-bold shrink-0`}
          >
            {status.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {status.message}
          </motion.div>
        )}
      </AnimatePresence>

      {editingRow && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden"
        >
          <div className="bg-gray-100 px-4 py-2 border-b border-[#d5d5d5] flex justify-between items-center">
            <h3 className="text-[14px] font-bold text-[#002B49]">Profile Edit</h3>
          </div>

          <div className="p-8 space-y-10">
            {/* 1. Examiner Quick Info Section */}
            <section className="space-y-6">
              <h4 className="text-[16px] font-bold text-blue-800 border-b pb-1 uppercase tracking-tight">Examiner Quick Info</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                {renderInput("T-PIN", COL.TPIN)}
                {renderInput("RM", COL.RM)}
                {renderInput("Nick Name", COL.NICK_NAME)}
                {renderInput("Full Name", COL.FULL_NAME)}
                {renderInput("Mobile 1", COL.MOBILE_1)}
                {renderInput("Mobile 2", COL.MOBILE_2)}
                {renderInput("Mobile Banking", COL.MOBILE_BANKING)}
                {renderInput("Institute", COL.INST)}
                {renderInput("Department", COL.DEPT)}
                {renderInput("HSC Batch", COL.HSC_BATCH)}
                {renderInput("Training Report", COL.TRAINING_REPORT)}
                {renderInput("Training Date", COL.TRAINING_DATE)}
                {renderInput("Physical Campus", COL.PHYSICAL_CAMPUS_PREF)}
              </div>
            </section>

            {/* 2. Assessments Report Section */}
            <section className="space-y-6">
              <h4 className="text-[16px] font-bold text-blue-800 border-b pb-1 uppercase tracking-tight">Assessments Report</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                {renderScoreSet("English Score/Set", COL.ENGLISH_PCT, COL.ENGLISH_SET)}
                {renderInput("English Date", COL.ENGLISH_DATE)}
                {renderScoreSet("Bangla Score/Set", COL.BANGLA_PCT, COL.BANGLA_SET)}
                {renderInput("Bangla Date", COL.BANGLA_DATE)}
                {renderScoreSet("Physics Score/Set", COL.PHYSICS_PCT, COL.PHYSICS_SET)}
                {renderInput("Physics Date", COL.PHYSICS_DATE)}
                {renderScoreSet("Chemistry Score/Set", COL.CHEMISTRY_PCT, COL.CHEMISTRY_SET)}
                {renderInput("Chemistry Date", COL.CHEMISTRY_DATE)}
                {renderScoreSet("ICT Score/Set", COL.ICT_PCT, COL.ICT_SET)}
                {renderInput("ICT Date", COL.ICT_DATE)}
                {renderScoreSet("Math Score/Set", COL.MATH_PCT, COL.MATH_SET)}
                {renderInput("Math Date", COL.MATH_DATE)}
                {renderScoreSet("Biology Score/Set", COL.BIOLOGY_PCT, COL.BIOLOGY_SET)}
                {renderInput("Biology Date", COL.BIOLOGY_DATE)}
              </div>
            </section>

            {/* 3. Personal Information Section */}
            <section className="space-y-6">
              <h4 className="text-[16px] font-bold text-blue-800 border-b pb-1 uppercase tracking-tight">Personal Information</h4>
              <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                {renderInput("Father's Name", COL.FATHERS_NAME)}
                {renderInput("Mother's Name", COL.MOTHERS_NAME)}
                {renderSelect("Religion", COL.RELIGION, ["Islam", "Hindu", "Christian", "Buddhist", "Other"])}
                {renderSelect("Gender", COL.GENDER, ["Male", "Female", "Other"])}
                {renderInput("Date of Birth", COL.DATE_OF_BIRTH, "date")}
                {renderInput("Email", COL.EMAIL, "email")}
                {renderInput("Teams ID", COL.TEAMS_ID)}
                {renderInput("Home District", COL.HOME_DISTRICT)}
                {renderInput("HSC Roll", COL.HSC_ROLL)}
                {renderInput("HSC Reg", COL.HSC_REG)}
                {renderInput("HSC Board", COL.HSC_BOARD)}
                {renderInput("HSC GPA", COL.HSC_GPA)}
                {renderInput("Running Program", COL.RUNNING_PROGRAM)}
                {renderInput("Previous Program", COL.PREVIOUS_PROGRAM)}
                {renderInput("Selected Subject", COL.SELECTED_SUBJECT)}
                {renderInput("ID Checked?", COL.ID_CHECKED)}
              </div>
            </section>

            {/* Remarks Section */}
            <section className="space-y-4">
              <h4 className="text-[16px] font-bold text-blue-800 border-b pb-1 uppercase tracking-tight">Remarks</h4>
              <div className="flex gap-5">
                <label className="w-32 text-right font-bold text-gray-600 text-[13px] pt-2">Remark Comment</label>
                <textarea 
                  value={editingRow[COL.REMARK_COMMENT - 1] || ''} 
                  onChange={(e) => handleInputChange(COL.REMARK_COMMENT, e.target.value)}
                  className="flex-grow border border-[#ccc] rounded-sm p-4 h-40 focus:outline-none focus:border-blue-400 text-[14px] font-bold font-bangla"
                  placeholder="Enter remarks here..."
                ></textarea>
              </div>
            </section>

            <div className="pt-10 flex justify-center gap-6 border-t">
               <button 
                 onClick={() => setEditingRow(null)}
                 className="px-10 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 text-[14px] font-bold transition-all shadow-sm"
               >
                 Discard Changes
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="bg-green-600 hover:bg-green-700 text-white px-10 py-3 rounded-sm text-[14px] font-bold transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
               >
                 {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                 Save All Changes to Database
               </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
    </>
  );
}
