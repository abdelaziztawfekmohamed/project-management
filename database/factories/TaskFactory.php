<?php

namespace Database\Factories;

use App\Models\Project;
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
        return [
            'name' => fake()->sentence(6),
            'description' => fake()->realText(),
            'status' => fake()->randomElement(['pending', 'in_progress', 'completed']),
            'priority' => fake()->randomElement(['low', 'medium', 'high']),
            'due_date' => fake()->dateTimeBetween('now', '+1 year'),
            'assigned_team_leader_id' => fake()->numberBetween(9, 24),
            'assigned_team_member_id' => fake()->numberBetween(25, 59),
            'created_by' => fake()->numberBetween(1, 24),
            'updated_by' => fake()->numberBetween(3, 24),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
