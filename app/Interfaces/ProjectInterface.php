<?php

namespace App\Interfaces;


interface ProjectInterface
{
    public function getAllProjects($user);
    public function getAllProjectsForTasks();
    public function getProjectTasks($project);
    public function getPaginatedResults($query, $sortField, $sortDirection);
    public function filterByName($query, $name);
    public function filterByStatuses($query, $statuses);
    public function filterByAssignees($query, $assignees);
}
