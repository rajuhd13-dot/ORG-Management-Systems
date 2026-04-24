import React, { useState, useEffect } from 'react';
import { Trash2, Shield, ShieldOff, Ban, CheckCircle, Settings, X, UserSearch } from 'lucide-react';

const MODULES_DATA = [
  { module: 'Student', subItems: ['Student Info'] },
  { module: 'Exam', subItems: ['Marks Entry', 'Manual Marks Entry', 'Manage Marks Entry', 'Marks Recalculation', 'Allow Marks Upload', 'Marks Entry By XML', 'Marks Entry By XML (Word)', 'Marks Entry By XML (Academic Info)', 'Report', 'Online Script Evaluation', 'Script Evaluation', 'Evaluation Entry', 'Script Management', 'Script Receive', 'Receive Report', 'Script Comparison'] },
  { module: 'Teacher', subItems: ['Teacher Profile', 'Add Teacher', 'Update Profile', 'Teacher List', 'Search Teacher', 'Register Teacher List', 'Active Teacher List', 'View Teacher Profile', 'Examiner Search', 'Examiner Profile Edit', 'Image Upload', 'Teacher Activity'] },
  { module: 'Team', subItems: ['My Account', 'Apply For', 'Member Management'] },
  { module: 'Administration', subItems: ['Routine', 'User Administration', 'Management List'] }
];

