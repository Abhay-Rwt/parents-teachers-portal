<?php

namespace App\Http\Controllers;

use App\Models\Announcement;
use App\Http\Resources\AnnouncementResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AnnouncementController extends Controller
{
    public function index()
    {
        return AnnouncementResource::collection(Announcement::with('teacher')->latest()->get());
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
        ]);

        $announcement = Announcement::create([
            'title' => $request->title,
            'description' => $request->description,
            'teacher_id' => Auth::id(),
        ]);

        return new AnnouncementResource($announcement);
    }
}
