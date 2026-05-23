import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ClipboardList, Plus, Calendar, FileText, X, AlertCircle } from 'lucide-react';

const AssignmentManager = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        due_date: '',
        classroom_id: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [assignRes, classRes] = await Promise.all([
                api.get('/teacher/assignments'),
                api.get('/lookups/classrooms')
            ]);
            setAssignments(assignRes.data.data || assignRes.data);
            setClassrooms(classRes.data);
        } catch (error) {
            console.error('Error fetching data');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/teacher/assignments', formData);
            setShowModal(false);
            setFormData({ title: '', description: '', due_date: '', classroom_id: '' });
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to create assignment';
            alert(msg);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Assignment Manager</h2>
                    <p className="text-slate-500">Create and track student assignments</p>
                </div>
                <button 
                    onClick={() => setShowModal(true)}
                    className="bg-primary-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
                >
                    <Plus className="w-5 h-5" />
                    New Assignment
                </button>
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-800">New Assignment</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                                <input 
                                    type="text" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Classroom</label>
                                <select 
                                    required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.classroom_id} onChange={e => setFormData({...formData, classroom_id: e.target.value})}
                                >
                                    <option value="">Select a class</option>
                                    {classrooms.map(c => <option key={c.id} value={c.id}>{c.class_name} - {c.section}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Due Date</label>
                                <input 
                                    type="date" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={formData.due_date} onChange={e => setFormData({...formData, due_date: e.target.value})}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                                <textarea 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 min-h-[100px]"
                                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                                />
                            </div>
                            <button type="submit" className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 mt-4">
                                Publish Assignment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {assignments.map((assignment) => (
                    <div key={assignment.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                                    <ClipboardList className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-800">{assignment.title}</h3>
                                    <p className="text-xs text-slate-400">Class: {assignment.classroom?.class_name || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                        <p className="mt-4 text-slate-600 text-sm">{assignment.description || 'No instructions provided.'}</p>
                        <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                            <span className="flex items-center gap-2 text-xs font-bold text-slate-400">
                                <Calendar className="w-4 h-4" />
                                Due: {new Date(assignment.due_date).toLocaleDateString()}
                            </span>
                            <button className="text-primary-600 text-sm font-bold hover:underline">View Submissions</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AssignmentManager;
