<?php

namespace App\Repositories;

use App\Enum\RolesEnum;
use App\Models\Task;
use App\Interfaces\TaskInterface;
use App\Models\Team;
use Illuminate\Support\Facades\Auth;

class TaskRepository implements TaskInterface
{

    public function getAllTasks()
    {
        if (Auth::user()->roles->contains('name', RolesEnum::Admin->value)) {
            return Task::query();
        }
        if (Auth::user()->roles->contains('name', RolesEnum::ProjectManager->value)) {
            return Task::whereHas('project', function ($query) {
                $query->where('assigned_project_manager_id', Auth::user()->id);
            });
        }
        if (Auth::user()->roles->contains('name', RolesEnum::TeamLeader->value)) {
            return Task::whereHas('project', function ($projectQuery) {
                $projectQuery->whereHas('teams', function ($teamQuery) {
                    $teamQuery->where('team_leader_id', Auth::user()->id);
                });
            });
        }
        if (Auth::user()->roles->contains('name', RolesEnum::TeamMember->value)) {
            return Task::query()->where('assigned_team_leader_id', Auth::user()->id);
        }
    }

    public function getAuthUserTasks($userID)
    {
        return Task::query()->where('assigned_team_leader_id', $userID);
    }

    public function totalPendingTasks()
    {
        $tasks = $this->getAllTasks();
        return $tasks->where('status', 'pending')->count();
    }

    public function myPendingTasks($userID)
    {
        $tasks = $this->getAllTasks();
        return $tasks->where('status', 'pending')
            ->where('assigned_team_leader_id', $userID)
            ->count();
    }

    public function totalProgressTasks()
    {
        $tasks = $this->getAllTasks();
        return $tasks->where('status', 'in_progress')->count();
    }

    public function myProgressTasks($userID)
    {
        $tasks = $this->getAllTasks();
        return $tasks->where('status', 'in_progress')
            ->where('assigned_team_leader_id', $userID)
            ->count();
    }

    public function totalCompletedTasks()
    {
        $tasks = $this->getAllTasks();
        return $tasks->where('status', 'completed')->count();
    }

    public function myCompletedTasks($userID)
    {
        $tasks = $this->getAllTasks();
        return $tasks->where('status', 'completed')
            ->where('assigned_team_leader_id', $userID)
            ->count();
    }

    public function activeTasks($userID)
    {
        $tasks = $this->getAllTasks();
        return $tasks->whereIn('status', ['pending', 'in_progress'])
            ->where('assigned_team_leader_id', $userID)
            ->limit(10)
            ->get();
    }

    public function getPaginatedResults($query, $sortField, $sortDirection)
    {

        $filteredQuery = $query->orderBy($sortField, $sortDirection)
            ->paginate(10);

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

    public function filterByStatus($query, $status)
    {
        return  $query->where("status", $status);
    }
}
