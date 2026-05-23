import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Award, Save, Loader2, Search, BookOpen, GraduationCap, CheckCircle2, AlertCircle } from 'lucide-react';

const GradeManager = () => {
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClass, setSelectedClass] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [students, setStudents] = useState([]);
    const [grades, setGrades] = useState({}); // { student_id: { marks: '', remarks: '' } }
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetchClassrooms();
    }, []);

    const fetchClassrooms = async () => {
        try {
            const { data } = await api.get('/lookups/classrooms');
            setClassrooms(data);
        } catch { }
    };

    const fetchSubjects = async () => {
        try {
            const { data } = await api.get('/lookups/subjects');
            setSubjects(data);
        } catch { }
    };

    const fetchStudentsAndGrades = async () => {
        if (!selectedClass || !selectedSubject) return;
        setLoading(true);
        try {
            const { data } = await api.get('/teacher/students');
            const classStudents = (data.data || data).filter(s => s.classroom?.id === parseInt(selectedClass));
            setStudents(classStudents);
            
            // Initialize grades with existing ones if possible, or empty
            const initialGrades = {};
            classStudents.forEach(s => {
                const existing = s.grades?.find(g => g.subject_id === parseInt(selectedSubject));
                initialGrades[s.id] = {
                    marks: existing?.marks || '',
                    remarks: existing?.remarks || ''
                };
            });
            setGrades(initialGrades);
        } catch {
            console.error('Error fetching students');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (selectedClass) fetchSubjects();
    }, [selectedClass]);

    useEffect(() => {
        fetchStudentsAndGrades();
    }, [selectedClass, selectedSubject]);

    const handleGradeChange = (studentId, field, value) => {
        setGrades(prev => ({
            ...prev,
            [studentId]: { ...prev[studentId], [field]: value }
        }));
    };

    const handleBulkSave = async () => {
        setSubmitting(true);
        setSuccess('');
        try {
            const payload = {
                subject_id: selectedSubject,
                grades: Object.keys(grades).map(id => ({
                    student_id: id,
                    marks: grades[id].marks,
                    remarks: grades[id].remarks
                })).filter(g => g.marks !== '')
            };
            await api.post('/teacher/grades/bulk', payload);
            setSuccess('Grades updated successfully!');
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            alert('Failed to save grades');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">Grade Management</h2>
                    <p className="text-slate-500 font-medium">Bulk award marks and feedback per subject</p>
                </div>
                {students.length > 0 && (
                    <button
                        onClick={handleBulkSave}
                        disabled={submitting}
                        className="w-full md:w-auto bg-primary-600 text-white px-8 py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 font-bold disabled:opacity-50"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save All Changes
                    </button>
                )}
            </div>

            {success && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl flex items-center gap-3 border border-emerald-100 shadow-sm animate-in slide-in-from-top-2">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="font-bold">{success}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <GraduationCap className="w-3 h-3" /> Select Classroom
                    </label>
                    <select
                        value={selectedClass}
                        onChange={e => setSelectedClass(e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-slate-700"
                    >
                        <option value="">Choose a class...</option>
                        {classrooms.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="w-3 h-3" /> Select Subject
                    </label>
                    <select
                        value={selectedSubject}
                        onChange={e => setSelectedSubject(e.target.value)}
                        disabled={!selectedClass}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-primary-500/10 transition-all font-bold text-slate-700 disabled:opacity-50"
                    >
                        <option value="">Choose a subject...</option>
                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 bg-white rounded-[32px] border border-slate-50 shadow-sm">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                    <p className="text-slate-400 font-bold">Loading students...</p>
                </div>
            ) : students.length > 0 ? (
                <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                                <th className="px-8 py-5 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest w-40">Marks (%)</th>
                                <th className="px-8 py-5 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Observations / Remarks</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {students.map((s) => (
                                <tr key={s.id} className="hover:bg-slate-50/50 transition-all group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-sm">
                                                {s.student_name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{s.student_name}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase">Roll: {s.roll_number || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <input
                                            type="number"
                                            min="0" max="100"
                                            placeholder="--"
                                            value={grades[s.id]?.marks || ''}
                                            onChange={e => handleGradeChange(s.id, 'marks', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-center font-black text-slate-700 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                        />
                                    </td>
                                    <td className="px-8 py-6">
                                        <input
                                            type="text"
                                            placeholder="Enter feedback..."
                                            value={grades[s.id]?.remarks || ''}
                                            onChange={e => handleGradeChange(s.id, 'remarks', e.target.value)}
                                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : selectedClass && selectedSubject && (
                <div className="p-20 text-center bg-white rounded-[32px] border border-dashed border-slate-200">
                    <AlertCircle className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No students found in this classroom.</p>
                </div>
            )}
        </div>
    );
};

export default GradeManager;
