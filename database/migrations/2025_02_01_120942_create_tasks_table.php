<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->string('status');
            $table->string('priority');
            $table->timestamp('due_date')->nullable();
            $table->foreignId('assigned_team_leader_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('assigned_team_member_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('parent_id')->nullable()->constrained('tasks')->nullOnDelete();
            $table->foreignId('project_id')->constrained('projects')->cascadeOnDelete();
            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('updated_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};






// <?php

// namespace App\Observers;

// use App\Models\Task;

// class TaskObserver
// {
//     public function updated(Task $task)
//     {
//         // Check if the status of a task has changed
//         if ($task->wasChanged('status')) {
//             // If a child task's status changes, check its parent
//             if ($task->parent_id !== null) {
//                 $this->updateParentTaskStatus($task->parent_id);
//             }
//             // If a parent task's status changes, check its children
//             $childTasks = Task::where('parent_id', $task->id)->get();
//             foreach ($childTasks as $childTask) {
//                 $this->updateParentTaskStatus($task->id);
//             }
//         }
//     }

//     /**
//      * Updates the status of a parent task based on the status of its child tasks.
//      *
//      * @param int $parentTaskId The ID of the parent task.
//      */
//     private function updateParentTaskStatus(int $parentTaskId)
//     {
//         $parentTask = Task::find($parentTaskId);

//         if (!$parentTask) {
//             return; // Parent task not found
//         }

//         // Get all child tasks of the parent
//         $childTasks = Task::where('parent_id', $parentTask->id)->get();

//         // Check if all child tasks are completed
//         $allChildrenCompleted = $childTasks->every(function ($childTask) {
//             return $childTask->status === 'completed';
//         });

//         // Update the parent task's status based on the children's status
//         if ($allChildrenCompleted && $parentTask->status !== 'in_progress') {
//             $parentTask->status = 'in_progress';
//             $parentTask->save();
//         } elseif (!$allChildrenCompleted && $parentTask->status !== 'pending') {
//             $parentTask->status = 'pending';
//             $parentTask->save();
//         }
//     }
// }



// <?php

// namespace App\Providers;

// use App\Models\Task;
// use App\Observers\TaskObserver;
// use Illuminate\Support\ServiceProvider;

// class AppServiceProvider extends ServiceProvider
// {
//     public function boot()
//     {
//         Task::observe(TaskObserver::class);
//     }
// }
