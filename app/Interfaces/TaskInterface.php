<?php

namespace App\Interfaces;

interface TaskInterface
{
    public function getAllTasks($user);
    public function getAuthUserTasks($userID);
    public function totalPendingTasks();
    public function myPendingTasks($userID);
    public function totalProgressTasks();
    public function myProgressTasks($userID);
    public function totalCompletedTasks();
    public function myCompletedTasks($userID);
    public function activeTasks($userID);
    public function getPaginatedResults($query, $sortField, $sortDirection);
    public function getAuthUserPaginatedResults($query, $sortField, $sortDirection);
    public function filterByName($query, $name);
    public function filterByStatuses($query, $statuses);
    public function filterByProjects($query,  $projects);
    public function filterByAssignees($query,  $assignees);
    public function filterByPriorities($query,  $priorities);
}
