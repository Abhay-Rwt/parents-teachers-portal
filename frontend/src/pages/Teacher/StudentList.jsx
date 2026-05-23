import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Users, Search, Mail, User, ShieldAlert, X, TrendingUp, Calendar, AlertCircle, Loader2, GraduationCap, Award, Plus, Edit2, Save, Trash2 } from 'lucide-react';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [showGradeForm, setShowGradeForm] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [gradingForm, setGradingForm] = useState({ id: null, subject_id: '', marks: '', remarks: '' });
    const [submittingGrade, setSubmittingGrade] = useState(false);

    useEffect(() => {
        fetchData();
        fetchSubjects();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/teacher/students');
            setStudents(data.data || data);
        } catch (error) {
            console.error('Error fetching students');
        } finally {
            setLoading(false);
        }
    };

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/lookups/subjects');
            setSubjects(data);
        } catch { }
    };

    const fetchStudentDetails = async (id) => {
        setDetailsLoading(true);
        setShowModal(true);
        try {
            const { data } = await api.get(`/teacher/students/${id}`);
            setSelectedStudent(data.data || data);
        } catch (error) {
            console.error('Error fetching student details');
            setShowModal(false);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleGradeSubmit = async (e) => {
        e.preventDefault();
        setSubmittingGrade(true);
        try {
            if (gradingForm.id) {
                await api.patch(`/teacher/grades/${gradingForm.id}`, gradingForm);
            } else {
                await api.post('/teacher/grades', { ...gradingForm, student_id: selectedStudent.id });
            }
            setShowGradeForm(false);
            setGradingForm({ id: null, subject_id: '', marks: '', remarks: '' });
            fetchStudentDetails(selectedStudent.id);
        } catch {
            alert('Failed to save grade');
        } finally {
            setSubmittingGrade(false);
        }
    };

    const deleteGrade = async (id) => {
        if (!window.confirm('Delete this grade?')) return;
        try {
            await api.delete(`/teacher/grades/${id}`);
            fetchStudentDetails(selectedStudent.id);
        } catch {
            alert('Failed to delete grade');
        }
    };

    const filteredStudents = students.filter(s => 
        s.student_name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (s.roll_number && s.roll_number.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-slate-800">
                <div>
                    <h2 className="text-2xl font-bold">Student Directory</h2>
                    <p className="text-slate-500">View and monitor progress of all registered students</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStudents.map((student) => (
                    <div key={student.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl hover:border-primary-100 transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-[100px] -mr-12 -mt-12 transition-all group-hover:scale-110"></div>
                        <div className="flex items-center gap-4 mb-6 relative">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-bold text-xl shadow-inner">
                                {student.student_name?.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800">{student.student_name}</h3>
                                <p className="text-[10px] font-black text-primary-500 uppercase tracking-widest">Roll: {student.roll_number || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="space-y-3 pt-6 border-t border-slate-50 relative">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-tighter">Classroom</span>
                                <span className="font-black text-slate-800">{student.classroom?.class_name || 'Unassigned'}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-400 font-bold uppercase tracking-tighter">Parent Contact</span>
                                <span className="font-black text-slate-800 truncate max-w-[150px]">{student.parent?.name || 'N/A'}</span>
                            </div>
                        </div>
                        <div className="mt-8 flex gap-3 relative">
                            <button className="p-3 bg-slate-50 text-slate-400 rounded-2xl hover:bg-primary-50 hover:text-primary-600 transition-all">
                                <Mail className="w-5 h-5" />
                            </button>
                            <button 
                                onClick={() => fetchStudentDetails(student.id)}
                                className="flex-1 bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all text-center shadow-lg shadow-slate-200"
                            >
                                Full Analytics
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <div className="bg-white w-full max-w-5xl rounded-[40px] shadow-2xl relative my-auto min-h-[600px]">
                        <button 
                            onClick={() => { setShowModal(false); setShowGradeForm(false); }}
                            className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-500 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-10"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {detailsLoading ? (
                            <div className="p-20 flex flex-col items-center justify-center gap-4">
                                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                                <p className="text-slate-500 font-bold animate-pulse">Computing Analytics...</p>
                            </div>
                        ) : selectedStudent && (
                            <div className="flex flex-col lg:flex-row">
                                {/* Left Side - Profile Summary */}
                                <div className="w-full lg:w-80 bg-slate-50 p-8 rounded-t-[40px] lg:rounded-l-[40px] lg:rounded-tr-none border-r border-slate-200 flex flex-col items-center">
                                    <div className="w-32 h-32 bg-white rounded-[40px] shadow-xl flex items-center justify-center border-4 border-white ring-1 ring-slate-100 mb-6">
                                        <span className="text-5xl font-black text-primary-600">{selectedStudent.student_name?.charAt(0)}</span>
                                    </div>
                                    <div className="text-center mb-10">
                                        <h3 className="text-2xl font-black text-slate-800">{selectedStudent.student_name}</h3>
                                        <p className="text-primary-600 font-black text-xs uppercase tracking-widest mt-1">ID: #{selectedStudent.id}</p>
                                    </div>

                                    <div className="w-full space-y-4">
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Parent</p>
                                            <p className="font-bold text-slate-800 text-sm">{selectedStudent.parent?.name || 'N/A'}</p>
                                        </div>
                                        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Classroom</p>
                                            <p className="font-bold text-slate-800 text-sm">{selectedStudent.classroom?.class_name || 'Unassigned'}</p>
                                            <p className="text-[10px] text-slate-500">Section: {selectedStudent.classroom?.section || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side - Analytics & Grading */}
                                <div className="flex-1 p-8 lg:p-12 space-y-10 max-h-[85vh] overflow-y-auto">
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div className="bg-emerald-50 p-5 rounded-3xl border border-emerald-100 text-center">
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Attendance</p>
                                            <span className="text-2xl font-black text-emerald-700">{selectedStudent.attendance_rate || '0'}%</span>
                                        </div>
                                        <div className="bg-indigo-50 p-5 rounded-3xl border border-indigo-100 text-center">
                                            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">GPA</p>
                                            <span className="text-2xl font-black text-indigo-700">{selectedStudent.gpa || '0.0'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center bg-white py-2">
                                            <h4 className="font-black text-slate-800 text-xl tracking-tight flex items-center gap-3">
                                                <Award className="w-6 h-6 text-primary-500" /> Academic Grades
                                            </h4>
                                            {!showGradeForm && (
                                                <button 
                                                    onClick={() => { setShowGradeForm(true); setGradingForm({ id: null, subject_id: '', marks: '', remarks: '' }); }}
                                                    className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-lg shadow-slate-100"
                                                >
                                                    <Plus className="w-4 h-4" /> Add Grade
                                                </button>
                                            )}
                                        </div>

                                        {showGradeForm && (
                                            <form onSubmit={handleGradeSubmit} className="bg-slate-50 p-8 rounded-3xl border-2 border-primary-100 space-y-4 animate-in slide-in-from-top-4">
                                                <h5 className="font-bold text-slate-800 flex items-center gap-2">
                                                    {gradingForm.id ? <Edit2 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                                                    {gradingForm.id ? 'Edit Grade' : 'New Grade Entry'}
                                                </h5>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <select 
                                                        required className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm"
                                                        value={gradingForm.subject_id} onChange={e => setGradingForm({...gradingForm, subject_id: e.target.value})}
                                                    >
                                                        <option value="">Select Subject</option>
                                                        {subjects.map(subj => <option key={subj.id} value={subj.id}>{subj.name}</option>)}
                                                    </select>
                                                    <input 
                                                        type="number" required placeholder="Marks (%)"
                                                        className="p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 font-bold text-sm"
                                                        value={gradingForm.marks} onChange={e => setGradingForm({...gradingForm, marks: e.target.value})}
                                                    />
                                                </div>
                                                <input 
                                                    type="text" placeholder="Remarks / Feedback"
                                                    className="w-full p-4 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 text-sm font-medium"
                                                    value={gradingForm.remarks} onChange={e => setGradingForm({...gradingForm, remarks: e.target.value})}
                                                />
                                                <div className="flex gap-2 pt-2">
                                                    <button type="submit" disabled={submittingGrade} className="flex-1 bg-primary-600 text-white font-black py-4 rounded-2xl hover:bg-primary-700 transition-all text-xs uppercase tracking-widest disabled:opacity-50">
                                                        {submittingGrade ? 'Saving...' : 'Save Grade'}
                                                    </button>
                                                    <button type="button" onClick={() => setShowGradeForm(false)} className="px-8 bg-white text-slate-400 font-black py-4 rounded-2xl hover:bg-slate-100 transition-all text-xs uppercase tracking-widest border border-slate-200">
                                                        Cancel
                                                    </button>
                                                </div>
                                            </form>
                                        )}

                                        <div className="grid grid-cols-1 gap-4">
                                            {selectedStudent.grades?.length > 0 ? selectedStudent.grades.map(grade => (
                                                <div key={grade.id} className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-white border border-slate-100 rounded-3xl hover:shadow-md transition-all group">
                                                    <div className="space-y-1">
                                                        <span className="font-black text-slate-800 text-base">{grade.subject?.name}</span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="px-2 py-0.5 bg-primary-50 text-primary-600 text-[10px] font-black rounded-lg uppercase">{grade.grade || 'N/A'}</span>
                                                            <p className="text-xs text-slate-400 font-medium">"{grade.remarks || 'No remarks provided'}"</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-6 mt-4 md:mt-0">
                                                        <div className="text-right">
                                                            <span className="text-2xl font-black text-slate-800">{grade.marks}%</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <button 
                                                                onClick={() => {
                                                                    setGradingForm({ id: grade.id, subject_id: grade.subject?.id, marks: grade.marks, remarks: grade.remarks });
                                                                    setShowGradeForm(true);
                                                                }}
                                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button 
                                                                onClick={() => deleteGrade(grade.id)}
                                                                className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            )) : (
                                                <div className="text-center py-10 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                                                    <p className="text-slate-400 text-sm italic">No grades recorded for this student yet.</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {filteredStudents.length === 0 && !loading && (
                <div className="p-20 text-center space-y-4 bg-white rounded-3xl border border-slate-100 border-dashed">
                    <ShieldAlert className="w-12 h-12 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-medium">No students currently registered.</p>
                </div>
            )}
        </div>
    );
};

export default StudentList;
