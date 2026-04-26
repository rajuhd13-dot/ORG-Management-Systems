import React, { useState, useEffect, useRef } from 'react';
import { Search, User, Phone, MapPin, GraduationCap, BookOpen, AlertCircle, CheckCircle2, History, CreditCard, Mail, Users, Calendar, ClipboardCheck, Zap, Database, Upload, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Configuration based on AppScript provide
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz7FLsOGJDUluBeLYm85VU-HyOM8yZ2pjcpzzX4Oz7N80IPFVAgL6uv788SZM4LfuilgA/exec';

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
  REMARK_COMMENT: 93,
  REMARK_COUNT: 94, REMARK_TEXT: 94, REMARK_BY: 95, REMARK_DATE: 96
};

const formatMobile = (v: any) => {
  let s = String(v || '').trim();
  if (!s) return '';
  // Handle 880 or 88 prefix
  if (s.startsWith('880')) return s.substring(2);
  if (s.startsWith('88')) return s.substring(2);
  // Add leading zero if 10 digits
  if (s.length === 10 && /^\d+$/.test(s)) return '0' + s;
  return s;
};

// Types for mapped data (matching AppScript mapRow_ output)
interface ExaminerData {
  quick: {
    tpin: string;
    rm: string;
    nickName: string;
    fullName: string;
    mobile1: string;
    mobile2: string;
    nagadNumber: string;
    institute: string;
    department: string;
    hscGpa: string;
    hscBatch: string;
    trainingReport: string;
    trainingDate: string;
    physicalCampus: string;
  };
  assessments: Array<{
    subject: string;
    percent: string;
    set: string;
    date: string;
    status: string;
  }>;
  remark: {
    count: number;
    show: boolean;
    body: string;
    byLine: string;
    dateLine: string;
  };
  personal: {
    fathersName: string;
    mothersName: string;
    religion: string;
    gender: string;
    dateOfBirth: string;
    hscRoll: string;
    hscReg: string;
    teamsId: string;
    hscBoard: string;
    email: string;
    regDate: string;
    homeDistrict: string;
    subjectsChoice: string;
    selectedSub: string;
    versionInterested: string;
    idChecked: string;
    runningProgram: string;
    previousProgram: string;
  };
}

