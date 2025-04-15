<?php

namespace App\Services;

use App\Enum\RolesEnum;
use App\Interfaces\ProjectInterface;
use App\Models\Project;
use App\Models\Team;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class ProjectService
{
    protected $projectInterface;

    public function __construct(ProjectInterface $projectInterface)
    {
        $this->projectInterface = $projectInterface;
    }

    public function getAllProjectsForTasks()
    {
        return $this->projectInterface->getAllProjectsForTasks();
    }

    public function getProjects($filters, $sortField, $sortDirection, $user): LengthAwarePaginator
    {
        $query = $this->projectInterface->getAllProjects($user);

        if (isset($filters['name'])) {
            $query = $this->projectInterface->filterByName($query, $filters['name']);
        }
        if (isset($filters['statuses'])) {
            $query = $this->projectInterface->filterByStatuses($query, $filters['statuses']);
        }
        if (isset($filters['assignees'])) {
            $query = $this->projectInterface->filterByAssignees($query, $filters['assignees']);
        }

        return $this->projectInterface->getPaginatedResults($query, $sortField, $sortDirection);
    }

    public function getProjectTasks($project, $filters, $sortField, $sortDirection): LengthAwarePaginator
    {
        $query = $this->projectInterface->getProjectTasks($project);

        if (isset($filters['name'])) {
            $query = $this->projectInterface->filterByName($query, $filters['name']);
        }
        if (isset($filters['statuses'])) {
            $query = $this->projectInterface->filterByStatuses($query, $filters['statuses']);
        }
        if (isset($filters['assignees'])) {
            $query = $this->projectInterface->filterByAssignees($query, $filters['assignees']);
        }

        return $this->projectInterface->getPaginatedResults($query, $sortField, $sortDirection);
    }

    public function getProjectsForUser($user)
    {
        return $this->projectInterface->getAllProjects($user)->get();
    }

    public function createProject($validatedData)
    {
        $validatedData['created_by'] = Auth::id();
        $project = Project::create($validatedData);
        return $project;
    }

    public function updateProject($validatedData, $project)
    {
        $validatedData['updated_by'] = Auth::id();
        $project->update($validatedData);
        return $project;
    }
}
