<?php

namespace Database\Seeders;

use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Database\Seeder;

class ClassroomSeeder extends Seeder
{
    public function run(): void
    {
        $class10 = Classroom::create(['class_name' => 'Class 10', 'section' => 'A']);
        $class11 = Classroom::create(['class_name' => 'Class 11', 'section' => 'B']);

        Subject::create(['name' => 'Mathematics', 'classroom_id' => $class10->id]);
        Subject::create(['name' => 'Science', 'classroom_id' => $class10->id]);
        Subject::create(['name' => 'Physics', 'classroom_id' => $class11->id]);
    }
}
