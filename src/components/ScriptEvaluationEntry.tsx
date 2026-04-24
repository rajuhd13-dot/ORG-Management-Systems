import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

const ALL_BRANCHES = [
  "Badda Udvash", "Bagerhat Udvash", "Bakshibazar Udvash", "Banasree Udvash", "Bandarban Udvash", 
  "Barguna Udvash", "Barishal Udvash", "Basabo Udvash", "Bhairab Udvash", "Bhola Udvash", 
  "Bogura Udvash", "Bogura Sherpur Udvash", "Bosila Udvash", "Brahmanbaria Udvash", "Cantonment Udvash", 
  "Chandpur Udvash", "Chapainawabganj Udvash", "Chawkbazar Udvash (CTG)", "Chuadanga Udvash", "Cox's Bazar Udvash", 
  "Cumilla Udvash", "Dinajpur Udvash", "Donia Udvash", "Faridpur Udvash", "Farmgate (MT) Udvash", 
  "Feni Udvash", "Gaibandha Udvash", "Gazipur Udvash", "Ghatail Udvash", "Gobindaganj Udvash", 
  "Gopalganj Udvash", "Habiganj Udvash", "Halishahar Udvash (CTG)", "Haziganj Udvash", "Ishwardi Udvash", 
  "Jamalpur Udvash", "Jashore Udvash", "Jatrabari Udvash", "Jhalakathi Udvash", "Jhenaidah Udvash", 
  "Jigatola Udvash", "Joypurhat Udvash", "Keraniganj Udvash", "Khagrachari Udvash", "Khilgaon Udvash", 
  "Khulna Boyra Bazar Udvash", "Khulna Shantidham Mor Udvash", "Kishoreganj Udvash", "Konapara Udvash", "Kurigram Udvash", 
  "Kushtia Udvash", "Lakshmipur Udvash", "Lalbagh Udvash", "Lalmonirhat Udvash", "Laxmibazar Udvash", 
  "Madaripur Udvash", "Magura Udvash", "Malibagh Udvash", "Manikganj Udvash", "Meherpur Udvash", 
  "Mirpur 1 Udvash", "Mirpur 2 Udvash", "Mohammadpur Udvash", "Motijheel Udvash", "Moulvibazar Udvash", 
  "Munshiganj Udvash", "Mymensingh (KB) Udvash", "Mymensingh Udvash", "Naogaon Udvash", "Narayanganj Udvash", 
  "Narail Udvash", "Narsingdi Udvash", "Natore Udvash", "Netrokona Udvash", "Nilphamari Udvash", 
  "Noakhali Udvash", "Oxygen Udvash (CTG)", "Pabna Udvash", "Pallabi Udvash", "Panchagarh Udvash", 
  "Patenga Udvash", "Patiya Udvash", "Patuakhali Udvash", "Pirganj Thakurgaon Udvash", "Pirganj Rangpur Udvash", 
  "Pirojpur Udvash", "Rajbari Udvash", "Rajshahi Kadirganj Udvash", "Rajshahi Vodra Mor Udvash", "Rangamati Udvash", 
  "Rangpur Khamar Mor Udvash", "Rangpur Medical Mor Udvash", "Rupnagar Udvash", "Saidpur Udvash", "Satkhira Udvash", 
  "Savar Udvash", "Science Lab Udvash", "Shantinagar Udvash", "Shariatpur Udvash", "Sherpur Udvash", 
  "Sirajganj Udvash", "Sunamganj Udvash", "Sylhet Tilagor Udvash", "Sylhet Chowhatta Udvash", "Tangail Udvash", 
  "Thakurgaon Udvash", "Tongi Udvash", "Ullapara Udvash", "Uttara Azampur Udvash", "Uttara Diabari Udvash", 
  "Uttara House Building Udvash"
];

