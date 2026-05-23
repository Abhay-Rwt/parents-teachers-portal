import { useState, useEffect } from 'react';
import api from '../utils/api';
import { Bell, CheckCheck, Loader2, Info, AlertCircle } from 'lucide-react';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [markingAll, setMarkingAll] = useState(false);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const { data } = await api.get('/notifications');
            setNotifications(data.data || data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    const markRead = async (notification) => {
        if (notification.read_status) return;
        try {
            await api.patch(`/notifications/${notification.id}/read`);
            setNotifications(prev =>
                prev.map(n => n.id === notification.id ? { ...n, read_status: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const markAllRead = async () => {
        setMarkingAll(true);
        const unread = notifications.filter(n => !n.read_status);
        await Promise.all(unread.map(n => api.patch(`/notifications/${n.id}/read`).catch(() => {})));
        setNotifications(prev => prev.map(n => ({ ...n, read_status: true })));
        setMarkingAll(false);
    };

    const unreadCount = notifications.filter(n => !n.read_status).length;

    const timeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
        if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
        return `${Math.floor(seconds / 86400)}d ago`;
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <Bell className="w-6 h-6 text-primary-600" />
                        Notifications
                        {unreadCount > 0 && (
                            <span className="text-xs font-black bg-primary-600 text-white px-2.5 py-0.5 rounded-full">
                                {unreadCount}
                            </span>
                        )}
                    </h2>
                    <p className="text-slate-500 mt-1">Your recent activity and alerts</p>
                </div>
                {unreadCount > 0 && (
                    <button
                        onClick={markAllRead}
                        disabled={markingAll}
                        className="flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-primary-700 disabled:opacity-50 transition-all"
                    >
                        {markingAll ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCheck className="w-4 h-4" />}
                        Mark all read
                    </button>
                )}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-20 bg-slate-100 rounded-2xl animate-pulse" />
                    ))}
                </div>
            ) : notifications.length === 0 ? (
                <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-slate-200">
                    <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-400 font-medium">No notifications yet</p>
                    <p className="text-slate-300 text-sm mt-1">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {notifications.map(n => (
                        <div
                            key={n.id}
                            onClick={() => markRead(n)}
                            className={`flex items-start gap-4 p-5 rounded-2xl border transition-all cursor-pointer ${
                                n.read_status
                                    ? 'bg-white border-slate-100 opacity-70'
                                    : 'bg-primary-50 border-primary-100 hover:bg-primary-100 shadow-sm'
                            }`}
                        >
                            <div className={`p-2.5 rounded-xl flex-shrink-0 ${n.read_status ? 'bg-slate-100 text-slate-400' : 'bg-primary-100 text-primary-600'}`}>
                                {n.read_status ? <Info className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between gap-3">
                                    <p className={`font-bold text-sm ${n.read_status ? 'text-slate-500' : 'text-slate-800'}`}>
                                        {n.title}
                                    </p>
                                    <span className="text-[10px] font-bold text-slate-400 flex-shrink-0">
                                        {timeAgo(n.created_at)}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                            </div>
                            {!n.read_status && (
                                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 flex-shrink-0 mt-1" />
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;
