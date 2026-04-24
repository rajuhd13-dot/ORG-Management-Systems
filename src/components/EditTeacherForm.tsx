import React from 'react';
import { PlusCircle, Upload, Download, Trash2 } from 'lucide-react';

export default function EditTeacherForm() {
  return (
    <div className="bg-white text-[13px] text-[#333]">
      {/* Header */}
      <div className="bg-[#002B49] text-white px-4 py-1.5 font-medium rounded-t-sm mb-6">
        Edit Teacher Profile
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

        {/* Edit Information */}
        <section>
          <h2 className="text-[#444] text-[18px] border-b border-[#eee] pb-2 mb-6">Edit Information</h2>
          <div className="flex gap-10">
            <div className="flex-grow space-y-4">
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Nick Name <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Polok" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Full Name <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Polok Bhuiyan" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Mobile Number 1 <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="8801795415777" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Mobile Number 2</label>
                <input type="text" placeholder="Mobile Number2" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 focus:outline-none focus:border-blue-400" />
              </div>
            </div>
            
            <div className="w-48 flex flex-col items-center pt-2">
              <div className="w-32 h-[160px] bg-[#f8f8f8] border border-[#ddd] overflow-hidden mb-2">
                 <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&h=320&auto=format&fit=crop" alt="Teacher" className="w-full h-full object-cover" />
              </div>
              <div className="flex gap-3">
                <button className="text-green-600 hover:text-green-800"><Upload size={18} /></button>
                <button className="text-blue-600 hover:text-blue-800"><Download size={18} /></button>
                <button className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-x-12 gap-y-4 pt-4">
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Mobile Banking Number</label>
              <input type="text" defaultValue="8801812941169" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
            </div>
            <div className="flex items-center gap-4">
              <label className="w-40 text-right font-bold">Mobile Banking Type</label>
              <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
                <option>Nagad</option>
              </select>
            </div>
          </div>
        </section>

        {/* Academic Details */}
        <section className="grid grid-cols-2 gap-x-12 gap-y-4">
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Institute <span className="text-red-500">*</span></label>
            <input type="text" defaultValue="BUTex" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Department <span className="text-red-500">*</span></label>
            <input type="text" defaultValue="AE" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">HSC Passing Year <span className="text-red-500">*</span></label>
            <input type="text" defaultValue="2016" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
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
              <option>Islam</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Gender <span className="text-red-500">*</span></label>
            <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white">
              <option>Male</option>
            </select>
          </div>
        </section>

        {/* Organizations */}
        <div className="flex items-center gap-4">
          <label className="w-40 text-right font-bold">Organization <span className="text-red-500">*</span></label>
          <div className="flex gap-4">
            {['UDVASH', 'UNMESH', 'ONLINE CARE', 'UTTORON'].map(org => (
              <label key={org} className="flex items-center gap-1 cursor-pointer font-bold">
                <input type="checkbox" className="w-4 h-4" defaultChecked={org === 'UDVASH'} />
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
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Script Evaluation</option></select>
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 2</option></select>
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 3</option></select>
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Choice 4</option></select>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <label className="w-40 text-right font-bold pt-1.5">Subject Priority <span className="text-red-500">*</span></label>
            <div className="space-y-2 flex-grow">
              <div className="grid grid-cols-3 gap-4">
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Physics</option></select>
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Chemistry</option></select>
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Higher Mathematics</option></select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Higher Mathematics 2nd Paper</option></select>
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Higher Mathematics 1st Paper</option></select>
                <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Physics 1st Paper</option></select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                 <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Physics 2nd Paper</option></select>
                 <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Chemistry 1st Paper</option></select>
                 <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Chemistry 2nd Paper</option></select>
              </div>
              <div className="flex gap-4 items-center">
                 <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white w-[32.3%]"><option>Mathematics</option></select>
                 <button className="bg-[#2c53a1] text-white p-1.5 rounded-sm hover:bg-blue-700 transition-colors">
                    <PlusCircle size={18} />
                 </button>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Version Priority <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-4 flex-grow max-w-[500px]">
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Bangla</option></select>
              <select className="border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>English</option></select>
            </div>
          </div>
           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Teacher Type <span className="text-red-500">*</span></label>
                <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Regular</option></select>
              </div>
               <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Profession <span className="text-red-500">*</span></label>
                <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Student</option></select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Job Company</label>
                <input type="text" placeholder="Professional Company" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Job Department</label>
                <input type="text" placeholder="Professional Department" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Teacher Activity Type <span className="text-red-500">*</span></label>
                <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>Both</option></select>
              </div>
              <div className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">Current District <span className="text-red-500">*</span></label>
                <input type="text" defaultValue="Dhaka" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
              </div>
           </div>
        </div>

        {/* Portal Login & AI */}
        <div className="flex gap-20 ml-10">
           <label className="flex items-center gap-2 font-bold cursor-pointer">
              <label className="w-32 text-right mr-2">Allow Portal Login</label>
              <input type="checkbox" className="w-4 h-4" defaultChecked /> Yes
           </label>
           <label className="flex items-center gap-2 font-bold cursor-pointer">
              <label className="w-32 text-right mr-2">Is AI Teacher</label>
              <input type="checkbox" className="w-4 h-4" /> Yes
           </label>
        </div>

        {/* Details Information */}
        <section className="space-y-6">
          <h2 className="text-[#444] text-[18px] border-b border-[#eee] pb-2 mb-6">Details Information</h2>
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            {['Father Name', 'Mother Name', 'Date Of Birth', 'Blood Group', 'Mobile Number (Roommate)', 'Mobile Number (Father)', 'Facebook Id', 'NID Number', 'TIN'].map(label => (
              <div key={label} className="flex items-center gap-4">
                <label className="w-40 text-right font-bold">{label}</label>
                {label === 'Blood Group' ? (
                   <select className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 bg-white"><option>-Select Blood group--</option></select>
                ) : (
                   <input type="text" placeholder={label} className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <label className="w-40 text-right font-bold">Email</label>
            <input type="email" defaultValue="dolldollpolok@gmail.com" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" />
          </div>
           {['School', 'College'].map(s => (
             <div key={s} className="flex items-center gap-4">
               <label className="w-40 text-right font-bold">{s}</label>
               <input type="text" placeholder={s} className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 placeholder:text-gray-300" />
             </div>
           ))}
        </section>

        {/* Address & Admission */}
        <section className="space-y-6">
           <div className="grid grid-cols-2 gap-x-12 gap-y-4">
              <div className="flex items-start gap-4">
                <label className="w-40 text-right font-bold pt-1.5">Present Address</label>
                <textarea className="flex-grow border border-[#ccc] rounded-sm p-2 h-20 placeholder:text-gray-300" placeholder="Permanent address"></textarea>
              </div>
              <div className="flex items-center gap-4">
                 <label className="w-20 text-right font-bold">Area</label>
                 <input type="text" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" placeholder="Area" />
              </div>
              <div className="flex items-start gap-4">
                <label className="w-40 text-right font-bold pt-1.5">Permanent Address</label>
                <textarea className="flex-grow border border-[#ccc] rounded-sm p-2 h-20 placeholder:text-gray-300" placeholder="Permanent address"></textarea>
              </div>
               <div className="flex items-center gap-4">
                 <label className="w-20 text-right font-bold">District</label>
                 <input type="text" className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5" placeholder="District" />
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
                   <label key={item} className="flex items-center gap-2 cursor-pointer text-[#444]"><input type="checkbox" className="w-4 h-4" /> {item}</label>
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
                  <label key={item} className="flex items-center gap-2 cursor-pointer text-[#444]"><input type="checkbox" className="w-4 h-4" /> {item}</label>
                ))}
              </div>
           </div>
        </section>

        {/* Update Button */}
        <div className="flex flex-col gap-4 pt-4 pb-10">
           <button className="bg-[#4a89c5] text-white px-8 py-2 rounded-sm font-bold w-fit hover:bg-blue-600 transition-colors ml-[176px]">
              Update
           </button>
        </div>
      </div>
    </div>
  );
}
