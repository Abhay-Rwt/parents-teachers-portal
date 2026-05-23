import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import ClassroomManagement from './pages/Admin/ClassroomManagement';
import SubjectManagement from './pages/Admin/SubjectManagement';
import StudentList from './pages/Teacher/StudentList';
import AttendanceTracker from './pages/Teacher/AttendanceTracker';
import GradeManager from './pages/Teacher/GradeManager';
import AssignmentManager from './pages/Teacher/AssignmentManager';
import StudentProgress from './pages/Parent/StudentProgress';
import ParentAssignments from './pages/Parent/Assignments';
import Messages from './pages/Messages';
import Meetings from './pages/Meetings';
import Notifications from './pages/Notifications';
import DashboardLayout from './layouts/DashboardLayout';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              
              {/* Admin Routes */}
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/classes" element={<ClassroomManagement />} />
              <Route path="/admin/subjects" element={<SubjectManagement />} />

              {/* Teacher Routes */}
              <Route path="/teacher/students" element={<StudentList />} />
              <Route path="/teacher/attendance" element={<AttendanceTracker />} />
              <Route path="/teacher/grades" element={<GradeManager />} />
              <Route path="/teacher/assignments" element={<AssignmentManager />} />

              {/* Parent Routes */}
              <Route path="/parent/progress" element={<StudentProgress />} />
              <Route path="/parent/assignments" element={<ParentAssignments />} />

              {/* Common Routes */}
              <Route path="/messages" element={<Messages />} />
              <Route path="/meetings" element={<Meetings />} />
              <Route path="/notifications" element={<Notifications />} />

              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
