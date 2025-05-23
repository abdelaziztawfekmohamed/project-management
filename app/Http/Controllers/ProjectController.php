<?php

namespace App\Http\Controllers;

use App\Enum\RolesEnum;
use App\Models\Project;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\TaskResource;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\ProjectService;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class ProjectController extends Controller
{
    protected $projectService;
    protected $userService;

    public function __construct(ProjectService $projectService, UserService $userService)
    {
        $this->projectService = $projectService;
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', Project::class);

        $user = Auth::user();

        [$filters, $sortField, $sortDirection] = $this->extractQueryParams($request);

        $projects = $this->projectService->getProjects($filters, $sortField, $sortDirection, $user)->appends($request->query());

        // dd(Auth::user()->hasRole(RolesEnum::Admin->value));
        // dd($this->userService->getAllUsers());
        $users = $this->userService->getAllUsers()->get();

        return Inertia::render("Project/Index", [
            "projects" => ProjectResource::collection($projects),
            'queryParams' => $request->query() ?: null,
            'users' => UserResource::collection($users),
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', Project::class);

        return Inertia::render("Project/Create");
    }

    public function store(StoreProjectRequest $request)
    {
        Gate::authorize('create', Project::class);

        $validatedData = $request->validated();

        $this->projectService->createProject($validatedData);

        return to_route('project.index')
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project, Request $request)
    {
        Gate::authorize('view', $project);

        // $managedProjectIds = Project::where('assigned_project_manager_id', Auth::user()->id)->pluck('id');
        // $teamIds = ProjectTeam::whereIn('project_id', $managedProjectIds)->pluck('team_id');
        // // dd($teamIds);
        // $teamMembersIds = User::whereIn('team_id', $teamIds)->pluck('id');
        // foreach ($teamMembersIds as $teamMemberId) {
        //     if ($teamMemberId === 76) {
        //         dd($teamMemberId, 'action is authorized');
        //     }
        // }
        // dd($teamMembersIds);
        // $users = User::whereIn('id', $teamMembersIds);
        // dd($users->contains($model));
        // dd($teamMembersIds->in_array($model->id));

        // $projectTeams = $project->teams();
        // dd($projectTeams->teamMembers()->get());


        // // dd($project, $request);

        // dd($project->teams()->get());

        // Eager load teams with their team members and associated users
        // $project->load(['teams.teamMembers.user']);

        // // Extract all unique users from the project's teams
        // $teamMembersUsers = $project->teams->flatMap(function ($team) {
        //     return $team->teamMembers->pluck('user');
        // })->unique();

        // // Debugging output
        // dd($teamMembersUsers);

        [$filters, $sortField, $sortDirection] = $this->extractQueryParams($request);

        $tasks = $this->projectService->getProjectTasks($project, $filters, $sortField, $sortDirection);

        $page = $request->input('page', 1);

        return Inertia::render("Project/Show", [
            "project" => new ProjectResource($project),
            "tasks" => TaskResource::collection($tasks),
            'queryParams' => $request->query() ?: null,
            'page' => $page,
            'success' => session('success'),
            'teams' => $project->teams
        ]);
    }

    public function edit(Project $project, Request $request)
    {
        Gate::authorize('update', $project);

        $page = $request->input('page', 1);

        return Inertia::render("Project/Edit", [
            "project" => new ProjectResource($project),
            'page' => $page
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project)
    {
        Gate::authorize('update', $project);

        $page = $request->input('page', 1);
        $validatedData = $request->validated();
        $this->projectService->updateProject($validatedData, $project);

        return to_route('project.index', [
            'page' => $page,
        ])
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project, Request $request)
    {
        Gate::authorize('delete', $project);

        $page = $request->input('page', 1);
        $sort_field = $request->input('sort_field') ?? null;
        $sort_direction = $request->input('sort_direction') ?? null;
        $status = $request->input('status') ?? null;
        $name = $request->input('name') ?? null;
        $assignees = $request->input('assignees') ?? null;
        // dd($page);
        // dd($request);
        $project->delete();

        return to_route('project.index', [
            'page' => $page,
            'sort_field' => $sort_field,
            'sort_direction' => $sort_direction,
            'name' => $name,
            'status' => $status,
            'assignees' => $assignees,
        ])
            ->with('success', 'Project deleted successfully.');
    }
}
