<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Resources\MessageResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class MessageController extends Controller
{
    public function index()
    {
        $messages = Message::where('sender_id', Auth::id())
            ->orWhere('receiver_id', Auth::id())
            ->with(['sender', 'receiver'])
            ->oldest()
            ->get();
        return MessageResource::collection($messages);
    }

    public function store(Request $request)
    {
        $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'message' => 'required|string',
        ]);

        $message = Message::create([
            'sender_id' => Auth::id(),
            'receiver_id' => $request->receiver_id,
            'message' => $request->message,
        ]);

        // Notify receiver
        \App\Models\Notification::create([
            'user_id' => $request->receiver_id,
            'title' => 'New Message',
            'body' => Auth::user()->name . ' sent you a message: "' . substr($request->message, 0, 50) . (strlen($request->message) > 50 ? '...' : '') . '"',
        ]);

        return new MessageResource($message->load(['sender', 'receiver']));
    }

    public function markAsRead(Message $message)
    {
        if ($message->receiver_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }
        $message->update(['is_read' => true]);
        return new MessageResource($message->load(['sender', 'receiver']));
    }
}
