import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Download } from 'lucide-react';

const COURSES_BY_PROGRAM: Record<string, string[]> = {
  "SSC Model Test": [
    "SSC Model Test (for Science)", "SSC Model Test (for Arts & Commerce)", "Dakhil Model Test (for Science)",
    "Dakhil Model Test (for General)", "SSC Cadet Special Model Test [With Books]", "SSC Cadet Special Model Test [Without Books]",
    "SSC MT 2026 Online Service", "SSC MT 2026 Offline Service", "SSC Final Model Test (for Science)",
    "SSC Final Model Test (for Arts & Commerce)", "SSC FMT 2026 Online Service", "SSC FMT 2026 Online Service [Irregular]",
    "SSC FMT 2026 Offline Service"
  ],
  "Class 9 Academic Program": ["Orientation Class"],
  "Class 10 Academic Program": ["Orientation Class"],
  "Engineering Admission Program": ["Engineering Admission Course"],
  "Varsity 'KA' Admission Program": ["Varsity 'KA' Admission Course"],
  "Varsity 'KHA' Admission Program": ["Varsity 'KHA' Admission Course"],
  "HSC Model Test": [
    "HSC/Alim Model Test (for Science)",
    "HSC/Alim Model Test (for Arts & Commerce)",
    "HSC Cadet Special Model Test (With Books)",
    "HSC Cadet Special Model Test (Without Books)",
    "HSC'26 Model Test Online Service [Irregular]",
    "HSC'26 Model Test Online Service",
    "HSC'26 Model Test Offline Service",
    "HSC/Alim Final Model Test (for Science)",
    "HSC/Alim Final Model Test (for Arts & Commerce)",
    "HSC'26 Final Model Test Online Service [Irregular]",
    "HSC'26 Final Model Test Online Service",
    "HSC'26 Final Model Test Offline Service",
    "HSC/Alim MCQ Booster Course (for Science)",
    "HSC/Alim MCQ Booster Course (for Arts & Commerce)"
  ],
  "Class 9 Bangla-English Program": ["Class 9 BE Course"],
  "Class 10 Bangla-English Program": ["Class 10 BE Course"],
  "HSC Bangla-English Full Program": ["HSC BE Full Course"],
  "Class 11 Academic Program": ["Class 11 Academic Course"],
  "Class 12 Academic Program": ["Class 12 Academic Course"],
  "College Admission Program": ["College Admission Course"],
  "Cadet College Vorti Prostuti (Online)": [
    "Cadet College Vorti Full Course [Combo With Books]",
    "Cadet College Vorti Full Course [Combo Without Books]",
    "Cadet College Vorti Full Course [Online]",
    "Cadet College Vorti Full Course [Only Books]"
  ]
};

const EXAMS_BY_PROGRAM: Record<string, string[]> = {
  "Cadet College Vorti Prostuti (Online)": [
    "[424] Cadet Standard Weekly Exam-01",
    "[431] Cadet Standard Weekly Exam-08",
    "[433] Cadet Standard Weekly Exam-10",
    "[434] Cadet Standard Weekly Exam-11",
    "[435] Cadet Standard Weekly Exam-12",
    "[436] Cadet Standard Weekly Exam-13",
    "[437] Cadet Standard Weekly Exam-14",
    "[438] Cadet Standard Weekly Exam-15"
  ],
  "DEFAULT": [
    "[101] Bangla 1st Paper MCQ and Written Exam-01",
    "[102] Bangla 1st Paper MCQ and Written Exam-02",
    "[103] Bangla 2nd Paper MCQ and Written Exam-01",
    "[104] Bangla 2nd Paper MCQ and Written Exam-02",
    "[105] English 1st Paper Written Exam-01",
    "[106] English 1st Paper Written Exam-02",
    "[107] English 2nd Paper Written Exam-01",
    "[108] English 2nd Paper Written Exam-02"
  ]
};

