<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Student;
use App\Http\Resources\AssignmentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    public function index()
    {
        $childClassroomIds = Student::where('parent_id', Auth::id())
            ->pluck('classroom_id')
            ->unique();

        $assignments = Assignment::whereIn('classroom_id', $childClassroomIds)
            ->with(['teacher', 'classroom'])
            ->latest()
            ->get();

        return AssignmentResource::collection($assignments);
    }
}
