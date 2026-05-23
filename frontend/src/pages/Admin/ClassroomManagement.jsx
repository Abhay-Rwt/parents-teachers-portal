import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { School, Plus, X, Trash2, AlertCircle, Loader2, Edit2 } from 'lucide-react';

const ClassroomManagement = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [teachers, setTeachers] = useState([]);
    const [editingClass, setEditingClass] = useState(null);
    const [formData, setFormData] = useState({ class_name: '', section: '', grade_level: '', teacher_id: '' });
    const [error, setError] = useState('');

    useEffect(() => { 
        fetchClasses(); 
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const { data } = await api.get('/lookups/teachers');
            setTeachers(data);
        } catch { }
    };

    const fetchClasses = async () => {
        try {
            const { data } = await api.get('/admin/classrooms');
            setClasses(data.data || data);
        } catch (error) {
            console.error('Error fetching classes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            if (editingClass) {
                await api.patch(`/admin/classrooms/${editingClass.id}`, formData);
            } else {
                await api.post('/admin/classrooms', formData);
            }
            setShowModal(false);
            setEditingClass(null);
            setFormData({ class_name: '', section: '', grade_level: '', teacher_id: '' });
            fetchClasses();
        } catch (err) {
            const msg = err.response?.data;
            setError(msg && typeof msg === 'object' ? Object.values(msg).flat().join(' ') : 'Failed to save classroom.');
        } finally {
            setSubmitting(false);
        }
    };

    const openEdit = (cls) => {
        setEditingClass(cls);
        setFormData({
            class_name: cls.class_name,
            section: cls.section,
            grade_level: cls.grade_level || '',
            teacher_id: cls.teacher_id || ''
        });
        setShowModal(true);
        setError('');
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this classroom?')) return;
        try {
            await api.delete(`/admin/classrooms/${id}`);
            fetchClasses();
        } catch {
            alert('Failed to delete classroom');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Classroom Management</h2>
                    <p className="text-slate-500">Create and organize school classes and sections</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setError(''); }}
                    className="bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 font-bold"
                >
                    <Plus className="w-5 h-5" /> New Class
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-800">{editingClass ? 'Edit Classroom' : 'Create New Classroom'}</h3>
                            <button onClick={() => { setShowModal(false); setEditingClass(null); }} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Class Name</label>
                                <input
                                    type="text" required placeholder="e.g. Grade 5 - A"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.class_name} onChange={e => setFormData({ ...formData, class_name: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Section</label>
                                    <input
                                        type="text" required placeholder="e.g. A"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.section} onChange={e => setFormData({ ...formData, section: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Grade Level</label>
                                    <input
                                        type="text" placeholder="e.g. 5"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.grade_level} onChange={e => setFormData({ ...formData, grade_level: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Assign Teacher</label>
                                <select
                                    required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.teacher_id} onChange={e => setFormData({ ...formData, teacher_id: e.target.value })}
                                >
                                    <option value="">Select a teacher...</option>
                                    {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                </select>
                            </div>
                             <button
                                type="submit" disabled={submitting}
                                className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : (editingClass ? 'Update Classroom' : 'Create Classroom')}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-all group-hover:scale-150 opacity-60"></div>
                        <div className="flex justify-between items-start mb-6 relative">
                            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                                <School className="w-7 h-7" />
                            </div>
                            <div className="flex items-center gap-2 relative">
                                <button
                                    onClick={() => openEdit(cls)}
                                    className="p-2 text-slate-300 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
                                    title="Edit Classroom"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(cls.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete Classroom"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 relative">{cls.class_name}</h3>
                        <p className="text-slate-400 text-sm font-semibold mt-1 relative">Section {cls.section}{cls.grade_level ? ` · Grade ${cls.grade_level}` : ''}</p>
                        <div className="mt-6 pt-4 border-t border-slate-50 flex items-center justify-between text-sm relative">
                            <div className="flex flex-col">
                                <span className="text-slate-400 font-medium">{cls.students_count ?? 0} students</span>
                                <span className="text-xs font-bold text-slate-700">Teacher: {cls.teacher?.name || 'TBD'}</span>
                            </div>
                            <span className="text-[10px] font-black text-primary-500 bg-primary-50 px-3 py-1 rounded-full uppercase tracking-wider">Active</span>
                        </div>
                    </div>
                ))}
            </div>

            {classes.length === 0 && !loading && (
                <div className="p-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed space-y-3">
                    <School className="w-12 h-12 text-slate-200 mx-auto" />
                    <p className="text-slate-400 font-medium">No classrooms yet. Create your first one!</p>
                </div>
            )}
        </div>
    );
};

export default ClassroomManagement;
