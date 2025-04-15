<?php

namespace App\Repositories;

use App\Enum\RolesEnum;
use App\Models\Task;
use App\Interfaces\TaskInterface;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class TaskRepository implements TaskInterface
{
    public function getAllTasks($user)
    {
        if ($user->hasRole(RolesEnum::Admin->value)) {
            return Task::query();
        }

        if ($user->hasRole(RolesEnum::ProjectManager->value)) {
            $projectsIDs = Project::query()->where('assigned_project_manager_id', $user->id)->pluck('id');
            // dd($projectsIDs);
            // $taskIDS = Task::query()->whereIn('project_id', $projectsIDs)->pluck('name');
            // dd($taskIDS);
            return Task::query()->whereIn('project_id', $projectsIDs);
        }

        if ($user->hasRole(RolesEnum::TeamLeader->value)) {
            return Task::whereHas('project', function ($projectQuery) use ($user) {
                $projectQuery->whereHas('teams', function ($teamQuery) use ($user) {
                    $teamQuery->where('team_leader_id', $user->id);
                });
            });
        }

        if ($user->hasRole(RolesEnum::TeamMember->value)) {
            return Task::query()->where('assigned_team_leader_id', Auth::user()->id);
        }
    }

    public function getAuthUserTasks($userID)
    {
        return Task::query()->where('assigned_team_leader_id', $userID);
    }

    public function totalPendingTasks()
    {
        $tasks = $this->getAllTasks(Auth::user());
        return $tasks->where('status', 'pending')->count();
    }

    public function myPendingTasks($userID)
    {
        $tasks = $this->getAllTasks(Auth::user());
        return $tasks->where('status', 'pending')
            ->where('assigned_team_leader_id', $userID)
            ->count();
    }

    public function totalProgressTasks()
    {
        $tasks = $this->getAllTasks(Auth::user());
        return $tasks->where('status', 'in_progress')->count();
    }

    public function myProgressTasks($userID)
    {
        $tasks = $this->getAllTasks(Auth::user());
        return $tasks->where('status', 'in_progress')
            ->where('assigned_team_leader_id', $userID)
            ->count();
    }

    public function totalCompletedTasks()
    {
        $tasks = $this->getAllTasks(Auth::user());
        return $tasks->where('status', 'completed')->count();
    }

    public function myCompletedTasks($userID)
    {
        $tasks = $this->getAllTasks(Auth::user());
        return $tasks->where('status', 'completed')
            ->where('assigned_team_leader_id', $userID)
            ->count();
    }

    public function activeTasks($userID)
    {
        $tasks = $this->getAllTasks(Auth::user());
        return $tasks->whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_team_leader_id', $userID)
            ->limit(10)
            ->get();
    }

    public function getPaginatedResults($query, $sortField, $sortDirection)
    {
        // dd($query->orderBy($sortField, $sortDirection)->pluck('name'));
        $filteredQuery = $query->orderBy($sortField, $sortDirection)
            ->paginate(10);
        // dd($filteredQuery->pluck('name'));
        return $filteredQuery;
    }

    public function getAuthUserPaginatedResults($query, $sortField, $sortDirection)
    {

        $filteredQuery = $query->orderBy($sortField, $sortDirection)
            ->paginate(10);

        return $filteredQuery;
    }

    public function filterByName($query, $name)
    {
        return  $query->where("name", "like", "%" . $name . "%");
    }

    public function filterByStatuses($query, $statuses)
    {
        $statuses = explode(',', $statuses);
        // dd($statuses);
        return  $query->whereIn("status", $statuses);
    }

    public function filterByProjects($query, $projects)
    {
        $projects = explode(',', $projects);
        // dd($projects);
        $projectsIDs = Project::query()->whereIn('name', $projects)->pluck('id');
        return  $query->whereIn("project_id", $projectsIDs);
    }

    public function filterByAssignees($query, $assignees)
    {
        $assignees = explode(',', $assignees);
        $assigneeUsersIDs = User::query()->whereIn('name', $assignees)->pluck('id');
        // dd($assignees);
        $team_leadersIDs = Task::query()->whereIn('assigned_team_leader_id', $assigneeUsersIDs)->pluck('assigned_team_leader_id');
        // dd($team_leadersIDs);
        $team_membersIDs = Task::query()->whereIn('assigned_team_member_id', $assigneeUsersIDs)->pluck('assigned_team_member_id');

        // dd($query->whereIn("assigned_team_leader_id", $team_leadersIDs)->pluck('id'), $query->WhereIn("assigned_team_member_id", $team_membersIDs)->pluck('id'));

        return $query->whereIn("assigned_team_leader_id", $team_leadersIDs)->orWhereIn("assigned_team_member_id", $team_membersIDs);
    }

    public function filterByPriorities($query, $priorities)
    {
        $priorities = explode(',', $priorities);
        return  $query->whereIn("priority", $priorities);
    }
}