const ALL_BRANCHES = [
  "Badda Udvash",
  "Bagerhat Udvash",
  "Bakshibazar Udvash",
  "Banasree Udvash",
  "Bandarban Udvash",
  "Barguna Udvash",
  "Barishal Udvash",
  "Basabo Udvash",
  "Bhairab Udvash",
  "Bhola Udvash",
  "Bogura Udvash",
  "Bogura Sherpur Udvash",
  "Bosila Udvash",
  "Brahmanbaria Udvash",
  "Cantonment Udvash",
  "Chandpur Udvash",
  "Chapainawabganj Udvash",
  "Chawkbazar Udvash (CTG)",
  "Chuadanga Udvash",
  "Cox's Bazar Udvash",
  "Cumilla Udvash",
  "Dinajpur Udvash",
  "Donia Udvash",
  "Faridpur Udvash",
  "Farmgate (MT) Udvash",
  "Feni Udvash",
  "Gaibandha Udvash",
  "Gazipur Udvash",
  "Ghatail Udvash",
  "Gobindaganj Udvash",
  "Gopalganj Udvash",
  "Habiganj Udvash",
  "Halishahar Udvash (CTG)",
  "Haziganj Udvash",
  "Ishwardi Udvash",
  "Jamalpur Udvash",
  "Jashore Udvash",
  "Jatrabari Udvash",
  "Jhalakathi Udvash",
  "Jhenaidah Udvash",
  "Jigatola Udvash",
  "Joypurhat Udvash",
  "Keraniganj Udvash",
  "Khagrachari Udvash",
  "Khilgaon Udvash",
  "Khulna Boyra Bazar Udvash",
  "Khulna Shantidham Mor Udvash",
  "Kishoreganj Udvash",
  "Konapara Udvash",
  "Kurigram Udvash",
  "Kushtia Udvash",
  "Lakshmipur Udvash",
  "Lalbagh Udvash",
  "Lalmonirhat Udvash",
  "Laxmibazar Udvash",
  "Madaripur Udvash",
  "Magura Udvash",
  "Malibagh Udvash",
  "Manikganj Udvash",
  "Meherpur Udvash",
  "Mirpur 1 Udvash",
  "Mirpur 2 Udvash",
  "Mohammadpur Udvash",
  "Motijheel Udvash",
  "Moulvibazar Udvash",
  "Munshiganj Udvash",
  "Mymensingh (KB) Udvash",
  "Mymensingh Udvash",
  "Naogaon Udvash",
  "Narayanganj Udvash",
  "Narail Udvash",
  "Narsingdi Udvash",
  "Natore Udvash",
  "Netrokona Udvash",
  "Nilphamari Udvash",
  "Noakhali Udvash",
  "Oxygen Udvash (CTG)",
  "Pabna Udvash",
  "Pallabi Udvash",
  "Panchagarh Udvash",
  "Patenga Udvash",
  "Patiya Udvash",
  "Patuakhali Udvash",
  "Pirganj Thakurgaon Udvash",
  "Pirganj Rangpur Udvash",
  "Pirojpur Udvash",
  "Rajbari Udvash",
  "Rajshahi Kadirganj Udvash",
  "Rajshahi Vodra Mor Udvash",
  "Rangamati Udvash",
  "Rangpur Khamar Mor Udvash",
  "Rangpur Medical Mor Udvash",
  "Rupnagar Udvash",
  "Saidpur Udvash",
  "Satkhira Udvash",
  "Savar Udvash",
  "Science Lab Udvash",
  "Shantinagar Udvash",
  "Shariatpur Udvash",
  "Sherpur Udvash",
  "Sirajganj Udvash",
  "Sunamganj Udvash",
  "Sylhet Tilagor Udvash",
  "Sylhet Chowhatta Udvash",
  "Tangail Udvash",
  "Thakurgaon Udvash",
  "Tongi Udvash",
  "Ullapara Udvash",
  "Uttara Azampur Udvash",
  "Uttara Diabari Udvash",
  "Uttara House Building Udvash"
];

