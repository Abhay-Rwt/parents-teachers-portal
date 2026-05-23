import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, User, Users } from 'lucide-react';
import api from '../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'parent',
        child_name: '',
        roll_number: '',
        classroom_id: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [classrooms, setClassrooms] = useState([]);
    const { register } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch classrooms for the parent registration dropdown
        api.get('/public/classrooms').then(res => setClassrooms(res.data)).catch(() => {});
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        if (formData.password !== formData.password_confirmation) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await register(formData);
            navigate('/dashboard');
        } catch (err) {
            console.error('Registration Error:', err.response?.data);
            const errors = err.response?.data;
            if (errors && typeof errors === 'object') {
                const errorMessages = Object.values(errors).flat().join(' ');
                setError(errorMessages || 'Registration failed. Please check your details.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            <div className="hidden md:flex md:w-1/2 bg-primary-600 p-20 items-center justify-center text-white">
                <div className="max-w-md space-y-8">
                    <GraduationCap className="w-20 h-20" />
                    <h1 className="text-5xl font-extrabold leading-tight">Join our educational community.</h1>
                    <p className="text-primary-100 text-lg">Real-time progress tracking and direct communication between teachers and parents.</p>
                </div>
            </div>
            <div className="flex-1 flex items-center justify-center p-8 md:p-20 overflow-y-auto">
                <div className="max-w-md w-full space-y-8 py-10">
                    <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 transition-all font-medium">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
                        <p className="text-slate-500 mt-2">Sign up as a parent or teacher</p>
                    </div>
                    {error && <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm text-center border border-red-100">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Join as</label>
                                <select 
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none cursor-pointer"
                                    value={formData.role}
                                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                                >
                                    <option value="parent">Parent</option>
                                    <option value="teacher">Teacher</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Your Name"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                />
                            </div>
                        </div>

                        {formData.role === 'parent' && (
                            <div className="p-6 bg-primary-50 rounded-3xl space-y-4 border border-primary-100 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="flex items-center gap-2 text-primary-700 font-bold mb-2">
                                    <Users className="w-5 h-5" />
                                    Child's Information
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-primary-600 ml-1">Child's Full Name</label>
                                        <input
                                            type="text"
                                            required={formData.role === 'parent'}
                                            placeholder="Student Name"
                                            className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            value={formData.child_name}
                                            onChange={(e) => setFormData({...formData, child_name: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-primary-600 ml-1">Roll Number</label>
                                        <input
                                            type="text"
                                            required={formData.role === 'parent'}
                                            placeholder="e.g. S101"
                                            className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            value={formData.roll_number}
                                            onChange={(e) => setFormData({...formData, roll_number: e.target.value})}
                                        />
                                    </div>
                                    <div className="col-span-1 md:col-span-2 space-y-1">
                                        <label className="text-xs font-bold text-primary-600 ml-1">Select Classroom</label>
                                        <select
                                            required={formData.role === 'parent'}
                                            className="w-full px-4 py-3 bg-white border border-primary-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                            value={formData.classroom_id}
                                            onChange={(e) => setFormData({...formData, classroom_id: e.target.value})}
                                        >
                                            <option value="">Choose your child's class...</option>
                                            {classrooms.map(cls => (
                                                <option key={cls.id} value={cls.id}>
                                                    {cls.class_name} - {cls.section}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    placeholder="email@example.com"
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-sm font-bold text-slate-700 ml-1">Confirm</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                                        value={formData.password_confirmation}
                                        onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-primary-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all disabled:opacity-50"
                        >
                            {loading ? 'Creating Account...' : 'Continue to Dashboard'}
                        </button>
                    </form>
                    <p className="text-center text-slate-500">
                        Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:underline">Sign In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
