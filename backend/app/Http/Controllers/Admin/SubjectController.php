<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use App\Http\Resources\SubjectResource;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        return SubjectResource::collection(Subject::with('classroom')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'classroom_id' => 'required|exists:classrooms,id',
        ]);

        $subject = Subject::create($request->all());
        return new SubjectResource($subject);
    }

    public function show(Subject $subject)
    {
        return new SubjectResource($subject->load('classroom'));
    }

    public function update(Request $request, Subject $subject)
    {
        $subject->update($request->all());
        return new SubjectResource($subject);
    }

    public function destroy(Subject $subject)
    {
        $subject->delete();
        return response()->json(['message' => 'Subject deleted successfully']);
    }
}
