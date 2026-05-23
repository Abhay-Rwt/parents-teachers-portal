import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { BookOpen, Plus, X, Trash2, AlertCircle, Loader2, Tag } from 'lucide-react';

const SubjectManagement = () => {
    const [subjects, setSubjects] = useState([]);
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', classroom_id: '', description: '' });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [subRes, classRes] = await Promise.all([
                api.get('/admin/subjects'),
                api.get('/lookups/classrooms')
            ]);
            setSubjects(subRes.data.data || subRes.data);
            setClassrooms(classRes.data);
        } catch {
            console.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('/admin/subjects', formData);
            setShowModal(false);
            setFormData({ name: '', classroom_id: '', description: '' });
            fetchData();
        } catch (err) {
            const msg = err.response?.data;
            setError(msg && typeof msg === 'object' ? Object.values(msg).flat().join(' ') : 'Failed to create subject.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this subject?')) return;
        try {
            await api.delete(`/admin/subjects/${id}`);
            fetchData();
        } catch {
            alert('Failed to delete subject');
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Subject Management</h2>
                    <p className="text-slate-500">Define curriculum subjects for each classroom</p>
                </div>
                <button
                    onClick={() => { setShowModal(true); setError(''); }}
                    className="bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 font-bold"
                >
                    <Plus className="w-5 h-5" /> Add Subject
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-800">Add New Subject</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Subject Name</label>
                                <input
                                    type="text" required placeholder="e.g. Mathematics"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Assign to Classroom</label>
                                <select
                                    required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.classroom_id} onChange={e => setFormData({ ...formData, classroom_id: e.target.value })}
                                >
                                    <option value="">Select a classroom</option>
                                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description (Optional)</label>
                                <textarea
                                    placeholder="Brief subject description..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit" disabled={submitting}
                                className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Adding...</> : 'Add Subject'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Subject</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Classroom</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {subjects.map((sub) => (
                                <tr key={sub.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl">
                                                <BookOpen className="w-5 h-5" />
                                            </div>
                                            <span className="font-bold text-slate-800">{sub.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600">
                                            <Tag className="w-3 h-3" />
                                            {sub.classroom?.class_name} - {sub.classroom?.section}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className="text-sm text-slate-400">{sub.description || '—'}</span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <button
                                            onClick={() => handleDelete(sub.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {subjects.length === 0 && !loading && (
                    <div className="p-16 text-center space-y-3">
                        <BookOpen className="w-10 h-10 text-slate-200 mx-auto" />
                        <p className="text-slate-400 font-medium">No subjects yet. Add your first one!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectManagement;
