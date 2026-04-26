import React, { useState, useRef } from 'react';
import { Upload, Download, Trash2, PlusCircle, FileSpreadsheet, Play, Square, RefreshCcw, X } from 'lucide-react';
import * as XLSX from 'xlsx';

interface TeacherData {
  'Nick-Name-*'?: string;
  'Full-Name-*'?: string;
  'Mobile-Number-1-*'?: string;
  'Mobile-Number-2'?: string;
  'Mobile-Banking-Number'?: string;
  'Mobile-Banking-Type'?: string;
  'Institute-*'?: string;
  'Department-*'?: string;
  'HSC-Passing-Year-*'?: string;
  'Religion-*'?: string;
  'Gender-*'?: string;
  'Teacher-Type-*'?: string;
  'Profession-*'?: string;
  'Teacher-Activity-Type-*'?: string;
  'Subject_1'?: string;
  'T-pin'?: string;
  [key: string]: any;
}

const SUBJECTS = [
  "Bangla", "English", "General Mathematics", "General Science", "Agriculture Studies", 
  "Home Science", "ICT", "Physical Education & Health", "Art and Crafts", 
  "Islam and Moral Education", "Hindu Religion and Moral Education", 
  "Christian Religion and Moral Education", "Buddhist Religion and Moral Education", 
  "Mathematics", "Social Science", "Computer Study", "Biology", "Physics", "Chemistry", 
  "Higher Mathematics", "Statistics", "Architecture", "BGS", "C Programming", 
  "General Knowledge", "Mathematical Physics", "Mathematical Chemistry", 
  "Bangla 1st Paper", "Bangla 2nd Paper", "Kormamukhi Shikkha", "English 1st Paper", 
  "English 2nd Paper", "Chemistry 1st Paper", "Chemistry 2nd Paper", "Physics 1st Paper", 
  "Physics 2nd Paper", "Higher Mathematics 1st Paper", "Higher Mathematics 2nd Paper", 
  "Biology 1st Paper", "Biology 2nd Paper", "Computer 1st Paper", "Computer 2nd Paper", 
  "Statistics 1st Paper", "Statistics 2nd Paper", "Arabic", "Career Education", 
  "Secondary Math", "Secondary ICT", "Engineering Drawings and Workshop Practice 1st Paper", 
  "Engineering Drawings and Workshop Practice 2nd Paper", "Bengali Language", "English Language", 
  "Bangladesh Affairs", "International Affairs", "Geography, Environment and Disaster Management", 
  "Computer and Information Technology", "Mathematical Reasoning", "Mental Ability", 
  "Ethics, Values and Good Governance", "Bengali Literature", "English Literature", 
  "Religion and Moral Education", "Higher Maths / Agriculture / Home Science", 
  "BGS / General Science", "Biology / Statistics / Engineering Drawing 1st Paper", 
  "Biology / Statistics / Engineering Drawing 2nd Paper", "Science & ICT", "Physiology", 
  "Anatomy", "Pathology", "Medicine", "Mathematical Reasoning & Mental Ability", 
  "Higher Math 1st Paper / Biology 1st Paper", "Higher Math 2nd Paper / Biology 2nd Paper", 
  "Higher Math / Biology", "Higher Maths /Biology/ Agriculture / Home Science", "Science", 
  "Cadre wise", "Self Development", "Viva Experience", "Question & Answer", 
  "Law & Constitution (Bangladesh & International)", "Economics (Bangladesh & International)", 
  "Math & IQ", "Science & Technology", "Bangladesh Studies", "Global Studies", 
  "পরামর্শ/মতামত/অভিযোগ", "Medical Physics", "Medical Chemistry", "Q&A Combined Subject", 
  "Open Discussion", "General Science & Technology", "Constitution, Law & Order", 
  "Class 8 (পরামর্শ/ মতামত/ অভিযোগ)", "8 BE Service Related", "11 (পরামর্শ/ মতামত/ অভিযোগ)", 
  "12 (পরামর্শ/ মতামত/ অভিযোগ)", "HSC Bangla-English (পরামর্শ/ মতামত/ অভিযোগ)", 
  "HSC ICT (পরামর্শ/ মতামত/ অভিযোগ)", "HSC (পরামর্শ/ মতামত/ অভিযোগ)", 
  "9-10 (পরামর্শ/ মতামত/ অভিযোগ)", "9-10 BE (পরামর্শ/ মতামত/ অভিযোগ)", 
  "SSC (পরামর্শ/ মতামত/ অভিযোগ)", "Combined Physics", "Combined Chemistry", 
  "Combined Mathematics", "Combined Biology", "Engineering (পরামর্শ/ মতামত/ অভিযোগ)", 
  "Medical (পরামর্শ/ মতামত/ অভিযোগ)", "Varsity 'KA' (পরামর্শ/ মতামত/ অভিযোগ)", 
  "College Admission (পরামর্শ/ মতামত/ অভিযোগ)", "HSC Foundation Service Related", 
  "HSC 1st Year Crash Service Related", "IQ", "Digital Technology", "Life & Livelihood", 
  "History & Social Science", "Class 6 (পরামর্শ/ মতামত/ অভিযোগ)", "Class 7 (পরামর্শ/ মতামত/ অভিযোগ)", 
  "Class 9 (পরামর্শ/ মতামত/ অভিযোগ)", "Advanced English", "Biology+Math", "Civics & Good Governance", 
  "Professional Subject", "Science (Exercise Book)", "English Grammar", "Subjective GK", 
  "English Written", "Weekly Solve Class", "Economics", "Civics & Others", "IQ & Mental Ability", 
  "Subjective Class", "Mathematical Physics 1st Paper", "Mathematical Physics 2nd Paper", 
  "Mathematical Chemistry 1st Paper", "Mathematical Chemistry 2nd Paper", "Analytical Ability", 
  "Bangla 1st Paper (গদ্য)", "Bangla 1st Paper (পদ্য)", "Bangla 1st Paper (সহপাঠ)", 
  "Bangla 2nd Paper (ব্যাকরণ)", "Bangla 2nd Paper (নির্মিত অংশ)", "Analytical Skills", "Others", 
  "GK& IQ", "Special Class", "Test Exam Question", "Medicine & Pharmacology", 
  "Surgery & Community Medicine and Public Health", "Obstetrics and Gynaecology & Forensic Medicine & Toxicology", 
  "Anatomy & Physiology", "Pathology, Microbiology & Biochemistry", "Anatomy & Dental Anatomy", 
  "Physiology & Biochemistry", "Science of Dental Materials", "General Pharmacology and dental therapeutics & Pathology and microbiology", 
  "Preventive and community dentistry & Dental jurisprudence", "Oral Surgery and Aesthesia", 
  "Conservative Dentistry and Dental Radiology", "Prosthodontics & Orthodontics", "Medicine & Surgery", 
  "English Written Special", "Bangla Written Special", "Written Special", "ICT + Math", "Humanitarian Qualities", 
  "Varsity 'KHA' (পরামর্শ/ মতামত/ অভিযোগ)", "Cadet (পরামর্শ/ মতামত/ অভিযোগ)", "Arts", "Commerce", 
  "Aptitude and Humanitarian Qualities", "Bangla Written", "Written Exam Scripts", "Newspaper Cut", 
  "Update Info", "Monthly Insight", "Preli Special", "Routine", "Intensive Class", 
  "Class 5 (পরামর্শ/ মতামত/ অভিযোগ)", "Geography and Environment", "Civics and Citizenship", 
  "History of Bangladesh and World Civilization", "Written Basic Class", "Monthly Solve Class", "Special Record Class"
];

