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
        $user = Auth::user();


        [$filters, $sortField, $sortDirection] = $this->extractQueryParams($request);

        $tasks = $this->taskService->getTasks($user, $filters, $sortField, $sortDirection)->appends($request->query());
        $projects = $this->projectService->getProjectsForUser($user);
        $users = $this->userService->getAllUsersForTasks();
        // $tasks = $tasks->with(['parentTask', 'childTasks']);
        // dd($tasks);

        return Inertia::render("Task/Index", [
            "tasks" => TaskResource::collection($tasks),
            "projects" => ProjectResource::collection($projects),
            "users" => UserResource::collection($users),
            'page' => $request->input('page', 1) ?: 1,
            'prevRouteName' => $request->input('prevRouteName') ?: null,
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
        // dd($request->validated());
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
        // dd($task->childTasks()->get() ?? $task->parentTask());
        // dd($task->parentTask());
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
        // dd($task->parentTask());

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

    public function destroy(Task $task, Request $request)
    {
        Gate::authorize('delete', $task);

        $page = $request->input('page', 1);
        $prevRouteName = $request->input('prevRouteName');
        $sort_field = $request->input('sort_field') ?? null;
        $sort_direction = $request->input('sort_direction') ?? null;
        $status = $request->input('status') ?? null;
        $name = $request->input('name') ?? null;
        $priority = $request->input('priority') ?? null;
        $assignees = $request->input('assignees') ?? null;
        $projects = $request->input('projects') ?? null;
        $project_id = $task->project->id;

        // dd($prevRouteName, $project_id, $page, $sort_field, $sort_direction, $name, $status, $priority, $assignees, $projects);

        $task->delete();

        if ($prevRouteName === 'task') {
            return to_route('task.index', [
                'page' => $page,
                'sort_field' => $sort_field,
                'sort_direction' => $sort_direction,
                'name' => $name,
                'status' => $status,
                'priority' => $priority,
                'assignees' => $assignees,
                'projects' => $projects
            ])
                ->with('success', 'Task updated successfully.');
        } else {
            return to_route('project.show', [
                'project' => $project_id,
                'page' => $page,
                'sort_field' => $sort_field,
                'sort_direction' => $sort_direction,
                'name' => $name,
                'status' => $status,
                'priority' => $priority,
                'assignees' => $assignees,
            ])
                ->with('success', 'Task updated successfully.');
        }
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
