<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BehaviorReport extends Model
{
    protected $fillable = [
        'student_id',
        'teacher_id',
        'remarks',
        'behavior_type',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }
}
