<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\User;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentController extends Controller
{
    public function index()
    {
        // Only students assigned to this teacher
        $students = Student::where('teacher_id', Auth::id())->with('classroom', 'parent')->get();
        if (Auth::user()->role === 'admin') {
            $students = Student::with('classroom', 'parent', 'teacher')->get();
        }
        return StudentResource::collection($students);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_name' => 'required|string|max:255',
            'roll_number' => 'required|string|unique:students',
            'classroom_id' => 'required|exists:classrooms,id',
            'parent_id' => 'required|exists:users,id',
        ]);

        $student = Student::create(array_merge($request->all(), [
            'teacher_id' => Auth::user()->role === 'teacher' ? Auth::id() : User::where('role', 'teacher')->first()?->id
        ]));

        return new StudentResource($student);
    }

    public function show(Student $student)
    {
        if ($student->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        return new StudentResource($student->load('classroom', 'parent', 'grades', 'attendances', 'behaviorReports'));
    }

    public function update(Request $request, Student $student)
    {
        if ($student->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $student->update($request->all());
        return new StudentResource($student);
    }
}
