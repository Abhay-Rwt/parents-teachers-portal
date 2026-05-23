import { useAuth } from '../context/AuthContext';
import AdminDashboard from './Admin/AdminDashboard';
import TeacherDashboard from './Teacher/TeacherDashboard';
import ParentDashboard from './Parent/ParentDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    switch (user.role) {
        case 'admin':
            return <AdminDashboard />;
        case 'teacher':
            return <TeacherDashboard />;
        case 'parent':
            return <ParentDashboard />;
        default:
            return <div>Unauthorized</div>;
    }
};

export default Dashboard;