export default function ManagementList() {
  const [users, setUsers] = useState<any[]>([]);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUsers = localStorage.getItem('org_users');
    if (storedUsers) {
      try {
        setUsers(JSON.parse(storedUsers));
      } catch (err) {
        console.error(err);
      }
    }
  }, []);

  const handleDeleteUser = (id: string) => {
    const updatedUsers = users.filter((u) => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('org_users', JSON.stringify(updatedUsers));
  };

  const handleToggleStatus = (id: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === id) {
        return { ...u, status: u.status === 'Active' ? 'Blocked' : 'Active' };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('org_users', JSON.stringify(updatedUsers));
  };
  
  const handleToggleRole = (id: string) => {
    const updatedUsers = users.map((u) => {
      if (u.id === id) {
        return { ...u, role: u.role === 'Admin' ? 'User' : 'Admin' };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('org_users', JSON.stringify(updatedUsers));
  };

  const updatePermissionsForUser = (id: string, newPerms: string[]) => {
    const updatedUsers = users.map((u) => {
      if (u.id === id) {
        return { ...u, permissions: newPerms };
      }
      return u;
    });
    setUsers(updatedUsers);
    localStorage.setItem('org_users', JSON.stringify(updatedUsers));
  };

  const togglePermission = (perms: string[], module: string) => {
    return perms.includes(module) ? perms.filter(p => p !== module) : [...perms, module];
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pt-4 px-2 font-['Segoe_UI',sans-serif]">
      <div className="bg-[#002B49] text-white px-4 py-2 border-b-2 border-red-500 rounded-t-md">
        <h2 className="text-[16px] font-semibold">Management List</h2>
      </div>

      <div className="bg-white border text-sm border-gray-300 rounded shadow-sm">
        <div className="p-6">
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-bold text-[#555] mb-3 flex items-center gap-2">
              <UserSearch size={16} /> Management List
            </h3>
            <div className="overflow-x-auto border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-[#f0f0f0]">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">User Info</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Access</th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">Role/Status</th>
                    <th scope="col" className="px-4 py-3 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {/* Default Admin */}
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-800">Md. Raju Ahammed</div>
                      <div className="text-xs text-gray-500">raju.2348@unmesh.net | Raju@2348</div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className="bg-blue-100 text-blue-800 text-[11px] font-semibold px-2 py-0.5 rounded border border-blue-200">All Access</span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-center">
                      <div className="flex flex-col gap-1 items-center">
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">Admin</span>
                        <span className="bg-green-100 text-green-800 text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide">Active</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                      <span className="text-gray-400 italic text-xs">Immutable</span>
                    </td>
                  </tr>
                  
                  {/* Dynamic Users */}
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-800">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.email} | {user.password}</div>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => setEditingUserId(user.id)}
                          className="flex items-center gap-1.5 text-[11px] bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-2.5 py-1 rounded shadow-sm font-medium transition-colors"
                        >
                          <Settings size={14} className="text-gray-500" />
                          Manage Menu Permissions
                          <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-sm ml-1 border border-gray-200">
                            {user.permissions?.length || 0}
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-center">
                        <div className="flex flex-col gap-1 items-center">
                          <button 
                            onClick={() => handleToggleRole(user.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-semibold transition-colors ${user.role === 'Admin' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                            title="Click to toggle role"
                          >
                            {user.role === 'Admin' ? <Shield size={10}/> : <ShieldOff size={10}/>}
                            {user.role || 'User'}
                          </button>
                          <button 
                            onClick={() => handleToggleStatus(user.id)}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide font-semibold transition-colors ${user.status === 'Blocked' ? 'bg-red-100 text-red-800 hover:bg-red-200' : 'bg-green-100 text-green-800 hover:bg-green-200'}`}
                            title={user.status === 'Blocked' ? 'Click to Unblock' : 'Click to Block'}
                          >
                            {user.status === 'Blocked' ? <Ban size={10}/> : <CheckCircle size={10}/>}
                            {user.status || 'Active'}
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 p-1.5 rounded transition-colors inline-block"
                          title="Remove user"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  
                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-sm text-gray-500 bg-gray-50/50">
                        No additional users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-500">Notice: Newly added authenticated users will be able to log in starting from the login page. Blocked users cannot log in.</p>
          </div>
        </div>
      </div>

      {editingUserId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-3 border-b flex justify-between items-center bg-[#002B49] text-white">
              <h3 className="font-semibold text-[15px]">Configure Menu Permissions</h3>
              <button 
                onClick={() => setEditingUserId(null)}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 bg-[#f9f9f9]">
              {(() => {
                const user = users.find(u => u.id === editingUserId);
                if (!user) return null;
                return (
                  <div className="space-y-6">
                    <div className="bg-blue-50 text-blue-800 px-4 py-2 rounded text-[13px] border border-blue-100">
                      Modifying access for: <strong>{user.name}</strong> ({user.email})
                    </div>
                    
                    {MODULES_DATA.map(({ module, subItems }) => {
                      const isModuleChecked = user.permissions?.includes(module);
                      
                      return (
                        <div key={module} className="bg-white border rounded shadow-sm overflow-hidden">
                          <label className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b cursor-pointer hover:bg-gray-100 transition-colors">
                            <input
                              type="checkbox"
                              checked={isModuleChecked}
                              onChange={() => {
                                updatePermissionsForUser(user.id, togglePermission(user.permissions || [], module));
                              }}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <span className="font-semibold text-[14px] text-gray-800">{module} Domain</span>
                          </label>
                          
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                            {subItems.map(subItem => {
                              const isChecked = user.permissions?.includes(subItem);
                              return (
                                <label key={subItem} className="flex items-start gap-2 cursor-pointer group">
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => {
                                      let newPerms = togglePermission(user.permissions || [], subItem);
                                      // If checking a submenu, also auto-check parent module if not checked
                                      if (!isChecked && !newPerms.includes(module)) {
                                        newPerms.push(module);
                                      }
                                      updatePermissionsForUser(user.id, newPerms);
                                    }}
                                    className="w-3.5 h-3.5 mt-0.5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                  />
                                  <span className={`text-[13px] transition-colors leading-snug ${isChecked ? 'text-blue-700 font-medium' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                    {subItem}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                );
              })()}
            </div>
            
            <div className="px-5 py-3 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setEditingUserId(null)}
                className="px-5 py-1.5 bg-[#002B49] text-white text-[13px] font-semibold rounded hover:bg-[#001f35] transition-colors shadow-sm"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
