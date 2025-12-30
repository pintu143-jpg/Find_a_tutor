import React from 'react';
import { StudentRequest } from '../types';
import { MapPin, Monitor, DollarSign, Clock, Shield } from 'lucide-react';

interface StudentRequestsBoardProps {
  requests: StudentRequest[];
  currentUserRole?: string;
}

const StudentRequestsBoard: React.FC<StudentRequestsBoardProps> = ({ requests, currentUserRole }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-500 pb-20">
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 py-12">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Student Requests</h1>
             <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
               Browse active learning requests from students. Matching is handled by our administrators to ensure quality connections.
             </p>
         </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
         {requests.length === 0 ? (
           <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No requests found</h3>
              <p className="text-slate-500 dark:text-slate-400">Be the first to see new student requests here.</p>
           </div>
         ) : (
           <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {requests.map(req => (
                <div key={req.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col">
                   <div className="p-6 flex-1">
                      <div className="flex items-start gap-4 mb-4">
                         <img src={req.avatar} alt={req.studentName} className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-700" />
                         <div>
                            <h3 className="font-bold text-slate-900 dark:text-white text-lg">{req.subject}</h3>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{req.studentName} • {req.level}</p>
                         </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                         <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${req.mode === 'online' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>
                            {req.mode === 'online' ? <Monitor className="w-3 h-3" /> : <MapPin className="w-3 h-3" />}
                            {req.mode === 'online' ? 'Online' : req.location}
                         </span>
                         <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            <DollarSign className="w-3 h-3" /> Budget: ${req.budget}/hr
                         </span>
                      </div>

                      <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-3 mb-4">
                        "{req.description}"
                      </p>
                      
                      <div className="flex items-center gap-1 text-xs text-slate-400">
                         <Clock className="w-3 h-3" /> Posted {new Date(req.postedAt).toLocaleDateString()}
                      </div>
                   </div>
                   
                   <div className="p-4 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700">
                      <div className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                         <Shield className="w-4 h-4" /> 
                         Assignment by Admin Only
                      </div>
                   </div>
                </div>
              ))}
           </div>
         )}
      </div>
    </div>
  );
};

export default StudentRequestsBoard;