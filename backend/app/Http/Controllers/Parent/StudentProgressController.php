<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Http\Resources\StudentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class StudentProgressController extends Controller
{
    public function index()
    {
        // Only students linked to this parent user
        $students = Student::where('parent_id', Auth::id())->with('classroom', 'teacher', 'grades', 'attendances', 'behaviorReports')->get();
        return StudentResource::collection($students);
    }

    public function store(Request $request)
    {
        $request->validate([
            'student_name' => 'required|string',
            'classroom_id' => 'required|exists:classrooms,id',
            'roll_number' => 'nullable|string',
        ]);

        $classroom = \App\Models\Classroom::findOrFail($request->classroom_id);

        $student = Student::create([
            'student_name' => $request->student_name,
            'classroom_id' => $request->classroom_id,
            'parent_id' => Auth::id(),
            'teacher_id' => $classroom->teacher_id,
            'roll_number' => $request->roll_number,
        ]);

        return new StudentResource($student->load('classroom', 'teacher'));
    }
}