export default function ScriptComparison() {
  const [formData, setFormData] = useState({
    organization: 'Select Organization',
    program: 'Select Program',
    session: 'Select Session',
    branch: ALL_BRANCHES,
    course: 'Select Course',
    exam: 'Select Exam',
    rows: '10'
  });

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getCourses = () => {
    return formData.program && formData.program !== 'Select Program' ? COURSES_BY_PROGRAM[formData.program] || [] : [];
  };

  const getExams = () => {
    if (formData.program && formData.program !== 'Select Program') {
      return EXAMS_BY_PROGRAM[formData.program] || EXAMS_BY_PROGRAM["DEFAULT"];
    }
    // Return all unique exam codes if program is not selected
    const allExams = Object.values(EXAMS_BY_PROGRAM).flat();
    return Array.from(new Set(allExams));
  };

  const filteredBranches = ALL_BRANCHES.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()));
  const allSelected = formData.branch.length === ALL_BRANCHES.length;
  
  const handleBranchSelectAll = (checked: boolean) => {
    setFormData(prev => ({ ...prev, branch: checked ? [...ALL_BRANCHES] : [] }));
  };

  const handleBranchSelect = (branchName: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      branch: checked 
        ? [...prev.branch, branchName]
        : prev.branch.filter(b => b !== branchName)
    }));
  };

  const getBranchDisplayText = () => {
    if (formData.branch.length === 0) return "Select Branch";
    if (formData.branch.length === ALL_BRANCHES.length) return "All Branch";
    if (formData.branch.length <= 2) return formData.branch.join(', ');
    return `${formData.branch.length} branch(es) selected`;
  };

  const renderBranchField = () => (
    <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
      <label className="md:w-[150px] text-right font-bold text-[#333] text-[13px] shrink-0">Branch:</label>
      <div className="flex-grow w-full md:w-auto relative" ref={dropdownRef}>
        <div 
          className="w-full border border-[#ccc] rounded-[4px] px-3 py-1.5 text-[13px] text-gray-600 bg-white cursor-pointer flex justify-between items-center"
          onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
        >
          <span className="truncate pr-2">{getBranchDisplayText()}</span>
          <ChevronDown size={14} className="text-gray-400" />
        </div>

        {isBranchDropdownOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-[#ccc] rounded-sm shadow-lg">
            <div className="p-2 border-b border-[#eee]">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1.5 text-gray-400" />
                <input
                  type="text"
                  className="w-full border border-[#ccc] rounded-sm pl-7 pr-2 py-1 text-[13px] focus:outline-none focus:border-[#66afe9]"
                  placeholder="Search..."
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            <div className="max-h-48 overflow-y-auto p-1">
              {branchSearch === '' && (
                <label className="flex items-center px-3 py-1.5 hover:bg-[#f5f5f5] cursor-pointer text-[13px]">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={allSelected}
                    onChange={(e) => handleBranchSelectAll(e.target.checked)}
                  />
                  <span>Select All</span>
                </label>
              )}
              {filteredBranches.map(branch => (
                <label key={branch} className="flex items-center px-3 py-1.5 hover:bg-[#f5f5f5] cursor-pointer text-[13px]">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={formData.branch.includes(branch)}
                    onChange={(e) => handleBranchSelect(branch, e.target.checked)}
                  />
                  <span>{branch}</span>
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderField = (label: string, value: string, key: string, type: 'select' | 'text' = 'select', options: string[] = []) => (
    <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
      <label className="md:w-[150px] text-right font-bold text-[#333] text-[13px] shrink-0">{label}:</label>
      <div className="flex-grow w-full md:w-auto relative">
        {type === 'select' ? (
          <select 
            value={value}
            onChange={(e) => {
              const newVal = e.target.value;
              setFormData(prev => {
                const nextData = { ...prev, [key]: newVal };
                if (key === 'program') {
                  nextData.course = 'Select Course';
                  nextData.exam = 'Select Exam';
                }
                return nextData;
              });
            }}
            className="w-full border border-[#ccc] rounded-[4px] px-2 py-1 text-[13px] text-gray-600 focus:outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(102,175,233,.6)] hover:border-gray-400 bg-white h-[30px]"
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input 
            type="text"
            value={value}
            onChange={(e) => setFormData({...formData, [key]: e.target.value})}
            placeholder={key === 'exam' ? '[Code] Name' : ''}
            className="w-full border border-[#ccc] rounded-[4px] px-2 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(102,175,233,.6)] hover:border-gray-400 bg-white"
          />
        )}
      </div>
    </div>
  );

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = () => {
    const existingEvaluations = JSON.parse(localStorage.getItem('script_evaluations') || '[]');
    
    const filtered = existingEvaluations.filter((evalItem: any) => {
      const matchOrg = formData.organization === 'Select Organization' || evalItem.organization === formData.organization;
      const matchProg = formData.program === 'Select Program' || evalItem.program === formData.program;
      const matchSession = formData.session === 'Select Session' || evalItem.session === formData.session;
      const matchCourse = formData.course === 'Select Course' || evalItem.course === formData.course;
      const matchExam = formData.exam === 'Select Exam' || evalItem.exam === formData.exam;
      const matchBranch = formData.branch.includes(evalItem.branch);
      
      return matchOrg && matchProg && matchSession && matchCourse && matchExam && matchBranch;
    });

    // Group by branch
    const branchSummary: Record<string, any> = {};
    filtered.forEach((item: any) => {
      if (!branchSummary[item.branch]) {
        branchSummary[item.branch] = {
          branch: item.branch,
          receivedQuantity: 1000, // Mock received quantity for demo
          evaluatedQuantity: 0,
          details: []
        };
      }
      branchSummary[item.branch].evaluatedQuantity += item.evaluatedQuantity;
      // Extract exam code for display
      const examCode = item.exam.match(/\[(.*?)\]/)?.[1] || 'N/A';
      branchSummary[item.branch].details.push(`(${examCode}-${item.evaluatedQuantity})`);
    });

    setSearchResults(Object.values(branchSummary));
    setSearchPerformed(true);
  };

  const handleExport = () => {
    if (searchResults.length === 0) return;

    // Create CSV content
    const headers = ["Branch", "Received Quantity", "Evaluated Quantity", "Remaining Quantity"];
    const rows = searchResults.map(res => [
      res.branch,
      res.receivedQuantity,
      res.evaluatedQuantity,
      res.receivedQuantity - res.evaluatedQuantity
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `script_comparison_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-4 pt-4 px-2 font-['Segoe_UI',sans-serif]">
      <div className="bg-white border text-sm border-[#002B49] rounded-sm shadow-md overflow-hidden">
        <div className="bg-[#002B49] text-white px-4 py-2 flex justify-between items-center">
          <h2 className="text-[13px] font-bold">Script Comparison Report</h2>
          <div className="flex gap-1">
            <button className="text-white hover:text-gray-200 p-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/></svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {renderField("Organization", formData.organization, 'organization', 'select', ['Select Organization', 'UDVASH', 'UNMESH', 'ONLINE CARE', 'UTTORON'])}
            {renderField("Program", formData.program, 'program', 'select', ['Select Program', ...Object.keys(COURSES_BY_PROGRAM)])}
            {renderField("Session", formData.session, 'session', 'select', ['Select Session', '2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020'])}
            {renderBranchField()}
            {renderField("Course", formData.course, 'course', 'select', ['Select Course', ...getCourses()])}
            {renderField("Exam", formData.exam, 'exam', 'select', ['Select Exam', ...getExams()])}
            {renderField("No of Row(s)", formData.rows, 'rows', 'text')}
          </div>

          <div className="flex justify-center mt-6 gap-3">
            <button 
              onClick={handleSearch}
              className="bg-[#428bca] hover:bg-[#3276b1] text-white px-6 py-1.5 rounded-[4px] text-[13px] shadow-sm transition-all active:scale-95 flex items-center gap-2"
            >
              <Search size={14} /> Search
            </button>
            {searchPerformed && searchResults.length > 0 && (
              <button 
                onClick={handleExport}
                className="bg-[#5cb85c] hover:bg-[#449d44] text-white px-6 py-1.5 rounded-[4px] text-[13px] shadow-sm transition-all active:scale-95 flex items-center gap-2"
              >
                <Download size={14} /> Export
              </button>
            )}
          </div>
        </div>
      </div>

      {searchPerformed && (
        <div className="mt-6 border border-[#ddd] rounded-sm shadow-sm overflow-hidden bg-white">
           <div className="bg-[#002B49] text-white px-4 py-2 flex justify-between items-center">
            <span className="font-bold text-[13px]">Script Comparison Details</span>
            <div className="bg-white/20 p-0.5 rounded cursor-pointer">
              <ChevronDown size={14} className="text-white transform rotate-180" />
            </div>
          </div>
          
          <div className="p-4">
             <div className="grid grid-cols-2 gap-0 mb-4 border border-[#ddd]">
                <div className="grid grid-cols-2">
                    <div className="bg-[#f9f9f9] border-r border-b px-3 py-2 font-bold text-right text-[12px]">Organization:</div>
                    <div className="border-b px-3 py-2 text-[12px]">{formData.organization !== 'Select Organization' ? formData.organization : 'ALL'}</div>
                    <div className="bg-[#f9f9f9] border-r px-3 py-2 font-bold text-right text-[12px]">Session:</div>
                    <div className="px-3 py-2 text-[12px]">{formData.session !== 'Select Session' ? formData.session : 'ALL'}</div>
                </div>
                <div className="grid grid-cols-2 border-l border-[#ddd]">
                    <div className="bg-[#f9f9f9] border-r border-b px-3 py-2 font-bold text-right text-[12px]">Program:</div>
                    <div className="border-b px-3 py-2 text-[12px]">{formData.program !== 'Select Program' ? formData.program : 'ALL'}</div>
                    <div className="bg-[#f9f9f9] border-r px-3 py-2 font-bold text-right text-[12px]">Branch:</div>
                    <div className="px-3 py-2 text-[12px]">{formData.branch.length === ALL_BRANCHES.length ? 'All' : formData.branch.length + ' selected'}</div>
                </div>
             </div>

             <div className="overflow-x-auto border border-[#ddd]">
               <table className="w-full text-center border-collapse">
                 <thead className="bg-[#fcfcfc] border-b border-[#ddd]">
                   <tr className="text-[12px] font-bold text-[#333]">
                     <th className="py-2 px-3 border-r">Branch</th>
                     <th className="py-2 px-3 border-r">Received Quantity</th>
                     <th className="py-2 px-3 border-r">Evaluated Quantity</th>
                     <th className="py-2 px-3">Remaining Quantity</th>
                   </tr>
                 </thead>
                 <tbody className="text-[12px]">
                    {searchResults.length > 0 ? (
                      searchResults.map((res: any, idx: number) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-[#fcfcfc]'}>
                          <td className="py-2 px-3 border-r border-t border-[#ddd] text-left pl-10">{res.branch}</td>
                          <td className="py-2 px-3 border-r border-t border-[#ddd]">{res.receivedQuantity}</td>
                          <td className="py-2 px-3 border-r border-t border-[#ddd]">
                             {res.evaluatedQuantity} <span className="text-gray-500 text-[11px] block">{res.details.join(', ')}</span>
                          </td>
                          <td className="py-2 px-3 border-t border-[#ddd]">{res.receivedQuantity - res.evaluatedQuantity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-10 text-gray-500 italic">No search results found</td>
                      </tr>
                    )}
                 </tbody>
               </table>
             </div>
             
             <div className="flex justify-between items-center mt-4 text-[12px] text-gray-600">
                <div>Showing 1 to {searchResults.length} of {searchResults.length} entries</div>
                <div className="flex gap-2">
                   <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>Previous</button>
                   <button className="px-3 py-1 border rounded bg-blue-50 text-blue-600">1</button>
                   <button className="px-3 py-1 border rounded disabled:opacity-50" disabled>Next</button>
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
