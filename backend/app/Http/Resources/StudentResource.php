<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class StudentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $totalAttendance = $this->attendances()->count();
        $presentCount = $this->attendances()->where('status', 'present')->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentCount / $totalAttendance) * 100) : null;

        $avgGrade = $this->grades()->avg('marks');

        return [
            'id' => $this->id,
            'student_name' => $this->student_name,
            'roll_number' => $this->roll_number,
            'classroom' => $this->classroom ? [
                'id' => $this->classroom->id,
                'class_name' => $this->classroom->class_name,
                'section' => $this->classroom->section,
            ] : null,
            'parent' => $this->parent ? [
                'id' => $this->parent->id,
                'name' => $this->parent->name,
                'email' => $this->parent->email,
            ] : null,
            'teacher' => $this->teacher ? [
                'id' => $this->teacher->id,
                'name' => $this->teacher->name,
            ] : null,
            'attendance_rate' => $attendanceRate,
            'gpa' => $avgGrade ? round($avgGrade / 25, 1) : null, // Assuming 100 max marks map to 4.0 scale
            'grades' => GradeResource::collection($this->whenLoaded('grades')),
            'behavior_reports' => BehaviorReportResource::collection($this->whenLoaded('behaviorReports')),
            'created_at' => $this->created_at,
        ];
    }
}
