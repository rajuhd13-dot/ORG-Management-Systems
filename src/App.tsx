/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, Search, ChevronDown, Power, X } from 'lucide-react';
import TeacherForm from './components/TeacherForm';
import TeacherSearchByPinForm from './components/TPINForm';
import ProfileView from './components/ProfileView';
import EditTeacherForm from './components/EditTeacherForm';
import TeacherListForm from './components/TeacherListForm';
import SearchTeacherForm from './components/SearchTeacherForm';
import ActiveTeacherListForm from './components/ActiveTeacherListForm';
import RegisterTeacherListForm from './components/RegisterTeacherListForm';
import ExaminerSearchForm from './components/ExaminerSearchForm';
import ExaminerSearchEditForm from './components/ExaminerSearchEditForm';
import ImageUploadForm from './components/ImageUploadForm';
import AssessmentAllowList from './components/AssessmentAllowList';
import DataCollection from './components/DataCollection';
import ManualMarksEntry from './components/ManualMarksEntry';
import ManageMarksEntry from './components/ManageMarksEntry';
import ScriptEvaluationEntry from './components/ScriptEvaluationEntry';
import AdminsManagement from './components/AdminsManagement';
import ManagementList from './components/ManagementList';
import ScriptComparison from './components/ScriptComparison';

// Types
import { fetchUsers } from './services/userService';

type View = 'Login' | 'Dashboard';

