<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Http\Resources\MeetingResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MeetingController extends Controller
{
    public function index()
    {
        $meetings = Meeting::where('teacher_id', Auth::id())
            ->orWhere('parent_id', Auth::id())
            ->with(['teacher', 'parent'])
            ->latest()
            ->get();
        return MeetingResource::collection($meetings);
    }

    public function store(Request $request)
    {
        $role = Auth::user()->role;
        $request->validate([
            'teacher_id' => $role === 'parent' ? 'required|exists:users,id' : 'nullable|exists:users,id',
            'parent_id' => $role === 'teacher' ? 'required|exists:users,id' : 'nullable|exists:users,id',
            'meeting_date' => 'required|date',
            'meeting_time' => 'required',
            'meeting_type' => 'required|string',
            'purpose' => 'required|string',
        ]);

        $teacherId = $role === 'parent' ? $request->teacher_id : Auth::id();
        $parentId = $role === 'teacher' ? $request->parent_id : Auth::id();

        // Security Check: Ensure valid link
        $studentExists = \App\Models\Student::where('parent_id', $parentId)
            ->where('teacher_id', $teacherId)
            ->exists();
        
        if (!$studentExists) {
            return response()->json(['message' => 'You can only schedule meetings between teachers and parents of the same students.'], 403);
        }

        $meeting = Meeting::create([
            'teacher_id' => $teacherId,
            'parent_id' => $parentId,
            'meeting_date' => $request->meeting_date,
            'meeting_time' => $request->meeting_time,
            'meeting_type' => $request->meeting_type,
            'purpose' => $request->purpose,
            'status' => 'pending',
            'initiated_by' => $role,
        ]);

        // Notify the receiver
        \App\Models\Notification::create([
            'user_id' => $role === 'parent' ? $meeting->teacher_id : $meeting->parent_id,
            'title' => 'New Meeting Request',
            'body' => Auth::user()->name . ' has requested a meeting on ' . $meeting->meeting_date . '.',
        ]);

        return new MeetingResource($meeting->load(['teacher', 'parent']));
    }

    public function updateStatus(Request $request, Meeting $meeting)
    {
        $request->validate(['status' => 'required|in:approved,rejected,completed']);
        $user = Auth::user();

        // Only the receiver can approve/reject
        if (in_array($request->status, ['approved', 'rejected'])) {
            if ($meeting->initiated_by === $user->role) {
                return response()->json(['message' => 'You cannot approve your own request.'], 403);
            }
        }

        // Only the teacher or parent involved can update
        if ($meeting->teacher_id !== $user->id && $meeting->parent_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $meeting->update(['status' => $request->status]);

        // Notify the requester about the status change
        \App\Models\Notification::create([
            'user_id' => $meeting->initiated_by === 'parent' ? $meeting->parent_id : $meeting->teacher_id,
            'title' => 'Meeting ' . ucfirst($request->status),
            'body' => Auth::user()->name . ' has ' . $request->status . ' the meeting request for ' . $meeting->meeting_date . '.',
        ]);

        return new MeetingResource($meeting);
    }
}