export default function ScriptEvaluationEntry() {
  const [formData, setFormData] = useState({
    organization: '--All--',
    program: '--All--',
    session: '--All--',
    branch: [] as string[],
    course: '--All--',
    exam: '--All--',
    scriptQuestionType: '--All--',
    evaluationType: '--All--',
    scriptVersion: '--All--',
    teacher: '',
    startDate: '2026-04-18',
    endDate: '2026-04-24',
    keyword: '',
    rows: '100'
  });

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [branchSearch, setBranchSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  const getCourses = () => {
    return formData.program && formData.program !== '--All--' ? COURSES_BY_PROGRAM[formData.program] || [] : [];
  };

  const getExams = () => {
    return formData.program && formData.program !== '--All--' ? (EXAMS_BY_PROGRAM[formData.program] || EXAMS_BY_PROGRAM["DEFAULT"]) : [];
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

  const getBranchDisplayValue = () => {
    if (formData.branch.length === 0) return 'All Branch';
    if (formData.branch.length === ALL_BRANCHES.length) return 'All Branch';
    if (formData.branch.length === 1) return formData.branch[0];
    return `${formData.branch.length} branch(es) selected`;
  };

  const renderField = (label: string, value: string, key: string, type: 'select' | 'text' | 'date' = 'select', options: string[] = []) => (
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
                  nextData.course = '--All--';
                  nextData.exam = '--All--';
                }
                return nextData;
              });
            }}
            className="w-full border border-[#ccc] rounded-[4px] px-2 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(102,175,233,.6)] hover:border-gray-400 bg-white"
          >
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        ) : (
          <input 
            type={type}
            value={value}
            onChange={(e) => setFormData({...formData, [key]: e.target.value})}
            placeholder={type === 'text' ? label : ''}
            className="w-full border border-[#ccc] rounded-[4px] px-2 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(102,175,233,.6)] hover:border-gray-400 bg-white"
          />
        )}
      </div>
    </div>
  );

  const renderBranchField = () => (
    <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
      <label className="md:w-[150px] text-right font-bold text-[#333] text-[13px] shrink-0">Branch:</label>
      <div className="flex-grow w-full md:w-auto relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
          className="w-full h-[33px] border border-[#ccc] rounded-[4px] px-2 py-1.5 text-[13px] text-gray-600 focus-within:border-[#66afe9] focus-within:shadow-[inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(102,175,233,.6)] bg-gradient-to-b from-[#fff] to-[#e6e6e6] cursor-pointer flex justify-between items-center bg-white"
        >
          <span className="truncate">{getBranchDisplayValue()}</span>
          <span className="text-[10px] ml-2 text-gray-600">▼</span>
        </div>
        
        {isBranchDropdownOpen && (
          <div className="absolute top-full left-0 w-full mt-1 bg-white border border-[#ccc] rounded-[4px] shadow-lg z-50 flex flex-col">
            <div className="p-2 border-b border-[#eee]">
              <div className="flex items-center border border-[#ccc] rounded-[4px] px-2 py-1 focus-within:border-[#66afe9] focus-within:shadow-[inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(102,175,233,.6)]">
                <Search size={14} className="text-gray-500 mr-2" />
                <input 
                  type="text" 
                  value={branchSearch}
                  onChange={(e) => setBranchSearch(e.target.value)}
                  placeholder="Search"
                  className="w-full outline-none text-[13px]"
                />
              </div>
            </div>
            <div className="max-h-[250px] overflow-y-auto py-1">
              <label className="flex items-center px-4 py-1.5 hover:bg-[#f5f5f5] cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={(e) => handleBranchSelectAll(e.target.checked)}
                  className="mr-2 rounded-sm text-blue-600 focus:ring-blue-500"
                />
                <span className="text-[13px] font-bold text-[#333]">Select all</span>
              </label>
              {filteredBranches.map(branch => (
                <label key={branch} className="flex items-center px-4 py-1.5 hover:bg-[#f5f5f5] cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formData.branch.includes(branch)}
                    onChange={(e) => handleBranchSelect(branch, e.target.checked)}
                    className="mr-2 rounded-sm text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-[13px] text-[#333]">{branch}</span>
                </label>
              ))}
              {filteredBranches.length === 0 && (
                <div className="px-4 py-2 text-[13px] text-gray-500 text-center">No results found</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-4 pt-4 px-2 font-['Segoe_UI',sans-serif]">
      <div className="flex justify-start mb-2">
        <button className="bg-[#428bca] hover:bg-[#3276b1] text-white px-3 py-1.5 rounded-[4px] text-[13px] font-bold shadow-sm flex items-center gap-1">
          Add Script Evaluation Entry
        </button>
      </div>

      <div className="bg-white border border-[#002B49] rounded-sm shadow-md overflow-hidden">
        <div className="bg-[#002B49] text-white px-4 py-2 flex justify-between items-center">
          <span className="font-bold text-[13px]">Examiner Script Evaluation Entry</span>
          <span className="text-[12px] cursor-pointer">−</span>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
            {renderField("Organization", formData.organization, 'organization', 'select', ['--All--', 'UDVASH', 'UNMESH', 'ONLINE CARE', 'UTTORON'])}
            {renderField("Program", formData.program, 'program', 'select', ['--All--', ...Object.keys(COURSES_BY_PROGRAM)])}
            {renderField("Session", formData.session, 'session', 'select', ['--All--', '2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020'])}
            {renderBranchField()}
            {renderField("Course", formData.course, 'course', 'select', ['--All--', ...getCourses()])}
            {renderField("Exam", formData.exam, 'exam', 'select', ['--All--', ...getExams()])}
            {renderField("Script Question Type", formData.scriptQuestionType, 'scriptQuestionType', 'select', ['--All--', 'Subjective', 'Objective'])}
            {renderField("Evaluation Type", formData.evaluationType, 'evaluationType', 'select', ['--All--', 'Online', 'Offline'])}
            {renderField("Script Version", formData.scriptVersion, 'scriptVersion', 'select', ['--All--', 'Version 1', 'Version 2'])}
            {renderField("Teacher", formData.teacher, 'teacher', 'text')}
            {renderField("Start Date", formData.startDate, 'startDate', 'date')}
            {renderField("End Date", formData.endDate, 'endDate', 'date')}
            {renderField("Keyword", formData.keyword, 'keyword', 'text')}
            {renderField("No of Row(s)", formData.rows, 'rows', 'text')}
          </div>

          <div className="flex justify-center mt-6">
            <button className="bg-[#428bca] hover:bg-[#3276b1] text-white px-6 py-2 rounded-[4px] text-[14px] font-bold shadow-md transition-all active:scale-95">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
