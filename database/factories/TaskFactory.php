<?php

namespace Database\Factories;

use App\Models\Project;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Task>
 */
class TaskFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // // Determine if we're assigning to a team leader or team member
        // // $assignToTeamLeader = fake()->boolean(); // 50% chance to assign to a team leader

        // $teamLeaderId = null;
        // $teamMemberId = null;
        // $parentId = null;

        // if (fake()->boolean(30)) { // 30% chance to be a team leader task
        //     // Create a team leader task
        //     $teamLeaderId = fake()->numberBetween(9, 24);
        //     // Ensure team member ID is null when assigned to a team leader
        //     $teamMemberId = null;
        //     $parentId = null;
        // } else {
        //     // Find a random team leader task to be the parent
        //     $parentTask = Task::whereNotNull('assigned_team_leader_id')->inRandomOrder()->first();
        //     if ($parentTask) {
        //         $parentId = $parentTask->id;
        //     }
        //     $teamMemberId = fake()->numberBetween(25, 59);
        //     $teamLeaderId = null;
        // }
        return [
            'name' => fake()->sentence(6),
            'description' => fake()->realText(),
            'status' => fake()->randomElement(['backlog', 'todo', 'in_progress', 'in_review', 'done']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'due_date' => fake()->dateTimeBetween('+1 week', '+7 months'),
            // 'assigned_team_leader_id' => $teamLeaderId,
            'assigned_team_leader_id' => fake()->numberBetween(9, 24),
            // 'assigned_team_member_id' => $teamMemberId,
            'assigned_team_member_id' => fake()->numberBetween(25, 59),
            // 'parent_id' => $parentId,
            'created_by' => fake()->numberBetween(1, 24),
            'updated_by' => fake()->numberBetween(3, 24),
            'created_at' => fake()->dateTimeBetween('-5 months', 'now'),
            'updated_at' => now(),
        ];
    }
}




// Okay, I understand. The issue is that even when a task is assigned to a team member, the parent_id is consistently ending up as null, despite the logic intended to find a random team leader task as the parent.

// Let's analyze the problem and fix it.

// The Problem:

// The core issue lies in the timing and the data available when the TaskFactory is creating tasks. Here's a breakdown:

// Project::factory(30)->create()->each(...) in DatabaseSeeder: You're creating 30 projects, and for each project, you're creating 30 tasks immediately.
// TaskFactory Logic: The TaskFactory's logic to find a parent task relies on this line:
//  php 
// $parentTask = Task::whereNotNull('assigned_team_leader_id')->inRandomOrder()->first();
// This means it's trying to find a task that already has a assigned_team_leader_id set.
// The Race Condition: Because you're creating all 30 tasks for a project at the same time, it's highly likely that none of the tasks have been assigned to a team leader yet when the factory is trying to find a parent. The first few tasks created will run the TaskFactory and try to find a parent, but no team leader tasks have been created yet. Thus, $parentTask will be null, and $parentId will remain null.
// The Solution:

// We need to ensure that some team leader tasks exist before we start creating team member tasks that need parents. We can achieve this by creating the team leader tasks first and then creating the team member tasks.

// Here's the updated DatabaseSeeder.php and TaskFactory.php to fix this:

// 1. DatabaseSeeder.php (Modified):

//  php 
// <?php

// namespace Database\Seeders;

// // ... (other use statements)
// use App\Models\Task;
// // ...

// class DatabaseSeeder extends Seeder
// {
//     public function run(): void
//     {
//         // ... (Role and Permission creation)

//         // ... (User creation)

//         // ... (Team creation)

//         // ... (Assign team member role to users)

//         // Create Projects
//         Project::factory(30)->create();

//         // Create Team Leader Tasks First
//         Project::all()->each(function ($project) {
//             $project->tasks()->createMany(
//                 Task::factory(10)->state(['assigned_team_leader_id' => fake()->numberBetween(9, 24)])->make()->toArray()
//             );
//         });

//         // Create Team Member Tasks (with potential parents)
//         Project::all()->each(function ($project) {
//             $project->tasks()->createMany(
//                 Task::factory(20)->make()->toArray()
//             );
//         });

//         // ... (Rest of the seeder)
//     }
// }
// 2. TaskFactory.php (Slightly Modified):

//  php 
// <?php

// namespace Database\Factories;

// use App\Models\Task;
// use Illuminate\Database\Eloquent\Factories\Factory;

// class TaskFactory extends Factory
// {
//     public function definition(): array
//     {
//         $teamLeaderId = null;
//         $teamMemberId = null;
//         $parentId = null;

//         // Check if a team leader ID is already set (using state)
//         if ($this->faker->boolean(30)) { // 30% chance to be a team leader task
//             $teamLeaderId = fake()->numberBetween(9, 24);
//             $teamMemberId = null;
//             $parentId = null;
//         } else {
//             // Find a random team leader task to be the parent
//             $parentTask = Task::whereNotNull('assigned_team_leader_id')->inRandomOrder()->first();
//             if ($parentTask) {
//                 $parentId = $parentTask->id;
//             }
//             $teamMemberId = fake()->numberBetween(25, 59);
//             $teamLeaderId = null;
//         }

//         return [
//             'name' => fake()->sentence(6),
//             'description' => fake()->realText(),
//             'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
//             'priority' => fake()->randomElement(['low', 'medium', 'high']),
//             'due_date' => fake()->dateTimeBetween('now', '+1 year'),
//             'assigned_team_leader_id' => $teamLeaderId,
//             'assigned_team_member_id' => $teamMemberId,
//             'parent_id' => $parentId,
//             'created_by' => fake()->numberBetween(1, 24),
//             'updated_by' => fake()->numberBetween(3, 24),
//             'created_at' => now(),
//             'updated_at' => now(),
//         ];
//     }
// }
// Use code with care. Learn more
// Explanation of Changes:

// DatabaseSeeder.php:

// Create Projects First: We create the projects first.
// Create Team Leader Tasks:
// Task::factory(10)->state(['assigned_team_leader_id' => fake()->numberBetween(9, 24)])->make()->toArray(): We use the state() method to force the first 10 tasks to be team leader tasks by setting assigned_team_leader_id directly. This ensures that there are team leader tasks in the database before we try to assign parents.
// Create Team Member Tasks:
// Task::factory(20)->make()->toArray(): We create the remaining 20 tasks. These tasks will now have a chance to find a parent because team leader tasks exist.
// Adjust the number of tasks: I have adjusted the number of tasks to 10 team leader tasks and 20 team member tasks.
// TaskFactory.php:

// Remove $assignToTeamLeader: we don't need it anymore because we are using the state method in the seeder.
// Add $this->faker->boolean(30): we are using this to make 30% of the tasks team leader tasks and 70% team member tasks.
// Remove the if ($assignToTeamLeader): we don't need it anymore because we are using the $this->faker->boolean(30) instead.
// How This Solves the Problem:

// Guaranteed Team Leader Tasks: By creating team leader tasks first, we ensure that there are tasks with assigned_team_leader_id set.
// Parent ID Logic Works: When the TaskFactory creates the team member tasks, the $parentTask = Task::whereNotNull('assigned_team_leader_id')->inRandomOrder()->first(); line will now have a chance to find a valid parent.
// Steps to Apply the Fix:

// Replace the contents of your DatabaseSeeder.php with the updated code.
// Replace the contents of your TaskFactory.php with the updated code.
// Run php artisan migrate:fresh --seed to clear your database and re-seed it with the new logic.
// After these changes, your team member tasks should now have parent_id values that point to existing team leader tasks.