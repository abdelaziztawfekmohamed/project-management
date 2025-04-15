<?php

namespace App\Providers;

use App\Interfaces\ProjectInterface;
use App\Repositories\ProjectRepository;
use Illuminate\Support\Facades\Vite;
use App\Interfaces\TaskInterface;
use App\Interfaces\UserInterface;
use App\Interfaces\PostInterface;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Project;
use App\Models\Task;
use App\Policies\CommentPolicy;
use App\Policies\PostPolicy;
use App\Policies\ProjectPolicy;
use App\Policies\TaskPolicy;
use App\Repositories\TaskRepository;
use App\Repositories\UserRepository;
use App\Repositories\PostRepository;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(ProjectInterface::class, ProjectRepository::class);
        $this->app->bind(TaskInterface::class, TaskRepository::class);
        $this->app->bind(UserInterface::class, UserRepository::class);
        $this->app->bind(PostInterface::class, PostRepository::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        Model::automaticallyEagerLoadRelationships();
        Gate::policy(Project::class, ProjectPolicy::class);
        Gate::policy(Task::class, TaskPolicy::class);
        Gate::policy(Comment::class, CommentPolicy::class);
        Gate::policy(Post::class, PostPolicy::class);
    }
}
