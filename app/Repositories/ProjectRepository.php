<?php

namespace App\Repositories;

use App\Enum\RolesEnum;
use App\Interfaces\ProjectInterface;
use App\Models\Project;
use Illuminate\Support\Facades\Auth;

class ProjectRepository implements ProjectInterface
{
    public function getAllProjects()
    {
        if (Auth::user()->roles->contains('name', RolesEnum::Admin->value)) {
            return Project::query();
        }
        if (Auth::user()->roles->contains('name', RolesEnum::ProjectManager->value)) {
            return Project::query()->where('assigned_project_manager_id', Auth::user()->id);
        }
    }

    public function getAllProjectsForTasks()
    {
        return Project::query()->orderBy("name", "asc")->get();
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

    public function filterByStatus($query, $status)
    {
        return  $query->where("status", $status);
    }
}
