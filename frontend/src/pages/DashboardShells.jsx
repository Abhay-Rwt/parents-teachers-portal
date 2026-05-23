import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Users, GraduationCap, School, ClipboardList, TrendingUp, Calendar, BookOpen, UserCheck } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color, bg }) => (
    <div className={`${bg || 'bg-white'} p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all`}>
        <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{label}</span>
            {Icon && <div className={`p-2.5 rounded-2xl ${bg ? 'bg-white/60' : 'bg-slate-50'}`}><Icon className={`w-5 h-5 ${color}`} /></div>}
        </div>
        <p className={`text-4xl font-black ${color}`}>{value ?? '—'}</p>
    </div>
);

export const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="p-8 text-red-500">Failed to load dashboard stats.</div>;
    if (!stats) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 bg-slate-100 rounded-xl w-48"></div>
            <div className="grid grid-cols-4 gap-6">{[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-3xl"></div>)}</div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-slate-800">Admin Overview</h2>
                <p className="text-slate-400 font-medium mt-1">Real-time school statistics</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Teachers" value={stats.total_teachers} icon={GraduationCap} color="text-primary-600" />
                <StatCard label="Parents" value={stats.total_parents} icon={Users} color="text-emerald-600" />
                <StatCard label="Students" value={stats.total_students} icon={UserCheck} color="text-indigo-600" />
                <StatCard label="Classrooms" value={stats.total_classes} icon={School} color="text-amber-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {[
                            { label: 'Manage Users', desc: 'View & moderate accounts', href: '/admin/users', color: 'bg-primary-50 text-primary-600' },
                            { label: 'Classrooms', desc: 'Create & manage classes', href: '/admin/classes', color: 'bg-indigo-50 text-indigo-600' },
                            { label: 'Subjects', desc: 'Add curriculum subjects', href: '/admin/subjects', color: 'bg-amber-50 text-amber-600' },
                            { label: 'Meetings', desc: 'View all appointments', href: '/meetings', color: 'bg-emerald-50 text-emerald-600' },
                        ].map(action => (
                            <Link key={action.href} to={action.href} className={`p-5 rounded-2xl ${action.color} hover:opacity-80 transition-all block`}>
                                <p className="font-black text-sm">{action.label}</p>
                                <p className="text-xs opacity-70 mt-0.5 font-medium">{action.desc}</p>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6">System Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-sm text-slate-500 font-medium">Total Users</span>
                            <span className="font-black text-slate-800">{(stats.total_teachers || 0) + (stats.total_parents || 0) + 1}</span>
                        </div>
                        <div className="flex justify-between items-center py-3 border-b border-slate-50">
                            <span className="text-sm text-slate-500 font-medium">Students per Class</span>
                            <span className="font-black text-slate-800">
                                {stats.total_classes > 0 ? Math.round((stats.total_students || 0) / stats.total_classes) : 0}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-3">
                            <span className="text-sm text-slate-500 font-medium">Portal Status</span>
                            <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase tracking-wider">Live</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const TeacherDashboard = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        api.get('/dashboard/stats')
            .then(res => setStats(res.data))
            .catch(() => setError(true));
    }, []);

    if (error) return <div className="p-8 text-red-500">Failed to load dashboard stats.</div>;
    if (!stats) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 bg-slate-100 rounded-xl w-48"></div>
            <div className="grid grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-3xl"></div>)}</div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-black text-slate-800">Teacher Dashboard</h2>
                <p className="text-slate-400 font-medium mt-1">Your class overview for today</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard label="My Students" value={stats.my_students} icon={GraduationCap} color="text-primary-600" />
                <StatCard label="Upcoming Meetings" value={stats.upcoming_meetings} icon={Calendar} color="text-emerald-600" />
                <StatCard label="Attendance Rate" value={stats.attendance_rate} icon={UserCheck} color="text-indigo-600" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6">Quick Actions</h3>
                    <div className="space-y-3">
                        {[
                            { label: 'View Students', href: '/teacher/students', color: 'bg-indigo-50 text-indigo-700' },
                            { label: 'Mark Attendance', href: '/teacher/attendance', color: 'bg-emerald-50 text-emerald-700' },
                            { label: 'Create Assignment', href: '/teacher/assignments', color: 'bg-primary-50 text-primary-700' },
                            { label: 'View Messages', href: '/messages', color: 'bg-slate-50 text-slate-700' },
                        ].map(a => (
                            <Link key={a.href} to={a.href} className={`block px-5 py-3.5 rounded-2xl ${a.color} font-bold text-sm hover:opacity-80 transition-all`}>
                                {a.label} →
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6">Upcoming Meetings</h3>
                    {stats.schedule && stats.schedule.length > 0 ? (
                        <div className="space-y-4">
                            {stats.schedule.map((m, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all">
                                    <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-xl flex flex-col items-center justify-center text-center flex-shrink-0">
                                        <span className="text-[8px] font-black uppercase">{new Date(m.meeting_date).toLocaleString('default', { month: 'short' })}</span>
                                        <span className="text-lg font-black leading-none">{new Date(m.meeting_date).getDate()}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-800 text-sm">{m.purpose}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{m.meeting_time} · {m.parent?.name}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-slate-300 space-y-2">
                            <Calendar className="w-8 h-8 opacity-40" />
                            <p className="text-sm font-medium">No meetings scheduled</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const ParentDashboard = () => {
    const [stats, setStats] = useState(null);
    const [selectedStudentId, setSelectedStudentId] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const url = selectedStudentId 
            ? `/dashboard/stats?student_id=${selectedStudentId}` 
            : '/dashboard/stats';
            
        api.get(url)
            .then(res => {
                setStats(res.data);
                if (!selectedStudentId && res.data.all_children?.length > 0) {
                    setSelectedStudentId(res.data.all_children[0].id);
                }
            })
            .catch(() => setError(true));
    }, [selectedStudentId]);

    if (error) return <div className="p-8 text-red-500">Failed to load dashboard stats.</div>;
    if (!stats) return (
        <div className="space-y-8 animate-pulse">
            <div className="h-8 bg-slate-100 rounded-xl w-64"></div>
            <div className="grid grid-cols-3 gap-6">{[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-3xl"></div>)}</div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-800">
                        {stats.child_name !== 'N/A' ? `${stats.child_name}'s Progress` : 'Parent Dashboard'}
                    </h2>
                    <p className="text-slate-400 font-medium mt-1">Academic summary and quick links</p>
                </div>

                {stats.all_children?.length > 1 && (
                    <div className="flex bg-slate-100 p-1.5 rounded-2xl gap-1">
                        {stats.all_children.map(child => (
                            <button
                                key={child.id}
                                onClick={() => setSelectedStudentId(child.id)}
                                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                                    selectedStudentId === child.id
                                        ? 'bg-white text-primary-600 shadow-sm'
                                        : 'text-slate-500 hover:text-slate-700'
                                }`}
                            >
                                {child.student_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <StatCard label="Latest Grade" value={stats.latest_grade || 'N/A'} icon={TrendingUp} color="text-emerald-600" />
                <StatCard label="Attendance" value={stats.attendance || 'N/A'} icon={UserCheck} color="text-primary-600" />
                <StatCard label="Pending Assignments" value={stats.pending_assignments ?? 0} icon={ClipboardList} color="text-amber-500" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-6">Quick Links</h3>
                    <div className="space-y-3">
                        {[
                            { label: "View Child's Progress", href: '/parent/progress', color: 'bg-primary-50 text-primary-700' },
                            { label: 'Message Teacher', href: '/messages', color: 'bg-indigo-50 text-indigo-700' },
                            { label: 'Request Meeting', href: '/meetings', color: 'bg-emerald-50 text-emerald-700' },
                        ].map(a => (
                            <Link key={a.href} to={a.href} className={`block px-5 py-3.5 rounded-2xl ${a.color} font-bold text-sm hover:opacity-80 transition-all`}>
                                {a.label} →
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                    <h3 className="font-black text-slate-800 mb-4">Student Info</h3>
                    {stats.child_name && stats.child_name !== 'N/A' ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                                <div className="w-14 h-14 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center font-black text-xl">
                                    {stats.child_name.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-black text-slate-800">{stats.child_name}</p>
                                    <p className="text-sm text-slate-400 font-medium">{stats.classroom_name || 'Class not assigned'}</p>
                                </div>
                            </div>
                            <div className="flex justify-between py-3 border-b border-slate-50">
                                <span className="text-sm text-slate-500 font-medium">Roll Number</span>
                                <span className="font-bold text-slate-800">{stats.roll_number || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between py-3">
                                <span className="text-sm text-slate-500 font-medium">Teacher</span>
                                <span className="font-bold text-slate-800">{stats.teacher_name || 'Not assigned'}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-slate-300 space-y-2">
                            <BookOpen className="w-8 h-8 opacity-40" />
                            <p className="text-sm font-medium">No student linked to your account</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
