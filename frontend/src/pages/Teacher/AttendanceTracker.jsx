import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { UserCheck, Calendar as CalendarIcon, Check, X, Clock, Loader2, AlertCircle } from 'lucide-react';

const AttendanceTracker = () => {
    const [students, setStudents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchInitialData();
    }, [date]);

    const fetchInitialData = async () => {
        setLoading(true);
        try {
            const [stuRes, attRes] = await Promise.all([
                api.get('/teacher/students'),
                api.get(`/teacher/attendances?date=${date}`)
            ]);
            
            setStudents(stuRes.data.data || stuRes.data);
            
            const attData = attRes.data.data || attRes.data;
            const map = {};
            attData.forEach(att => {
                map[att.student_id] = att.status;
            });
            setAttendanceMap(map);
        } catch (error) {
            console.error('Error fetching attendance data');
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async (studentId, status) => {
        setMarking(studentId);
        try {
            await api.post('/teacher/attendances', {
                student_id: studentId,
                status: status,
                date: date
            });
            setAttendanceMap(prev => ({ ...prev, [studentId]: status }));
        } catch (error) {
            alert('Failed to mark attendance');
        } finally {
            setMarking(null);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Attendance Tracker</h2>
                    <p className="text-slate-500">Record and track daily student presence</p>
                </div>
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-sm w-full md:w-auto">
                    <CalendarIcon className="w-5 h-5 text-primary-500" />
                    <input 
                        type="date" 
                        className="outline-none text-sm font-bold bg-transparent flex-1" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Student Information</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Current Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((student) => (
                                <tr key={student.id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center font-bold text-lg shadow-inner">
                                                {student.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800 group-hover:text-primary-700 transition-colors">{student.student_name}</p>
                                                <p className="text-xs font-medium text-slate-400 uppercase">{student.classroom?.class_name || 'No Class'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        {attendanceMap[student.id] ? (
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                attendanceMap[student.id] === 'present' ? 'bg-emerald-100 text-emerald-700' :
                                                attendanceMap[student.id] === 'absent' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {attendanceMap[student.id]}
                                            </span>
                                        ) : (
                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-wider">Unmarked</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="flex justify-center gap-2">
                                            <button 
                                                disabled={marking === student.id}
                                                onClick={() => markAttendance(student.id, 'present')}
                                                className={`p-3 rounded-xl transition-all shadow-sm ${
                                                    attendanceMap[student.id] === 'present' 
                                                    ? 'bg-emerald-600 text-white scale-110' 
                                                    : 'bg-slate-50 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                                                }`}
                                            >
                                                {marking === student.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                                            </button>
                                            <button 
                                                disabled={marking === student.id}
                                                onClick={() => markAttendance(student.id, 'absent')}
                                                className={`p-3 rounded-xl transition-all shadow-sm ${
                                                    attendanceMap[student.id] === 'absent' 
                                                    ? 'bg-red-600 text-white scale-110' 
                                                    : 'bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-600'
                                                }`}
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                            <button 
                                                disabled={marking === student.id}
                                                onClick={() => markAttendance(student.id, 'late')}
                                                className={`p-3 rounded-xl transition-all shadow-sm ${
                                                    attendanceMap[student.id] === 'late' 
                                                    ? 'bg-amber-500 text-white scale-110' 
                                                    : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                                                }`}
                                            >
                                                <Clock className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {students.length === 0 && !loading && (
                    <div className="p-20 text-center space-y-4">
                        <AlertCircle className="w-12 h-12 text-slate-200 mx-auto" />
                        <p className="text-slate-400 font-medium">No students found associated with your account.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AttendanceTracker;