export default function App() {
  const [view, setView] = useState<View>('Login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isTeacherMenuOpen, setIsTeacherMenuOpen] = useState(false);
  const [isMarksEntryMenuOpen, setIsMarksEntryMenuOpen] = useState(false);
  const [isScriptEvaluationMenuOpen, setIsScriptEvaluationMenuOpen] = useState(false);
  const [isScriptManagementMenuOpen, setIsScriptManagementMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [activeModule, setActiveModule] = useState<string | null>(localStorage.getItem('org_activeModule'));
  const [activeSubModule, setActiveSubModule] = useState<string | null>(localStorage.getItem('org_activeSubModule'));
  const [isTPINVerified, setIsTPINVerified] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Persistence logic
  useEffect(() => {
    const savedUser = localStorage.getItem('org_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user) {
          setCurrentUser(user);
          setView('Dashboard');
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
        localStorage.removeItem('org_user');
      }
    }
  }, []);

  // Persist navigation state
  useEffect(() => {
    if (activeModule) localStorage.setItem('org_activeModule', activeModule);
    else localStorage.removeItem('org_activeModule');
  }, [activeModule]);

  useEffect(() => {
    if (activeSubModule) localStorage.setItem('org_activeSubModule', activeSubModule);
    else localStorage.removeItem('org_activeSubModule');
  }, [activeSubModule]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'raju.2348@unmesh.net' && password === 'Raju@2348') {
      const adminUser = { email, name: 'Md. Raju Ahammed', role: 'Admin', status: 'Active', permissions: ['Student', 'Exam', 'Teacher', 'Team', 'Administration'] };
      setCurrentUser(adminUser);
      localStorage.setItem('org_user', JSON.stringify(adminUser));
      setView('Dashboard');
      setError('');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const users = await fetchUsers();
    
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    if (foundUser) {
      if (foundUser.status === 'Blocked') {
        setError('Your account is blocked. Please contact an administrator.');
        setLoading(false);
        return;
      }
      if (!foundUser.permissions) foundUser.permissions = foundUser.role === 'Admin' ? ['Student', 'Exam', 'Teacher', 'Team', 'Administration'] : [];
      setCurrentUser(foundUser);
      localStorage.setItem('org_user', JSON.stringify(foundUser));
      setView('Dashboard');
      setError('');
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    setView('Login');
    setEmail('');
    setPassword('');
    setIsTeacherMenuOpen(false);
    setIsMarksEntryMenuOpen(false);
    setIsUserDropdownOpen(false);
    setActiveModule(null);
    setCurrentUser(null);
    localStorage.removeItem('org_user');
    localStorage.removeItem('org_activeModule');
    localStorage.removeItem('org_activeSubModule');
  };

  return (
    <div className="min-h-screen bg-white font-system text-[#333]">
      <AnimatePresence mode="wait">
        {view === 'Login' ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col h-screen"
          >
            {/* Header */}
            <header className="bg-[#002B49] text-white px-4 py-2.5 flex justify-between items-center select-none">
              <div className="flex flex-col leading-none">
                <span className="font-bold text-xl tracking-tight">ORG</span>
                <span className="text-[10px] text-gray-400 mt-0.5">v215.13</span>
              </div>
              <div className="flex gap-8 text-[13px] font-medium">
                <button className="hover:text-blue-300 transition-colors cursor-pointer">My Ip</button>
                <button className="hover:text-blue-300 transition-colors cursor-pointer">Log in</button>
              </div>
            </header>

            {/* Login Section */}
            <main className="flex-grow flex items-center justify-center bg-[#f9f9f9]">
              <div className="w-full max-w-[420px] bg-white border border-[#ddd] rounded-sm shadow-sm overflow-hidden">
                <div className="bg-[#f5f5f5] px-4 py-2.5 border-b border-[#ddd] text-center">
                  <h2 className="text-[14px] font-semibold text-[#555]">Log in</h2>
                </div>
                <form onSubmit={handleLogin} className="p-10 space-y-5">
                  <div className="flex items-center gap-4">
                    <label className="text-[13px] font-bold text-[#444] w-24 text-right">User Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 text-[14px] font-bold focus:outline-none focus:border-blue-400 bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <label className="text-[13px] font-bold text-[#444] w-24 text-right">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="flex-grow border border-[#ccc] rounded-sm px-3 py-1.5 text-[14px] font-bold focus:outline-none focus:border-blue-400 bg-white"
                    />
                  </div>
                  {error && <p className="text-red-600 text-xs text-center font-medium">{error}</p>}
                  <div className="flex justify-center ml-24">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-[#55a1d5] hover:bg-[#4a8ebf] text-white px-5 py-1.5 rounded-sm text-[13px] font-medium transition-colors cursor-pointer shadow-sm min-w-[80px] flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                      {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Log in'}
                    </button>
                  </div>
                </form>
              </div>
            </main>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-screen"
          >
            {/* Dashboard Header */}
            <header className="bg-[#002B49] text-white px-4 py-2 flex justify-between items-center shrink-0 select-none">
              <div className="flex items-center gap-8">
                <div 
                  className="flex flex-col leading-none cursor-pointer"
                  onClick={() => {
                    setActiveModule(null);
                    setActiveSubModule(null);
                  }}
                >
                  <span className="font-bold text-xl tracking-tight">ORG</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">v215.13</span>
                </div>
                <nav className="flex gap-7 text-[13px] font-medium text-gray-300 ml-2 mt-1">
                  {['Student', 'Exam', 'Teacher', 'Team', 'Administration'].filter(item => currentUser?.permissions?.includes(item)).map((item) => (
                    <button 
                      key={item} 
                      onClick={() => {
                        setActiveModule(item);
                        setActiveSubModule(null);
                        setIsTPINVerified(false);
                      }}
                      className={`hover:text-white transition-colors cursor-pointer border-b-2 pb-0.5 ${
                        activeModule === item ? 'text-white border-white' : 'border-transparent'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="flex items-center gap-4 text-[13px]">
                <div className="relative">
                  <div 
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center gap-1 cursor-pointer hover:text-blue-300 transition-colors font-medium border border-transparent hover:border-blue-400/30 px-2 py-0.5 rounded-sm"
                  >
                    <span className="opacity-90">{currentUser?.name || "Md. Raju Ahammed"}</span>
                    <ChevronDown size={14} className="opacity-70" />
                  </div>
                  
                  <AnimatePresence>
                    {isUserDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-sm py-1 z-50 overflow-hidden"
                      >
                        <button className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors">
                          Change Password
                        </button>
                        <button className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors">
                          My Ip
                        </button>
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Log off
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                <button 
                  onClick={handleLogout}
                  className="bg-white/10 p-1.5 rounded-sm hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <Power size={18} />
                </button>
              </div>
            </header>

            <div className="flex flex-grow overflow-hidden border-t-2 border-[#002B49]/10">
              {/* Sidebar: Only show if a module is active */}
              {activeModule && (
                <aside className="w-[230px] bg-[#fdfdfd] border-r border-[#ddd] flex flex-col p-2.5 pb-0 shrink-0 select-none">
                  <div className="relative mb-3">
                    <input
                      type="text"
                      placeholder="Search By Menu.."
                      className="w-full border border-[#ccc] rounded-sm px-2 py-1.5 text-[12px] pr-8 bg-white focus:outline-none focus:border-blue-400 italic"
                    />
                    <div className="absolute right-2.5 top-2 text-gray-400 cursor-pointer p-0.5 hover:text-gray-600 transition-colors">
                      <X size={14} />
                    </div>
                  </div>

                  <div className="space-y-0.5 overflow-y-auto flex-grow pr-1 custom-sidebar-scroll">
                    <div 
                      onClick={() => setActiveSubModule(null)}
                      className="bg-[#002B49] text-white px-3 py-2 rounded-sm text-[13px] font-semibold cursor-pointer"
                    >
                      {activeModule}s
                    </div>
                    {activeModule === 'Administration' && (
                      <div className="flex flex-col bg-white border border-[#ddd] border-t-0 rounded-b-sm">
                        {['Routine', 'User Administration', 'Management List'].filter(item => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(item)).map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setActiveSubModule(item);
                            }}
                            className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors border-b border-[#eee] last:border-0 ${
                              activeSubModule === item ? 'font-bold bg-gray-50' : 'font-normal'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                    {activeModule === 'Team' && (
                      <div className="flex flex-col bg-white border border-[#ddd] border-t-0 rounded-b-sm">
                        {['My Account', 'Apply For', 'Member Management'].filter(item => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(item)).map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                              setActiveSubModule(item);
                            }}
                            className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors border-b border-[#eee] last:border-0 ${
                              activeSubModule === item ? 'font-bold bg-gray-50' : 'font-normal'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                    {activeModule === 'Exam' && (
                      <div className="flex flex-col bg-white border border-[#ddd] border-t-0 rounded-b-sm">
                        {['Marks Entry', 'Report', 'Online Script Evaluation', 'Script Evaluation', 'Script Management'].filter(item => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(item)).map((item) => {
                          if (item === 'Marks Entry') {
                            return (
                              <div key={item} className="flex flex-col border-b border-[#eee] last:border-0">
                                <button
                                  onClick={() => setIsMarksEntryMenuOpen(!isMarksEntryMenuOpen)}
                                  className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors ${
                                    isMarksEntryMenuOpen ? 'font-bold bg-gray-50' : 'font-normal'
                                  }`}
                                >
                                  {item}
                                </button>
                                <AnimatePresence>
                                  {isMarksEntryMenuOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden bg-[#fafafa]"
                                    >
                                      {['Manual Marks Entry', 'Manage Marks Entry', 'Marks Recalculation', 'Allow Marks Upload', 'Marks Entry By XML', 'Marks Entry By XML (Word)', 'Marks Entry By XML (Academic Info)'].filter(subItem => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(subItem)).map((subItem) => (
                                        <button
                                          key={subItem}
                                          onClick={() => setActiveSubModule(subItem)}
                                          className={`block w-full text-left pl-8 pr-3.5 py-2 text-[12px] text-[#555] hover:text-[#002B49] hover:bg-[#eee] transition-colors border-t border-[#eee] ${
                                            activeSubModule === subItem ? 'font-bold text-[#002B49]' : ''
                                          }`}
                                        >
                                          {subItem}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          }

                          if (item === 'Script Evaluation') {
                            return (
                              <div key={item} className="flex flex-col border-b border-[#eee] last:border-0">
                                <button
                                  onClick={() => setIsScriptEvaluationMenuOpen(!isScriptEvaluationMenuOpen)}
                                  className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors ${
                                    isScriptEvaluationMenuOpen ? 'font-bold bg-gray-50' : 'font-normal'
                                  }`}
                                >
                                  {item}
                                </button>
                                <AnimatePresence>
                                  {isScriptEvaluationMenuOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden bg-[#fafafa]"
                                    >
                                      {['Evaluation Entry'].filter(subItem => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(subItem)).map((subItem) => (
                                        <button
                                          key={subItem}
                                          onClick={() => setActiveSubModule(subItem)}
                                          className={`block w-full text-left pl-8 pr-3.5 py-2 text-[12px] text-[#2c53a1] hover:text-[#002B49] hover:bg-[#eee] transition-colors border-t border-[#eee] ${
                                            activeSubModule === subItem ? 'font-bold text-[#2c53a1]' : ''
                                          }`}
                                        >
                                          {subItem}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          }

                          if (item === 'Script Management') {
                            return (
                              <div key={item} className="flex flex-col border-b border-[#eee] last:border-0">
                                <button
                                  onClick={() => setIsScriptManagementMenuOpen(!isScriptManagementMenuOpen)}
                                  className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors ${
                                    isScriptManagementMenuOpen ? 'font-bold bg-gray-50' : 'font-normal'
                                  }`}
                                >
                                  {item}
                                </button>
                                <AnimatePresence>
                                  {isScriptManagementMenuOpen && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden bg-[#fafafa]"
                                    >
                                      {['Script Receive', 'Receive Report', 'Script Comparison'].filter(subItem => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(subItem)).map((subItem) => (
                                        <button
                                          key={subItem}
                                          onClick={() => setActiveSubModule(subItem)}
                                          className={`block w-full text-left pl-8 pr-3.5 py-2 text-[12px] text-[#2c53a1] hover:text-[#002B49] hover:bg-[#eee] transition-colors border-t border-[#eee] ${
                                            activeSubModule === subItem ? 'font-bold text-[#2c53a1]' : ''
                                          }`}
                                        >
                                          {subItem}
                                        </button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          }

                          return (
                            <button
                              key={item}
                              onClick={() => {
                                setActiveSubModule(item);
                              }}
                              className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors border-b border-[#eee] last:border-0 ${
                                activeSubModule === item ? 'font-bold bg-gray-50' : 'font-normal'
                              }`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {activeModule === 'Student' && (
                      <div className="flex flex-col bg-white border border-[#ddd] border-t-0 rounded-b-sm">
                        {['Student Info'].filter(item => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(item)).map((item) => (
                          <button
                            key={item}
                            onClick={() => {
                                setActiveSubModule(item);
                                setIsTPINVerified(false);
                            }}
                            className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors border-b border-[#eee] last:border-0 ${
                              activeSubModule === item ? 'font-bold bg-gray-50' : 'font-normal'
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                    {activeModule === 'Teacher' && (
                      <div className="flex flex-col bg-white border border-[#ddd] border-t-0 rounded-b-sm">
                        {['Teacher Profile'].filter(item => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(item)).map(tp => (
                          <React.Fragment key={tp}>
                            <button
                              onClick={() => setIsTeacherMenuOpen(!isTeacherMenuOpen)}
                              className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors border-b border-[#eee] last:border-0 ${
                                isTeacherMenuOpen ? 'font-bold bg-gray-50' : 'font-normal'
                              }`}
                            >
                              {tp}
                            </button>
                            <AnimatePresence>
                              {isTeacherMenuOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden flex flex-col border-l-[3px] border-red-500/10 bg-white"
                                >
                                  {[
                                    'Add Teacher',
                                    'Update Profile',
                                    'Teacher List',
                                    'Search Teacher',
                                    'Register Teacher List',
                                    'Active Teacher List',
                                    'View Teacher Profile',
                                    'Examiner Search',
                                    'Examiner Profile Edit',
                                    'Image Upload',
                                    'Assessment Allow List',
                                    'Data Collection',
                                  ].filter(item => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(item)).map((item) => (
                                    <button
                                      key={item}
                                      onClick={() => {
                                        setActiveSubModule(item);
                                        setIsTPINVerified(false);
                                      }}
                                      className="text-left py-[9px] pl-7 pr-3 text-[12.5px] text-[#2c53a1] hover:bg-blue-50/50 transition-all border-b border-[#f5f5f5] last:border-0 font-medium"
                                    >
                                      {item}
                                    </button>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </React.Fragment>
                        ))}
                        {['Teacher Activity'].filter(item => currentUser?.role === 'Admin' || currentUser?.permissions?.includes(item)).map(ta => (
                          <button
                            key={ta}
                            onClick={() => {
                              setActiveSubModule(ta);
                              setIsTPINVerified(false);
                            }}
                            className={`text-left px-3.5 py-2.5 text-[13px] text-[#444] hover:bg-gray-50 transition-colors border-b border-[#eee] last:border-0 ${
                              activeSubModule === ta ? 'font-bold bg-gray-50' : 'font-normal'
                            }`}
                          >
                            {ta}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                </aside>
              )}

              {/* Main Content Area */}
              <div className="flex-grow flex flex-col overflow-hidden bg-white">
                <main className="flex-grow p-8 overflow-y-auto">
                  {activeSubModule === 'Add Teacher' ? (
                    <TeacherForm />
                  ) : activeSubModule === 'Update Profile' ? (
                    <div className="space-y-6">
                      <TeacherSearchByPinForm onVerify={() => setIsTPINVerified(true)} />
                      {isTPINVerified && <EditTeacherForm />}
                    </div>
                  ) : activeSubModule === 'Teacher List' ? (
                    <TeacherListForm />
                  ) : activeSubModule === 'Search Teacher' ? (
                    <SearchTeacherForm />
                  ) : activeSubModule === 'Active Teacher List' ? (
                    <ActiveTeacherListForm />
                  ) : activeSubModule === 'Register Teacher List' ? (
                    <RegisterTeacherListForm />
                  ) : activeSubModule === 'View Teacher Profile' ? (
                    <ProfileView />
                  ) : activeSubModule === 'Examiner Search' ? (
                    <ExaminerSearchForm />
                  ) : activeSubModule === 'Examiner Profile Edit' ? (
                    <ExaminerSearchEditForm />
                  ) : activeSubModule === 'Image Upload' ? (
                    <ImageUploadForm />
                  ) : activeSubModule === 'Assessment Allow List' ? (
                    <AssessmentAllowList />
                  ) : activeSubModule === 'Data Collection' ? (
                    <DataCollection />
                  ) : activeSubModule === 'Manual Marks Entry' ? (
                    <ManualMarksEntry />
                  ) : activeSubModule === 'Manage Marks Entry' ? (
                    <ManageMarksEntry />
                  ) : activeSubModule === 'Evaluation Entry' ? (
                    <ScriptEvaluationEntry />
                  ) : activeSubModule === 'Script Comparison' ? (
                    <ScriptComparison />
                  ) : activeSubModule === 'User Administration' ? (
                    <AdminsManagement />
                  ) : activeSubModule === 'Management List' ? (
                    <ManagementList />
                  ) : (
                    <div className="bg-[#ededed] w-full h-[220px] flex flex-col items-center justify-center rounded-sm border border-[#d5d5d5] shadow-sm p-6 text-center">
                      {currentUser?.permissions?.length === 0 ? (
                        <>
                          <h1 className="text-[36px] font-medium text-red-500 tracking-tight mb-3">
                            No Access Granted
                          </h1>
                          <p className="text-[16px] text-gray-600 max-w-md">
                            You don't have access to any modules. Please add permissions from the Admin menu (gray buttons).
                          </p>
                        </>
                      ) : activeModule ? (
                        <h1 className="text-[52px] font-medium text-[#444] tracking-tight">
                          {activeModule} Area
                        </h1>
                      ) : (
                        <h1 className="text-[52px] font-medium text-[#444] tracking-tight">
                          Welcome to ORG
                        </h1>
                      )}
                    </div>
                  )}
                </main>

                
                {/* Footer */}
                <footer className="py-5 border-t border-[#eee] text-center bg-white shrink-0 shadow-sm">
                  <p className="text-[13px] text-[#777] font-medium">© 2026 - ORG</p>
                </footer>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
