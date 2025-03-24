<?php

namespace App\Http\Controllers;

use App\Http\Requests\StorePostRequest;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use App\Models\Post;
use App\Services\PostService;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Contracts\Support\ValidatedData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PostController extends Controller
{
    protected $postService;

    public function __construct(PostService $postService)
    {
        $this->postService = $postService;
    }

    public function index()
    {
        $user = Auth::user();
        $currentUserId = $user->id;

        $paginatedPosts = $this->postService->getPosts($currentUserId);

        return Inertia::render('Post/Index', [
            'posts' => PostResource::collection($paginatedPosts),
            'user' => new UserResource($user),
            'success' => session('success'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Post/Create');
    }

    public function store(StorePostRequest $request)
    {
        $validatedData = $request->validated();
        // dd($validatedData);
        $this->postService->createPost($validatedData);

        return to_route('post.index')
            ->with('success', 'Post created successfully.');
    }

    public function show(Post $post)
    {
        $user = Auth::user();
        $post = $this->postService->getPostWithUpvoteInfo($post);

        // dd($post->comments);
        // foreach ($post->comments as $comment) {
        //     dd($comment->user);
        // }

        return Inertia::render('Post/Show', [
            'post' => new PostResource($post),
            'comments' => $post->comments->map(function ($comment) {
                return [
                    'id' => $comment->id,
                    'comment' => $comment->comment,
                    'created_at' => $comment->created_at->format('Y-m-d H:i:s'),
                    'user' => new UserResource($comment->user),
                ];
            }),
            'user' => new UserResource($user),
            'success' => session('success'),
        ]);
    }

    public function edit(Post $post)
    {
        return Inertia::render('Post/Edit', [
            'post' => new PostResource($post)
        ]);
    }

    public function update(Request $request, Post $post)
    {
        $validatedData = $request->validated();
        $this->postService->updatePost($validatedData);

        return to_route('post.index')
            ->with('success', 'Post updated successfully.');
    }

    public function destroy(Post $post)
    {
        $post->delete();

        return to_route('post.index')
            ->with('success', 'Post deleted successfully.');
    }
}
