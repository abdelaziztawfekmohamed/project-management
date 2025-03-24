<?php

namespace App\Interfaces;

interface TaskInterface
{
    public function getAllTasks();
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
    public function filterByStatus($query, $name);
}
