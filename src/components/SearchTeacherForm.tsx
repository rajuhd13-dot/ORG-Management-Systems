import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function SearchTeacherForm() {
  const [availableFields, setAvailableFields] = useState([
    'TPIN', 'Nick Name', 'Mobile Number 1', 'Organization', 'Full Name',
    'Father Name', 'Mother Name', 'Institute', 'Mobile Number 2',
    'Mobile Banking Number', 'Mobile Banking Type', 'Mobile Number(Room Mate)',
    'Mobile Number(Father)', 'Mobile Number(Mother)', 'Religion', 'Gender',
    'Date Of Birth', 'Blood Group', 'Department', 'Hsc Passing Year',
    'Email', 'Activity Priority', 'Subject Priority', 'Version Priority',
    'Teacher Type', 'Teacher Activity Type', 'Profession',
    'Professional Company', 'Professional Department', 'NID', 'TIN',
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
    <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden w-full">
      <div className="bg-[#002B49] text-white px-4 py-2 font-semibold text-[14px]">
        Search Teacher
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-6">
            <div className="flex items-center gap-4">
                <label className="font-bold text-[13px] w-28 text-right">Organization</label>
                <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white text-[13px]">
                    <option>All</option>
                    <option>UDVASH</option>
                    <option>UNMESH</option>
                    <option>ONLINE CARE</option>
                    <option>UTTORON</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                <label className="font-bold text-[13px] w-28 text-right">Keyword</label>
                <input type="text" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
            </div>
        </div>

        <section className="border-t border-gray-200 pt-6">
            <h3 className="text-center font-bold text-[13px] mb-4">Select Information To View</h3>
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
            <div className="grid grid-cols-5 gap-4 mt-6">
                <input type="text" placeholder="TPIN" className="border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
                <input type="text" placeholder="Nick Name" className="border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
                <input type="text" placeholder="Mobile Number 1" className="border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
                <input type="text" placeholder="Subject Priority" className="border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
                <input type="number" defaultValue={10} className="border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px]" />
            </div>
            <div className="flex justify-center mt-6">
              <button className="bg-[#4a89c5] text-white px-6 py-1.5 rounded-sm font-bold text-[13px] hover:bg-blue-600">View List</button>
            </div>
        </section>
      </div>
    </div>
  );
}
