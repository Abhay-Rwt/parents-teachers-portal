import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Calendar, Clock, Video, Plus, Check, X, Loader2, AlertCircle, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Meetings = () => {
    const [meetings, setMeetings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [lookups, setLookups] = useState([]); // Can be teachers or parents
    const [actionLoading, setActionLoading] = useState(null);
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        teacher_id: '',
        parent_id: '',
        meeting_date: '',
        meeting_time: '',
        meeting_type: 'online',
        purpose: '',
    });

    useEffect(() => {
        fetchMeetings();
        fetchLookups();
    }, [user]);

    const fetchMeetings = async () => {
        try {
            const { data } = await api.get('/meetings');
            setMeetings(data.data || data);
        } catch {
            console.error('Error fetching meetings');
        } finally {
            setLoading(false);
        }
    };

    const fetchLookups = async () => {
        try {
            const endpoint = user?.role === 'parent' ? '/lookups/teachers' : '/lookups/parents';
            const { data } = await api.get(endpoint);
            setLookups(data);
        } catch { }
    };

    const handleRequest = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        try {
            await api.post('/meetings', formData);
            setShowModal(false);
            setFormData({ teacher_id: '', parent_id: '', meeting_date: '', meeting_time: '', meeting_type: 'online', purpose: '' });
            fetchMeetings();
        } catch (err) {
            const msg = err.response?.data;
            setError(msg && typeof msg === 'object' ? Object.values(msg).flat().join(' ') : 'Failed to request meeting.');
        } finally {
            setSubmitting(false);
        }
    };

    const updateStatus = async (meeting, status) => {
        setActionLoading(meeting.id + status);
        try {
            await api.patch(`/meetings/${meeting.id}/status`, { status });
            fetchMeetings();
        } catch {
            alert('Failed to update meeting status');
        } finally {
            setActionLoading(null);
        }
    };

    const statusBadge = (status) => {
        const map = {
            pending: 'bg-amber-100 text-amber-700',
            approved: 'bg-emerald-100 text-emerald-700',
            rejected: 'bg-red-100 text-red-700',
            completed: 'bg-slate-100 text-slate-600',
        };
        return map[status] || 'bg-slate-100 text-slate-600';
    };

    const canApprove = (meeting) => {
        if (meeting.status !== 'pending') return false;
        // Only receiver can approve
        return meeting.initiated_by !== user.role;
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Meeting Schedule</h2>
                    <p className="text-slate-500">Manage parent-teacher appointments</p>
                </div>
                {(user?.role === 'parent' || user?.role === 'teacher') && (
                    <button
                        onClick={() => { setShowModal(true); setError(''); }}
                        className="bg-primary-600 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 font-bold"
                    >
                        <Plus className="w-5 h-5" /> Request Meeting
                    </button>
                )}
            </div>

            {showModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="font-bold text-xl text-slate-800">Request Meeting</h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X /></button>
                        </div>
                        <form onSubmit={handleRequest} className="p-6 space-y-4">
                            {error && (
                                <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">
                                    {user?.role === 'parent' ? 'Select Teacher' : 'Select Parent'}
                                </label>
                                <select
                                    required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                    value={user?.role === 'parent' ? formData.teacher_id : formData.parent_id} 
                                    onChange={e => setFormData({ ...formData, [user?.role === 'parent' ? 'teacher_id' : 'parent_id']: e.target.value })}
                                >
                                    <option value="">Choose {user?.role === 'parent' ? 'teacher' : 'parent'}...</option>
                                    {lookups.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Date</label>
                                    <input
                                        type="date" required min={new Date().toISOString().split('T')[0]}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.meeting_date} onChange={e => setFormData({ ...formData, meeting_date: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Time</label>
                                    <input
                                        type="time" required
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.meeting_time} onChange={e => setFormData({ ...formData, meeting_time: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-1">Meeting Type</label>
                                    <select
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500"
                                        value={formData.meeting_type} onChange={e => setFormData({ ...formData, meeting_type: e.target.value })}
                                    >
                                        <option value="online">Online (Video Call)</option>
                                        <option value="in-person">In-Person</option>
                                        <option value="phone">Phone Call</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-1">Purpose</label>
                                <textarea
                                    required placeholder="Briefly describe the objective..."
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 min-h-[80px]"
                                    value={formData.purpose} onChange={e => setFormData({ ...formData, purpose: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit" disabled={submitting}
                                className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Sending...</> : 'Send Request'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <div className="space-y-4">
                {meetings.map((meeting) => (
                    <div key={meeting.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100">
                                    <span className="text-[10px] font-black text-slate-400 uppercase">
                                        {new Date(meeting.meeting_date).toLocaleString('default', { month: 'short' })}
                                    </span>
                                    <span className="text-2xl font-black text-slate-800">
                                        {new Date(meeting.meeting_date).getDate()}
                                    </span>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-slate-800 text-lg">{meeting.purpose}</h3>
                                        <p className="text-[10px] font-black text-primary-500 bg-primary-50 px-2 py-0.5 rounded-lg uppercase tracking-tighter">
                                            Req by {meeting.initiated_by}
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3 mt-1">
                                        <span className="flex items-center gap-1 text-sm text-slate-400 font-medium">
                                            <Clock className="w-4 h-4" />
                                            {meeting.meeting_time}
                                        </span>
                                        <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                            meeting.meeting_type === 'online' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-500'
                                        }`}>
                                            {meeting.meeting_type === 'online' && <Video className="w-3 h-3" />}
                                            {meeting.meeting_type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2 font-medium flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {user.role === 'parent'
                                            ? `Teacher: ${meeting.teacher?.name || 'N/A'}`
                                            : `Parent: ${meeting.parent?.name || 'N/A'}`}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${statusBadge(meeting.status)}`}>
                                    {meeting.status}
                                </span>
                                {canApprove(meeting) && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(meeting, 'approved')}
                                            disabled={actionLoading === meeting.id + 'approved'}
                                            className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all disabled:opacity-50"
                                            title="Approve"
                                        >
                                            {actionLoading === meeting.id + 'approved' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => updateStatus(meeting, 'rejected')}
                                            disabled={actionLoading === meeting.id + 'rejected'}
                                            className="p-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
                                            title="Reject"
                                        >
                                            {actionLoading === meeting.id + 'rejected' ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                                        </button>
                                    </>
                                )}
                                {meeting.status === 'approved' && (
                                    <button
                                        onClick={() => updateStatus(meeting, 'completed')}
                                        className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-200 transition-all"
                                    >
                                        Mark Done
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Meetings;
