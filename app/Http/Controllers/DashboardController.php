<?php

namespace App\Http\Controllers;

use App\Enum\RolesEnum;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Services\TaskService;
use App\Services\UserService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $userService;
    protected $taskService;

    public function __construct(UserService $userService, TaskService $taskService)
    {
        $this->userService = $userService;
        $this->taskService = $taskService;
    }

    public function index()
    {
        $user = $this->userService->getTheAuthUser();
        $userID = $user->id;

        // $userRole = $user->hasRole(RolesEnum::Admin->value);
        // dd($userRole);

        $totalPendingTasks = $this->taskService->totalPendingTasks();
        $myPendingTasks = $this->taskService->myPendingTasks($userID);

        $totalProgressTasks = $this->taskService->totalProgressTasks();
        $myProgressTasks = $this->taskService->myProgressTasks($userID);

        $totalCompletedTasks = $this->taskService->totalCompletedTasks();
        $myCompletedTasks = $this->taskService->myCompletedTasks($userID);

        $myActiveTasks = $this->taskService->activeTasks($userID);

        $activeTasks = TaskResource::collection($myActiveTasks);

        // dd(Auth::user());
        $user = new UserResource($user);

        return Inertia::render(
            'dashboard',
            compact(
                'totalPendingTasks',
                'myPendingTasks',
                'totalProgressTasks',
                'myProgressTasks',
                'totalCompletedTasks',
                'myCompletedTasks',
                'activeTasks',
                'user'
            )
        );
    }
}
