<?php

namespace App\Services;

use App\Interfaces\UserInterface;
use App\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class UserService
{
    protected $userInterface;

    public function __construct(UserInterface $userInterface)
    {
        $this->userInterface = $userInterface;
    }

    public function getAllUsersForTasks()
    {
        return $this->userInterface->getAllUsersForTasks();
    }

    public function getTheAuthUser()
    {
        return Auth::user();
    }

    public function getAuthUserPermissions($user)
    {
        return $user->getAllPermissions()->pluck('name');
    }

    public function getUsers($filters, $sortField, $sortDirection): LengthAwarePaginator
    {
        $query = $this->userInterface->getAllUsers();

        if (isset($filters['name'])) {
            $query = $this->userInterface->filterByName($query, $filters['name']);
        }
        if (isset($filters['email'])) {
            $query = $this->userInterface->filterByEmail($query, $filters['email']);
        }

        return $this->userInterface->getPaginatedResults($query, $sortField, $sortDirection);
    }

    public function getUserTasks($user, $filters, $sortField, $sortDirection): LengthAwarePaginator
    {
        $query = $this->userInterface->getUserTasks($user);

        if (isset($filters['name'])) {
            $query = $this->userInterface->filterByName($query, $filters['name']);
        }
        if (isset($filters['email'])) {
            $query = $this->userInterface->filterByEmail($query, $filters['email']);
        }

        return $this->userInterface->getPaginatedResults($query, $sortField, $sortDirection);
    }

    public function createUser($validatedData)
    {
        $validatedData['email_verified_at'] = time();
        $validatedData['password'] = bcrypt($validatedData['password']);
        $user = User::create($validatedData);
        return $user;
    }

    public function updateUser($validatedData, $user)
    {
        $password = $validatedData['password'] ?? null;
        if ($password) {
            $validatedData['password'] = bcrypt($password);
        } else {
            unset($validatedData['password']);
        }
        $user->update($validatedData);
        return $user;
    }
}
