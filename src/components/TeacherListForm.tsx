import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function TeacherListForm() {
  const [availableFields, setAvailableFields] = useState([
    'TPIN', 'Organization', 'Full Name', 'Nick Name', 'Father\'s Name', 'Mother\'s Name',
    'Institute', 'Mobile Number 1', 'Mobile Number 2', 'Mobile Banking Number',
    'Mobile Banking Type', 'Mobile Number(Room Mate)', 'Mobile Number(Father)',
    'Mobile Number(Mother)', 'Religion', 'Gender', 'Date Of Birth', 'Blood Group',
    'Department', 'HSC Passing Year', 'Email Address', 'Activity Priority',
    'Subject Priority', 'Version Priority', 'Teacher Type', 'Teacher Activity Type',
    'Profession', 'Professional Company', 'Professional Departmen', 'Nid', 'TIN',
    'School', 'College', 'Current District'
  ]);
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [leftSelected, setLeftSelected] = useState<string[]>([]);
  const [rightSelected, setRightSelected] = useState<string[]>([]);

  const handleMoveAllToRight = () => {
    setSelectedFields([...selectedFields, ...availableFields]);
    setAvailableFields([]);
  };

  const handleMoveSelectedToRight = () => {
    setSelectedFields([...selectedFields, ...leftSelected]);
    setAvailableFields(availableFields.filter(f => !leftSelected.includes(f)));
    setLeftSelected([]);
  };

  const handleMoveSelectedToLeft = () => {
    setAvailableFields([...availableFields, ...rightSelected]);
    setSelectedFields(selectedFields.filter(f => !rightSelected.includes(f)));
    setRightSelected([]);
  };

  const handleMoveAllToLeft = () => {
    setAvailableFields([...availableFields, ...selectedFields]);
    setSelectedFields([]);
  };

  return (
    <div className="bg-white border border-[#d5d5d5] rounded-sm overflow-hidden w-full shadow-sm">
      <div className="bg-[#002B49] text-white px-4 py-1.5 font-medium text-[13.5px]">
        Teacher List
      </div>
      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {/* Organization List & Activity Priority List */}
            {['Organization', 'Activity Priority'].map(label => (
              <div key={label} className="flex items-start gap-4">
                <label className="w-40 text-right font-bold text-[13px] pt-1">{label}</label>
                <select multiple className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white text-[13px] h-[80px]">
                  {label === 'Organization' ? (
                    <>
                      <option>All Organization</option>
                      <option>UDVASH</option>
                      <option>UNMESH</option>
                      <option>ONLINE CARE</option>
                    </>
                  ) : (
                    <>
                      <option>All Teacher Type</option>
                      <option>Teaching</option>
                      <option>Script Evaluation</option>
                      <option>Materials Development</option>
                      <option>Question & Answer</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
             {/* Subject Priority & Activity Type List */}
             {['Subject Priority', 'Activity Type'].map(label => (
                <div key={label} className="flex items-start gap-4">
                  <label className="w-40 text-right font-bold text-[13px] pt-1">{label}</label>
                  <select multiple className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white text-[13px] h-[80px]">
                    {label === 'Subject Priority' ? (
                      <>
                        <option>Bangla 1st Paper</option>
                        <option>Bangla 2nd Paper</option>
                        <option>English 1st Paper</option>
                        <option>English 2nd Paper</option>
                        <option>Mathematics (General Math)</option>
                        <option>ICT (Information and Communication Technology)</option>
                        <option>Religion and Moral Education (Islam, Hindu, Christian, Buddhist)</option>
                        <option>Physics (1st & 2nd Paper)</option>
                        <option>Chemistry (1st & 2nd Paper)</option>
                        <option>Biology (1st & 2nd Paper)</option>
                        <option>Higher Mathematics (1st & 2nd Paper)</option>
                        <option>General Science</option>
                        <option>Mathematical Physics / Mathematical Chemistry</option>
                        <option>Statistics (1st & 2nd Paper)</option>
                        <option>BGS (Bangladesh and Global Studies)</option>
                        <option>History of Bangladesh and World Civilization</option>
                        <option>Geography, Environment and Disaster Management</option>
                        <option>Civics and Citizenship / Good Governance</option>
                        <option>Economics (Bangladesh & International)</option>
                        <option>Arts and Crafts</option>
                        <option>Agriculture Studies</option>
                        <option>Home Science</option>
                        <option>Computer Study / Computer Science (1st & 2nd Paper)</option>
                        <option>C Programming</option>
                        <option>Engineering Drawings and Workshop Practice (1st & 2nd Paper)</option>
                        <option>Architecture</option>
                        <option>Career Education / Kormamukhi Shikkha</option>
                        <option>Physical Education & Health</option>
                        <option>Digital Technology / Life & Livelihood</option>
                        <option>Anatomy & Physiology</option>
                        <option>Pathology, Microbiology & Biochemistry</option>
                        <option>Medicine & Pharmacology</option>
                        <option>Surgery & Community Medicine</option>
                        <option>Obstetrics and Gynaecology</option>
                        <option>Forensic Medicine & Toxicology</option>
                        <option>Dental Subjects (Dental Anatomy, Materials, Oral Surgery)</option>
                        <option>Bangladesh Affairs</option>
                        <option>International Affairs</option>
                        <option>General Knowledge (GK)</option>
                        <option>Mathematical Reasoning & Mental Ability</option>
                        <option>Ethics, Values and Good Governance</option>
                        <option>Analytical Ability / Skills</option>
                        <option>Law & Constitution</option>
                        <option>Subjective GK</option>
                      </>
                    ) : (
                      <>
                        <option>All Activity Type</option>
                        <option>Class</option>
                        <option>Private Care</option>
                        <option>Both</option>
                      </>
                    )}
                  </select>
                </div>
              ))}
          </div>

          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {/* Religion & Profession List */}
            {['Religion', 'Profession'].map(label => (
              <div key={label} className="flex items-start gap-4">
                <label className="w-40 text-right font-bold text-[13px] pt-1">{label}</label>
                <select multiple className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white text-[13px] h-[80px]">
                  {label === 'Religion' ? (
                    <>
                      <option>All Religion</option>
                      <option>Islam</option>
                      <option>Hinduism</option>
                      <option>Christianity</option>
                      <option>Buddhism</option>
                      <option>Other</option>
                    </>
                  ) : (
                    <>
                      <option>All Profession</option>
                      <option>Accountant</option>
                      <option>Architect</option>
                      <option>Business</option>
                      <option>Civil Servant</option>
                      <option>Debater</option>
                      <option>Engineer</option>
                      <option>Entrepreneur</option>
                      <option>Govt. Service</option>
                      <option>Journalist</option>
                      <option>Lawyer</option>
                      <option>Media</option>
                      <option>Olympiad</option>
                      <option>Pharmacists</option>
                      <option>Photographer</option>
                      <option>Police Officer</option>
                      <option>Politician</option>
                      <option>Private Service</option>
                      <option>Researcher</option>
                      <option>Student</option>
                      <option>Teacher</option>
                      <option>Writer</option>
                      <option>Doctor</option>
                    </>
                  )}
                </select>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {['Version Priority', 'Gender', 'Teacher Type', 'Teacher PIN', 'Full Name', 'Nick Name', 'Institute', 'Mobile Number', 'HSC Passing Year', 'Display Per Page'].map(label => (
              <div key={label} className="flex items-center gap-4">
                <label className="w-40 text-right font-bold text-[13px]">{label}</label>
                {['Version Priority', 'Gender', 'Teacher Type'].includes(label) ? (
                  <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white text-[13px] h-[34px]">
                    {label === 'Version Priority' && (
                      <>
                        <option>All Version Priority</option>
                        <option>Bangla</option>
                        <option>English</option>
                      </>
                    )}
                    {label === 'Gender' && (
                      <>
                        <option>All Gender</option>
                        <option>Male</option>
                        <option>Female</option>
                      </>
                    )}
                    {label === 'Teacher Type' && (
                      <>
                        <option>All Type</option>
                        <option>Regular</option>
                        <option>Irregular</option>
                      </>
                    )}
                  </select>
                ) : label === 'Display Per Page' ? (
                  <input type="number" defaultValue={100} className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
                ) : (
                  <input type="text" placeholder={label} className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-4 items-center pl-[176px]">
            <button className="bg-[#4a89c5] text-white px-6 py-1.5 rounded-sm font-bold text-[13px] hover:bg-blue-600">Count</button>
            <input type="text" className="border border-[#ccc] rounded-sm px-3 py-1.5 w-32 text-[13px]" disabled />
        </div>

        <section className="border-t border-[#eee] pt-6">
            <h3 className="text-center font-bold text-[13px] mb-4">Select Information to View</h3>
            <div className="flex justify-center items-center gap-4">
                <select 
                    multiple 
                    className="w-[300px] h-32 border border-[#ccc] rounded-sm p-2 text-[13px]"
                    onChange={(e) => setLeftSelected(Array.from(e.target.selectedOptions as unknown as HTMLOptionElement[]).map(option => option.value))}
                >
                    {availableFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="flex flex-col gap-2">
                    <button onClick={handleMoveAllToRight} className="border border-[#ccc] p-1 rounded-sm"><ChevronsRight size={16} /></button>
                    <button onClick={handleMoveSelectedToRight} className="border border-[#ccc] p-1 rounded-sm"><ArrowRight size={16} /></button>
                    <button onClick={handleMoveSelectedToLeft} className="border border-[#ccc] p-1 rounded-sm"><ArrowLeft size={16} /></button>
                    <button onClick={handleMoveAllToLeft} className="border border-[#ccc] p-1 rounded-sm"><ChevronsLeft size={16} /></button>
                </div>
                <select 
                    multiple 
                    className="w-[300px] h-32 border border-[#ccc] rounded-sm p-2 text-[13px]"
                    onChange={(e) => setRightSelected(Array.from(e.target.selectedOptions as unknown as HTMLOptionElement[]).map(option => option.value))}
                >
                    {selectedFields.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
            </div>
            <div className="flex justify-center mt-6">
              <button className="bg-[#4a89c5] text-white px-10 py-1.5 rounded-sm font-bold text-[13px] hover:bg-blue-600">View</button>
            </div>
        </section>
      </div>
    </div>
  );
}
