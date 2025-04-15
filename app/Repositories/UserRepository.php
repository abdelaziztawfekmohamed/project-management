<?php

namespace App\Repositories;

use App\Enum\RolesEnum;
use App\Interfaces\UserInterface;
use App\Models\Project;
use App\Models\ProjectTeam;
use App\Models\TeamMembers;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserRepository implements UserInterface
{
    public function getAllUsers($user)
    {
        if ($user->hasRole(RolesEnum::Admin->value)) {
            return User::query();
        }
        if ($user->hasRole([RolesEnum::ProjectManager->value]) || $user->hasRole([RolesEnum::TeamLeader->value])) {

            $managedProjectIds = Project::where('assigned_project_manager_id', $user->id)->pluck('id');
            $teamIds = ProjectTeam::whereIn('project_id', $managedProjectIds)->pluck('team_id');
            // dd($teamIds);
            $teamMembers = User::whereIn('team_id', $teamIds);
            // dd($teamMembersIds);
            // $users = User::whereIn('id', $teamMembersIds);
            // dd($users);
            return $teamMembers;
        }
    }

    public function getAllUsersForTasks()
    {
        return User::query()
            ->orderBy("name", "asc")->get();
    }

    public function getUserTasks($user)
    {
        return $user->tasks();
    }

    public function getPaginatedResults($query, $sortField, $sortDirection)
    {
        $filteredQuery = $query
            ->orderBy($sortField, $sortDirection)->paginate(10);

        return $filteredQuery;
    }

    public function filterByName($query, $name)
    {
        return  $query->where("name", "like", "%" . $name . "%");
    }

    public function filterByEmail($query, $email)
    {
        return  $query->where("email", "like", "%" . $email . "%");
    }
}
