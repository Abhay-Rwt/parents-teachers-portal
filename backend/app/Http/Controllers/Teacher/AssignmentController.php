<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Http\Resources\AssignmentResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AssignmentController extends Controller
{
    public function index()
    {
        return AssignmentResource::collection(Assignment::where('teacher_id', Auth::id())->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'classroom_id' => 'required|exists:classrooms,id',
            'due_date' => 'required|date',
        ]);

        // Verify the classroom belongs to this teacher
        $classroom = \App\Models\Classroom::findOrFail($request->classroom_id);
        if ($classroom->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized. You can only create assignments for your assigned classes.'], 403);
        }

        $assignment = Assignment::create(array_merge($request->all(), ['teacher_id' => Auth::id()]));

        // Notify all parents in this classroom
        $parentIds = \App\Models\Student::where('classroom_id', $request->classroom_id)
            ->pluck('parent_id')
            ->unique();
        
        foreach ($parentIds as $parentId) {
            \App\Models\Notification::create([
                'user_id' => $parentId,
                'title' => 'New Assignment Posted',
                'body' => 'A new assignment "' . $assignment->title . '" has been posted for your child\'s class.',
            ]);
        }

        return new AssignmentResource($assignment);
    }

    public function update(Request $request, Assignment $assignment)
    {
        if ($assignment->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $assignment->update($request->all());
        return new AssignmentResource($assignment);
    }

    public function destroy(Assignment $assignment)
    {
        if ($assignment->teacher_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $assignment->delete();
        return response()->json(['message' => 'Assignment deleted successfully']);
    }
}
