<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GradeResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'marks' => $this->marks,
            'grade' => $this->grade,
            'remarks' => $this->remarks,
            'assignment' => $this->assignment ? [
                'id' => $this->assignment->id,
                'title' => $this->assignment->title,
            ] : null,
            'subject' => $this->subject ? [
                'id' => $this->subject->id,
                'name' => $this->subject->name,
            ] : null,
            'created_at' => $this->created_at,
        ];
    }
}
