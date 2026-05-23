<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Student;
use App\Models\Classroom;
use App\Models\Assignment;
use App\Models\Attendance;
use App\Models\Grade;
use App\Models\Message;
use App\Models\Meeting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $stats = [];

        if ($user->role === 'admin') {
            $stats = [
                'total_teachers' => User::where('role', 'teacher')->count(),
                'total_parents' => User::where('role', 'parent')->count(),
                'total_students' => Student::count(),
                'total_classes' => Classroom::count(),
            ];
        } elseif ($user->role === 'teacher') {
            $studentCount = Student::where('teacher_id', $user->id)->count();
            $today = now()->toDateString();

            // Calculate real attendance rate for today
            $presentToday = Attendance::where('date', $today)
                ->where('status', 'present')
                ->whereHas('student', fn($q) => $q->where('teacher_id', $user->id))
                ->count();
            $attendanceRate = $studentCount > 0
                ? round(($presentToday / $studentCount) * 100) . '%'
                : 'N/A';

            $stats = [
                'my_students' => $studentCount,
                'upcoming_meetings' => Meeting::where('teacher_id', $user->id)
                    ->whereIn('status', ['pending', 'approved'])
                    ->count(),
                'attendance_rate' => $attendanceRate,
                'schedule' => Meeting::where('teacher_id', $user->id)
                    ->whereIn('status', ['pending', 'approved'])
                    ->with('parent')
                    ->orderBy('meeting_date')
                    ->take(3)
                    ->get(),
            ];
        } elseif ($user->role === 'parent') {
            $students = Student::where('parent_id', $user->id)->get(['id', 'student_name']);
            $studentId = $request->query('student_id') ?: ($students->first()?->id);

            $student = $studentId 
                ? Student::where('id', $studentId)
                    ->where('parent_id', $user->id)
                    ->with('classroom', 'teacher', 'grades', 'attendances')
                    ->first()
                : null;

            if ($student) {
                // Calculate real attendance percentage
                $totalDays = $student->attendances->count();
                $presentDays = $student->attendances->where('status', 'present')->count();
                $attendancePct = $totalDays > 0 ? round(($presentDays / $totalDays) * 100) . '%' : 'N/A';

                // Latest grade
                $latestGrade = $student->grades->sortByDesc('created_at')->first();

                // Pending assignments (assignments for student's class)
                $pendingAssignments = $student->classroom_id
                    ? Assignment::where('classroom_id', $student->classroom_id)->count()
                    : 0;

                $stats = [
                    'child_name' => $student->student_name,
                    'roll_number' => $student->roll_number,
                    'classroom_name' => $student->classroom?->class_name,
                    'teacher_name' => $student->teacher?->name,
                    'latest_grade' => $latestGrade ? $latestGrade->marks . '%' : 'N/A',
                    'attendance' => $attendancePct,
                    'pending_assignments' => $pendingAssignments,
                    'all_children' => $students,
                ];
            } else {
                $stats = [
                    'child_name' => 'N/A',
                    'roll_number' => null,
                    'classroom_name' => null,
                    'teacher_name' => null,
                    'latest_grade' => 'N/A',
                    'attendance' => 'N/A',
                    'pending_assignments' => 0,
                    'all_children' => $students,
                ];
            }
        }

        return response()->json($stats);
    }
}
