import { Link } from 'react-router-dom';
import { GraduationCap, Users, MessageSquare, CheckCircle, ArrowRight } from 'lucide-react';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Navigation */}
            <nav className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 md:px-20 sticky top-0 z-50">
                <div className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 text-primary-600" />
                    <span className="text-xl font-bold text-slate-800">EduPortal</span>
                </div>
                <div className="flex items-center gap-6">
                    <Link to="/login" className="text-slate-600 font-medium hover:text-primary-600 transition-all">Login</Link>
                    <Link to="/register" className="bg-primary-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all">Get Started</Link>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="py-20 px-8 md:px-20 text-center space-y-8">
                <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full text-sm font-bold">
                    <span className="flex h-2 w-2 rounded-full bg-primary-600 animate-pulse"></span>
                    Modern Communication for Schools
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 leading-tight">
                    Connecting <span className="text-primary-600">Parents</span> and <br />
                    <span className="text-indigo-600">Teachers</span> seamlessly.
                </h1>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                    A complete portal for student progress tracking, real-time messaging, attendance management, and parent-teacher meetings.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/register" className="bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-primary-700 shadow-xl shadow-primary-200 flex items-center gap-2 transition-all group">
                        Join Your School
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link to="/login" className="bg-white border border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                        Admin Login
                    </Link>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-8 md:px-20 bg-white">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <FeatureCard 
                        icon={<Users className="w-8 h-8 text-indigo-500" />}
                        title="Student Tracking"
                        desc="Detailed analytics on attendance, grades, and behavioral reports in one dashboard."
                    />
                    <FeatureCard 
                        icon={<MessageSquare className="w-8 h-8 text-primary-500" />}
                        title="Secure Messaging"
                        desc="Instant end-to-end communication between parents and educators."
                    />
                    <FeatureCard 
                        icon={<CheckCircle className="w-8 h-8 text-emerald-500" />}
                        title="Easy Scheduling"
                        desc="Book parent-teacher meetings and check school announcements effortlessly."
                    />
                </div>
            </section>
        </div>
    );
};

const FeatureCard = ({ icon, title, desc }) => (
    <div className="p-8 rounded-3xl border border-slate-100 hover:border-primary-100 hover:shadow-2xl hover:shadow-primary-100/30 transition-all group">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;
