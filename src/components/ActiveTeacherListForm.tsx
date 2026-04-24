import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function ActiveTeacherListForm() {
  const [availableFields, setAvailableFields] = useState([
    'TPIN', 'Organization', 'Full Name', 'Nick Name', 'Father Name', 'Mother Name',
    'Institute', 'Mobile Number 1', 'Mobile Number 2', 'Mobile Banking Number',
    'Mobile Banking Type', 'Mobile Number(Room Mate)', 'Mobile Number(Father)',
    'Mobile Number(Mother)', 'Religion', 'Gender', 'Date Of Birth', 'Blood Group',
    'Department', 'HSC Passing Year', 'Email', 'Activity Priority',
    'Subject Priority', 'Version Priority', 'Teacher Type', 'Teacher Activity Type',
    'Profession', 'Professional Company', 'Professional Department', 'NID', 'TIN',
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

  const filters = [
    { label: 'Activity Priority', options: ['Select All'] },
    { label: 'Class Type', options: ['Select All'] },
    { label: 'Organization', options: ['Select All'] },
    { label: 'Program', options: ['Select All'] },
    { label: 'Session', options: ['Select All'] },
    { label: 'Course', options: ['Select All'] },
    { label: 'Branch', options: ['Select All'] },
    { label: 'Campus', options: ['Select All'] },
  ];

  return (
    <div className="bg-white border border-[#d5d5d5] rounded-sm shadow-sm overflow-hidden w-full text-[13px]">
      <div className="bg-[#002B49] text-white px-4 py-2 font-semibold text-[14px]">
        Active Teacher List
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-6">
          {filters.map((filter, i) => (
            <div key={i} className="flex items-center gap-4">
              <label className="font-bold w-32 text-right">{filter.label}</label>
              <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
                {filter.options.map(opt => <option key={opt}>{opt}</option>)}
              </select>
            </div>
          ))}
          <div className="flex items-center gap-4">
            <label className="font-bold w-32 text-right">Date From</label>
            <input type="date" defaultValue="2026-04-16" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-bold w-32 text-right">Date To</label>
            <input type="date" defaultValue="2026-04-23" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="font-bold w-32 text-right">Display Per Page</label>
            <input type="number" defaultValue={100} className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
        </div>

        <section className="border-t border-gray-200 pt-6">
          <h3 className="text-center font-bold mb-4">Select Information To View</h3>
          <div className="flex justify-center items-center gap-4">
            <select
                multiple
                className="w-[300px] h-32 border border-[#ccc] rounded-sm p-2"
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
                className="w-[300px] h-32 border border-[#ccc] rounded-sm p-2"
                onChange={(e) => setRightSelected(Array.from(e.target.selectedOptions as unknown as HTMLOptionElement[]).map(option => option.value))}
            >
                {selectedFields.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            <button className="bg-[#4a89c5] text-white px-8 py-1.5 rounded-sm font-bold hover:bg-blue-600 transition-colors">View</button>
            <button className="bg-[#4a89c5] text-white px-8 py-1.5 rounded-sm font-bold hover:bg-blue-600 transition-colors">Export</button>
          </div>
        </section>
      </div>
    </div>
  );
}
