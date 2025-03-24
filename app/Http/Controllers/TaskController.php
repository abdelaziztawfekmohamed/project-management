<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Http\Requests\StoreTaskRequest;
use App\Http\Requests\UpdateTaskRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Services\ProjectService;
use App\Services\TaskService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class TaskController extends Controller
{
    protected $taskService;
    protected $projectService;
    protected $userService;

    public function __construct(TaskService $taskService, ProjectService $projectService, UserService $userService)
    {
        $this->taskService = $taskService;
        $this->projectService = $projectService;
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Task::class);

        [$filters, $sortField, $sortDirection] = $this->extractQueryParams($request);

        $tasks = $this->taskService->getTasks($filters, $sortField, $sortDirection);
        // dd($tasks);

        return Inertia::render("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => $request->query() ?: null,
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Task::class);

        $projects = $this->projectService->getAllProjectsForTasks();
        $users = $this->userService->getAllUsersForTasks();

        return Inertia::render("Task/Create", [
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
        ]);
    }

    public function store(StoreTaskRequest $request)
    {
        Gate::authorize('create', Task::class);

        $validatedData = $request->validated();

        $this->taskService->createTask($validatedData);

        return to_route('task.index')
            ->with('success', 'Task created successfully.');
    }

    public function show(Task $task)
    {
        // dd(Gate::authorize('view', $task));
        Gate::authorize('view', $task);
        // dd($task);
        return Inertia::render("Task/Show", [
            "task" => new TaskResource($task),
        ]);
    }

    public function edit(Task $task, Request $request)
    {
        Gate::authorize('update', $task);

        $projects = $this->projectService->getAllProjectsForTasks();
        $users = $this->userService->getAllUsersForTasks();
        $page = $request->input('page', 1);
        $prevRouteName = $request->input('prevRouteName');
        // dd($prevRouteName);


        return Inertia::render("Task/Edit", [
            "task" => new TaskResource($task),
            'projects' => ProjectResource::collection($projects),
            'users' => UserResource::collection($users),
            'page' => $page,
            'prevRouteName' => $prevRouteName
        ]);
    }

    public function update(UpdateTaskRequest $request, Task $task)
    {
        Gate::authorize('update', $task);

        $validatedData = $request->validated();
        // dd($validatedData);
        $this->taskService->updateTask($validatedData, $task);
        $page = $validatedData['page'];
        $prevRouteName = $validatedData['prevRouteName'];
        $project_id = $task->project->id;

        if ($prevRouteName === 'task') {
            return to_route('task.index', ['page' => $page])
                ->with('success', 'Task updated successfully.');
        } else {
            return to_route('project.show', ['project' => $project_id, 'page' => $page])
                ->with('success', 'Task updated successfully.');
        }
    }

    public function destroy(Task $task)
    {
        Gate::authorize('delete', $task);

        $task->delete();

        return to_route('task.index')
            ->with('success', 'Task deleted successfully.');
    }

    public function myTasks(Request $request)
    {
        [$filters, $sortField, $sortDirection] = $this->extractQueryParams($request);

        $user = $this->userService->getTheAuthUser(Auth::user());
        $userID = $user->id;

        $tasks = $this->taskService->getAuthUserTasks($userID, $filters, $sortField, $sortDirection);

        return Inertia::render("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => $request->query() ?: null,
            'success' => session('success'),
        ]);
    }
}