export default function ExaminerSearchForm() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [allData, setAllData] = useState<any[]>([]);
  const [data, setData] = useState<ExaminerData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'loading' | 'cached'>('idle');

  // Load cache on mount
  useEffect(() => {
    const cachedData = localStorage.getItem('examiner_sync_data');
    if (cachedData) {
      try {
        setAllData(JSON.parse(cachedData));
        setSyncStatus('cached');
      } catch (e) {
        console.error('Failed to parse cached data', e);
      }
    }
    // Automatically start sync in background
    handleSync();
  }, []);

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'sync' })
      });
      const text = await response.text();
      try {
        const result = JSON.parse(text);
        if (result.ok && Array.isArray(result.data)) {
          setAllData(result.data);
          localStorage.setItem('examiner_sync_data', JSON.stringify(result.data));
          setSyncStatus('cached');
          setError(null);
        } else {
          let msg = result.error || result.message || 'Invalid data format received from the server.';
          if (msg.includes('Invalid action: sync')) {
            msg = 'Script Error: Please copy the updated code from public/gas-script.js and deploy it to your Google Apps Script as a new version.';
          }
          setError(msg);
        }
      } catch (err) {
        console.error('JSON Parse error', err);
        if (text.trim().startsWith('<')) {
          setError('Received HTML instead of JSON. Please deploy the Google Apps Script Web App with access set to "Anyone".');
        } else {
          setError('Failed to parse response from server.');
        }
      }
    } catch (err) {
      console.error('Sync failed', err);
      setError('Network request failed during sync.');
    } finally {
      setSyncing(false);
    }
  };

  const norm = (v: any) => {
    v = String(v || '').trim();
    if (!v) return '';
    const d = v.replace(/\D/g, '');
    if (d) {
      if (d.length >= 12 && d.slice(0, 3) === '880') return d;
      if (d[0] === '0' && d.length === 11) return '88' + d;
      if (d[0] === '1' && d.length === 10) return '880' + d;
      return d;
    }
    return v.toUpperCase();
  };

  const mapRow = (row: any[]): ExaminerData => {
    const g = (c: number) => row[c - 1] || '';
    const rm = String(g(COL.RM)).trim();
    const rmNum = parseInt(rm.match(/\d+/)?.[0] || '0');

    const mkAs = (name: string, pctCol: number, setCol: number, dateCol: number, pass: number) => {
      const p = String(g(pctCol)).trim();
      const s = String(g(setCol)).trim();
      const d = String(g(dateCol)).trim();
      
      const scoreMatch = p.match(/(\d+(?:\.\d+)?)\s*\/\s*\d+/);
      const sc = scoreMatch ? parseFloat(scoreMatch[1]) : parseFloat(p.match(/-?\d+(?:\.\d+)?/)?.[0] || '0');
      
      const st = (p || s || d) ? (sc >= pass ? 'Allow' : 'Not Allow') : 'No Exam';
      return { subject: name, percent: p, set: s, date: d, status: st };
    };

    const remarkRaw = String(g(COL.REMARK_COMMENT)).trim();
    const bodyLines: string[] = [];
    let byLine = '', dateLine = '';
    
    remarkRaw.split('\n').forEach(line => {
      const l = line.trim();
      if (!l) return;
      if (l.charAt(0) === '#') byLine = l;
      else if (/^date\s*:/i.test(l)) dateLine = l;
      else bodyLines.push(l);
    });

    const body = bodyLines.join('\n').trim() || (rmNum > 0 ? 'No specific comments found.' : '');

    return {
      quick: {
        tpin: g(COL.TPIN), rm: rm, nickName: g(COL.NICK_NAME),
        fullName: g(COL.FULL_NAME), mobile1: formatMobile(g(COL.MOBILE_1)), mobile2: formatMobile(g(COL.MOBILE_2)),
        nagadNumber: formatMobile(g(COL.MOBILE_BANKING)), institute: g(COL.INST), department: g(COL.DEPT),
        hscGpa: g(COL.HSC_GPA), hscBatch: g(COL.HSC_BATCH),
        trainingReport: g(COL.TRAINING_REPORT), trainingDate: g(COL.TRAINING_DATE),
        physicalCampus: g(COL.PHYSICAL_CAMPUS_PREF)
      },
      assessments: [
        mkAs('English (%)',   COL.ENGLISH_PCT,   COL.ENGLISH_SET,   COL.ENGLISH_DATE,   60),
        mkAs('Bangla (%)',    COL.BANGLA_PCT,    COL.BANGLA_SET,    COL.BANGLA_DATE,    50),
        mkAs('Physics (%)',   COL.PHYSICS_PCT,   COL.PHYSICS_SET,   COL.PHYSICS_DATE,   50),
        mkAs('Chemistry (%)', COL.CHEMISTRY_PCT, COL.CHEMISTRY_SET, COL.CHEMISTRY_DATE, 50),
        mkAs('Math (%)',      COL.MATH_PCT,      COL.MATH_SET,      COL.MATH_DATE,      50),
        mkAs('Biology (%)',   COL.BIOLOGY_PCT,   COL.BIOLOGY_SET,   COL.BIOLOGY_DATE,   50),
        mkAs('ICT (%)',       COL.ICT_PCT,       COL.ICT_SET,       COL.ICT_DATE,       50)
      ],
      remark: { count: rmNum, show: rmNum >= 4 || (remarkRaw.length > 0 && rmNum > 0), body, byLine, dateLine },
      personal: {
        fathersName: g(COL.FATHERS_NAME), mothersName: g(COL.MOTHERS_NAME),
        religion: g(COL.RELIGION), gender: g(COL.GENDER), dateOfBirth: g(COL.DATE_OF_BIRTH),
        hscRoll: g(COL.HSC_ROLL), hscReg: g(COL.HSC_REG), teamsId: g(COL.TEAMS_ID),
        hscBoard: g(COL.HSC_BOARD), email: g(COL.EMAIL), regDate: g(COL.FORM_FILL_DATE),
        homeDistrict: g(COL.HOME_DISTRICT),
        subjectsChoice: [g(COL.SUBJECT_1), g(COL.SUBJECT_2), g(COL.SUBJECT_3), g(COL.SUBJECT_4), g(COL.SUBJECT_5)].filter(Boolean).join(', '),
        selectedSub: g(COL.SELECTED_SUBJECT), versionInterested: g(COL.VERSION_INTERESTED),
        idChecked: g(COL.ID_CHECKED), runningProgram: g(COL.RUNNING_PROGRAM),
        previousProgram: g(COL.PREVIOUS_PROGRAM)
      }
    };
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    // 1. Try local memory search first (Super Fast)
    if (allData.length > 0) {
      const qNorm = norm(query);
      const foundRow = allData.find(row => 
        row[COL.TPIN - 1]?.toString().trim().toUpperCase() === query.trim().toUpperCase() ||
        norm(row[COL.MOBILE_1 - 1]) === qNorm ||
        norm(row[COL.MOBILE_2 - 1]) === qNorm
      );

      if (foundRow) {
        setData(mapRow(foundRow));
        setLoading(false);
        return;
      }
    }

    // 2. Fallback to server search if not in local cache
    try {
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ action: 'search', q: query.trim() })
      });
      const result = await response.json();

      if (result.ok) {
        setData(mapRow(result.data));
      } else {
        setError(result.message || 'No examiner found.');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Search Header - ORG Style */}
      <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm">
        <div className="bg-[#002B49] text-white px-4 py-2 font-semibold text-[14px] flex justify-between items-center">
            <span>Examiner Search</span>
            {syncing ? (
                 <div className="flex items-center gap-2 text-[11px] font-normal text-blue-300">
                    <Zap size={14} className="animate-pulse" />
                    Syncing Database...
                 </div>
            ) : syncStatus === 'cached' ? (
                <div className="flex items-center gap-2 text-[11px] font-normal text-green-300">
                    <Database size={14} />
                    {allData.length} records ready
                </div>
            ) : null}
        </div>
        
        <form onSubmit={handleSearch} className="py-12 flex flex-col items-center justify-center space-y-5">
          <div className="w-full max-w-sm space-y-5">
            <div className="flex items-center gap-4">
                <label className="text-[13px] font-bold text-[#444] w-28 text-right">T-PIN / Mobile</label>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 text-[14px] font-bold focus:outline-none focus:border-blue-400 bg-white"
                    placeholder="Enter To Search"
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
            </div>
            
            <div className="flex justify-center ml-32">
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-[#4a89c5] text-white px-10 py-2 rounded-sm text-[15px] font-bold hover:bg-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2 w-full"
                >
                    {loading ? (
                         <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <>
                            <Search size={18} />
                            Search Examiner
                        </>
                    )}
                </button>
            </div>
          </div>
        </form>
      </div>

      <AnimatePresence mode="wait">
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-sm flex items-center justify-center gap-3 text-[14px] font-bold"
          >
            <AlertCircle size={20} />
            {error}
          </motion.div>
        )}

        {data && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 pb-20"
          >
            {/* Special Remarks Section as requested in image - MOVED to top */}
            {data.remark.show && (
              <div className="bg-white border border-[#d5d5d5] rounded-sm p-8 shadow-sm">
                <div className="flex items-start gap-5">
                    <label className="text-[14px] font-bold text-[#444] w-32 text-right pt-2 shrink-0">Remarks</label>
                    <div className="flex-grow">
                        <div className="w-full min-h-[120px] border border-[#ccc] rounded-sm p-4 text-[14px] text-gray-700 bg-white font-bold font-bangla whitespace-pre-line leading-relaxed">
                            {data.remark.body}
                        </div>
                    </div>
                </div>
              </div>
            )}

            {/* Image 1: Examiner Quick Info */}
            <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden text-[#1e293b]">
              <div className="bg-[#1e293b] text-white px-4 py-2 flex justify-between items-center border-b border-[#1e293b]">
                <div className="flex items-center gap-3">
                  <div className="w-1.5 h-4 bg-yellow-400 rounded-full" />
                  <h2 className="text-[14px] font-bold uppercase tracking-wide">Examiner Quick Info</h2>
                </div>
                <div className="flex gap-2">
                  <div className="bg-[#334155] px-3 py-1 rounded flex items-center gap-2 border border-[#475569]">
                    <span className="text-[12px] font-bold text-white uppercase">T-Pin</span>
                    <span className="text-[16px] font-bold text-yellow-400 leading-none">{data.quick.tpin}</span>
                  </div>
                  <div className="bg-[#334155] px-3 py-1 rounded flex items-center gap-2 border border-[#475569]">
                    <span className="text-[12px] font-bold text-white uppercase">RM</span>
                    <span className="text-[16px] font-bold text-yellow-400 leading-none">{data.quick.rm.match(/\d+/)?.[0] || data.quick.rm}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 text-[14px]">
                <QuickInfoRow label="Nick Name" value={data.quick.nickName} />
                <QuickInfoRow label="Full Name" value={data.quick.fullName} isLastCol />
                
                <QuickInfoRow label="Mobile 1" value={data.quick.mobile1} />
                <QuickInfoRow label="Institute" value={data.quick.institute} isLastCol />
                
                <QuickInfoRow label="Mobile 2" value={data.quick.mobile2} />
                <QuickInfoRow label="Department" value={data.quick.department} isLastCol />
                
                <QuickInfoRow label="Nagad Number" value={data.quick.nagadNumber} />
                <QuickInfoRow label="Training Report" value={data.quick.trainingReport} isLastCol />
                
                <QuickInfoRow label="HSC GPA" value={data.quick.hscGpa} />
                <QuickInfoRow label="Training Date" value={data.quick.trainingDate} isLastCol />
                
                <QuickInfoRow label="HSC Batch" value={data.quick.hscBatch} isLastRow />
                <QuickInfoRow label="Physical Campus" value={data.quick.physicalCampus} isLastCol isLastRow />
              </div>
            </div>

            {/* Image 2: Assessments Report */}
            <div className="space-y-4">
               <div className="bg-white border border-[#d5d5d5] rounded-sm py-2 px-4 shadow-sm flex items-center gap-3">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="text-[15px] font-bold text-[#002B49]">Assessments Report</h3>
               </div>
               
               <div className="bg-white border border-[#d5d5d5] rounded-sm overflow-hidden shadow-sm">
                 <table className="w-full text-left border-collapse text-[13.5px]">
                    <thead className="bg-[#334155] text-white">
                        <tr className="font-bold">
                            <th className="px-5 py-1.5 border-r border-[#475569]">Subjects</th>
                            <th className="px-5 py-1.5 border-r border-[#475569] text-center w-1/4">% & Set</th>
                            <th className="px-5 py-1.5 border-r border-[#475569] text-center w-1/4">Date</th>
                            <th className="px-5 py-1.5 text-right w-1/6">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[#eee]">
                        {data.assessments.map((item, idx) => (
                            <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="px-5 py-1 font-bold text-gray-700">{item.subject}</td>
                                <td className="px-5 py-1 text-center text-gray-600">
                                    {item.percent && (
                                        <span className="font-medium">
                                            {item.percent} {item.set ? `(${item.set})` : ''}
                                        </span>
                                    )}
                                </td>
                                <td className="px-5 py-1 text-center text-gray-600 font-medium">{item.date}</td>
                                <td className="px-5 py-1 text-right">
                                    <div className={`flex items-center justify-end gap-1 font-bold ${
                                        item.status === 'No Exam' ? 'text-gray-400' :
                                        item.status === 'Allow' ? 'text-green-600' : 'text-red-500'
                                    }`}>
                                        {item.status === 'Allow' && <CheckCircle2 size={14} />}
                                        {item.status === 'Not Allow' && <XCircle size={14} />}
                                        {item.status}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
               </div>
            </div>

            {/* Image 3: Personal Information */}
            <div className="space-y-4">
               <div className="bg-white border border-[#d5d5d5] rounded-sm py-2 px-4 shadow-sm flex items-center gap-3">
                  <div className="w-1 h-5 bg-blue-600 rounded-full" />
                  <h3 className="text-[15px] font-bold text-[#002B49]">Personal Information</h3>
               </div>
               
               <div className="bg-white border border-[#d5d5d5] rounded-sm overflow-hidden shadow-sm">
                 <div className="grid grid-cols-1 md:grid-cols-2 text-[14px]">
                    <QuickInfoRow label="Father's Name" value={data.personal.fathersName} />
                    <QuickInfoRow label="Mother's Name" value={data.personal.mothersName} isLastCol />
                    
                    <QuickInfoRow label="Religion" value={data.personal.religion} />
                    <QuickInfoRow label="Gender" value={data.personal.gender} isLastCol />
                    
                    <QuickInfoRow label="Date of Birth" value={data.personal.dateOfBirth} />
                    <QuickInfoRow label="HSC Roll" value={data.personal.hscRoll} isLastCol />
                    
                    <QuickInfoRow label="Teams ID" value={data.personal.teamsId} />
                    <QuickInfoRow label="HSC Reg" value={data.personal.hscReg} isLastCol />
                    
                    <QuickInfoRow label="E-mail" value={data.personal.email} valueColor="text-blue-700" />
                    <QuickInfoRow label="HSC Board" value={data.personal.hscBoard} isLastCol />
                    
                    <QuickInfoRow label="Home District" value={data.personal.homeDistrict} />
                    <QuickInfoRow label="Reg. Date" value={data.personal.regDate} isLastCol />
                    
                    <QuickInfoRow label="Subjects Choice" value={data.personal.subjectsChoice} valueColor="text-blue-600" />
                    <QuickInfoRow label="Selected Sub" value={data.personal.selectedSub} isLastCol />
                    
                    <QuickInfoRow label="Version" value={data.personal.versionInterested} />
                    <QuickInfoRow label="ID Checked?" value={data.personal.idChecked} isLastCol />
                    
                    <QuickInfoRow label="Running Program" value={data.personal.runningProgram} isLastRow />
                    <QuickInfoRow label="Previous Program" value={data.personal.previousProgram} isLastCol isLastRow />
                 </div>
               </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper components for the ORG layout
function QuickInfoRow({ 
    label, 
    value, 
    isLastCol = false, 
    isLastRow = false, 
    valueColor = "text-gray-900"
}: { 
    label: string, 
    value: string, 
    isLastCol?: boolean, 
    isLastRow?: boolean,
    valueColor?: string
}) {
    return (
        <div className={`flex border-b border-[#eee] ${!isLastRow ? '' : 'md:border-b-0'} ${!isLastCol ? 'md:border-r' : ''}`}>
            <div className="w-1/3 bg-gray-50/50 px-4 py-1.5 text-gray-500 font-medium border-r border-[#eee]">
                {label}
            </div>
            <div className="flex-grow px-4 py-1.5 flex justify-between items-center min-h-[34px]">
                <span className={`font-bold ${valueColor}`}>{value || ''}</span>
            </div>
        </div>
    );
}
