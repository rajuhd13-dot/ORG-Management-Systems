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
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const [addFormData, setAddFormData] = useState({
    organization: '--Select Organization--',
    program: '--Select Program--',
    session: '--Select Session--',
    course: '--Select Course--',
    exam: '',
    scriptQuestionType: '--Select Script Question Type--',
    evaluationType: '--Select Evaluation Type--',
    scriptVersion: '--Select Script Version--',
    branch: [] as string[],
    evaluationDate: '2026-04-25',
    teacher: '',
    subject: '-- Select Subject --'
  });

  const [branchesData, setBranchesData] = useState([{ branch: '--Select Branch--', scriptQuantity: '', remaining: '' }]);

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
    "HSC Model Test": [
      "[101] Bangla 1st Paper CQ and MCQ Exam-01",
      "[102] English 1st Paper Exam-01",
      "[103] Physics 1st Paper CQ and MCQ Exam-01",
      "[104] Chemistry 1st Paper CQ and MCQ Exam-01"
    ],
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

  const getSubjectFromExam = (examName: string) => {
    if (!examName || examName === '--Select Exam--' || examName === '--All--') return '';
    const match = examName.match(/\] (.+?)(?: CQ and MCQ| MCQ and Written| Written| CQ| Exam| Model|-|$)/i);
    return match ? match[1].trim() : '';
  };

  const getCourses = (prog: string) => {
    return prog && prog !== '--All--' && prog !== '--Select Program--' ? COURSES_BY_PROGRAM[prog] || [] : [];
  };

  const getExams = (prog: string) => {
    if (prog && prog !== '--All--' && prog !== '--Select Program--') {
      return EXAMS_BY_PROGRAM[prog] || EXAMS_BY_PROGRAM["DEFAULT"];
    }
    // Return all unique exam codes
    const allExams = Object.values(EXAMS_BY_PROGRAM).flat();
    return Array.from(new Set(allExams));
  };

  const currentFormData = showAddForm ? addFormData : formData;
  const setCurrentFormData = showAddForm ? setAddFormData : setFormData;

  const filteredBranches = ALL_BRANCHES.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()));
  const allSelected = currentFormData.branch.length === ALL_BRANCHES.length;
  
  const handleBranchSelectAll = (checked: boolean) => {
    setCurrentFormData((prev: any) => ({ ...prev, branch: checked ? [...ALL_BRANCHES] : [] }));
  };

  const handleBranchSelect = (branchName: string, checked: boolean) => {
    setCurrentFormData((prev: any) => ({
      ...prev,
      branch: checked 
        ? [...prev.branch, branchName] 
        : prev.branch.filter((b: string) => b !== branchName)
    }));
  };

  const getBranchDisplayValue = () => {
    if (currentFormData.branch.length === 0) return 'All Branch';
    if (currentFormData.branch.length === ALL_BRANCHES.length) return 'All Branch';
    if (currentFormData.branch.length === 1) return currentFormData.branch[0];
    return `${currentFormData.branch.length} branch(es) selected`;
  };

  const renderField = (label: string, value: string, key: string, type: 'select' | 'text' | 'date' = 'select', options: string[] = [], stateObj: any, setter: any, isAddForm = false) => (
    <div className="flex flex-col md:flex-row items-center gap-2 mb-4">
      <label className="md:w-[150px] text-right font-bold text-[#333] text-[13px] shrink-0">{label}:</label>
      <div className="flex-grow w-full md:w-auto relative">
        {type === 'select' ? (
          <select 
            value={value}
            onChange={(e) => {
              const newVal = e.target.value;
              setter((prev: any) => {
                const nextData = { ...prev, [key]: newVal };
                if (key === 'program') {
                  nextData.course = isAddForm ? '--Select Course--' : '--All--';
                  nextData.exam = isAddForm ? '' : '--All--';
                }
                if (key === 'exam' && isAddForm) {
                  const subject = getSubjectFromExam(newVal);
                  if (subject) {
                    nextData.subject = subject;
                  }
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
            onChange={(e) => setter({...stateObj, [key]: e.target.value})}
            placeholder={isAddForm && type === 'text' && (key === 'exam' || key === 'teacher') ? (key === 'exam' ? '[Code] Name' : 'TPIN / Nick Name') : (type === 'text' ? label : '')}
            className="w-full border border-[#ccc] rounded-[4px] px-2 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-[#66afe9] focus:shadow-[inset_0_1px_1px_rgba(0,0,0,.075),0_0_8px_rgba(102,175,233,.6)] hover:border-gray-400 bg-white disabled:bg-[#eee]"
            disabled={key === 'subject' && isAddForm}
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
                    checked={currentFormData.branch.includes(branch)}
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

  const handleBranchRowAdd = () => {
    setBranchesData([...branchesData, { branch: '--Select Branch--', scriptQuantity: '', remaining: '' }]);
  };

  const handleBranchRowRemove = (index: number) => {
    setBranchesData(branchesData.filter((_, i) => i !== index));
  };

  const handleBranchRowChange = (index: number, field: string, value: string) => {
    const updated = [...branchesData];
    updated[index] = { ...updated[index], [field]: value };
    setBranchesData(updated);
  };

  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleMainSearch = () => {
    const existingEvaluations = JSON.parse(localStorage.getItem('script_evaluations') || '[]');
    
    const filtered = existingEvaluations.filter((evalItem: any) => {
      const matchOrg = formData.organization === '--All--' || evalItem.organization === formData.organization;
      const matchProg = formData.program === '--All--' || evalItem.program === formData.program;
      const matchSession = formData.session === '--All--' || evalItem.session === formData.session;
      const matchCourse = formData.course === '--All--' || evalItem.course === formData.course;
      const matchExam = formData.exam === '--All--' || evalItem.exam === formData.exam;
      const matchBranch = formData.branch.length === 0 || formData.branch.includes(evalItem.branch);
      
      return matchOrg && matchProg && matchSession && matchCourse && matchExam && matchBranch;
    });

    setSearchResults(filtered);
    setSearchPerformed(true);
  };

  const calculateTotalScriptQuantity = () => {
    return branchesData.reduce((sum, row) => sum + (parseInt(row.scriptQuantity) || 0), 0);
  };

  const handleSave = () => {
    // Collect data to save
    const evaluationsToSave = branchesData
      .filter(row => row.branch !== '--Select Branch--' && row.scriptQuantity)
      .map(row => ({
        organization: addFormData.organization,
        program: addFormData.program,
        session: addFormData.session,
        course: addFormData.course,
        exam: addFormData.exam,
        branch: row.branch,
        scriptQuantity: parseInt(row.scriptQuantity) || 0,
        evaluatedQuantity: parseInt(row.scriptQuantity) || 0, // Assuming evaluated = entered quantity for now
        timestamp: new Date().toISOString()
      }));

    if (evaluationsToSave.length > 0) {
      const existingEvaluations = JSON.parse(localStorage.getItem('script_evaluations') || '[]');
      const updatedEvaluations = [...existingEvaluations, ...evaluationsToSave];
      localStorage.setItem('script_evaluations', JSON.stringify(updatedEvaluations));
    }

    // Show success message
    setShowSuccess(true);
    
    // Clear only the branches table
    setBranchesData([{ branch: '--Select Branch--', scriptQuantity: '', remaining: '' }]);

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  if (showAddForm) {
    return (
      <div className="max-w-6xl mx-auto space-y-4 pt-4 px-2 font-['Segoe_UI',sans-serif]">
        <div className="bg-white border border-[#002B49] rounded-sm shadow-md overflow-hidden">
          <div className="bg-[#002B49] text-white px-4 py-2 flex justify-between items-center">
            <span className="font-bold text-[13px]">Script Evaluation Entry</span>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12">
              {renderField("Organization", addFormData.organization, 'organization', 'select', ['--Select Organization--', 'UDVASH', 'UNMESH', 'ONLINE CARE', 'UTTORON'], addFormData, setAddFormData, true)}
              {renderField("Program", addFormData.program, 'program', 'select', ['--Select Program--', ...Object.keys(COURSES_BY_PROGRAM)], addFormData, setAddFormData, true)}
              {renderField("Session", addFormData.session, 'session', 'select', ['--Select Session--', '2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020'], addFormData, setAddFormData, true)}
              {renderBranchField()}
              {renderField("Course", addFormData.course, 'course', 'select', ['--Select Course--', ...getCourses(addFormData.program)], addFormData, setAddFormData, true)}
              {renderField("Exam", addFormData.exam, 'exam', 'select', ['--Select Exam--', ...getExams(addFormData.program)], addFormData, setAddFormData, true)}
              {renderField("Script Question Type", addFormData.scriptQuestionType, 'scriptQuestionType', 'select', ['--Select Script Question Type--', 'Normal', 'Creative'], addFormData, setAddFormData, true)}
              {renderField("Evaluation Type", addFormData.evaluationType, 'evaluationType', 'select', ['--Select Evaluation Type--', 'Regular', 'Recheck', 'Top Student'], addFormData, setAddFormData, true)}
              {renderField("Script Version", addFormData.scriptVersion, 'scriptVersion', 'select', ['--Select Script Version--', 'Bangla', 'English'], addFormData, setAddFormData, true)}
              {renderField("Evaluation Date", addFormData.evaluationDate, 'evaluationDate', 'date', [], addFormData, setAddFormData, true)}
              {renderField("Teacher", addFormData.teacher, 'teacher', 'text', [], addFormData, setAddFormData, true)}
              <div className="col-span-1 md:col-span-2 md:w-1/2 md:pr-6">
                <div className="flex flex-col md:flex-row items-center gap-2 mb-4 mt-2">
                  <label className="md:w-[150px] text-right font-bold text-[#333] text-[13px] shrink-0">Subject:</label>
                  <div className="flex-grow w-full md:w-auto">
                     {getSubjectFromExam(addFormData.exam) ? (
                        <label className="flex items-center gap-2 text-[13px] text-[#333] font-bold cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={addFormData.subject === getSubjectFromExam(addFormData.exam)}
                            onChange={(e) => setAddFormData({...addFormData, subject: e.target.checked ? getSubjectFromExam(addFormData.exam) : ''})}
                            className="w-3 h-3 border-gray-300"
                          />
                          {getSubjectFromExam(addFormData.exam)}
                        </label>
                     ) : (
                       <span className="text-[13px] text-gray-500 italic">Select an Exam first</span>
                     )}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 border border-[#ddd] rounded-sm overflow-hidden">
              <table className="w-full text-[13px]">
                <thead className="bg-[#f0f0f0] border-b border-[#ddd]">
                  <tr>
                    <th className="py-2 px-2 text-center font-bold text-[#333] border-r border-[#ddd] w-[60px]">Serial</th>
                    <th className="py-2 px-2 text-center font-bold text-[#333] border-r border-[#ddd]">Branch</th>
                    <th className="py-2 px-2 text-center font-bold text-[#333] border-r border-[#ddd]">Script Quantity</th>
                    <th className="py-2 px-2 text-center font-bold text-[#333] border-r border-[#ddd]">Remaining</th>
                    <th className="py-2 px-2 text-center font-bold text-[#333] w-[40px]">
                      <button 
                        className="bg-[#428bca] hover:bg-[#3276b1] text-white w-6 h-6 rounded flex items-center justify-center font-bold text-lg"
                        onClick={handleBranchRowAdd}
                      >
                        +
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {branchesData.map((row, index) => (
                    <tr key={index} className="border-b border-[#ddd] last:border-0">
                      <td className="py-1 px-2 text-center border-r border-[#ddd]">{index + 1}</td>
                      <td className="py-1 px-2 border-r border-[#ddd]">
                        <select 
                          value={row.branch}
                          onChange={(e) => handleBranchRowChange(index, 'branch', e.target.value)}
                          className="w-full border border-[#ccc] rounded-[3px] px-2 py-1 text-[13px] text-gray-600 focus:outline-none focus:border-[#66afe9] bg-white"
                        >
                          <option>--Select Branch--</option>
                          {(addFormData.branch.length > 0 ? addFormData.branch : ALL_BRANCHES).map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-1 px-2 border-r border-[#ddd]">
                        <input 
                          type="number" 
                          value={row.scriptQuantity}
                          onChange={(e) => handleBranchRowChange(index, 'scriptQuantity', e.target.value)}
                          className="w-full border border-[#ccc] rounded-[3px] px-2 py-1 text-[13px] text-gray-600 focus:outline-none focus:border-[#66afe9] bg-white text-right"
                        />
                      </td>
                      <td className="py-1 px-2 border-r border-[#ddd] bg-[#f9f9f9]">
                        <input 
                          type="text" 
                          value={row.remaining}
                          readOnly
                          className="w-full border border-[#ccc] rounded-[3px] px-2 py-1 text-[13px] text-gray-600 bg-[#eeeeee] focus:outline-none"
                        />
                      </td>
                      <td className="py-1 px-2 text-center">
                         <button 
                          className="bg-[#f0ad4e] hover:bg-[#ec971f] text-white w-6 h-6 rounded flex items-center justify-center font-bold text-lg"
                          onClick={() => handleBranchRowRemove(index)}
                        >
                          -
                        </button>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-[#f9f9f9]">
                    <td colSpan={2} className="py-2 px-2 text-center font-bold text-[#333] border-r border-[#ddd]">Total</td>
                    <td className="py-2 px-2 border-r border-[#ddd] font-bold text-[#333]">{calculateTotalScriptQuantity()}</td>
                    <td className="py-2 px-2 border-r border-[#ddd] font-bold text-[#333]">0</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-center mt-6 gap-2 items-center">
              {showSuccess && (
                <span className="text-green-600 font-bold text-[13px] mr-2">
                  Save Success!
                </span>
              )}
              <button 
                className="bg-[#428bca] hover:bg-[#3276b1] text-white px-4 py-1.5 rounded-[4px] text-[13px] shadow-sm transition-all active:scale-95"
                onClick={handleSave}
              >
                Save
              </button>
              <button 
                className="bg-[#5bc0de] hover:bg-[#31b0d5] text-white px-4 py-1.5 rounded-[4px] text-[13px] shadow-sm transition-all active:scale-95"
                onClick={() => {
                  handleSave();
                  setTimeout(() => setShowAddForm(false), 500);
                }}
              >
                Save & Exit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 pt-4 px-2 font-['Segoe_UI',sans-serif]">
      <div className="flex justify-start mb-2">
        <button 
          onClick={() => setShowAddForm(true)}
          className="bg-[#428bca] hover:bg-[#3276b1] text-white px-3 py-1.5 rounded-[4px] text-[13px] shadow-sm flex items-center gap-1"
        >
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
            {renderField("Organization", formData.organization, 'organization', 'select', ['--All--', 'UDVASH', 'UNMESH', 'ONLINE CARE', 'UTTORON'], formData, setFormData)}
            {renderField("Program", formData.program, 'program', 'select', ['--All--', ...Object.keys(COURSES_BY_PROGRAM)], formData, setFormData)}
            {renderField("Session", formData.session, 'session', 'select', ['--All--', '2027', '2026', '2025', '2024', '2023', '2022', '2021', '2020'], formData, setFormData)}
            {renderBranchField()}
            {renderField("Course", formData.course, 'course', 'select', ['--All--', ...getCourses(formData.program)], formData, setFormData)}
            {renderField("Exam", formData.exam, 'exam', 'select', ['--All--', ...getExams(formData.program)], formData, setFormData)}
            {renderField("Script Question Type", formData.scriptQuestionType, 'scriptQuestionType', 'select', ['--All--', 'Normal', 'Creative'], formData, setFormData)}
            {renderField("Evaluation Type", formData.evaluationType, 'evaluationType', 'select', ['--All--', 'Regular', 'Recheck', 'Top Student'], formData, setFormData)}
            {renderField("Script Version", formData.scriptVersion, 'scriptVersion', 'select', ['--All--', 'Bangla', 'English'], formData, setFormData)}
            {renderField("Teacher", formData.teacher, 'teacher', 'text', [], formData, setFormData)}
            {renderField("Start Date", formData.startDate, 'startDate', 'date', [], formData, setFormData)}
            {renderField("End Date", formData.endDate, 'endDate', 'date', [], formData, setFormData)}
            {renderField("Keyword", formData.keyword, 'keyword', 'text', [], formData, setFormData)}
            {renderField("No of Row(s)", formData.rows, 'rows', 'text', [], formData, setFormData)}
          </div>

          <div className="flex justify-center mt-6">
            <button 
              onClick={handleMainSearch}
              className="bg-[#428bca] hover:bg-[#3276b1] text-white px-6 py-2 rounded-[4px] text-[14px] shadow-md transition-all active:scale-95"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {searchPerformed && (
        <div className="bg-white border border-[#ddd] rounded-sm shadow-md overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
           <div className="bg-[#002B49] text-white px-4 py-2 flex justify-between items-center text-[13px] font-bold">
            Examiner Script Evaluation Entry List
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-[12px] border-collapse">
                <thead className="bg-[#fcfcfc] border-b border-[#ddd]">
                  <tr className="font-bold text-[#333]">
                    <th className="py-2 px-2 border-r text-center w-[50px]">SL</th>
                    <th className="py-2 px-2 border-r text-left">Organization</th>
                    <th className="py-2 px-2 border-r text-left">Exam</th>
                    <th className="py-2 px-2 border-r text-left">Branch</th>
                    <th className="py-2 px-2 border-r text-right">Quantity</th>
                    <th className="py-2 px-2 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {searchResults.length > 0 ? (
                    searchResults.map((res: any, idx: number) => (
                      <tr key={idx} className="border-b border-[#eee] hover:bg-[#f9f9f9]">
                        <td className="py-2 px-2 border-r text-center">{idx + 1}</td>
                        <td className="py-2 px-2 border-r">{res.organization}</td>
                        <td className="py-2 px-2 border-r">{res.exam}</td>
                        <td className="py-2 px-2 border-r">{res.branch}</td>
                        <td className="py-2 px-2 border-r text-right">{res.scriptQuantity}</td>
                        <td className="py-2 px-2 text-center">
                          <button className="bg-blue-500 text-white px-2 py-0.5 rounded text-[10px] hover:bg-blue-600">View</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-gray-500 italic">No entries found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex justify-between items-center mt-4 text-[12px] text-gray-600">
                <div>Showing 1 to {searchResults.length} of {searchResults.length} entries</div>
                <div className="flex gap-1">
                   <button className="px-2 py-1 border rounded bg-white hover:bg-gray-50">Previous</button>
                   <button className="px-3 py-1 border rounded bg-blue-600 text-white">1</button>
                   <button className="px-2 py-1 border rounded bg-white hover:bg-gray-50">Next</button>
                </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

