<?php

use App\Enum\PermissionsEnum;
use App\Enum\RolesEnum;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UpvoteController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard');

Route::middleware(['auth', 'verified', sprintf(
    'role:%s|%s|%s|$s',
    RolesEnum::ProjectManager->value,
    RolesEnum::TeamLeader->value,
    RolesEnum::Admin->value,
    RolesEnum::TeamMember->value
)])->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::middleware(sprintf(
        'role:%s|%s|%s',
        RolesEnum::Admin->value,
        RolesEnum::ProjectManager->value,
        RolesEnum::TeamLeader->value,
    ))->group(function () {
        Route::get('/user', [UserController::class, 'index'])
            ->name('user.index');
    });

    Route::middleware(sprintf(
        'role:%s|%s|%s',
        RolesEnum::Admin->value,
        RolesEnum::ProjectManager->value,
        RolesEnum::TeamLeader->value
    ))->group(function () {
        Route::get('/user/{user}', [UserController::class, 'show'])
            ->name('user.show');

        Route::get('/user/{user}/edit', [UserController::class, 'edit'])
            ->name('user.edit');

        Route::put('/user/{user}', [UserController::class, 'update'])
            ->name('user.update');

        Route::delete('/user/{user}', [UserController::class, 'destroy'])
            ->name('user.destroy');

        Route::get('/user/create', [UserController::class, 'create'])
            ->name('user.create');

        Route::post('/user', [UserController::class, 'store'])
            ->name('user.store');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::middleware(sprintf(
        'role:%s|%s',
        RolesEnum::Admin->value,
        RolesEnum::ProjectManager->value,
        RolesEnum::TeamLeader->value
    ))->group(function () {
        Route::get('/project', [ProjectController::class, 'index'])
            ->name('project.index');

        Route::get('/project/{project}', [ProjectController::class, 'show'])
            ->name('project.show');
    });

    Route::middleware('role' . RolesEnum::Admin->value)->group(function () {
        Route::get('/project/create', [ProjectController::class, 'create'])
            ->name('project.create');

        Route::post('/project', [ProjectController::class, 'store'])
            ->name('project.store');

        Route::get('/project/{project}/edit', [ProjectController::class, 'edit'])
            ->name('project.edit');

        Route::put('/project/{project}', [ProjectController::class, 'update'])
            ->name('project.update');

        Route::delete('/project/{project}', [ProjectController::class, 'destroy'])
            ->name('project.destroy');
    });

    Route::get('/task/my-tasks', [TaskController::class, 'myTasks'])
        ->name('task.myTasks')->middleware(sprintf(
            'role:%s',
            RolesEnum::TeamMember->value
        ));

    Route::middleware(sprintf(
        'role:%s|%s',
        RolesEnum::Admin->value,
        RolesEnum::ProjectManager->value,
        RolesEnum::TeamLeader->value
    ))->group(function () {
        Route::get('/task', [TaskController::class, 'index'])
            ->name('task.index');

        Route::get('/task/{task}/edit', [TaskController::class, 'edit'])
            ->name('task.edit');

        Route::put('/task/{task}', [TaskController::class, 'update'])
            ->name('task.update');

        Route::get('/task/create', [TaskController::class, 'create'])
            ->name('task.create');

        Route::post('/task', [TaskController::class, 'store'])
            ->name('task.store');

        Route::delete('/task/{task}', [TaskController::class, 'destroy'])
            ->name('task.destroy');
    });

    Route::get('/task/{task}', [TaskController::class, 'show'])
        ->name('task.show')->middleware(sprintf(
            'role:%s|%s|%s|%s',
            RolesEnum::Admin->value,
            RolesEnum::ProjectManager->value,
            RolesEnum::TeamLeader->value,
            RolesEnum::TeamMember->value,
        ));

    Route::delete('post/{post}', [PostController::class, 'destroy'])
        ->name('post.destroy')
        ->middleware('role:' . RolesEnum::Admin->value);

    Route::resource('post', PostController::class)
        ->except('destroy');

    Route::post('/post/{post}/upvote', [UpvoteController::class, 'store'])
        ->name('upvote.store');
    Route::delete('/upvote/{post}', [UpvoteController::class, 'destroy'])
        ->name('upvote.destroy');

    Route::resource('comment', CommentController::class)
        ->except('destroy');

    Route::delete('/comment/{comment}', [CommentController::class, 'destroy'])
        ->name('comment.destroy')
        ->middleware('role:' . RolesEnum::Admin->value);
});


require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
