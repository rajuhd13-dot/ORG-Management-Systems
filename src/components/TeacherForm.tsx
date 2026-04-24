import React from 'react';
import { Upload, Download, Trash2, PlusCircle } from 'lucide-react';

export default function TeacherForm() {
  return (
    <div className="bg-white text-[13px] text-[#333]">
      {/* Header */}
      <div className="bg-[#002B49] text-white px-4 py-1.5 font-medium rounded-t-sm mb-6">
        Add Teacher
      </div>

      <div className="space-y-8 pb-20">
        {/* Remarks Section */}
        <div className="flex gap-8">
          <label className="w-32 text-right font-bold pt-2">Remarks</label>
          <textarea 
            placeholder="Enter Remarks"
            className="flex-grow border border-[#ccc] rounded-sm p-2 h-32 focus:outline-none focus:border-blue-400"
          ></textarea>
        </div>

        {/* Quick Information */}
        <section>
          <h2 className="text-[#444] text-[18px] border-b border-[#eee] pb-2 mb-6">Quick Information</h2>
          <div className="flex gap-10">
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Nick Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Nick Name" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Full Name <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Full Name" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Mobile Number 1 <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Mobile Number1" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Mobile Number 2</label>
                <input type="text" placeholder="Mobile Number2" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Mobile Banking Number</label>
                <input type="text" placeholder="Enter Mobile Banking Number" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            
            <div className="w-48 flex flex-col items-center gap-3 pt-2">
              <div className="w-32 h-32 bg-[#f8f8f8] border border-[#ddd] flex items-center justify-center">
                 <img src="https://via.placeholder.com/128?text=Photo" alt="Avatar placeholder" className="opacity-40" />
              </div>
              <div className="flex gap-3">
                <button className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"><Upload size={16} /></button>
                <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Download size={16} /></button>
                <button className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mt-4 pr-48">
            <label className="w-40 text-right font-bold">Mobile Banking Type</label>
            <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400 bg-white">
              <option>Select Type</option>
            </select>
          </div>
        </section>

        {/* Academic Details */}
        <section className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Institute <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Institute" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Department <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Department" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">HSC Passing Year <span className="text-red-500">*</span></label>
            <input type="text" placeholder="Only Number" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Teacher Grade</label>
            <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
              <option>-- Not Applicable --</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Religion <span className="text-red-500">*</span></label>
            <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
              <option>Select Religion</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Gender <span className="text-red-500">*</span></label>
            <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
              <option>Select Gender</option>
            </select>
          </div>
        </section>

        {/* Organizations */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right font-bold">Organization <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            {['UDVASH', 'UNMESH', 'ONLINE CARE', 'UTTORON'].map(org => (
              <label key={org} className="flex items-center gap-1 cursor-pointer font-bold">
                <input type="checkbox" className="w-4 h-4" />
                {org}
              </label>
            ))}
          </div>
        </div>

        {/* Priorities */}
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <label className="w-40 text-right font-bold pt-1.5">Activity Priority <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-4 gap-4 flex-grow">
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 1</option></select>
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 2</option></select>
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 3</option></select>
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 4</option></select>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <label className="w-40 text-right font-bold pt-1.5">Subject Priority <span className="text-red-500">*</span></label>
            <div className="flex gap-4 flex-grow items-center">
              <div className="grid grid-cols-3 gap-4 flex-grow">
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 1</option></select>
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 2</option></select>
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 3</option></select>
              </div>
              <button className="bg-[#2c53a1] text-white p-1.5 rounded-sm hover:bg-blue-700 transition-colors">
                <PlusCircle size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Payment & Monthly */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Payment Block</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" /> Cash Payment</label>
              <label className="flex items-center gap-1 cursor-pointer"><input type="checkbox" /> Nagad payment</label>
            </div>
          </div>

          <section>
            <h3 className="text-[#444] text-[16px] border-b border-[#eee] pb-1.5 mb-4">Monthly Teacher Information</h3>
            <label className="flex items-center gap-2 mb-4 font-bold ml-10">
              <input type="checkbox" /> Enable as Monthly Basis Teacher
            </label>
            <div className="ml-10 border border-[#ddd] rounded-sm overflow-hidden">
               <div className="bg-[#f8f8f8] border-b border-[#ddd] px-4 py-2 flex justify-between items-center">
                  <span className="font-bold">Mentor History <span className="text-red-500">*</span></span>
                  <button className="bg-[#89b4db] text-white px-3 py-1 rounded-sm text-[11px] font-bold hover:bg-blue-400 transition-colors">
                    + Add Mentor
                  </button>
               </div>
               <table className="w-full text-center">
                  <thead className="bg-[#fcfcfc] text-[11px] font-bold border-b border-[#ddd]">
                    <tr>
                      <th className="py-2.5 border-r border-[#ddd]">PIN</th>
                      <th className="py-2.5 border-r border-[#ddd]">Name</th>
                      <th className="py-2.5 border-r border-[#ddd]">Designation</th>
                      <th className="py-2.5 border-r border-[#ddd]">Department</th>
                      <th className="py-2.5 border-r border-[#ddd]">Effective Date</th>
                      <th className="py-2.5">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-transparent">
                      <td colSpan={6} className="py-10 text-gray-400 italic">No mentor history available</td>
                    </tr>
                  </tbody>
               </table>
            </div>
          </section>
        </div>

        {/* Details Information */}
        <section className="space-y-6">
          <h2 className="text-[#444] text-[18px] border-b border-[#eee] pb-2 mb-6">Details Information</h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Father Name</label>
              <input type="text" placeholder="Father Name" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Mother Name</label>
              <input type="text" placeholder="Mother Name" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Date Of Birth</label>
              <input type="text" placeholder="dd/mm/yyyy" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Blood Group</label>
              <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
                <option>-Select Blood group--</option>
              </select>
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold leading-tight">Mobile Number<br/><span className="text-[11px] font-normal">(Roommate)</span></label>
              <input type="text" placeholder="Roommate mobile number" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Mobile Number (Father)</label>
              <input type="text" placeholder="Father's Mobile Number" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
          </div>
        </section>

        {/* Identification & Education */}
        <section className="space-y-6">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">NID Number</label>
              <input type="text" placeholder="Enter NID Number" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">TIN</label>
              <input type="text" placeholder="Enter Tax Identification No." className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Email</label>
            <input type="email" placeholder="Email" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">School</label>
            <input type="text" placeholder="School" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
           <div className="grid grid-cols-1 gap-4">
              <div className="flex items-start gap-4">
                <label className="w-40 text-right font-bold pt-1.5">Present Address</label>
                <div className="flex-grow flex gap-4">
                   <textarea placeholder="Present addresss" className="w-[60%] border border-[#ccc] rounded-sm p-2 h-24"></textarea>
                   <div className="flex-grow flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <label className="w-16 text-right font-bold">Area</label>
                        <input type="text" placeholder="Area" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 h-10" />
                      </div>
                   </div>
                </div>
              </div>
           </div>
        </section>

        {/* Buttons */}
        <div className="flex flex-col gap-4 pt-10">
           <button className="bg-[#4a89c5] text-white px-8 py-2.5 rounded-sm font-bold w-fit hover:bg-blue-600 transition-colors">
              Create
           </button>
           <button className="text-[#2c53a1] font-bold text-left hover:underline">
              Back to List
           </button>
        </div>
      </div>
    </div>
  );
}
