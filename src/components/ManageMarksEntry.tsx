import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface RowData {
  roll: string;
  marks: Record<string, string>;
}

export default function ManageMarksEntry() {
  const SUBJECTS_BY_PROGRAM: Record<string, string[]> = {
    "Cadet College Vorti Prostuti (Online)": ["English", "Mathematics", "Bangla", "General Knowledge"],
    "DEFAULT": ["Bangla 1st Paper"]
  };
  
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [searchRoll, setSearchRoll] = useState('');
  const [isFound, setIsFound] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProPanelOpen, setIsProPanelOpen] = useState(false);
  const [highestMark, setHighestMark] = useState('30');
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [validationError, setValidationError] = useState<{
    type: 'mark_too_high' | 'duplicates';
    message: string;
    details: any;
  } | null>(null);
  const [fixMarkValue, setFixMarkValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Field states
  const [organization, setOrganization] = useState('');
  const [program, setProgram] = useState('');
  const [session, setSession] = useState('');
  const [course, setCourse] = useState('');
  const [exam, setExam] = useState('');
  const [examType, setExamType] = useState('');
  
  // Courses mapping (shared with ManualMarksEntry)
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
    return COURSES_BY_PROGRAM[program] || [];
  };

  const getExams = () => {
    return EXAMS_BY_PROGRAM[program] || EXAMS_BY_PROGRAM["DEFAULT"];
  };

  const getSubjects = () => {
    if (program === "Cadet College Vorti Prostuti (Online)") {
      return SUBJECTS_BY_PROGRAM["Cadet College Vorti Prostuti (Online)"];
    }
    
    if (exam) {
      const match = exam.match(/\[\d+\]\s*(.*?)(?=\s+(?:MCQ|Written|Exam|$))/i);
      if (match && match[1]) {
        return [match[1].trim()];
      }
      return [exam];
    }

    return SUBJECTS_BY_PROGRAM["DEFAULT"];
  };

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleFind = () => {
    const newErrors: Record<string, boolean> = {};
    if (!organization || organization === 'Select Organization') newErrors.organization = true;
    if (!program || program === 'Select Program') newErrors.program = true;
    if (!session || session === 'Select Session') newErrors.session = true;
    if (!course || course === 'Select Course') newErrors.course = true;
    if (!exam || exam === 'Select Exam') newErrors.exam = true;
    if (!examType || examType === 'Select Exam Type') newErrors.examType = true;
    if (!searchRoll) newErrors.searchRoll = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsFound(true);
    const subjects = getSubjects();
    setRowsData([{ 
      roll: searchRoll, 
      marks: subjects.reduce((acc, sub) => ({ ...acc, [sub]: '' }), {}) 
    }]);
  };

  const handlePopulate = (data: RowData[]) => {
    if (data.length > 0) {
      setIsFound(true);
      setRowsData(data);
    }
  };

  const validateAndPopulateData = (data: any[]) => {
    setValidationError(null);
    const max = parseFloat(highestMark);
    const currentSubjects = getSubjects();
    
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const rollValue = String(item.roll || item.registrationNo || '').trim();
      const markKeysToCheck = ['mark', 'mark1', 'mark2', 'mark3', 'mark4', ...currentSubjects];
      for (const key of markKeysToCheck) {
        if (item[key] !== undefined && item[key] !== '') {
          const val = parseFloat(item[key]);
          if (!isNaN(val) && val > max) {
            setValidationError({
              type: 'mark_too_high',
              message: `Mark too high (Highest = ${max})`,
              details: { index: i, roll: rollValue, mark: item[key], key: key }
            });
            setFixMarkValue(String(max));
            break; 
          }
        }
      }
    }

    const validatedData = data.map((item) => {
      const rollValue = String(item.roll || item.registrationNo || '').trim();
      const marks: Record<string, string> = {};
      currentSubjects.forEach((sub, idx) => {
        const subValue = item[sub] || item[`mark${idx + 1}`] || (idx === 0 ? item.mark : '');
        marks[sub] = String(subValue || '');
      });
      return { roll: rollValue, marks };
    });

    handlePopulate(validatedData);
  };

  const handleJsonPopulate = () => {
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data)) {
        validateAndPopulateData(data);
      }
    } catch (e: any) {
      alert(e?.message || 'Invalid JSON format');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsProcessingImage(true);
    setValidationError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const allExtractedData: any[] = [];

      for (const file of Array.from(files) as File[]) {
        const base64Data = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => resolve((event.target?.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });

        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: [
            {
              text: `Extract information from this mark sheet. Look for Roll Numbers/Registration Numbers and their corresponding Marks for subjects: ${getSubjects().join(', ')}. 
              Return ONLY valid JSON in this format: [{"roll": "12345", "English": "85", "Mathematics": "90", ...}]. 
              If a subject mark is not found, leave it empty. If no data is found, return [].`,
            },
            {
              inlineData: { mimeType: file.type, data: base64Data },
            },
          ],
        });

        const text = response.text;
        if (text) {
          try {
            const data = JSON.parse(text);
            allExtractedData.push(...data);
          } catch (err) {
            console.error("Failed to parse AI response", err);
          }
        }
      }

      if (allExtractedData.length > 0) {
        setJsonText(JSON.stringify(allExtractedData, null, 2));
        validateAndPopulateData(allExtractedData);
      }
    } catch (error) {
      console.error("Error processing images", error);
      alert("Failed to process images.");
    } finally {
      setIsProcessingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateRowData = (idx: number, field: string, value: string, subject?: string) => {
    if (field === 'mark' && subject && value.trim() !== '') {
      const max = parseFloat(highestMark);
      const val = parseFloat(value);
      if (!isNaN(max) && !isNaN(val) && val > max) {
        setValidationError({
          type: 'mark_too_high',
          message: `Mark too high (Highest = ${max})`,
          details: { index: idx, roll: rowsData[idx].roll, mark: value, key: subject }
        });
        setFixMarkValue(String(max));
        return;
      }
    }
    const newData = [...rowsData];
    if (field === 'roll') {
      newData[idx] = { ...newData[idx], roll: value };
    } else if (field === 'mark' && subject) {
      newData[idx] = { ...newData[idx], marks: { ...newData[idx].marks, [subject]: value } };
    }
    setRowsData(newData);
    setValidationError(null);
  };

  const handleFixHighMark = () => {
    if (!validationError || validationError.type !== 'mark_too_high') return;
    const { index, key } = validationError.details;
    const newData = [...rowsData];
    newData[index] = { ...newData[index], marks: { ...newData[index].marks, [key]: fixMarkValue } };
    setRowsData(newData);
    setValidationError(null);
  };

  const handleSave = () => {
    const hasData = rowsData.some(r => r.roll.trim() !== '' || (Object.values(r.marks) as string[]).some(m => m.trim() !== ''));
    if (!hasData) {
      setSaveStatus({ type: 'error', message: 'No data to save.' });
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    setSaveStatus({ type: 'success', message: 'Marks updated successfully' });
    setTimeout(() => setSaveStatus(null), 5000);
  };

  const renderSelectField = (label: string, value: string, setValue: (v: string) => void, options: string[], errorKey: string, placeholder: string, customOnChange?: (v: string) => void) => {
    const hasError = errors[errorKey];
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          <label className="w-[110px] text-right font-bold text-gray-700 text-[13px] shrink-0">{label}</label>
          <div className="flex-grow relative">
            <select 
              value={value}
              onChange={(e) => {
                const newVal = e.target.value;
                setValue(newVal);
                if (newVal && newVal !== placeholder) {
                  setErrors(prev => ({ ...prev, [errorKey]: false }));
                }
                if (customOnChange) customOnChange(newVal);
              }}
              className={`w-full border rounded-[4px] px-3 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 bg-white ${hasError ? 'border-red-500' : 'border-[#ccc]'}`}
            >
              <option>{placeholder}</option>
              {options.map(opt => <option key={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 mt-4 px-2 font-['Segoe_UI',sans-serif]">
      {/* Exam Details Card */}
      <div className="bg-white border border-[#002B49] rounded-sm overflow-hidden shadow-sm">
        <div className="bg-[#002B49] text-white px-4 py-1.5 font-bold text-[13px]">Exam Details</div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
            {renderSelectField("Organization", organization, setOrganization, ["UDVASH", "UNMESH", "ONLINE CARE", "UTTORON"], "organization", "Select Organization")}
            {renderSelectField("Program", program, setProgram, Object.keys(COURSES_BY_PROGRAM), "program", "Select Program", (v) => {
              setCourse('');
              setExam('');
              setRowsData([]);
              setIsFound(false);
            })}
            
            {renderSelectField("Session", session, setSession, ["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020"], "session", "Select Session")}
            {renderSelectField("Course", course, setCourse, getCourses(), "course", "Select Course")}
            
            {renderSelectField("Exam", exam, setExam, getExams(), "exam", "Select Exam")}

            {renderSelectField("Exam Type", examType, setExamType, ["Written"], "examType", "Select Exam Type")}
          </div>
        </div>
      </div>

      {/* Student Registration/Roll Number Card */}
      <div className="bg-white border border-[#002B49] rounded-sm overflow-hidden shadow-sm">
        <div className="bg-[#002B49] text-white px-4 py-1.5 font-bold text-[13px]">Student Registration/Roll Number</div>
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <label className="font-bold text-gray-700 text-[14px] md:w-[150px] text-right">Student Regi/ Roll</label>
            <div className="flex items-center gap-2 w-full max-w-[400px]">
              <input 
                type="text" 
                value={searchRoll}
                onChange={(e) => setSearchRoll(e.target.value)}
                placeholder="Reg No. / Roll No." 
                className={`flex-grow border rounded-sm px-3 py-2 text-[14px] focus:outline-none focus:border-blue-400 bg-white ${errors.searchRoll ? 'border-red-500' : 'border-[#ccc]'}`} 
              />
              <button 
                onClick={handleFind}
                className="bg-[#428bca] hover:bg-[#337ab7] text-white px-6 py-2 rounded-[4px] text-[14px] font-normal transition-colors min-w-[80px]"
              >
                Find
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Marks Details Card */}
      <div className="bg-white border border-[#002B49] rounded-sm overflow-hidden">
        <div className="bg-[#002B49] text-white px-4 py-1.5 font-bold text-[13px]">Marks Details</div>
        <div className="p-4">
          {!isFound ? (
            <div className="bg-white py-6 text-center border-t border-gray-100">
              <span className="text-[15px] font-bold text-[#333]">Please Fillup Exam Details Criteria & Give a Roll/Registration No.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {validationError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded-sm text-[13px] flex items-center justify-between">
                  <div>
                    <span className="font-bold">Error:</span> {validationError.message} 
                    (Roll: {validationError.details.roll}, Mark: {validationError.details.mark})
                  </div>
                  <button onClick={handleFixHighMark} className="bg-red-600 text-white px-3 py-1 rounded text-[11px] font-bold">Fix to {highestMark}</button>
                </div>
              )}
              
              <table className="w-full border-collapse border border-[#e3e3e3]">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-[#e3e3e3] py-2 px-4 text-center text-[13px] font-bold text-[#333] w-16">Sl.</th>
                    <th className="border border-[#e3e3e3] py-2 px-4 text-center text-[13px] font-bold text-[#333] min-w-[200px]">Registration No. / Roll Number</th>
                    {getSubjects().map(sub => (
                      <th key={sub} className="border border-[#e3e3e3] py-2 px-4 text-center text-[13px] font-bold text-[#333]">{sub}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowsData.map((rowData, idx) => (
                    <tr key={idx}>
                      <td className="border border-[#e3e3e3] py-2 px-4 text-center text-[13px] font-bold text-[#333]">{idx + 1}</td>
                      <td className="border border-[#e3e3e3] py-2 px-2">
                        <input 
                          type="text" 
                          value={rowData.roll}
                          readOnly
                          className="w-full border-0 px-3 py-1.5 text-[13px] focus:outline-none bg-gray-50" 
                        />
                      </td>
                      {getSubjects().map(sub => (
                        <td key={sub} className="border border-[#e3e3e3] py-2 px-2">
                          <input 
                            type="text" 
                            value={rowData.marks[sub] || ''}
                            onChange={(e) => updateRowData(idx, 'mark', e.target.value, sub)}
                            className="w-full border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-400 bg-white" 
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>

              {saveStatus && (
                <div className={`mt-4 p-2.5 rounded-md text-center font-bold text-[14px] ${saveStatus.type === 'success' ? 'bg-[#dff0d8] text-[#3c763d] border border-[#d6e9c6]' : 'bg-[#f2dede] text-[#a94442] border border-[#ebccd1]'}`}>
                  {saveStatus.message}
                </div>
              )}

              <div className="flex justify-center p-6 mt-4 border-t border-[#eee]">
                <button 
                  onClick={handleSave}
                  className="bg-[#428bca] hover:bg-[#3071a9] text-white px-8 py-2 rounded-sm text-[14px] font-medium transition-colors shadow-sm"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
