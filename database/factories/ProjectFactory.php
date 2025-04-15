<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Project>
 */
class ProjectFactory extends Factory
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
            'due_date' => fake()->dateTimeBetween('now', '+1 year'),
            'status' => fake()->randomElement(['todo', 'in_progress', 'in_review', 'done']),
            'assigned_project_manager_id' => fake()->numberBetween(3, 8),
            'created_by' => fake()->randomElement([1, 2]),
            'updated_by' => fake()->numberBetween(3, 8),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
