import React, { useState, useEffect } from 'react';
import { UserPlus, Loader2 } from 'lucide-react';
import { fetchUsers, saveUsers } from '../services/userService';

export default function AdminsManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('User');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
        const data = await fetchUsers();
        setUsers(data);
    };
    loadUsers();
  }, []);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;

    setLoading(true);
    const newUser = { id: Date.now().toString(), name, email, password, role, status: 'Active', permissions: [] };
    const updatedUsers = [...users, newUser];
    
    const success = await saveUsers(updatedUsers);
    
    if (success) {
      setUsers(updatedUsers);
      setEmail('');
      setPassword('');
      setName('');
      setRole('User');
      alert('User added successfully!');
    } else {
      alert('Failed to save user.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pt-4 px-2 font-['Segoe_UI',sans-serif]">
      <div className="bg-[#002B49] text-white px-4 py-2 border-b-2 border-red-500 rounded-t-md">
        <h2 className="text-[16px] font-semibold">User Administration</h2>
      </div>

      <div className="bg-white border text-sm border-gray-300 rounded shadow-sm">
        <div className="p-8">
          <form onSubmit={handleAddUser} className="w-full max-w-lg mx-auto space-y-4 border border-gray-200 p-6 shadow-sm rounded-md bg-[#fdfdfd]">
            <h3 className="text-[15px] font-bold text-[#002B49] mb-6 border-b pb-2 flex items-center gap-2">
              <UserPlus size={18} />
              Add New Authenticated User
            </h3>
            
            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-[13px]">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-[13px]">Email Address (Username)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-[13px]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure password"
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
                required
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="font-semibold text-gray-700 text-[13px]">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-[4px] px-3 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:border-blue-400 bg-white"
              >
                <option value="User">User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="mt-8 bg-[#002B49] hover:bg-[#001f35] text-white px-4 py-2.5 rounded-[4px] font-semibold text-[13px] flex items-center justify-center gap-2 w-full transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              {loading ? 'Adding User...' : 'Add User'}
            </button>
            <p className="text-[12px] text-gray-500 mt-3 text-center leading-relaxed">
              Added users initially have no access.<br/>Configure permissions from the Management List menu.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
