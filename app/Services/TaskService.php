<?php

namespace App\Services;

use App\Interfaces\TaskInterface;
use App\Models\Task;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class TaskService
{
    protected $taskInterface;

    public function __construct(TaskInterface $taskInterface)
    {
        $this->taskInterface = $taskInterface;
    }

    public function getTasks($user, $filters, $sortField, $sortDirection): LengthAwarePaginator
    {
        $query = $this->taskInterface->getAllTasks($user);
        // dd($query->pluck('name'));
        // $orderedQuery = $query->orderBy('id');


        if (isset($filters['name'])) {
            $query = $this->taskInterface->filterByName($query, $filters['name']);
        }
        if (isset($filters['statuses'])) {
            $query = $this->taskInterface->filterByStatuses($query, $filters['statuses']);
        }
        if (isset($filters['priorities'])) {
            // dd($filters['priorities']);
            $query = $this->taskInterface->filterByPriorities($query, $filters['priorities']);
        }
        if (isset($filters['projects'])) {
            // dd($filters['projects']);
            $query = $this->taskInterface->filterByProjects($query, $filters['projects']);
        }
        if (isset($filters['assignees'])) {
            $query = $this->taskInterface->filterByAssignees($query, $filters['assignees']);
        }

        return $this->taskInterface->getPaginatedResults($query, $sortField, $sortDirection);
    }

    public function getAuthUserTasks($userID, $filters, $sortField, $sortDirection): LengthAwarePaginator
    {
        $query = $this->taskInterface->getAuthUserTasks($userID);
        if (isset($filters['name'])) {
            $query = $this->taskInterface->filterByName($query, $filters['name']);
        }
        if (isset($filters['status'])) {
            $query = $this->taskInterface->filterByStatuses($query, $filters['statuses']);
        }

        return $this->taskInterface->getAuthUserPaginatedResults($query, $sortField, $sortDirection);
    }

    public function totalPendingTasks()
    {
        return $this->taskInterface->totalPendingTasks();
    }

    public function myPendingTasks($userID)
    {
        return $this->taskInterface->myPendingTasks($userID);
    }

    public function totalProgressTasks()
    {
        return $this->taskInterface->totalProgressTasks();
    }

    public function myProgressTasks($userID)
    {
        return $this->taskInterface->myProgressTasks($userID);
    }

    public function totalCompletedTasks()
    {
        return $this->taskInterface->totalCompletedTasks();
    }

    public function myCompletedTasks($userID)
    {
        return $this->taskInterface->myCompletedTasks($userID);
    }

    public function activeTasks($userID)
    {
        return $this->taskInterface->activeTasks($userID);
    }

    public function createTask($validatedData)
    {
        $validatedData['created_by'] = Auth::id();
        $task = Task::create($validatedData);
        return $task;
    }

    public function updateTask($validatedData, $task)
    {
        $validatedData['updated_by'] = Auth::id();
        $task->update($validatedData);
        return $task;
    }
}
