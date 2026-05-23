<?php

namespace Database\Seeders;

use App\Models\Student;
use App\Models\User;
use App\Models\Classroom;
use Illuminate\Database\Seeder;

class StudentSeeder extends Seeder
{
    public function run(): void
    {
        $parent = User::where('role', 'parent')->first();
        $teacher = User::where('role', 'teacher')->first();
        $classroom = Classroom::first();

        Student::create([
            'student_name' => 'Alex Junior',
            'classroom_id' => $classroom->id,
            'section' => 'A',
            'roll_number' => '101',
            'parent_id' => $parent->id,
            'teacher_id' => $teacher->id,
            'dob' => '2010-05-15',
            'gender' => 'Male',
        ]);
    }
}
