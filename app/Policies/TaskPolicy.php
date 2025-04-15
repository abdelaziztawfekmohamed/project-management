<?php

namespace App\Policies;

use App\Enum\RolesEnum;
use App\Models\ProjectTeam;
use App\Models\Task;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class TaskPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasRole(RolesEnum::Admin->value) || $user->hasRole(RolesEnum::ProjectManager->value) || $user->hasRole(RolesEnum::TeamLeader->value) || $user->hasRole(RolesEnum::TeamMember->value);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Task $task): bool
    {

        // Admins can view all tasks
        if ($user->hasRole(RolesEnum::Admin->value)) {
            return true;
        }

        // Project Managers can view tasks in their assigned projects
        if ($user->hasRole(RolesEnum::ProjectManager->value)) {
            return $task->project->assigned_project_manager_id === $user->id;
            // return true;
        }

        // Team Leaders can view tasks in their team's projects
        if ($user->hasRole(RolesEnum::TeamLeader->value)) {
            $teamsIds = Team::where('assigned_team_leader_id', $user->id)->pluck('id');
            // dd($teamsIds);

            $projectsIds = ProjectTeam::whereIn('team_id', $teamsIds)->pluck('project_id');
            // dd($projectsIds);

            $tasksIds = Task::whereIn('project_id', $projectsIds)->pluck('id');
            // dd($tasksIds);
            foreach ($tasksIds as $taskId) {
                if ($taskId == $task->id) {
                    return true;
                }
            }
            // return $task->project->teams->contains('team_leader_id', $user->id);
        }

        // Team Members can view tasks assigned to them
        return $task->assigned_team_member_id === $user->id;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        // // Admins can create any task
        // if ($user->hasRole(RolesEnum::Admin->value)) {
        //     return true;
        // }

        // // Project Managers can create tasks in their assigned projects
        // if ($user->hasRole(RolesEnum::ProjectManager->value)) {
        //     return $task->project->assigned_project_manager_id === $user->id;
        // }

        // // Team Leaders can create tasks in their team's projects
        // if ($user->hasRole(RolesEnum::TeamLeader->value)) {
        //     $teamsIds = Team::where('assigned_team_leader_id', $user->id)->pluck('id');
        //     // dd($teamsIds);

        //     $projectsIds = ProjectTeam::whereIn('team_id', $teamsIds)->pluck('project_id');
        //     // dd($projectsIds);

        //     $tasksIds = Task::whereIn('project_id', $projectsIds)->pluck('id');
        //     // dd($tasksIds);
        //     foreach ($tasksIds as $taskId) {
        //         if ($taskId == $task->id) {
        //             return true;
        //         }
        //     }
        // }

        // return false;
        return $user->hasRole(RolesEnum::Admin->value) ||
            $user->hasRole(RolesEnum::ProjectManager->value) ||
            $user->hasRole(RolesEnum::TeamLeader->value);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Task $task): bool
    {
        // Admins can update any task
        if ($user->hasRole(RolesEnum::Admin->value)) {
            return true;
        }

        // Project Managers can update tasks in their assigned projects
        if ($user->hasRole(RolesEnum::ProjectManager->value)) {
            return $task->project->assigned_project_manager_id === $user->id;
        }

        // Team Leaders can update tasks in their team's projects
        if ($user->hasRole(RolesEnum::TeamLeader->value)) {
            $teamsIds = Team::where('assigned_team_leader_id', $user->id)->pluck('id');
            // dd($teamsIds);

            $projectsIds = ProjectTeam::whereIn('team_id', $teamsIds)->pluck('project_id');
            // dd($projectsIds);

            $tasksIds = Task::whereIn('project_id', $projectsIds)->pluck('id');
            // dd($tasksIds);
            foreach ($tasksIds as $taskId) {
                if ($taskId == $task->id) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Task $task): bool
    {
        // Admins can delete any task
        if ($user->hasRole(RolesEnum::Admin->value)) {
            return true;
        }

        // Project Managers can delete tasks in their assigned projects
        if ($user->hasRole(RolesEnum::ProjectManager->value)) {
            return $task->project->assigned_project_manager_id === $user->id;
        }

        if ($user->hasRole(RolesEnum::TeamLeader->value)) {
            $teamsIds = Team::where('assigned_team_leader_id', $user->id)->pluck('id');
            // dd($teamsIds);       

            $projectsIds = ProjectTeam::whereIn('team_id', $teamsIds)->pluck('project_id');
            // dd($projectsIds);

            $tasksIds = Task::whereIn('project_id', $projectsIds)->pluck('id');
            // dd($tasksIds);
            foreach ($tasksIds as $taskId) {
                if ($taskId == $task->id) {
                    return true;
                }
            }
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Task $task): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Task $task): bool
    {
        return false;
    }
}
