<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Grade;
use App\Models\Student;
use App\Http\Resources\GradeResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class GradeController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:students,id',
            'subject_id' => 'required|exists:subjects,id',
            'marks' => 'required|numeric',
            'grade' => 'nullable|string',
            'remarks' => 'nullable|string',
        ]);

        $student = Student::findOrFail($request->student_id);
        if ($student->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $grade = Grade::create($request->all());
        return new GradeResource($grade);
    }

    public function bulkStore(Request $request)
    {
        $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'grades' => 'required|array',
            'grades.*.student_id' => 'required|exists:students,id',
            'grades.*.marks' => 'required|numeric',
            'grades.*.remarks' => 'nullable|string',
        ]);

        $created = [];
        foreach ($request->grades as $g) {
            $student = Student::findOrFail($g['student_id']);
            if ($student->teacher_id !== Auth::id()) continue;

            $grade = Grade::updateOrCreate(
                ['student_id' => $g['student_id'], 'subject_id' => $request->subject_id],
                [
                    'marks' => $g['marks'],
                    'remarks' => $g['remarks'] ?? null,
                    'grade' => $this->calculateGrade($g['marks'])
                ]
            );
            $created[] = $grade;

            // Notify parent
            \App\Models\Notification::create([
                'user_id' => $student->parent_id,
                'title' => 'New Grade Posted',
                'body' => 'A new grade has been posted for ' . $student->student_name . ' in ' . $grade->subject?->name . '.',
            ]);
        }

        return GradeResource::collection($created);
    }

    private function calculateGrade($marks)
    {
        if ($marks >= 90) return 'A+';
        if ($marks >= 80) return 'A';
        if ($marks >= 70) return 'B';
        if ($marks >= 60) return 'C';
        if ($marks >= 50) return 'D';
        return 'F';
    }

    public function update(Request $request, Grade $grade)
    {
        if ($grade->student->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $grade->update(array_merge($request->all(), [
            'grade' => isset($request->marks) ? $this->calculateGrade($request->marks) : $grade->grade
        ]));
        return new GradeResource($grade);
    }

    public function destroy(Grade $grade)
    {
        if ($grade->student->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $grade->delete();
        return response()->json(['message' => 'Grade deleted successfully']);
    }
}
