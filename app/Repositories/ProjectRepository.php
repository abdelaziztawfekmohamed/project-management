<?php

namespace App\Repositories;

use App\Enum\RolesEnum;
use App\Interfaces\ProjectInterface;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class ProjectRepository implements ProjectInterface
{
    public function getAllProjects($user)
    {
        if ($user->hasRole(RolesEnum::Admin->value)) {
            return Project::query();
        }
        if ($user->hasRole(RolesEnum::ProjectManager->value)) {
            return Project::query()->where('assigned_project_manager_id', $user->id);
        }
        if ($user->hasRole(RolesEnum::TeamLeader->value)) {
            $teamIds = Team::where('assigned_team_leader_id', $user->id)->pluck('id');
            return Project::whereHas('teams', function ($query) use ($teamIds) {
                $query->whereIn('team_id', $teamIds);
            });
        }
        return collect(); // Empty collection for unauthorized roles
    }

    public function getAllProjectsForTasks()
    {
        return Project::orderBy("name", "asc")->get();
    }

    public function getProjectTasks($project)
    {
        return $project->tasks();
    }

    public function getPaginatedResults($query, $sortField, $sortDirection)
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
        return  $query->whereIn("status", $statuses);
    }

    public function filterByAssignees($query, $assignees)
    {
        $assignees = explode(',', $assignees);
        $assignedProjectManagerIds = User::whereIn('name', $assignees)->pluck('id');
        return  $query->whereIn("assigned_project_manager_id", $assignedProjectManagerIds);
    }
}
