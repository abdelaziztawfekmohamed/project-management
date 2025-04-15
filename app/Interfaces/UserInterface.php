<?php

namespace App\Interfaces;

interface UserInterface
{
    public function getAllUsers($user);
    public function getAllUsersForTasks();
    public function getUserTasks($project);
    public function getPaginatedResults($query, $sortField, $sortDirection);
    public function filterByName($query, $name);
    public function filterByEmail($query, $name);
}
