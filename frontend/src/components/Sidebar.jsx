import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, BookOpen, Calendar, MessageSquare, Bell, LogOut, GraduationCap, ClipboardList, UserCheck, Award } from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const menuItems = {
        admin: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: Users, label: 'Manage Users', path: '/admin/users' },
            { icon: GraduationCap, label: 'Manage Classes', path: '/admin/classes' },
            { icon: BookOpen, label: 'Manage Subjects', path: '/admin/subjects' },
            { icon: Bell, label: 'Notifications', path: '/notifications' },
        ],
        teacher: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: Users, label: 'Students', path: '/teacher/students' },
            { icon: UserCheck, label: 'Attendance', path: '/teacher/attendance' },
            { icon: Award, label: 'Grades', path: '/teacher/grades' },
            { icon: ClipboardList, label: 'Assignments', path: '/teacher/assignments' },
            { icon: Calendar, label: 'Meetings', path: '/meetings' },
            { icon: MessageSquare, label: 'Messages', path: '/messages' },
            { icon: Bell, label: 'Notifications', path: '/notifications' },
        ],
        parent: [
            { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
            { icon: ClipboardList, label: 'Assignments', path: '/parent/assignments' },
            { icon: GraduationCap, label: 'Child Progress', path: '/parent/progress' },
            { icon: MessageSquare, label: 'Teacher Inbox', path: '/messages' },
            { icon: Calendar, label: 'Meetings', path: '/meetings' },
            { icon: Bell, label: 'Notifications', path: '/notifications' },
        ]
    };

    const currentItems = menuItems[user?.role] || [];

    return (
        <div className="w-64 bg-white min-h-screen border-r border-slate-200 flex flex-col">
            <div className="p-6 border-b border-slate-50">
                <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
                    <GraduationCap className="w-8 h-8" />
                    EduPortal
                </h1>
            </div>
            <nav className="flex-1 p-4 space-y-1">
                {currentItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            location.pathname === item.path
                                ? 'bg-primary-50 text-primary-600 font-semibold'
                                : 'text-slate-600 hover:bg-slate-50'
                        }`}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>
            <div className="p-4 border-t border-slate-50 mt-auto">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-all"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
