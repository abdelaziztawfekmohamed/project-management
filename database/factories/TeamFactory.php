<?php

namespace Database\Factories;

use App\Enum\TeamEnum;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Team>
 */
class TeamFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company(),
            'created_by' => fake()->numberBetween(3, 8),
            'team_leader_id' => fake()->numberBetween(9, 24),
            'category' => fake()->randomElement(TeamEnum::categories()),
            'updated_by' => fake()->numberBetween(3, 8),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}
