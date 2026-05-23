<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Student;
use App\Http\Resources\AttendanceResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    public function index(Request $request)
    {
        $request->validate(['date' => 'required|date']);
        $attendances = Attendance::where('date', $request->date)
            ->whereHas('student', function($q) {
                $q->where('teacher_id', Auth::id());
            })->get();
        return AttendanceResource::collection($attendances);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'status' => 'required|string',
            'date' => 'required|date',
        ]);

        $student = Student::findOrFail($request->student_id);
        if ($student->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $attendance = Attendance::updateOrCreate(
            ['student_id' => $request->student_id, 'date' => $request->date],
            ['status' => $request->status]
        );
        return new AttendanceResource($attendance);
    }

    public function update(Request $request, Attendance $attendance)
    {
        if ($attendance->student->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $attendance->update($request->all());
        return new AttendanceResource($attendance);
    }
}
