import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { GraduationCap, BookOpen, User, Calendar, Award, TrendingUp, ChevronRight, Plus, X, Loader2, AlertCircle } from 'lucide-react';

const StudentProgress = () => {
    const [students, setStudents] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [formData, setFormData] = useState({ student_name: '', classroom_id: '', roll_number: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const { data } = await api.get('/public/classrooms');
            setClassrooms(data);
        } catch { }
    };

    const fetchStudents = async () => {
        try {
            const { data } = await api.get('/parent/progress');
            setStudents(data.data || data);
            if ((data.data?.length > 0 || data.length > 0) && !selectedStudent) {
                setSelectedStudent(data.data?.[0] || data[0]);
            } else if (selectedStudent) {
                // Refresh existing selected student if it exists in new data
                const updated = (data.data || data).find(s => s.id === selectedStudent.id);
                if (updated) setSelectedStudent(updated);
            }
        } catch (error) {
            console.error('Error fetching progress');
        } finally {
            setLoading(false);
        }
    };

    const handleAddChild = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('/parent/progress', formData);
            setShowModal(false);
            setFormData({ student_name: '', classroom_id: '', roll_number: '' });
            fetchStudents();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add child');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Student Progress</h2>
                    <p className="text-slate-500 font-medium">Monitoring academic & personal development</p>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <button 
                        onClick={() => { setShowModal(true); setError(''); }}
                        className="p-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all shadow-sm"
                        title="Add another child"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    {students.length > 0 && (
                        <div className="flex-1 md:w-64 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-1 overflow-x-auto">
                            {students.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setSelectedStudent(s)}
                                    className={`flex-1 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                                        selectedStudent?.id === s.id
                                            ? 'bg-primary-600 text-white shadow-lg shadow-primary-200'
                                            : 'text-slate-400 hover:bg-slate-50'
                                    }`}
                                >
                                    {s.student_name.split(' ')[0]}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-800">Add Child</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleAddChild} className="p-6 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                    <AlertCircle className="w-4 h-4" /> {error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Student Name</label>
                                <input 
                                    type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.student_name} onChange={e => setFormData({...formData, student_name: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Classroom</label>
                                <select 
                                    required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.classroom_id} onChange={e => setFormData({...formData, classroom_id: e.target.value})}
                                >
                                    <option value="">Select Class</option>
                                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Roll Number (Optional)</label>
                                <input 
                                    type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.roll_number} onChange={e => setFormData({...formData, roll_number: e.target.value})}
                                />
                            </div>
                            <button type="submit" disabled={submitting} className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-all mt-4 disabled:opacity-50">
                                {submitting ? 'Adding...' : 'Add Child'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {selectedStudent ? (
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <GraduationCap className="w-8 h-8 text-primary-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{selectedStudent.student_name}</h3>
                                <p className="text-slate-500">Class: {selectedStudent.classroom?.class_name} | Teacher: {selectedStudent.teacher?.name}</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="bg-emerald-50 px-4 py-2 rounded-xl text-center">
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Attendance</p>
                                <p className="text-xl font-bold text-emerald-700">{selectedStudent.attendance_rate !== null ? `${selectedStudent.attendance_rate}%` : 'N/A'}</p>
                            </div>
                            <div className="bg-primary-50 px-4 py-2 rounded-xl text-center">
                                <p className="text-[10px] text-primary-600 font-bold uppercase tracking-wider">GPA</p>
                                <p className="text-xl font-bold text-primary-700">{selectedStudent.gpa !== null ? selectedStudent.gpa : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-indigo-500" />
                                Recent Grades
                            </h4>
                            <div className="space-y-3">
                                {selectedStudent.grades?.length > 0 ? (
                                    selectedStudent.grades.map(grade => (
                                        <div key={grade.id} className="flex justify-between items-center p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-all">
                                            <span className="text-sm font-medium text-slate-700">{grade.subject?.name}</span>
                                            <span className="font-bold text-primary-600">{grade.marks}%</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No recent grades available</p>
                                )}
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-amber-500" />
                                Behavior Reports
                            </h4>
                            <div className="space-y-3">
                                {selectedStudent.behavior_reports?.length > 0 ? (
                                    selectedStudent.behavior_reports.map(report => (
                                        <div key={report.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                                            <p className="text-sm text-amber-800 font-medium">{report.remarks}</p>
                                            <p className="text-[10px] text-amber-600 mt-1">{new Date(report.created_at).toLocaleDateString()}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-slate-400 italic">No behavior reports recorded</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <User className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No children added yet.</p>
                    <button onClick={() => setShowModal(true)} className="text-primary-600 font-bold text-sm mt-2 hover:underline">
                        Add your first child
                    </button>
                </div>
            )}
        </div>
    );
};

export default StudentProgress;
