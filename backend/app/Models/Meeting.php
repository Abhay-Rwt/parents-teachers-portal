<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Meeting extends Model
{
    protected $fillable = [
        'teacher_id',
        'parent_id',
        'meeting_date',
        'meeting_time',
        'meeting_type',
        'purpose',
        'status',
        'initiated_by',
    ];

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function parent()
    {
        return $this->belongsTo(User::class, 'parent_id');
    }
}
