<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;

class UserController extends Controller
{
    protected $userService;

    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    public function index(Request $request)
    {
        Gate::authorize('viewAny', User::class);

        [$filters, $sortField, $sortDirection] = $this->extractQueryParams($request);

        $users = $this->userService->getUsers($filters, $sortField, $sortDirection);

        return Inertia::render("User/Index", [
            "users" => UserResource::collection($users),
            'queryParams' => $request->query() ?: null,
            'success' => session('success'),
            'authUser'  => new UserResource($this->userService->getTheAuthUser(Auth::user())),
        ]);
    }

    public function create()
    {
        Gate::authorize('create', User::class);

        return Inertia::render("User/Create");
    }

    public function store(StoreUserRequest $request)
    {
        Gate::authorize('create', User::class);

        $validatedData = $request->validated();

        $this->userService->createUser($validatedData);

        return to_route('user.index')
            ->with('success', 'User created successfully.');
    }

    public function edit(User $user)
    {
        Gate::authorize('update', $user);

        return Inertia::render("User/Edit", [
            "user" => new UserResource($user),
        ]);
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        Gate::authorize('update', $user);

        $validatedData = $request->validated();
        $this->userService->updateUser($validatedData, $user);

        return to_route('user.index')
            ->with('success', 'User ' . $user->name . ' updated successfully.');
    }

    public function destroy(User $user)
    {
        Gate::authorize('delete', $user);

        $user->delete();

        return to_route('user.index')
            ->with('success', 'User deleted successfully.');
    }
}
