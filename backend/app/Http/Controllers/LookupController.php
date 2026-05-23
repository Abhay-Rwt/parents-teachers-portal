<?php

namespace App\Http\Controllers;

use App\Models\Classroom;
use App\Models\Subject;
use App\Models\User;
use Illuminate\Http\Request;

class LookupController extends Controller
{
    public function classrooms(Request $request)
    {
        $query = Classroom::query();
        
        // If teacher, only show their assigned classes
        if ($request->user() && $request->user()->role === 'teacher') {
            $query->where('teacher_id', $request->user()->id);
        }
        
        return response()->json($query->get());
    }

    public function subjects()
    {
        return response()->json(Subject::all());
    }

    public function parents(Request $request)
    {
        if ($request->user() && $request->user()->role === 'teacher') {
            // Only parents of students belonging to this teacher's classes
            $parentIds = \App\Models\Student::where('teacher_id', $request->user()->id)
                ->pluck('parent_id')
                ->unique();
            
            return response()->json(User::whereIn('id', $parentIds)->get(['id', 'name', 'email']));
        }

        return response()->json(User::where('role', 'parent')->get(['id', 'name', 'email']));
    }

    public function teachers(Request $request)
    {
        if ($request->user() && $request->user()->role === 'parent') {
            // Get teachers linked to this parent's students
            $teacherIds = \App\Models\Student::where('parent_id', $request->user()->id)
                ->pluck('teacher_id')
                ->unique();
            
            return response()->json(User::whereIn('id', $teacherIds)->get(['id', 'name', 'email']));
        }

        return response()->json(User::where('role', 'teacher')->get(['id', 'name', 'email']));
    }
}
