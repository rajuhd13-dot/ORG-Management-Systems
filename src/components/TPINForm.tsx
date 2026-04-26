import React, { useState } from 'react';

interface TeacherSearchByPinFormProps {
  onVerify: () => void;
  label?: string;
}

export default function TeacherSearchByPinForm({ onVerify, label = 'Teacher PIN' }: TeacherSearchByPinFormProps) {
  const [value, setValue] = useState('');
  return (
    <div className="bg-white border border-[#d5d5d5] rounded-sm overflow-hidden w-full shadow-sm">
      <div className="bg-[#002B49] text-white px-4 py-1.5 font-medium text-[13.5px]">
        {label}
      </div>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          if (value.trim()) {
            localStorage.setItem('editing_teacher_pin', value.trim());
            onVerify();
          }
        }}
        className="py-10 flex flex-col items-center justify-center space-y-4"
      >
        <div className="w-[280px]">
          <input 
            type="text" 
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${label}`}
            className="w-full border border-[#ccc] rounded-sm px-3 py-1.5 text-[13px] focus:outline-none focus:border-blue-400 placeholder:text-gray-400"
          />
        </div>
        <button 
          type="submit"
          className="bg-[#4a89c5] text-white px-12 py-1.5 rounded-sm text-[17px] font-medium hover:bg-blue-600 transition-colors w-[280px]"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