interface TeacherFormProps {
  onBack: () => void;
  onSave?: (data: any) => void;
}

export default function TeacherForm({ onBack, onSave }: TeacherFormProps) {
  const [formData, setFormData] = useState({
    remarks: '',
    nickName: '',
    fullName: '',
    mobile1: '',
    mobile2: '',
    mobileBankingNumber: '',
    mobileBankingType: 'Select Type',
    institute: '',
    department: '',
    hscPassingYear: '',
    teacherGrade: '-- Not Applicable --',
    religion: 'Islam',
    gender: 'Male',
    orgs: {
      UDVASH: false,
      UNMESH: false,
      'ONLINE CARE': false,
      UTTORON: false
    },
    activityPriorities: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4'],
    subjectPriorities: ['Choice 1', 'Choice 2', 'Choice 3', '', '', '', '', '', '', ''],
    versionPriorities: ['Bangla', 'English'],
    teacherType: 'Regular',
    profession: 'Student',
    jobCompany: '',
    jobDepartment: '',
    teacherActivityType: 'Both',
    currentDistrict: '',
    allowPortalLogin: true,
    isAiTeacher: false,
    details: {
      fatherName: '',
      motherName: '',
      dob: '',
      bloodGroup: '--Select Blood group--',
      mobileRoommate: '',
      mobileFather: '',
      facebookId: '',
      nid: '',
      tin: '',
      email: '',
      school: '',
      college: ''
    },
    address: {
      present: '',
      area: '',
      permanent: '',
      district: ''
    }
  });

  const [excelDataState, setExcelDataState] = useState<any[]>([]);
  const excelDataRef = useRef<any[]>([]);
  
  const excelData = excelDataState;
  const setExcelData = (data: any[] | ((prev: any[]) => any[])) => {
    setExcelDataState(prev => {
      const next = typeof data === 'function' ? data(prev) : data;
      excelDataRef.current = next;
      return next;
    });
  };

  const [processingIdx, setProcessingIdx] = useState<number | null>(null);
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const isAutoRunningRef = useRef(false);
  const stopAutoRun = () => {
    setIsAutoRunning(false);
    isAutoRunningRef.current = false;
  };
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const profileImages = JSON.parse(localStorage.getItem('teacher_profile_images') || '{}');

  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws) as TeacherData[];
      
      const sanitizedData = data.map(row => ({
        ...row,
        'T-pin': row['T-pin'] || ''
      })).filter(row => {
          const hasValidData = Object.values(row).some(val => val && val.toString().trim() !== '' && val.toString().trim() !== '-');
          return hasValidData;
      });
      
      setExcelData(sanitizedData);
    };
    reader.readAsBinaryString(file);
  };

  const pickField = (row: any, keys: string[], fallback = '') => {
    for (const key of keys) {
      if (row[key] !== undefined && row[key] !== null) {
        return row[key].toString().trim();
      }
    }
    return fallback;
  };

  const processRow = async (idx: number) => {
    const row = excelDataRef.current[idx];
    if (!row) return;

    setProcessingIdx(idx);
    
    const mapVal = (val: string, map: Record<string, string>) => val ? (map[val] || val) : '';

    const religionMap: Record<string, string> = { '1': 'Islam', '2': 'Hinduism', '3': 'Buddhism', '4': 'Christianity' };
    const genderMap: Record<string, string> = { '1': 'Male', '2': 'Female' };
    const typeMap: Record<string, string> = { '1': 'Regular', '2': 'Contractual' };
    const versionMap: Record<string, string> = { '1': 'Bangla', '2': 'English' };
    const activityMap: Record<string, string> = { '1': 'Teaching', '2': 'Script Evaluation', '3': 'Materials Development', '4': 'Question & Answer' };
    const professionMap: Record<string, string> = { '19': 'Student', '20': 'Service Holder' };
    const teacherActivityMap: Record<string, string> = { '1': 'Academic', '2': 'Non-Academic', '3': 'Both' };
    const bankingMap: Record<string, string> = { '20': 'Nagad', '21': 'bKash' };
    const subjectMap: Record<string, string> = { 
      '70': 'Biology',
      'Biology': 'Biology'
    };

    const derivedSubjects: string[] = [];
    const englishMarks = parseFloat(pickField(row, ['English(%)', 'English (%)', 'English%']));
    if (!isNaN(englishMarks) && englishMarks > 60) derivedSubjects.push('English');

    const banglaMarks = parseFloat(pickField(row, ['Bangla(%)', 'Bangla (%)', 'Bangla%']));
    if (!isNaN(banglaMarks) && banglaMarks > 50) derivedSubjects.push('Bangla');

    const physMarks = parseFloat(pickField(row, ['Physics(%)', 'Physics (%)', 'Physics%']));
    if (!isNaN(physMarks) && physMarks > 50) derivedSubjects.push('Physics');

    const chemMarks = parseFloat(pickField(row, ['Chemistry(%)', 'Chemistry (%)', 'Chemistry%']));
    if (!isNaN(chemMarks) && chemMarks > 50) derivedSubjects.push('Chemistry');

    const bMarks = parseFloat(pickField(row, ['Biology(%)', 'Biology (%)', 'Biology%']));
    if (!isNaN(bMarks) && bMarks > 50) derivedSubjects.push('Biology');
    
    const ictMarks = parseFloat(pickField(row, ['ICT(%)', 'ICT (%)', 'ICT%']));
    if (!isNaN(ictMarks) && ictMarks > 50) derivedSubjects.push('ICT');
    
    const mathMarks = parseFloat(pickField(row, ['Math(%)', 'Math (%)', 'Math%']));
    if (!isNaN(mathMarks) && mathMarks > 50) derivedSubjects.push('Mathematics');

    // Comprehensive auto-fill logic
    setFormData(prev => ({
      ...prev,
      remarks: pickField(row, ['Remarks']),
      nickName: pickField(row, ['Nick-Name-*', 'Nick Name*', 'Nick Name', 'NickName', 'Nick_Name']),
      fullName: pickField(row, ['Full-Name-*', 'Full Name*', 'Full Name', 'FullName']),
      mobile1: pickField(row, ['Mobile-Number-1-*', 'Mobile Number 1*', 'MobileNumber1', 'Mobile 1', 'Mobile']),
      mobile2: pickField(row, ['Mobile-Number-2', 'Mobile Number 2', 'MobileNumber2', 'Mobile 2']),
      mobileBankingNumber: pickField(row, ['Mobile-Banking-Number', 'Mobile Banking Number', 'MobileBankingNumber']),
      mobileBankingType: mapVal(pickField(row, ['Mobile-Banking-Type', 'Mobile Banking Type', 'MobileBankingType'], 'Select Type'), bankingMap),
      institute: pickField(row, ['Institute-*', 'Institute*', 'Institute']),
      department: pickField(row, ['Department-*', 'Department*', 'Department']),
      hscPassingYear: pickField(row, ['HSC-Passing-Year-*', 'HSC Passing Year*', 'HscPassingYear', 'HSC Year']),
      religion: mapVal(pickField(row, ['Religion-*', 'Religion*', 'Religion'], 'Islam'), religionMap),
      gender: mapVal(pickField(row, ['Gender-*', 'Gender*', 'Gender'], 'Male'), genderMap),
      teacherType: mapVal(pickField(row, ['Teacher-Type-*', 'Teacher Type*', 'Teacher Type', 'Type'], 'Regular'), typeMap),
      profession: mapVal(pickField(row, ['Profession-*', 'Profession*', 'Profession'], 'Student'), professionMap),
      teacherActivityType: mapVal(pickField(row, ['Teacher-Activity-Type-*', 'Teacher Activity Type*', 'TeacherActivityType'], 'Both'), teacherActivityMap),
      currentDistrict: pickField(row, ['Current-District-*', 'Current District', 'District', 'DistrictName']),
      orgs: {
        UDVASH: pickField(row, ['orgName[]', 'orgName[]_20', 'orgName[]_21']) === '1' ? true : prev.orgs.UDVASH,
        UNMESH: prev.orgs.UNMESH,
        'ONLINE CARE': pickField(row, ['orgName[]_20', 'orgName[]']) === '1' ? true : prev.orgs['ONLINE CARE'],
        UTTORON: prev.orgs.UTTORON
      },
      details: {
        ...prev.details,
        fatherName: pickField(row, ['Father-Name', 'Father Name', 'FatherName']),
        motherName: pickField(row, ['Mother-Name', 'Mother Name', 'MotherName']),
        nid: pickField(row, ['NID-Number', 'NID Number', 'NID', 'NidNumber']),
        tin: pickField(row, ['TIN', 'Tin']),
        email: pickField(row, ['Email', 'E-mail', 'Mail']),
        school: pickField(row, ['School']),
        college: pickField(row, ['College', 'Collage'])
      },
      address: {
        ...prev.address,
        district: pickField(row, ['DistrictName', 'District'])
      },
      activityPriorities: [
        mapVal(pickField(row, ['ActivityPriority1', 'Activity Priority1'], prev.activityPriorities[0]), activityMap),
        mapVal(pickField(row, ['ActivityPriority2', 'Activity Priority2'], prev.activityPriorities[1]), activityMap),
        mapVal(pickField(row, ['ActivityPriority3', 'Activity Priority3'], prev.activityPriorities[2]), activityMap),
        mapVal(pickField(row, ['ActivityPriority4', 'Activity Priority4'], prev.activityPriorities[3]), activityMap)
      ],
      versionPriorities: [
        mapVal(pickField(row, ['VersionPriority1', 'Version Priority1', 'Version Priority 1'], prev.versionPriorities[0]), versionMap),
        mapVal(pickField(row, ['VersionPriority2', 'Version Priority2', 'Version Priority 2'], prev.versionPriorities[1]), versionMap),
      ],
      subjectPriorities: (() => {
        const p0 = mapVal(pickField(row, ['Subject_1', 'Subject 1', 'SubjectPriority1', 'Subject Priority1', 'Subject Priority 1'], prev.subjectPriorities[0]), subjectMap);
        const p1 = mapVal(pickField(row, ['Subject_2', 'Subject 2', 'SubjectPriority2', 'Subject Priority2', 'Subject Priority 2'], prev.subjectPriorities[1]), subjectMap);
        const p2 = mapVal(pickField(row, ['Subject_3', 'Subject 3', 'SubjectPriority3', 'Subject Priority3', 'Subject Priority 3'], prev.subjectPriorities[2]), subjectMap);
        const p3 = mapVal(pickField(row, ['Subject_4', 'Subject 4', 'SubjectPriority4', 'Subject Priority4'], prev.subjectPriorities[3]), subjectMap);
        const p4 = mapVal(pickField(row, ['Subject_5', 'Subject 5', 'SubjectPriority5', 'Subject Priority5'], prev.subjectPriorities[4]), subjectMap);
        const p5 = mapVal(pickField(row, ['Subject_6', 'Subject 6', 'SubjectPriority6', 'Subject Priority6'], prev.subjectPriorities[5]), subjectMap);
        
        const existing = [p0, p1, p2, p3, p4, p5].filter(p => p && isNaN(Number(p)) && !p.startsWith('Choice'));
        const allValid = Array.from(new Set([...derivedSubjects, ...existing]));
        
        const finalPriorities = Array(10).fill('');
        for(let i = 0; i < allValid.length && i < 10; i++) {
            finalPriorities[i] = allValid[i];
        }
        for(let i = 0; i < 3; i++) {
           if (!finalPriorities[i]) finalPriorities[i] = `Choice ${i+1}`;
        }
        return finalPriorities;
      })()
    }));

    // Wait to simulate process
    await new Promise(resolve => setTimeout(resolve, 600));

    // Generate T-pin (serial-wise)
    let tpin = row['Old-T-pin']?.toString();
    if (!tpin) {
      const teachersList = JSON.parse(localStorage.getItem('teachers') || '[]');
      const existingTpins = teachersList.map((t: any) => parseInt(t.tpin)).filter((n: number) => !isNaN(n));
      const excelTpins = excelDataRef.current.map((r: any) => parseInt(r['T-pin'])).filter((n: number) => !isNaN(n));
      
      const allTpins = [...existingTpins, ...excelTpins];
      const nextTpin = allTpins.length > 0 ? Math.max(...allTpins) + 1 : 1001;
      tpin = nextTpin.toString();
    }
    
    setExcelData(prev => {
      const updatedData = [...prev];
      updatedData[idx] = { ...updatedData[idx], 'T-pin': tpin };
      return updatedData;
    });

    // Save to global storage
    const teachers = JSON.parse(localStorage.getItem('teachers') || '[]');
    teachers.push({
      tpin,
      nickName: pickField(row, ['Nick-Name-*', 'Nick Name*', 'Nick Name', 'NickName']),
      fullName: pickField(row, ['Full-Name-*', 'Full Name*', 'Full Name', 'FullName']),
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('teachers', JSON.stringify(teachers));

    setProcessingIdx(null);
    return true;
  };

  const exportExcel = () => {
    const currentData = excelDataRef.current;
    if (!currentData || currentData.length === 0) return;
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(currentData);
    XLSX.utils.book_append_sheet(wb, ws, "Teachers");
    XLSX.writeFile(wb, "Teachers_with_T-Pins.xlsx");
  };

  const startAutoRun = async () => {
    setIsAutoRunning(true);
    isAutoRunningRef.current = true;
    let autoStop = false;
    
    for (let i = 0; i < excelDataRef.current.length; i++) {
      if (!isAutoRunningRef.current) break;
      
      const existingTpin = excelDataRef.current[i]['T-pin'];
      if (existingTpin && existingTpin !== '-' && existingTpin.toString().trim() !== '') continue;
      
      const success = await processRow(i);
      if (!success) break;
      
      // Wait to simulate process before the next row
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    const wasStopped = !isAutoRunningRef.current;
    setIsAutoRunning(false);
    isAutoRunningRef.current = false;
    
    // Auto download once finished
    if (!autoStop && !wasStopped) {
      exportExcel();
    }
  };

  const handleOrgChange = (org: string) => {
    setFormData(prev => ({
      ...prev,
      orgs: { ...prev.orgs, [org]: !prev.orgs[org as keyof typeof prev.orgs] }
    }));
  };

  return (
    <div className="bg-white text-[13px] text-[#333] font-['Segoe_UI',sans-serif]">
      {/* Header */}
      <div className="bg-[#002B49] text-white px-4 py-1.5 font-medium rounded-t-sm mb-6 flex justify-between items-center">
        <span>Add Teacher</span>
        <div className="flex gap-2">
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-[#5cb85c] hover:bg-[#449d44] px-2 py-0.5 rounded text-[11px] transition-colors"
          >
            <FileSpreadsheet size={14} /> Import Excel
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleExcelImport} 
            className="hidden" 
            accept=".xlsx, .xls, .csv" 
          />
        </div>
      </div>

      {/* Excel Processing Panel */}
      {excelData.length > 0 && (
        <div className="mx-4 mb-8 border border-blue-200 bg-blue-50/30 p-4 rounded-sm animate-in fade-in slide-in-from-top-2">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-blue-800 flex items-center gap-2">
              <FileSpreadsheet size={16} /> Excel Data Found ({excelData.length} rows)
            </h3>
            <div className="flex gap-2">
              <button 
                onClick={exportExcel}
                className="flex items-center gap-1.5 bg-[#2d2dff] hover:bg-blue-700 text-white px-3 py-1 rounded shadow-sm transition-all active:scale-95 text-[12px] font-bold"
              >
                <Download size={14} /> Download Excel
              </button>
              <button 
                onClick={startAutoRun}
                disabled={isAutoRunning}
                className="flex items-center gap-1.5 bg-[#44d17a] hover:bg-[#32ad60] text-white px-3 py-1 rounded shadow-sm disabled:opacity-50 transition-all active:scale-95 text-[12px] font-bold"
              >
                {isAutoRunning ? <RefreshCcw size={14} className="animate-spin" /> : <Play size={14} />} Auto Run
              </button>
              <button 
                onClick={stopAutoRun}
                className="flex items-center gap-1.5 bg-[#ffb100] hover:bg-[#e6a000] text-[#1b1b1b] px-3 py-1 rounded shadow-sm transition-all active:scale-95 text-[12px] font-bold"
              >
                <Square size={14} /> Stop
              </button>
              <button 
                onClick={() => setExcelData([])}
                className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded shadow-sm transition-all active:scale-95 text-[12px] font-bold"
              >
                <Trash2 size={14} /> Clear
              </button>
            </div>
          </div>
          <div className="max-h-60 overflow-auto border border-blue-100 rounded-sm bg-white shadow-inner">
            <table className="w-full text-[11px] border-collapse whitespace-nowrap">
              <thead className="bg-[#fcfcfc] sticky top-0 border-b border-blue-100 shadow-sm z-10">
                <tr className="font-bold text-[#333]">
                  <th className="p-1.5 text-center border-r w-10">#</th>
                  {Object.keys(excelData[0] || {}).filter(k => k !== 'T-pin').map(key => (
                    <th key={key} className="p-1.5 text-left border-r">{key}</th>
                  ))}
                  <th className="p-1.5 text-center sticky right-0 bg-[#fcfcfc] border-l shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)]">Status / T-pin</th>
                </tr>
              </thead>
              <tbody>
                {excelData.map((row, idx) => (
                  <tr key={idx} className={`border-b border-blue-50 hover:bg-blue-50/50 transition-colors ${processingIdx === idx ? 'bg-yellow-50' : ''} ${row['T-pin'] ? 'bg-green-50' : ''}`}>
                    <td className="p-1.5 border-r text-center">{idx + 1}</td>
                    {Object.keys(excelData[0] || {}).filter(k => k !== 'T-pin').map(key => (
                      <td key={key} className="p-1.5 border-r max-w-[200px] truncate" title={row[key]}>
                        {row[key] || '-'}
                      </td>
                    ))}
                    <td className="p-1.5 font-bold text-center sticky right-0 border-l shadow-[-2px_0_5px_-2px_rgba(0,0,0,0.1)] bg-white">
                      {row['T-pin'] || (processingIdx === idx ? <RefreshCcw size={12} className="animate-spin inline" /> : '-')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="space-y-8 pb-20 p-4">
        {/* Remarks Section */}
        <div className="flex gap-8">
          <label className="w-32 text-right font-bold pt-2 text-[#444]">Remarks</label>
          <textarea 
            placeholder="Enter Remarks"
            className="flex-grow border border-[#ccc] rounded-sm p-2 h-32 focus:outline-none focus:border-blue-400"
            value={formData.remarks}
            onChange={e => setFormData({ ...formData, remarks: e.target.value })}
          ></textarea>
        </div>

        {/* Quick Information */}
        <section>
          <h2 className="text-[#444] text-[18px] border-b border-[#eee] pb-2 mb-6">Quick Information</h2>
          <div className="flex gap-10">
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Nick Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Nick Name" 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400"
                  value={formData.nickName}
                  onChange={e => setFormData({ ...formData, nickName: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Full Name <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Mobile Number 1 <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Mobile Number1" 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400"
                  value={formData.mobile1}
                  onChange={e => setFormData({ ...formData, mobile1: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Mobile Number 2</label>
                <input 
                  type="text" 
                  placeholder="Mobile Number2" 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400"
                  value={formData.mobile2}
                  onChange={e => setFormData({ ...formData, mobile2: e.target.value })}
                />
              </div>
            </div>
            
            <div className="w-48 flex flex-col items-center pt-2">
              <div className="w-32 h-[160px] bg-[#f8f8f8] border border-[#ddd] overflow-hidden mb-2 shadow-inner">
                 <img 
                   src="https://via.placeholder.com/128x160?text=Upload+Photo" 
                   alt="Teacher Photo" 
                   className="w-full h-full object-cover opacity-60" 
                 />
              </div>
              <div className="flex gap-3">
                <button className="text-green-600 hover:text-green-800 p-1"><Upload size={18} /></button>
                <button className="text-blue-600 hover:text-blue-800 p-1"><Download size={18} /></button>
                <button className="text-red-500 hover:text-red-700 p-1"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 pt-4">
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Mobile Banking Number</label>
              <input 
                type="text" 
                placeholder="Enter Mobile Banking Number" 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                value={formData.mobileBankingNumber}
                onChange={e => setFormData({ ...formData, mobileBankingNumber: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Mobile Banking Type</label>
              <select 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
                value={formData.mobileBankingType}
                onChange={e => setFormData({ ...formData, mobileBankingType: e.target.value })}
              >
                <option>Select Type</option>
                <option>bKash</option>
                <option>Nagad</option>
                <option>Rocket</option>
              </select>
            </div>
          </div>
        </section>

        {/* Academic Details */}
        <section className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Institute <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Institute" 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
              value={formData.institute}
              onChange={e => setFormData({ ...formData, institute: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Department <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="Department" 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
              value={formData.department}
              onChange={e => setFormData({ ...formData, department: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">HSC Passing Year <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              placeholder="HSC Passing Year" 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
              value={formData.hscPassingYear}
              onChange={e => setFormData({ ...formData, hscPassingYear: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Teacher Grade</label>
            <select 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
              value={formData.teacherGrade}
              onChange={e => setFormData({ ...formData, teacherGrade: e.target.value })}
            >
              <option>-- Not Applicable --</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Religion <span className="text-red-500">*</span></label>
            <select 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
              value={formData.religion}
              onChange={e => setFormData({ ...formData, religion: e.target.value })}
            >
              <option>Islam</option>
              <option>Hinduism</option>
              <option>Christianity</option>
              <option>Buddhism</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Gender <span className="text-red-500">*</span></label>
            <select 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
              value={formData.gender}
              onChange={e => setFormData({ ...formData, gender: e.target.value })}
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </section>

        {/* Organizations */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right font-bold">Organization <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            {['UDVASH', 'UNMESH', 'ONLINE CARE', 'UTTORON'].map(org => (
              <label key={org} className="flex items-center gap-1 cursor-pointer font-bold">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 cursor-pointer" 
                  checked={formData.orgs[org as keyof typeof formData.orgs]}
                  onChange={() => handleOrgChange(org)}
                />
                {org}
              </label>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <label className="w-40 shrink-0 text-right font-bold pt-1.5">Activity Priority <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-4 flex-grow">
              {formData.activityPriorities.map((val, i) => (
                <select 
                  key={i} 
                  className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
                  value={val}
                  onChange={e => {
                    const newPriorities = [...formData.activityPriorities];
                    newPriorities[i] = e.target.value;
                    setFormData({ ...formData, activityPriorities: newPriorities });
                  }}
                >
                  <option value={`Choice ${i + 1}`}>{`Choice ${i + 1}`}</option>
                  <option value="Teaching">Teaching</option>
                  <option value="Script Evaluation">Script Evaluation</option>
                  <option value="Materials Development">Materials Development</option>
                  <option value="Question & Answer">Question & Answer</option>
                </select>
              ))}
            </div>
          </div>
          <div className="flex items-start gap-4">
            <label className="w-40 shrink-0 text-right font-bold pt-1.5">Subject Priority <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-4 flex-grow">
              {formData.subjectPriorities.slice(0, Math.max(3, formData.subjectPriorities.findLastIndex(v => v) + 1)).map((val, i) => (
                <select 
                  key={i} 
                  className="w-full border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
                  value={val}
                  onChange={e => {
                    const newPriorities = [...formData.subjectPriorities];
                    newPriorities[i] = e.target.value;
                    setFormData({ ...formData, subjectPriorities: newPriorities });
                  }}
                >
                  <option value={`Choice ${i + 1}`}>{`Choice ${i + 1}`}</option>
                  {SUBJECTS.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                  {val && !val.startsWith('Choice') && !SUBJECTS.includes(val) && (
                    <option value={val}>{val}</option>
                  )}
                </select>
              ))}
              {Math.max(3, formData.subjectPriorities.findLastIndex(v => v) + 1) < 10 && (
                <div>
                  <button
                    type="button"
                    className="bg-[#4a8cca] text-white w-[38px] h-[38px] flex items-center justify-center rounded text-xl"
                    onClick={() => {
                      const idx = Math.max(3, formData.subjectPriorities.findLastIndex(v => v) + 1);
                      if (idx < 10) {
                        const newPriorities = [...formData.subjectPriorities];
                        newPriorities[idx] = `Choice ${idx + 1}`;
                        setFormData({ ...formData, subjectPriorities: newPriorities });
                      }
                    }}
                  >
                    +
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Version Priority <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4 flex-grow max-w-[500px]">
              {formData.versionPriorities.map((val, i) => (
                <select key={i} className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
                  <option>{val}</option>
                </select>
              ))}
            </div>
          </div>
           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Teacher Type <span className="text-red-500">*</span></label>
                <select 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
                  value={formData.teacherType}
                  onChange={e => setFormData({ ...formData, teacherType: e.target.value })}
                >
                  <option>Regular</option>
                  <option>Contractual</option>
                </select>
              </div>
               <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Profession <span className="text-red-500">*</span></label>
                <select 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
                  value={formData.profession}
                  onChange={e => setFormData({ ...formData, profession: e.target.value })}
                >
                  <option>Student</option>
                  <option>Service Holder</option>
                  <option>Business</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Job Company</label>
                <input 
                  type="text" 
                  placeholder="Professional Company" 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                  value={formData.jobCompany}
                  onChange={e => setFormData({ ...formData, jobCompany: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Job Department</label>
                <input 
                  type="text" 
                  placeholder="Professional Department" 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                  value={formData.jobDepartment}
                  onChange={e => setFormData({ ...formData, jobDepartment: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Teacher Activity Type <span className="text-red-500">*</span></label>
                <select 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
                  value={formData.teacherActivityType}
                  onChange={e => setFormData({ ...formData, teacherActivityType: e.target.value })}
                >
                  <option>Both</option>
                  <option>Academic</option>
                  <option>Admission</option>
                </select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Current District <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  placeholder="Current District" 
                  className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                  value={formData.currentDistrict}
                  onChange={e => setFormData({ ...formData, currentDistrict: e.target.value })}
                />
              </div>
           </div>
        </div>

        {/* Portal Login & AI */}
        <div className="flex gap-20 ml-10">
           <label className="flex items-center gap-2 font-bold cursor-pointer">
              <label className="w-32 text-right mr-2">Allow Portal Login</label>
              <input 
                type="checkbox" 
                className="w-4 h-4" 
                checked={formData.allowPortalLogin}
                onChange={() => setFormData({ ...formData, allowPortalLogin: !formData.allowPortalLogin })}
              /> Yes
           </label>
           <label className="flex items-center gap-2 font-bold cursor-pointer">
              <label className="w-32 text-right mr-2">Is AI Teacher</label>
              <input 
                type="checkbox" 
                className="w-4 h-4"
                checked={formData.isAiTeacher}
                onChange={() => setFormData({ ...formData, isAiTeacher: !formData.isAiTeacher })}
              /> Yes
           </label>
        </div>

        {/* Details Information */}
        <section className="space-y-6">
          <h2 className="text-[#444] text-[18px] border-b border-[#eee] pb-2 mb-6">Details Information</h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Father Name</label>
              <input 
                type="text" 
                placeholder="Father Name" 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                value={formData.details.fatherName}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, fatherName: e.target.value } })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Mother Name</label>
              <input 
                type="text" 
                placeholder="Mother Name" 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                value={formData.details.motherName}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, motherName: e.target.value } })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Date Of Birth</label>
              <input 
                type="date" 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 h-[34px]"
                value={formData.details.dob}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, dob: e.target.value } })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Blood Group</label>
              <select 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"
                value={formData.details.bloodGroup}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, bloodGroup: e.target.value } })}
              >
                 <option>--Select Blood group--</option>
                 <option>A+</option><option>A-</option>
                 <option>B+</option><option>B-</option>
                 <option>AB+</option><option>AB-</option>
                 <option>O+</option><option>O-</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
               <label className="w-40 text-right font-bold">Mobile Roommate</label>
               <input 
                 type="text" 
                 placeholder="Mobile Number (Roommate)" 
                 className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                 value={formData.details.mobileRoommate}
                 onChange={e => setFormData({ ...formData, details: { ...formData.details, mobileRoommate: e.target.value } })}
               />
            </div>
            <div className="flex items-center gap-4">
               <label className="w-40 text-right font-bold">Mobile Father</label>
               <input 
                 type="text" 
                 placeholder="Mobile Number (Father)" 
                 className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                 value={formData.details.mobileFather}
                 onChange={e => setFormData({ ...formData, details: { ...formData.details, mobileFather: e.target.value } })}
               />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Facebook Id</label>
              <input 
                type="text" 
                placeholder="Facebook Id" 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                value={formData.details.facebookId}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, facebookId: e.target.value } })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">NID Number</label>
              <input 
                type="text" 
                placeholder="NID Number" 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                value={formData.details.nid}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, nid: e.target.value } })}
              />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">TIN</label>
              <input 
                type="text" 
                placeholder="TIN" 
                className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
                value={formData.details.tin}
                onChange={e => setFormData({ ...formData, details: { ...formData.details, tin: e.target.value } })}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Email</label>
            <input 
              type="email" 
              placeholder="Email" 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5"
              value={formData.details.email}
              onChange={e => setFormData({ ...formData, details: { ...formData.details, email: e.target.value } })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">School</label>
            <input 
              type="text" 
              placeholder="School" 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 placeholder:text-gray-300"
              value={formData.details.school}
              onChange={e => setFormData({ ...formData, details: { ...formData.details, school: e.target.value } })}
            />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">College</label>
            <input 
              type="text" 
              placeholder="College" 
              className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 placeholder:text-gray-300"
              value={formData.details.college}
              onChange={e => setFormData({ ...formData, details: { ...formData.details, college: e.target.value } })}
            />
          </div>
        </section>

        {/* Address & Admission */}
        <section className="space-y-6">
           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex items-start gap-4">
                <label className="w-40 text-right font-bold pt-1.5">Present Address</label>
                <textarea 
                  className="flex-grow border border-[#ccc] rounded-sm p-2 h-20 placeholder:text-gray-300" 
                  placeholder="Present address"
                  value={formData.address.present}
                  onChange={e => setFormData({ ...formData, address: { ...formData.address, present: e.target.value } })}
                ></textarea>
              </div>
              <div className="flex items-center gap-4">
                 <label className="w-20 text-right font-bold">Area</label>
                 <input 
                   type="text" 
                   className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" 
                   placeholder="Area"
                   value={formData.address.area}
                   onChange={e => setFormData({ ...formData, address: { ...formData.address, area: e.target.value } })}
                 />
              </div>
              <div className="flex items-start gap-4">
                <label className="w-40 text-right font-bold pt-1.5">Permanent Address</label>
                <textarea 
                  className="flex-grow border border-[#ccc] rounded-sm p-2 h-20 placeholder:text-gray-300" 
                  placeholder="Permanent address"
                  value={formData.address.permanent}
                  onChange={e => setFormData({ ...formData, address: { ...formData.address, permanent: e.target.value } })}
                ></textarea>
              </div>
               <div className="flex items-center gap-4">
                 <label className="w-20 text-right font-bold">District</label>
                 <input 
                   type="text" 
                   className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" 
                   placeholder="District"
                   value={formData.address.district}
                   onChange={e => setFormData({ ...formData, address: { ...formData.address, district: e.target.value } })}
                 />
              </div>
           </div>

           <div className="flex items-start gap-4">
              <label className="w-40 text-right font-bold">Admission Info</label>
              <div className="flex-grow border border-[#ccc] rounded-sm overflow-hidden">
                 <table className="w-full text-center">
                    <thead className="bg-[#fcfcfc] text-[11px] font-bold border-b border-[#ddd]">
                       <tr>
                          <th className="py-2.5 border-r border-[#ddd]">Institute</th>
                          <th className="py-2.5 border-r border-[#ddd]">AT Position</th>
                          <th className="py-2.5 border-r border-[#ddd]">AT Session</th>
                          <th className="py-2.5">Alloted Subject</th>
                       </tr>
                    </thead>
                    <tbody className="text-[12px]">
                       {['BUET', 'MEDICAL', 'DU', 'OTHERS'].map(inst => (
                         <tr key={inst} className="border-b border-[#eee] last:border-0 hover:bg-gray-50/50">
                           <td className="py-2 px-3 border-r border-[#eee] font-bold text-left">{inst}</td>
                           <td className="py-1 px-1.5 border-r border-[#eee]"><input type="text" placeholder="At Position" className="w-full border border-[#ddd] rounded-sm px-2 py-1 placeholder:text-gray-300" /></td>
                           <td className="py-1 px-1.5 border-r border-[#eee]"><input type="text" placeholder="At Session" className="w-full border border-[#ddd] rounded-sm px-2 py-1 placeholder:text-gray-300" /></td>
                           <td className="py-1 px-1.5"><input type="text" placeholder="Subject" className="w-full border border-[#ddd] rounded-sm px-2 py-1 placeholder:text-gray-300" /></td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </section>

        {/* Extra Curricular & Wish List */}
        <section className="space-y-10">
           <div className="flex items-start gap-4">
              <label className="w-40 text-right font-bold">Previous Extra <br/>Carricular Activities</label>
              <div className="grid grid-cols-3 gap-y-3 flex-grow ml-4">
                 {['Debating Club', 'Science Club', 'Cultural Activities', 'Sports', 'Math Olympiad', 'Physics Olympiad', 'Chemistry Olympiad', 'Informatics Olympiad', 'ভাষা প্রতিযুগ'].map(item => (
                   <label key={item} className="flex items-center gap-2 cursor-pointer text-[#444] font-medium"><input type="checkbox" className="w-4 h-4" /> {item}</label>
                 ))}
              </div>
           </div>
           <div className="flex items-start gap-4">
              <label className="w-40 text-right font-bold">Wish to get attached <br/>with</label>
              <div className="grid grid-cols-3 gap-y-3 flex-grow ml-4">
                {[
                  'রামানুজান গণিত ক্লাব', 'উদভাস সাংস্কৃতিক জোট', 'উদভাস ফিল্ম ক্লাব',
                  'অন্যরকম প্রজন্ম (সামাজিক কার্যক্রম)', 'স্পন্দন (রক্তদান কর্মসূচী)', 'নিশীথ (ডিবেটিং ক্লাব)',
                  'উদভাস বিজ্ঞান ক্লাব', 'পাঠ চক্র'
                ].map(item => (
                  <label key={item} className="flex items-center gap-2 cursor-pointer text-[#444] font-medium"><input type="checkbox" className="w-4 h-4" /> {item}</label>
                ))}
              </div>
           </div>
        </section>

        {/* Create Button */}
        <div className="flex flex-col gap-4 pt-4 border-t">
           <button 
             onClick={() => onSave?.(formData)}
             className="bg-[#4a89c5] text-white px-10 py-2.5 rounded-sm font-bold w-fit hover:bg-blue-600 transition-all shadow-md active:scale-95 ml-auto"
           >
              Create
           </button>
           <button 
             onClick={onBack}
             className="text-[#2c53a1] font-bold text-left hover:underline w-fit"
           >
              Back to List
           </button>
        </div>
      </div>
    </div>
  );
}
