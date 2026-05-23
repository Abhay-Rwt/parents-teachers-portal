import { useState, useEffect } from 'react';
import api from '../../utils/api';
import { Search, Shield, ShieldCheck, Mail, Users } from 'lucide-react';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data.data || data);
        } catch (error) {
            console.error('Error fetching users');
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (user) => {
        try {
            await api.patch(`/admin/users/${user.id}/toggle-status`);
            fetchUsers();
        } catch (error) {
            console.error('Error toggling status');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">User Directory</h2>
                    <p className="text-slate-500">Monitor and manage all registered portal members</p>
                </div>
                <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search members..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-50/50 border-b border-slate-100">
                            <tr>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">User Profile</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest">Access Role</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Account Status</th>
                                <th className="px-8 py-5 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Moderation</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-800">{user.name}</p>
                                                <p className="text-xs font-medium text-slate-400">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                                            user.role === 'teacher' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                                        }`}>
                                            {user.role === 'admin' ? <ShieldCheck className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-center">
                                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                            user.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        {user.id !== 1 && ( // Prevent blocking root admin
                                            <button 
                                                onClick={() => toggleStatus(user)}
                                                className={`text-xs font-black uppercase tracking-widest py-2 px-4 rounded-xl transition-all ${
                                                    user.status === 'active' 
                                                    ? 'text-red-500 hover:bg-red-50' 
                                                    : 'text-emerald-500 hover:bg-emerald-50'
                                                }`}
                                            >
                                                {user.status === 'active' ? 'Revoke Access' : 'Restore Access'}
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredUsers.length === 0 && !loading && (
                    <div className="p-20 text-center space-y-4">
                        <Users className="w-12 h-12 text-slate-200 mx-auto" />
                        <p className="text-slate-400 font-medium">No users found matching your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
