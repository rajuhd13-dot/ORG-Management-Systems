import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

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
  "Badda", "Banani", "Banashree", "Cantonment", "Danmondi", 
  "Farmgate", "Gazipur", "Jatrabari", "Mirpur", "Moghbazar", 
  "Mohammadpur", "Motijheel", "Mouchak", "Pallabi", "Savar", 
  "Science Lab", "Shantinagar", "Uttara"
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

          <div className="flex justify-center mt-6">
            <button className="bg-[#428bca] hover:bg-[#3276b1] text-white px-6 py-1.5 rounded-[4px] text-[13px] shadow-sm transition-all active:scale-95">
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
