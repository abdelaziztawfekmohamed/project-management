<?php

namespace Database\Seeders;


use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Project;
use App\Models\Task;
use App\Models\Team;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
        $teamMemberRole = Role::create(['name' => RolesEnum::TeamMember->value]);
        $teamLeaderRole = Role::create(['name' => RolesEnum::TeamLeader->value]);
        $projectManagerRole = Role::create(['name' => RolesEnum::ProjectManager->value]);
        $adminRole = Role::create(['name' => RolesEnum::Admin->value]);

        /**
         * Edit Permissions  
         */
        $editUsersPermission = Permission::create([
            'name' => PermissionsEnum::EditUsers->value,
        ]);

        $editPostsPermission = Permission::create([
            'name' => PermissionsEnum::EditPosts->value,
        ]);

        $editCommentsPermission = Permission::create([
            'name' => PermissionsEnum::EditComments->value,
        ]);

        $editProjectsPermission = Permission::create([
            'name' => PermissionsEnum::EditProjects->value,
        ]);

        $editTasksPermission = Permission::create([
            'name' => PermissionsEnum::EditTasks->value,
        ]);

        /**
         * Create Permissions  
         */
        $createUsersPermission = Permission::create([
            'name' => PermissionsEnum::CreateUsers->value,
        ]);

        $createPostsPermission = Permission::create([
            'name' => PermissionsEnum::CreatePosts->value,
        ]);

        $createCommentsPermission = Permission::create([
            'name' => PermissionsEnum::CreateComments->value,
        ]);

        $createProjectsPermission = Permission::create([
            'name' => PermissionsEnum::CreateProjects->value,
        ]);

        $createTasksPermission = Permission::create([
            'name' => PermissionsEnum::CreateTasks->value,
        ]);

        /**
         * Delete Permissions  
         */
        $deleteUsersPermission = Permission::create([
            'name' => PermissionsEnum::DeleteUsers->value,
        ]);

        $deletePostsPermission = Permission::create([
            'name' => PermissionsEnum::DeletePosts->value,
        ]);

        $deleteCommentsPermission = Permission::create([
            'name' => PermissionsEnum::DeleteComments->value,
        ]);

        $deleteProjectsPermission = Permission::create([
            'name' => PermissionsEnum::DeleteProjects->value,
        ]);

        $deleteTasksPermission = Permission::create([
            'name' => PermissionsEnum::DeleteTasks->value,
        ]);

        /**
         * Upvote Downvote Permissions  
         */

        $UpvoteDownvotePermission = Permission::create([
            'name' => PermissionsEnum::UpvoteDownvote->value,
        ]);

        $teamMemberRole->syncPermissions([
            $createPostsPermission,
            $editPostsPermission,
            $createCommentsPermission,
            $editCommentsPermission,
            $UpvoteDownvotePermission
        ]);

        $teamLeaderRole->syncPermissions([
            $UpvoteDownvotePermission,
            $createTasksPermission,
            $editTasksPermission,
            $createCommentsPermission,
            $editCommentsPermission,
            $createPostsPermission,
            $editPostsPermission,
            $editUsersPermission,
        ]);

        $projectManagerRole->syncPermissions([
            $UpvoteDownvotePermission,
            $createTasksPermission,
            $editTasksPermission,
            $createCommentsPermission,
            $editCommentsPermission,
            $createPostsPermission,
            $editPostsPermission,
            $createProjectsPermission,
            $editProjectsPermission,
            $editUsersPermission,
        ]);

        $adminRole->syncPermissions([
            $UpvoteDownvotePermission,
            $createTasksPermission,
            $editTasksPermission,
            $createCommentsPermission,
            $editCommentsPermission,
            $createPostsPermission,
            $editPostsPermission,
            $createProjectsPermission,
            $editProjectsPermission,
            $createUsersPermission,
            $editUsersPermission,
            $deleteUsersPermission,
            $deletePostsPermission,
            $deleteCommentsPermission,
            $deleteProjectsPermission,
            $deleteTasksPermission,
        ]);

        User::factory()->create([
            'id' => 1,
            'name' => 'Abdulaziz',
            'email' => 'abdulaziz@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ])->assignRole($adminRole);

        User::factory()->create([
            'id' => 2,
            'name' => 'Ahmed Sayed',
            'email' => 'ahmedsayed@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now(),
        ])->assignRole($adminRole);

        User::factory()->create([
            'id' => 3,
            'name' => 'Ahmed',
            'email' => 'ahmed@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now()
        ])->assignRole($projectManagerRole);

        User::factory(5)->create([])->each(function ($user) use ($projectManagerRole) {
            $user->assignRole($projectManagerRole);
        });

        User::factory()->create([
            'id' => 9,
            'name' => 'Mohamed',
            'email' => 'mohamed@example.com',
            'password' => bcrypt('123.321A'),
            'email_verified_at' => now()
        ])->assignRole($teamLeaderRole);

        User::factory(15)->create()->each(function ($user) use ($teamLeaderRole) {
            $user->assignRole($teamLeaderRole);
        });

        // User::factory()->create([
        //     'id' => 25,
        //     'name' => 'Mahmoud',
        //     'email' => 'mahmoud@example.com',
        //     'password' => bcrypt('123.321A'),
        //     'role' => RolesEnum::TeamMember->value,
        //     'email_verified_at' => now()
        // ])->assignRole($teamMemberRole);

        Team::factory(20)->create();

        User::factory(60)->create([
            'password' => bcrypt('123.321A'),
            'team_id' => fake()->numberBetween(1, 20),
        ])->each(function ($user) use ($teamMemberRole) {
            $user->assignRole($teamMemberRole);
        });

        // Project::factory(30)->create()->each(function ($project) {
        //     $project->tasks()->createMany(
        //         Task::factory(30)->make()->toArray()
        //     );
        // });

        Project::factory(30)->create();

        // Project::all()->each(function ($project) {
        //     Task::factory(5)->create([
        //         'project_id' => $project->id,
        //         'assigned_team_leader_id' => fake()->numberBetween(9, 24),
        //         'assigned_team_member_id' => null,
        //         'parent_id' => null
        //     ]);
        //     Task::factory(25)->create([
        //         'project_id' => $project->id,
        //         'assigned_team_leader_id' => null,
        //         'assigned_team_member_id' => fake()->numberBetween(25, 59),
        //         'parent_id' => fake()->optional()->numberBetween(1, 5)
        //     ]);
        // });

        Project::all()->each(function ($project) {
            // Get 5 unique team leaders
            $teamLeaders = User::role(RolesEnum::TeamLeader->value)
                ->inRandomOrder()
                ->take(5)
                ->pluck('id');

            // Get 25 unique team members
            $teamMembers = User::role(RolesEnum::TeamMember->value)
                ->inRandomOrder()
                ->take(25)
                ->pluck('id');

            // Create 5 Team Leader Tasks
            $teamLeaderTasks = collect();
            $teamLeaders->each(function ($teamLeaderId) use ($project, &$teamLeaderTasks) {
                $task = Task::factory()->create([
                    'project_id' => $project->id,
                    'assigned_team_leader_id' => $teamLeaderId,
                    'parent_id' => null,
                    'assigned_team_member_id' => null
                ]);
                $teamLeaderTasks->push($task);
            });

            // Create 25 Team Member Tasks
            $teamMembers->each(function ($teamMemberId) use ($project, $teamLeaderTasks) {
                Task::factory()->create([
                    'project_id' => $project->id,
                    'assigned_team_member_id' => $teamMemberId,
                    'assigned_team_leader_id' => null,
                    'parent_id' => $teamLeaderTasks->isNotEmpty() ? $teamLeaderTasks->random()->id : null,
                ]);
            });
        });

        // Project::all()->each(function ($project) {
        //     Task::factory(25)->create([
        //         'project_id' => $project->id,
        //         'assigned_team_leader_id' => null,
        //         'assigned_team_member_id' => fake()->numberBetween(25, 59),
        //         'parent_id' => fake()->optional()->numberBetween(1, 5)
        //     ]);
        // });

        Project::all()->each(function ($project) {
            $teams = Team::inRandomOrder()->take(rand(1, 20))->get();
            $project->teams()->attach($teams);
        });

        Post::factory(10)->create()->each(function ($post) {
            $post->comments()->createMany(
                Comment::factory(5)->make()->toArray()
            );
        });
    }
}
