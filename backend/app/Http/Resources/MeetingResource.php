<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MeetingResource extends JsonResource
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
            'teacher_id' => $this->teacher_id,
            'parent_id' => $this->parent_id,
            'meeting_date' => $this->meeting_date,
            'meeting_time' => $this->meeting_time,
            'meeting_type' => $this->meeting_type,
            'purpose' => $this->purpose,
            'status' => $this->status,
            'initiated_by' => $this->initiated_by,
            'teacher' => $this->teacher ? [
                'id' => $this->teacher->id,
                'name' => $this->teacher->name,
            ] : null,
            'parent' => $this->parent ? [
                'id' => $this->parent->id,
                'name' => $this->parent->name,
            ] : null,
            'created_at' => $this->created_at,
        ];
    }
}
