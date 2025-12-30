import React, { useState } from 'react';
import { CheckCircle2, XCircle, Shield, Search, Check, Mail, Edit, X, Save, Phone, FileText, Users, TrendingUp, BarChart3, AlertCircle, DollarSign, Activity, Clock, BookOpen, MapPin, Monitor, Send, GraduationCap, List, Link as LinkIcon, UserPlus, UserMinus, ThumbsUp, Star, Quote, Building2 } from 'lucide-react';
import { Tutor, StudentRequest, User, PlatformReview } from '../types';

interface AdminDashboardProps {
  tutors: Tutor[];
  students?: User[];
  studentRequests?: StudentRequest[]; 
  platformReviews?: PlatformReview[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onVerify: (id: string) => void;
  onUpdate: (tutor: Tutor) => void;
  onMatchStudent?: (requestId: string, tutorId?: string) => void; 
  onActionStudent?: (id: string, action: 'activate' | 'suspend') => void;
  onReviewAction?: (id: string, action: 'approve' | 'reject') => void;
  onUpdateStudent?: (student: User) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  tutors, 
  students = [],
  studentRequests = [], 
  platformReviews = [],
  onApprove, 
  onReject, 
  onVerify, 
  onUpdate,
  onMatchStudent,
  onActionStudent,
  onReviewAction,
  onUpdateStudent
}) => {
  const [activeTab, setActiveTab] = useState<'tutors' | 'students' | 'feedback'>('tutors');
  const [studentView, setStudentView] = useState<'all' | 'active' | 'requests'>('all');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('pending');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Tutor Tab Assignment State
  const [assigningTutorId, setAssigningTutorId] = useState<string | null>(null);
  const [studentIdToAssign, setStudentIdToAssign] = useState('');

  // Edit Modal State
  const [editingTutor, setEditingTutor] = useState<Tutor | null>(null);
  const [editingStudent, setEditingStudent] = useState<User | null>(null);

  const filteredTutors = tutors.filter(tutor => {
    const matchesFilter = filter === 'all' ? true : tutor.status === filter;
    const matchesSearch = tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tutor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tutor.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (studentView === 'active') {
       return matchesSearch && (student.status === 'active' || !student.status);
    }
    return matchesSearch;
  });

  const pendingReviews = platformReviews.filter(r => r.status === 'pending');
  const otherReviews = platformReviews.filter(r => r.status !== 'pending');

  // Filter requests to only show Pending ones for the "Requests" view
  const pendingRequestsList = studentRequests.filter(req => req.status === 'pending');

  // Tutor Stats
  const pendingTutorCount = tutors.filter(t => t.status === 'pending').length;
  const activeTutorCount = tutors.filter(t => t.status === 'approved').length;
  
  // Student Stats
  const totalStudentCount = students.length;
  const activeStudentCount = students.filter(s => s.status === 'active' || !s.status).length;
  const pendingStudentCount = students.filter(s => s.status === 'pending').length; 
  const suspendedStudentCount = students.filter(s => s.status === 'suspended').length;

  const pendingRequestsCount = pendingRequestsList.length;
  const pendingFeedbackCount = pendingReviews.length;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTutor) {
      onUpdate(editingTutor);
      setEditingTutor(null);
    }
  };

  const handleSaveStudentEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingStudent && onUpdateStudent) {
      onUpdateStudent(editingStudent);
      setEditingStudent(null);
    }
  };

  const handleTutorAssignStudent = (tutorId: string) => {
      if (!studentIdToAssign || !onMatchStudent) return;

      // Find the student request associated with this ID
      // Prioritize pending requests, then matched requests (to re-assign)
      const targetRequest = studentRequests.find(r => r.studentId === studentIdToAssign && (r.status === 'pending' || r.status === 'matched'));

      if (targetRequest) {
          onMatchStudent(targetRequest.id, tutorId);
          setAssigningTutorId(null);
          setStudentIdToAssign('');
      } else {
          alert(`No active or pending request found for Student ID: ${studentIdToAssign}`);
      }
  };

  const renderStats = () => {
    if (activeTab === 'students') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Students</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{totalStudentCount}</h3>
                 </div>
                 <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                    <GraduationCap className="w-6 h-6" />
                 </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
                 <TrendingUp className="w-4 h-4" />
                 <span>+8%</span>
                 <span className="text-slate-400 font-normal ml-1">new this week</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Students</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{activeStudentCount}</h3>
                 </div>
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                    <Users className="w-6 h-6" />
                 </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
                 <span>95%</span>
                 <span className="text-slate-400 font-normal ml-1">engagement rate</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Requests</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{pendingRequestsCount}</h3>
                 </div>
                 <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl text-indigo-600 dark:text-indigo-400">
                    <Send className="w-6 h-6" />
                 </div>
              </div>
              <div className="mt-4">
                 <span className="text-xs text-slate-400">Requires matching</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Suspended Users</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{suspendedStudentCount}</h3>
                 </div>
                 <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400">
                    <AlertCircle className="w-6 h-6" />
                 </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-red-600 dark:text-red-400 font-medium">
                 <span>Action Taken</span>
              </div>
           </div>
        </div>
      );
    }

    if (activeTab === 'feedback') {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start relative z-10">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Feedback</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{pendingFeedbackCount}</h3>
                        </div>
                        <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                            <Clock className="w-6 h-6" />
                        </div>
                    </div>
                    <div className="mt-4 relative z-10">
                        <span className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                            Action Req.
                        </span>
                    </div>
                </div>
                
                <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Published Feedback</p>
                            <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{platformReviews.filter(r => r.status === 'approved').length}</h3>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                            <ThumbsUp className="w-6 h-6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default Tutor Stats
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Tutors</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{tutors.length}</h3>
                 </div>
                 <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400">
                    <Users className="w-6 h-6" />
                 </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
                 <TrendingUp className="w-4 h-4" />
                 <span>+12%</span>
                 <span className="text-slate-400 font-normal ml-1">from last month</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Active Teachers</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{activeTutorCount}</h3>
                 </div>
                 <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-purple-600 dark:text-purple-400">
                    <BarChart3 className="w-6 h-6" />
                 </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
                 <TrendingUp className="w-4 h-4" />
                 <span>+5%</span>
                 <span className="text-slate-400 font-normal ml-1">from last month</span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between relative overflow-hidden">
              <div className="flex justify-between items-start relative z-10">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Pending Approvals</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{pendingTutorCount}</h3>
                 </div>
                 <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl text-amber-600 dark:text-amber-400">
                    <AlertCircle className="w-6 h-6" />
                 </div>
              </div>
              <div className="mt-4 relative z-10">
                 <span className="text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded">
                    Action Req.
                 </span>
              </div>
           </div>

           <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                 <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Revenue (YTD)</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">$45.2k</h3>
                 </div>
                 <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-xl text-green-600 dark:text-green-400">
                    <DollarSign className="w-6 h-6" />
                 </div>
              </div>
              <div className="flex items-center gap-1 mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
                 <TrendingUp className="w-4 h-4" />
                 <span>+24%</span>
                 <span className="text-slate-400 font-normal ml-1">from last month</span>
              </div>
           </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-500 font-sans">
      
      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center gap-2 text-slate-900 dark:text-white">
            <Shield className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            Admin Console
          </h1>
          <div className="flex items-center gap-6">
             <nav className="hidden md:flex gap-1 bg-slate-100 dark:bg-slate-700 p-1 rounded-lg">
                <button 
                  onClick={() => setActiveTab('tutors')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'tutors' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                  Tutors
                </button>
                <button 
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'students' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                  Students
                  {pendingRequestsCount > 0 && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingRequestsCount}</span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('feedback')}
                  className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all flex items-center gap-2 ${activeTab === 'feedback' ? 'bg-white dark:bg-slate-600 shadow-sm text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                >
                  Feedback
                  {pendingFeedbackCount > 0 && (
                    <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingFeedbackCount}</span>
                  )}
                </button>
             </nav>
             
             <div className="flex items-center gap-3">
               <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:inline">Administrator</span>
               <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold">A</div>
             </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Dynamic Stats Grid */}
        {renderStats()}

        {activeTab === 'tutors' && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
           <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Tutor Management</h2>
              
              <div className="flex w-full md:w-auto gap-4">
                 <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                    <button 
                      onClick={() => setFilter('pending')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'pending' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                      Pending
                    </button>
                    <button 
                      onClick={() => setFilter('approved')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'approved' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                      Active
                    </button>
                    <button 
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                    >
                      All
                    </button>
                 </div>

                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full md:w-64"
                    />
                 </div>
              </div>
           </div>

           <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tutor ID</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Tutor Profile</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Subjects & Experience</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned Students</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Verification</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filteredTutors.length === 0 ? (
                   <tr>
                     <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 italic">
                        No tutors found matching your filters.
                     </td>
                   </tr>
                ) : (
                  filteredTutors.map((tutor) => {
                    const assignedStudents = studentRequests.filter(req => req.assignedTutorId === tutor.id);
                    const isAssigning = assigningTutorId === tutor.id;

                    return (
                    <tr key={tutor.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                         <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                           {tutor.id}
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setEditingTutor(tutor)}>
                          <img src={tutor.avatar} alt="" className="w-10 h-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-indigo-500 transition-all" />
                          <div>
                            <div className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tutor.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 group-hover:text-indigo-500">
                               Click to edit
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
                           {tutor.subjects.join(', ')}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                           {tutor.experienceYears} Years Exp • ${tutor.hourlyRate}/hr
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          tutor.status === 'approved' 
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800' 
                            : tutor.status === 'rejected'
                            ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                            : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800'
                        }`}>
                          {tutor.status === 'pending' && <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5 animate-pulse"></span>}
                          {tutor.status.charAt(0).toUpperCase() + tutor.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                         <div className="flex flex-col gap-2">
                            {assignedStudents.length > 0 ? (
                                <div className="flex flex-col gap-1.5">
                                    {assignedStudents.map(req => (
                                    <div key={req.id} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-1.5 rounded border border-slate-100 dark:border-slate-600 max-w-[200px]">
                                        <img src={req.avatar} alt={req.studentName} className="w-6 h-6 rounded-full flex-shrink-0" />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[10px] font-bold text-slate-900 dark:text-white leading-tight truncate">{req.studentName}</span>
                                            <span className="text-[9px] text-slate-500 dark:text-slate-400 font-mono truncate">ID: {req.studentId}</span>
                                        </div>
                                    </div>
                                    ))}
                                </div>
                            ) : (
                                <span className="text-xs text-slate-400 italic">No Active Students</span>
                            )}
                            
                            {isAssigning ? (
                                <div className="flex gap-1 animate-in fade-in duration-200 mt-1">
                                    <input 
                                        type="text"
                                        className="w-28 px-2 py-1 text-xs border border-slate-300 rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        placeholder="Student ID"
                                        value={studentIdToAssign}
                                        onChange={(e) => setStudentIdToAssign(e.target.value)}
                                        autoFocus
                                    />
                                    <button onClick={() => handleTutorAssignStudent(tutor.id)} className="p-1 bg-green-600 text-white rounded hover:bg-green-700">
                                        <Check className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => setAssigningTutorId(null)} className="p-1 bg-slate-400 text-white rounded hover:bg-slate-500">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    onClick={() => { setAssigningTutorId(tutor.id); setStudentIdToAssign(''); }}
                                    className="flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline mt-1"
                                >
                                    <UserPlus className="w-3.5 h-3.5" /> Assign Student
                                </button>
                            )}
                         </div>
                      </td>
                      <td className="px-6 py-4">
                         <button 
                           onClick={() => onVerify(tutor.id)}
                           className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                             tutor.isVerified 
                               ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50' 
                               : 'bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600'
                           }`}
                         >
                           {tutor.isVerified ? (
                             <>
                               <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                             </>
                           ) : (
                             <>
                               <span className="w-3.5 h-3.5 border-2 border-slate-300 dark:border-slate-500 rounded-full"></span> Verify
                             </>
                           )}
                         </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button 
                             onClick={() => setEditingTutor(tutor)}
                             className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                             title="Edit Profile"
                           >
                             <Edit className="w-4 h-4" />
                           </button>

                           {tutor.status === 'pending' ? (
                             <>
                               <button 
                                 onClick={() => onApprove(tutor.id)}
                                 className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded hover:bg-green-700 transition-colors shadow-sm"
                               >
                                 <Check className="w-3.5 h-3.5" /> Approve
                               </button>
                               <button 
                                 onClick={() => onReject(tutor.id)}
                                 className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900 text-xs font-medium rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                               >
                                 <XCircle className="w-3.5 h-3.5" /> Reject
                               </button>
                             </>
                           ) : tutor.status === 'rejected' ? (
                             <button 
                               onClick={() => onApprove(tutor.id)}
                               className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                             >
                               Re-approve
                             </button>
                           ) : (
                             <button 
                               onClick={() => onReject(tutor.id)}
                               className="text-xs text-red-600 dark:text-red-400 hover:underline"
                             >
                               Deactivate
                             </button>
                           )}
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        )}

        {/* Feedback Management Tab */}
        {activeTab === 'feedback' && (
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
               <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Feedback Moderation</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Review and approve feedback to be displayed on the home page.</p>
               </div>

               {/* Pending Reviews Section */}
               <div className="p-6">
                   <h3 className="text-sm font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-4 flex items-center gap-2">
                       <Clock className="w-4 h-4" /> Pending Approval ({pendingReviews.length})
                   </h3>
                   
                   <div className="grid md:grid-cols-2 gap-4 mb-8">
                       {pendingReviews.length === 0 ? (
                           <div className="col-span-2 text-center py-8 bg-slate-50 dark:bg-slate-700/30 rounded-xl text-slate-400 italic">
                               No pending feedback.
                           </div>
                       ) : (
                           pendingReviews.map(review => (
                               <div key={review.id} className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-xl border border-slate-200 dark:border-slate-600">
                                   <div className="flex justify-between items-start mb-3">
                                       <div className="flex items-center gap-3">
                                           <img src={review.image} alt={review.name} className="w-10 h-10 rounded-full" />
                                           <div>
                                               <h4 className="font-bold text-slate-900 dark:text-white text-sm">{review.name}</h4>
                                               <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                                   <span>ID: {review.studentId}</span>
                                                   <span>•</span>
                                                   <span>{new Date(review.date).toLocaleDateString()}</span>
                                               </div>
                                           </div>
                                       </div>
                                       <div className="flex gap-1">
                                           {[...Array(5)].map((_, i) => (
                                               <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                                           ))}
                                       </div>
                                   </div>
                                   <div className="bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4 relative">
                                       <Quote className="w-4 h-4 text-indigo-200 absolute -top-2 -left-2 fill-current" />
                                       <p className="text-sm text-slate-600 dark:text-slate-300 italic relative z-10">
                                           "{review.content}"
                                       </p>
                                   </div>
                                   <div className="flex gap-2 justify-end">
                                       <button 
                                           onClick={() => onReviewAction && onReviewAction(review.id, 'reject')}
                                           className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded border border-transparent hover:border-red-100 transition-colors"
                                       >
                                           Reject
                                       </button>
                                       <button 
                                           onClick={() => onReviewAction && onReviewAction(review.id, 'approve')}
                                           className="px-3 py-1.5 text-xs font-medium bg-green-600 text-white rounded hover:bg-green-700 transition-colors shadow-sm flex items-center gap-1"
                                       >
                                           <Check className="w-3 h-3" /> Approve
                                       </button>
                                   </div>
                               </div>
                           ))
                       )}
                   </div>

                   {/* History / Approved Section */}
                   <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
                       <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wide mb-4 flex items-center gap-2">
                           <List className="w-4 h-4" /> Feedback History
                       </h3>
                       <div className="overflow-x-auto">
                           <table className="w-full text-left">
                               <thead className="bg-slate-50 dark:bg-slate-700/50">
                                   <tr>
                                       <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Student</th>
                                       <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Feedback</th>
                                       <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Rating</th>
                                       <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase">Status</th>
                                       <th className="px-4 py-2 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
                                   </tr>
                               </thead>
                               <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                                   {otherReviews.map(review => (
                                       <tr key={review.id} className="text-sm">
                                           <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">{review.name}</td>
                                           <td className="px-4 py-3 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={review.content}>{review.content}</td>
                                           <td className="px-4 py-3 text-amber-500 font-bold">{review.rating}/5</td>
                                           <td className="px-4 py-3">
                                               <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                   review.status === 'approved' 
                                                   ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                                                   : 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                               }`}>
                                                   {review.status}
                                               </span>
                                           </td>
                                           <td className="px-4 py-3 text-right">
                                               {review.status === 'approved' ? (
                                                   <button onClick={() => onReviewAction && onReviewAction(review.id, 'reject')} className="text-red-500 hover:underline text-xs">Remove</button>
                                               ) : (
                                                   <button onClick={() => onReviewAction && onReviewAction(review.id, 'approve')} className="text-green-500 hover:underline text-xs">Approve</button>
                                               )}
                                           </td>
                                       </tr>
                                   ))}
                               </tbody>
                           </table>
                       </div>
                   </div>
               </div>
            </div>
        )}

        {/* Student Management Tab (Consolidated) */}
        {activeTab === 'students' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
             
             {/* Sub-Header */}
             <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex flex-col gap-1">
                   <h2 className="text-lg font-bold text-slate-900 dark:text-white">Student Management</h2>
                   <p className="text-sm text-slate-500 dark:text-slate-400">Manage student profiles and learning requests.</p>
                </div>
                
                <div className="flex items-center gap-4 w-full md:w-auto">
                   {/* Sub-Tab Toggle */}
                   <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                      <button 
                        onClick={() => setStudentView('all')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${studentView === 'all' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                      >
                        All
                      </button>
                      <button 
                        onClick={() => setStudentView('active')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${studentView === 'active' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                      >
                        Active
                      </button>
                      <button 
                        onClick={() => setStudentView('requests')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${studentView === 'requests' ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
                      >
                        Requests
                        {pendingRequestsCount > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{pendingRequestsCount}</span>}
                      </button>
                   </div>

                   {/* Search only for List view mostly, but can apply to requests too */}
                   {(studentView === 'all' || studentView === 'active') && (
                     <div className="relative hidden md:block">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                          type="text" 
                          placeholder="Search students..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none w-64"
                        />
                     </div>
                   )}
                </div>
             </div>
             
             {/* CONTENT: Student Profiles (All or Active) */}
             {(studentView === 'all' || studentView === 'active') && (
               <div className="overflow-x-auto animate-in fade-in duration-300">
                 <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student ID</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student Profile</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Contact Info</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned Tutor IDs</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                       {filteredStudents.length === 0 ? (
                          <tr>
                             <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 italic">
                                No students found.
                             </td>
                          </tr>
                       ) : (
                         filteredStudents.map((student) => {
                           // Find active tutor IDs for this student
                           const activeTutors = [...new Set(
                             studentRequests
                               .filter(req => req.studentId === student.id && req.status === 'matched' && req.assignedTutorId)
                               .map(req => req.assignedTutorId)
                           )];

                           return (
                           <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                              <td className="px-6 py-4">
                                 <span className="font-mono text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                                   {student.id}
                                 </span>
                              </td>
                              <td className="px-6 py-4">
                                 <div 
                                    className="flex items-center gap-3 cursor-pointer group"
                                    onClick={() => setEditingStudent(student)}
                                 >
                                    <img src={student.avatar} alt="" className="w-10 h-10 rounded-full object-cover group-hover:ring-2 group-hover:ring-indigo-500 transition-all" />
                                    <div>
                                       <div className="font-medium text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{student.name}</div>
                                       <div className="text-xs text-slate-400 group-hover:text-indigo-500">Click to edit</div>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="flex flex-col gap-1 text-sm text-slate-600 dark:text-slate-300">
                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {student.email}</div>
                                    {student.phone && <div className="flex items-center gap-2"><Phone className="w-3 h-3" /> {student.phone}</div>}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 <div className="text-sm text-slate-600 dark:text-slate-300">
                                    {student.joinedAt ? new Date(student.joinedAt).toLocaleDateString() : 'N/A'}
                                 </div>
                              </td>
                              <td className="px-6 py-4">
                                 {activeTutors.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                       {activeTutors.map(tId => (
                                          <span key={tId} className="px-2 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded text-xs font-mono border border-indigo-100 dark:border-indigo-800">
                                             {tId}
                                          </span>
                                       ))}
                                    </div>
                                 ) : (
                                    <span className="text-xs text-slate-400 italic">None</span>
                                 )}
                              </td>
                              <td className="px-6 py-4">
                                 <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                    student.status === 'active' 
                                      ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800' 
                                      : student.status === 'suspended'
                                      ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-100 dark:border-red-800'
                                      : 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800'
                                  }`}>
                                    {student.status || 'Active'}
                                 </span>
                              </td>
                              <td className="px-6 py-4 text-right">
                                 <div className="flex items-center justify-end gap-2">
                                    <button 
                                       onClick={() => setEditingStudent(student)}
                                       className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded transition-colors"
                                       title="Edit Full Profile"
                                    >
                                       <Edit className="w-4 h-4" />
                                    </button>
                                    {student.status === 'suspended' ? (
                                       <button 
                                          onClick={() => onActionStudent && onActionStudent(student.id, 'activate')}
                                          className="text-xs text-green-600 dark:text-green-400 hover:underline"
                                       >
                                          Activate
                                       </button>
                                    ) : (
                                       <button 
                                          onClick={() => onActionStudent && onActionStudent(student.id, 'suspend')}
                                          className="text-xs text-red-600 dark:text-red-400 hover:underline"
                                       >
                                          Suspend
                                       </button>
                                    )}
                                 </div>
                              </td>
                           </tr>
                           );
                         })
                       )}
                    </tbody>
                 </table>
               </div>
             )}

             {/* CONTENT: Student Requests */}
             {studentView === 'requests' && (
                <div className="overflow-x-auto animate-in fade-in duration-300">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="bg-slate-50 dark:bg-slate-700/30 border-b border-slate-200 dark:border-slate-700">
                           <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Request Details</th>
                           <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Student</th>
                           <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Posted</th>
                           <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assigned To</th>
                           <th className="px-6 py-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {pendingRequestsList.length === 0 ? (
                           <tr>
                              <td colSpan={5} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 italic">
                                 No pending requests. All requests have been assigned.
                              </td>
                           </tr>
                        ) : (
                           pendingRequestsList.map((req) => (
                              <tr key={req.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="font-medium text-slate-900 dark:text-white">{req.subject}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">{req.level} • {req.mode}</div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate max-w-xs" title={req.description}>{req.description}</div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                       <img src={req.avatar} alt="" className="w-6 h-6 rounded-full" />
                                       <div>
                                          <div className="text-sm text-slate-900 dark:text-white">{req.studentName}</div>
                                          <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">ID: {req.studentId}</div>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="text-sm text-slate-600 dark:text-slate-300">
                                       {new Date(req.postedAt).toLocaleDateString()}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    {req.assignedTutorId ? (
                                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                                            ID: {req.assignedTutorId}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Unassigned</span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                                       req.status === 'pending'
                                          ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800'
                                          : req.status === 'matched'
                                          ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-100 dark:border-green-800'
                                          : 'bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700'
                                    }`}>
                                       {req.status}
                                    </span>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
                </div>
             )}
          </div>
        )}

      </main>

      {/* Edit Tutor Modal */}
      {editingTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Tutor Profile</h3>
                 <button onClick={() => setEditingTutor(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                 <form id="edit-tutor-form" onSubmit={handleSaveEdit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                          <input 
                             type="text" 
                             value={editingTutor.name}
                             onChange={e => setEditingTutor({...editingTutor, name: e.target.value})}
                             className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hourly Rate</label>
                          <input 
                             type="number" 
                             value={editingTutor.hourlyRate}
                             onChange={e => setEditingTutor({...editingTutor, hourlyRate: Number(e.target.value)})}
                             className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                       <textarea 
                          value={editingTutor.bio}
                          onChange={e => setEditingTutor({...editingTutor, bio: e.target.value})}
                          rows={4}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                       />
                    </div>
                    
                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subjects (comma separated)</label>
                       <input 
                          type="text" 
                          value={editingTutor.subjects.join(', ')}
                          onChange={e => setEditingTutor({...editingTutor, subjects: e.target.value.split(',').map(s => s.trim())})}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                       />
                    </div>
                 </form>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
                 <button 
                    onClick={() => setEditingTutor(null)}
                    className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    type="submit"
                    form="edit-tutor-form"
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                 >
                    <Save className="w-4 h-4" /> Save Changes
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                 <h3 className="text-xl font-bold text-slate-900 dark:text-white">Edit Student Profile</h3>
                 <button onClick={() => setEditingStudent(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                    <X className="w-6 h-6" />
                 </button>
              </div>
              
              <div className="p-6 overflow-y-auto">
                 <form id="edit-student-form" onSubmit={handleSaveStudentEdit} className="space-y-6">
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100 dark:border-slate-700">
                        <img src={editingStudent.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                        <div>
                            <h4 className="font-bold text-lg dark:text-white">{editingStudent.name}</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400">ID: {editingStudent.id}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                          <input 
                             type="text" 
                             value={editingStudent.name}
                             onChange={e => setEditingStudent({...editingStudent, name: e.target.value})}
                             className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email (Read Only)</label>
                          <input 
                             type="email" 
                             value={editingStudent.email}
                             disabled
                             className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg cursor-not-allowed"
                          />
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                          <input 
                             type="tel" 
                             value={editingStudent.phone || ''}
                             onChange={e => setEditingStudent({...editingStudent, phone: e.target.value})}
                             className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          />
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                          <select
                              value={editingStudent.gender || ''}
                              onChange={e => setEditingStudent({...editingStudent, gender: e.target.value})}
                              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                          >
                              <option value="">Select</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                          </select>
                       </div>
                    </div>

                    <div>
                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Address</label>
                       <input 
                          type="text" 
                          value={editingStudent.address || ''}
                          onChange={e => setEditingStudent({...editingStudent, address: e.target.value})}
                          className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-6 border-t border-slate-100 dark:border-slate-700 pt-4">
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">School Name</label>
                          <div className="relative">
                             <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                                type="text" 
                                value={editingStudent.schoolName || ''}
                                onChange={e => setEditingStudent({...editingStudent, schoolName: e.target.value})}
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                             />
                          </div>
                       </div>
                       <div>
                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Grade/Class</label>
                          <div className="relative">
                             <GraduationCap className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                             <input 
                                type="text" 
                                value={editingStudent.grade || ''}
                                onChange={e => setEditingStudent({...editingStudent, grade: e.target.value})}
                                className="w-full pl-9 pr-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                             />
                          </div>
                       </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Account Status</label>
                        <select
                            value={editingStudent.status || 'active'}
                            onChange={e => setEditingStudent({...editingStudent, status: e.target.value as any})}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 dark:bg-slate-900 dark:text-white rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
                        >
                            <option value="active">Active</option>
                            <option value="suspended">Suspended</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>
                 </form>
              </div>

              <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900">
                 <button 
                    onClick={() => setEditingStudent(null)}
                    className="px-6 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                 >
                    Cancel
                 </button>
                 <button 
                    type="submit"
                    form="edit-student-form"
                    className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                 >
                    <Save className="w-4 h-4" /> Save Changes
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;