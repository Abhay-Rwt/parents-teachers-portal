import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { ClipboardList, Calendar, FileText, AlertCircle, Loader2 } from 'lucide-react';

const ParentAssignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/parent/assignments');
            setAssignments(data.data || data);
        } catch (error) {
            console.error('Error fetching assignments', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Class Assignments</h2>
                    <p className="text-slate-500">View upcoming and previous tasks for your child's class</p>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
                </div>
            ) : assignments.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
                    <ClipboardList className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No assignments posted yet</p>
                </div>
            ) : (
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
                                        <p className="text-xs text-slate-400">Class: {assignment.classroom?.class_name} • {assignment.teacher?.name}</p>
                                    </div>
                                </div>
                                {new Date(assignment.due_date) < new Date() && (
                                    <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">Past Due</span>
                                )}
                            </div>
                            <p className="mt-4 text-slate-600 text-sm leading-relaxed">{assignment.description || 'No detailed instructions provided.'}</p>
                            <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                                <span className={`flex items-center gap-2 text-xs font-bold ${new Date(assignment.due_date) < new Date() ? 'text-red-400' : 'text-slate-400'}`}>
                                    <Calendar className="w-4 h-4" />
                                    Due: {new Date(assignment.due_date).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ParentAssignments;
