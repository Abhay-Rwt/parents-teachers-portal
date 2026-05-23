<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MessageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'sender_id'   => $this->sender_id,
            'receiver_id' => $this->receiver_id,
            'message'     => $this->message,
            'is_read'     => $this->is_read,
            'created_at'  => $this->created_at,
            'sender'      => $this->whenLoaded('sender', fn() => ['id' => $this->sender->id, 'name' => $this->sender->name]),
            'receiver'    => $this->whenLoaded('receiver', fn() => ['id' => $this->receiver->id, 'name' => $this->receiver->name]),
        ];
    }
}
