import React, { useState, useRef } from 'react';
import { GoogleGenAI, Type } from "@google/genai";

interface RowData {
  roll: string;
  marks: Record<string, string>;
}

export default function ManualMarksEntry() {
  const SUBJECTS_BY_PROGRAM: Record<string, string[]> = {
    "Cadet College Vorti Prostuti (Online)": ["English", "Mathematics", "Bangla", "General Knowledge"],
    "DEFAULT": ["Bangla 1st Paper"]
  };
  const [totalRowsInput, setTotalRowsInput] = useState('40');
  const [createdRows, setCreatedRows] = useState<number | null>(null);
  const [rowsData, setRowsData] = useState<RowData[]>([]);
  const [jsonText, setJsonText] = useState('');
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [isProPanelOpen, setIsProPanelOpen] = useState(true);
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
  
  // Courses mapping
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
      // Extract subject from exam string (e.g., "[107] English 2nd Paper Written Exam-01")
      // We look for everything between the code [XXX] and the type (MCQ/Written/Exam)
      const match = exam.match(/\[\d+\]\s*(.*?)(?=\s+(?:MCQ|Written|Exam|$))/i);
      if (match && match[1]) {
        return [match[1].trim()];
      }
      return [exam]; // Fallback to full exam name if no specific pattern found
    }

    return SUBJECTS_BY_PROGRAM["DEFAULT"];
  };

  // Error states
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleCreate = () => {
    const newErrors: Record<string, boolean> = {};
    
    if (!organization || organization === 'Select Organization') newErrors.organization = true;
    if (!program || program === 'Select Program') newErrors.program = true;
    if (!session || session === 'Select Session') newErrors.session = true;
    if (!course || course === 'Select Course') newErrors.course = true;
    if (!exam || exam === 'Select Exam') newErrors.exam = true;
    if (!examType || examType === 'Select Exam Type') newErrors.examType = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }
    
    const rows = parseInt(totalRowsInput, 10);
    if (!isNaN(rows) && rows > 0) {
      setCreatedRows(rows);
      const subjects = getSubjects();
      setRowsData(Array.from({ length: rows }, () => ({ 
        roll: '', 
        marks: subjects.reduce((acc, sub) => ({ ...acc, [sub]: '' }), {}) 
      })));
    }
  };

  const handlePopulate = (data: RowData[]) => {
    if (data.length > 0) {
      setCreatedRows(data.length);
      setTotalRowsInput(String(data.length));
      setRowsData(data);
    }
  };

  const validateAndPopulateData = (data: any[]) => {
    setValidationError(null);
    const max = parseFloat(highestMark);
    const currentSubjects = getSubjects();
    
    // High Mark validation loop
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      const rollValue = String(item.roll || item.registrationNo || '').trim();
      
      // Check all possible mark keys
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
            // We continue to populate the table even with errors
            break; 
          }
        }
      }
    }

    const validatedData = data.map((item) => {
      const rollValue = String(item.roll || item.registrationNo || '').trim();
      const marks: Record<string, string> = {};
      
      currentSubjects.forEach((sub, idx) => {
        // Try to find mark by subject name, or index-based (mark1, mark2, etc)
        const subValue = item[sub] || item[`mark${idx + 1}`] || (idx === 0 ? item.mark : '');
        marks[sub] = String(subValue || '');
      });

      return { roll: rollValue, marks };
    });

    // Duplicate detection
    const rollMap: Record<string, number[]> = {};
    validatedData.forEach((d, i) => {
      if (d.roll.trim()) {
        if (!rollMap[d.roll]) rollMap[d.roll] = [];
        rollMap[d.roll].push(i + 1);
      }
    });

    const duplicateRolls = Object.entries(rollMap).filter(([_, indexes]) => indexes.length > 1);
    if (duplicateRolls.length > 0) {
      setValidationError({
        type: 'duplicates',
        message: 'Duplicate Rolls Found:',
        details: duplicateRolls.map(([roll, indexes]) => ({ roll, indexes }))
      });
    }

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
          model: "gemini-2.0-flash",
          contents: [
            {
              text: `Extract information from this mark sheet. Look for Roll Numbers/Registration Numbers and their corresponding Marks for subjects: ${getSubjects().join(', ')}. 
              Return ONLY valid JSON in this format: [{"roll": "12345", "English": "85", "Mathematics": "90", ...}]. 
              If a subject mark is not found, leave it empty. If no data is found, return [].`,
            },
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data,
              },
            },
          ],
        });

        let text = response.text;
        if (text) {
          try {
            // Clean markdown bold blocks if any
            text = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const data = JSON.parse(text);
            allExtractedData.push(...data);
          } catch (err) {
            console.error("Failed to parse AI response for file:", file.name, "Raw text:", text, err);
          }
        }
      }

      if (allExtractedData.length > 0) {
        setJsonText(JSON.stringify(allExtractedData, null, 2));
        validateAndPopulateData(allExtractedData);
      }
    } catch (error) {
      console.error("Error processing images:", error);
      alert("Failed to process images. Please try again.");
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
    
    // Update the row in rowsData
    const newData = [...rowsData];
    newData[index] = { ...newData[index], marks: { ...newData[index].marks, [key]: fixMarkValue } };
    setRowsData(newData);

    // Update the JSON text as well to keep it in sync
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data) && data[index]) {
        data[index][key] = fixMarkValue;
        setJsonText(JSON.stringify(data, null, 2));
      }
    } catch (e) {}

    setValidationError(null);
  };

  const handleAutoRemoveDuplicates = () => {
    try {
      const data = JSON.parse(jsonText);
      if (Array.isArray(data)) {
        const seen = new Set();
        const cleaned = data.filter(item => {
          const roll = String(item.roll || item.registrationNo || '').trim();
          if (!roll) return true;
          if (seen.has(roll)) return false;
          seen.add(roll);
          return true;
        });
        setJsonText(JSON.stringify(cleaned, null, 2));
        setValidationError(null);
      }
    } catch (e) {}
  };

  const handleSave = () => {
    // Validate that at least some data exists
    const hasData = rowsData.some(r => r.roll.trim() !== '' || (Object.values(r.marks) as string[]).some(m => m.trim() !== ''));
    if (!hasData) {
      setSaveStatus({ type: 'error', message: 'No data to save.' });
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }

    // Duplicate detection in table
    const rollMap: Record<string, number[]> = {};
    rowsData.forEach((d, i) => {
      const cleanedRoll = d.roll.trim();
      if (cleanedRoll) {
        if (!rollMap[cleanedRoll]) rollMap[cleanedRoll] = [];
        rollMap[cleanedRoll].push(i + 1);
      }
    });

    const duplicateRolls = Object.entries(rollMap).filter(([_, indexes]) => indexes.length > 1);
    if (duplicateRolls.length > 0) {
      const alertMsg = duplicateRolls.map(([roll, indexes]) => 
        `Roll ${roll} is duplicate at Sl. No: ${indexes.join(', ')}`
      ).join('\n');
      alert(`Duplicate rolls found:\n${alertMsg}`);
      return;
    }

    // High Mark validation (double check)
    const max = parseFloat(highestMark);
    for (let i = 0; i < rowsData.length; i++) {
      const markValues = Object.values(rowsData[i].marks) as string[];
      for (const valStr of markValues) {
        const val = parseFloat(valStr);
        if (!isNaN(max) && !isNaN(val) && val > max) {
          alert(`Mark ${val} at Sl. No ${i + 1} exceeds highest mark ${max}`);
          return;
        }
      }
    }

    // Simulate successful save
    setSaveStatus({ type: 'success', message: 'Marks entry successful' });
    
    // Clear the form data as requested (empty Registration No./Roll and Marks)
    const subjects = getSubjects();
    setRowsData(rowsData.map(() => ({ 
      roll: '', 
      marks: subjects.reduce((acc, sub) => ({ ...acc, [sub]: '' }), {}) 
    })));
    setJsonText('');

    // In a real app, we would send data to server here
    console.log("Saving data:", rowsData);

    // Auto hide message after 5 seconds to match UserScript behavior
    setTimeout(() => setSaveStatus(null), 5000);
  };

  const renderSelectField = (label: string, value: string, setValue: (v: string) => void, options: string[], errorKey: string, placeholder: string, customOnChange?: (v: string) => void) => {
    const hasError = errors[errorKey];
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-4">
          <label className="w-[120px] text-right font-bold text-gray-700 text-[13px] shrink-0">{label}</label>
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
            {hasError && (
              <div className="absolute -bottom-5 left-0 text-[12px] text-red-500 font-normal">
                The {label} field is required.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 mt-4 px-2">
      <div className="bg-white border border-[#002B49] rounded-sm overflow-hidden">
        <div className="bg-[#002B49] text-white px-4 py-1.5 flex justify-between items-center">
          <h2 className="text-[13px] font-bold">Manual Marks Entry</h2>
        </div>
        
        <div className="p-6">
          {/* Multiple Subjects Marks Entry Pro Panel */}
          <div className="mb-8 border border-[#337ab7] rounded-sm overflow-hidden font-['Segoe_UI',sans-serif]">
            <div 
              className="bg-[#337ab7] text-white px-4 py-2 font-bold cursor-pointer flex justify-between items-center text-[14px]"
              onClick={() => setIsProPanelOpen(!isProPanelOpen)}
            >
              <span>📋 Multiple Subjects Marks Entry Pro</span>
              <span>{isProPanelOpen ? '−' : '+'}</span>
            </div>
            
            {isProPanelOpen && (
              <div className="p-4 bg-[#fdfdfd] border-t border-[#ddd]">
                <textarea 
                  value={jsonText}
                  onChange={(e) => setJsonText(e.target.value)}
                  placeholder={`Paste JSON here...\n\nExample for current program (${program || 'DEFAULT'}):\n[{"slno":"1","roll":"4940118",${getSubjects().map(s => `"${s}":"18.5"`).join(',')}}]\n\nSingle (legacy):\n[{"slno":"1","roll":"4304768","mark":"6"}]`}
                  className="w-full h-36 border border-[#ccc] rounded-sm p-3 text-[12px] font-mono focus:outline-none focus:border-blue-400 mb-3 bg-white resize-y"
                />

                <div className="mb-3 space-y-1.5">
                  <div className="flex items-start gap-2 text-[12px] text-[#333]">
                    <span className="w-3.5 h-3.5 bg-[#28a745] text-white rounded-[2px] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                    <div>Press <b>Populate</b>: Total Rows set to JSON length + auto Create if needed.</div>
                  </div>
                  <div className="flex items-start gap-2 text-[12px] text-[#333]">
                    <span className="w-3.5 h-3.5 bg-[#28a745] text-white rounded-[2px] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                    <div><b>JSON SL</b> column shows <code>slno</code> (site serial unchanged).</div>
                  </div>
                  <div className="flex items-start gap-2 text-[12px] text-[#333]">
                    <span className="w-3.5 h-3.5 bg-[#28a745] text-white rounded-[2px] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">✓</span>
                    <div>If any mark exceeds Highest Mark, inline fix appears (Update).</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="text-[13px] font-bold">Highest Mark:</span>
                  <input 
                    type="number" 
                    value={highestMark}
                    onChange={(e) => setHighestMark(e.target.value)}
                    className="w-20 border border-[#ccc] rounded-sm px-2 py-1 text-[13px] font-bold outline-none" 
                  />
                  <span className="text-[12px] px-2 py-0.5 rounded-full border border-[#ddd] bg-white text-[#555] font-bold">Max: <b>{highestMark}</b></span>
                  <span className="text-[12px] px-2 py-0.5 rounded-full border border-[#ddd] bg-white text-[#555] font-bold">Inputs: <b>{getSubjects().length}</b></span>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-[#eee]">
                  <button 
                    onClick={handleJsonPopulate}
                    className="bg-[#28a745] hover:bg-[#218838] text-white px-5 py-2 rounded-[4px] text-[14px] font-extrabold transition-colors"
                  >
                    Populate
                  </button>
                  <div className="relative">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                      className="hidden" 
                      accept="image/*"
                      multiple
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessingImage}
                      className={`${isProcessingImage ? 'bg-gray-400' : 'bg-[#28a745] hover:bg-[#218838]'} text-white px-5 py-2 rounded-[4px] text-[14px] font-extrabold transition-colors flex items-center gap-2`}
                    >
                      {isProcessingImage ? 'Extracting...' : 'Upload Marksheet'}
                    </button>
                  </div>
                  <button 
                    onClick={() => { setJsonText(''); setRowsData([]); setCreatedRows(null); setValidationError(null); }}
                    className="bg-[#6c757d] hover:bg-[#5a6268] text-white px-5 py-2 rounded-[4px] text-[14px] font-extrabold transition-colors"
                  >
                    Clear
                  </button>

                  {/* Validation Error Banner */}
                  {validationError && (
                    <div className={`mt-4 p-2.5 rounded-[4px] text-[12px] flex items-center flex-wrap gap-2 ${validationError.type === 'mark_too_high' ? 'bg-[#f8d7da] text-[#721c24] border border-[#f5c6cb]' : 'bg-[#fff3cd] text-[#856404] border border-[#ffeeba]'}`}>
                      <span className="font-extrabold">
                        {validationError.type === 'mark_too_high' ? '❌' : '⚠️'} {validationError.message}
                      </span>
                      
                      {validationError.type === 'mark_too_high' && (
                        <>
                          <span className="bg-[#dc3545] text-white px-1.5 py-0.5 rounded font-bold">SL {validationError.details.index + 1}</span>
                          <span className="whitespace-nowrap">
                            Roll: <b>{validationError.details.roll}</b> | <b>{validationError.details.key}</b>: <b>{validationError.details.mark} (&gt; {highestMark})</b>
                          </span>
                          <div className="flex items-center gap-2 ml-auto">
                            <span>New:</span>
                            <input 
                              type="number" 
                              value={fixMarkValue}
                              onChange={(e) => setFixMarkValue(e.target.value)}
                              className="w-16 px-1.5 py-0.5 border border-[#d39ca2] rounded bg-white outline-none"
                            />
                            <button 
                              onClick={handleFixHighMark}
                              className="bg-[#dc3545] text-white px-3 py-0.5 rounded font-bold hover:brightness-95 transition-all text-[11px]"
                            >
                              Update
                            </button>
                          </div>
                        </>
                      )}

                      {validationError.type === 'duplicates' && (
                        <>
                          <div className="flex flex-wrap gap-1.5">
                            {validationError.details.slice(0, 5).map((d: any) => (
                              <span key={d.roll} className="bg-[#dc3545] text-white px-2 py-0.5 rounded-full font-bold text-[10px]">
                                {d.roll} ({d.indexes.length}x)
                              </span>
                            ))}
                            {validationError.details.length > 5 && <span>...</span>}
                          </div>
                          <button 
                            onClick={handleAutoRemoveDuplicates}
                            className="bg-[#dc3545] text-white px-3 py-1 rounded font-bold hover:brightness-95 transition-all text-[11px] ml-auto"
                          >
                            Auto Remove (Keep First)
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            {/* Organization */}
            {renderSelectField("Organization", organization, setOrganization, ["UDVASH", "UNMESH", "ONLINE CARE", "UTTORON"], "organization", "Select Organization")}
            
            {/* Program */}
            {renderSelectField("Program", program, setProgram, [
              "Engineering Admission Program", "Varsity 'KA' Admission Program", "Varsity 'KHA' Admission Program",
              "SSC Model Test", "HSC Model Test", "Class 9 Academic Program", "Class 9 Bangla-English Program",
              "Class 10 Academic Program", "Class 10 Bangla-English Program", "HSC Bangla-English Full Program",
              "Class 11 Academic Program", "Class 12 Academic Program", "College Admission Program",
              "Cadet College Vorti Prostuti (Online)"
            ], "program", "Select Program", (v) => { 
              setCourse(''); 
              setExam(''); 
              setCreatedRows(null);
              setRowsData([]);
            })}
            
            {/* Session */}
            {renderSelectField("Session", session, setSession, ["2027", "2026", "2025", "2024", "2023", "2022", "2021", "2020"], "session", "Select Session")}
            
            {/* Course */}
            {renderSelectField("Course", course, setCourse, getCourses(), "course", "Select Course")}
            
            {/* Exam */}
            {renderSelectField("Exam", exam, setExam, getExams(), "exam", "Select Exam")}
            
            {/* Exam Type */}
            {renderSelectField("Exam Type", examType, setExamType, ["Written"], "examType", "Select Exam Type")}

            {/* Exam Held Date */}
            <div className="flex items-center gap-4">
              <label className="w-[120px] text-right font-bold text-gray-700 text-[13px] shrink-0">Exam Held Date</label>
              <input type="date" defaultValue="2026-04-24" className="flex-grow border border-[#ccc] rounded-[4px] px-3 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 bg-[#eeeeee]" />
            </div>
            
            {/* Total Rows */}
            <div className="flex items-center gap-4">
              <label className="w-[120px] text-right font-bold text-gray-700 text-[13px] shrink-0">Total Rows</label>
              <input 
                type="text" 
                value={totalRowsInput}
                onChange={(e) => setTotalRowsInput(e.target.value)}
                className="flex-grow border border-[#ccc] rounded-[4px] px-3 py-1.5 text-[13px] text-gray-600 focus:outline-none focus:border-blue-400 bg-white" 
              />
            </div>
          </div>
          
          <div className="flex justify-center items-center gap-4 mt-10">
            <button 
              onClick={handleCreate}
              className="bg-[#428bca] hover:bg-[#337ab7] text-white px-6 py-1.5 rounded-[4px] text-[13px] font-normal transition-colors"
            >
              Create
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#002B49] rounded-sm overflow-hidden">
        <div className="bg-[#002B49] text-white px-4 py-1.5 flex justify-between items-center">
          <h2 className="text-[13px] font-bold">Marks Details</h2>
        </div>
        
        <div className="p-4">
          {createdRows === null ? (
            <div className="border border-[#e3e3e3] bg-white py-4 text-center my-2">
              <span className="text-[13px] font-bold text-[#333]">Please Fillup Exam details criteria.</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-[#e3e3e3]">
                <thead>
                  <tr>
                    <th className="border border-[#e3e3e3] py-3 px-4 text-center text-[13px] font-bold text-[#333] w-16">Sl.</th>
                    <th className="border border-[#e3e3e3] py-3 px-4 text-center text-[13px] font-bold text-[#333] min-w-[180px]">Registration No. / Roll Number</th>
                    {getSubjects().map(sub => (
                      <th key={sub} className="border border-[#e3e3e3] py-3 px-4 text-center text-[13px] font-bold text-[#333]">{sub}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rowsData.map((rowData, idx) => (
                    <tr key={idx}>
                      <td className="border border-[#e3e3e3] py-2 px-4 text-center text-[13px] font-bold text-[#333]">
                        {idx + 1}
                      </td>
                      <td className="border border-[#e3e3e3] py-2 px-2">
                        <input 
                          type="text" 
                          placeholder="Reg No. / Roll No." 
                          value={rowData.roll}
                          onChange={(e) => updateRowData(idx, 'roll', e.target.value)}
                          className="w-full border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-400" 
                        />
                      </td>
                      {getSubjects().map(sub => (
                        <td key={sub} className="border border-[#e3e3e3] py-2 px-2">
                          <input 
                            type="text" 
                            value={rowData.marks[sub] || ''}
                            onChange={(e) => updateRowData(idx, 'mark', e.target.value, sub)}
                            className="w-full border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-400" 
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {saveStatus && (
                <div className={`mt-4 mb-4 p-2.5 rounded-md text-center font-bold text-[14px] w-full ${saveStatus.type === 'success' ? 'bg-[#dff0d8] text-[#3c763d] border border-[#d6e9c6]' : 'bg-[#f2dede] text-[#a94442] border border-[#ebccd1]'}`}>
                  {saveStatus.message}
                </div>
              )}

              <div className="flex justify-center p-4 border-t border-[#e3e3e3]">
                <button 
                  onClick={handleSave}
                  className="bg-[#428bca] hover:bg-[#3071a9] text-white px-6 py-1.5 rounded-sm text-[13px] font-medium transition-colors"
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
