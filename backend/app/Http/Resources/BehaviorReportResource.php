<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BehaviorReportResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'incident_date' => $this->incident_date,
            'description' => $this->description,
            'severity' => $this->severity,
            'created_at' => $this->created_at,
        ];
    }
}
