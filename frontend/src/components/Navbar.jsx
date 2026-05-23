import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User, Loader2 } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (user) {
            fetchUnreadCount();
            const interval = setInterval(fetchUnreadCount, 30000); // Poll every 30s
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchUnreadCount = async () => {
        try {
            const { data } = await api.get('/notifications');
            const notifications = data.data || data;
            const count = notifications.filter(n => !n.read_status).length;
            setUnreadCount(count);
        } catch (error) {
            console.error('Error fetching notifications count', error);
        }
    };

    return (
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 min-w-[300px]">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-transparent border-none outline-none text-sm w-full"
                />
            </div>
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => navigate('/notifications')}
                    className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-xl transition-all"
                >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-black rounded-full border-2 border-white flex items-center justify-center px-1">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </button>
                <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
                    <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                        <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold">
                        {user?.name?.charAt(0)}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
