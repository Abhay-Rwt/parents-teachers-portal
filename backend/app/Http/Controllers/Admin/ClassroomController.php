<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Http\Resources\ClassroomResource;
use Illuminate\Http\Request;

class ClassroomController extends Controller
{
    public function index()
    {
        return ClassroomResource::collection(Classroom::with('teacher')->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'class_name' => 'required|string',
            'section' => 'required|string',
            'grade_level' => 'nullable|string',
            'teacher_id' => 'nullable|exists:users,id',
        ]);

        $classroom = Classroom::create($request->all());
        return new ClassroomResource($classroom->load('teacher'));
    }

    public function show(Classroom $classroom)
    {
        return new ClassroomResource($classroom);
    }

    public function update(Request $request, Classroom $classroom)
    {
        $request->validate([
            'class_name' => 'sometimes|required|string',
            'section' => 'sometimes|required|string',
            'grade_level' => 'nullable|string',
            'teacher_id' => 'nullable|exists:users,id',
        ]);

        $classroom->update($request->all());
        return new ClassroomResource($classroom->load('teacher'));
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return response()->json(['message' => 'Classroom deleted successfully']);
    }
}
