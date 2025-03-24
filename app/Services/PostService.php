<?php

namespace App\Services;

use App\Interfaces\PostInterface;
use App\Models\Post;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;

class PostService
{
    protected $postInterface;

    public function __construct(PostInterface $postInterface)
    {
        $this->postInterface = $postInterface;
    }

    public function getPosts($currentUserId): LengthAwarePaginator
    {
        return $this->postInterface->getPaginatedResults($currentUserId);
    }

    public function getPostWithUpvoteInfo(Post $post)
    {
        $post->upvote_count = $this->postInterface->getUpvoteCount($post);
        $post->user_has_upvoted = $this->postInterface->hasUserUpvoted($post);
        $post->user_has_downvoted = $this->postInterface->hasUserDownvoted($post);

        return $post;
    }

    public function createPost($validatedData)
    {
        $validatedData['created_by'] = Auth::id();
        $post = Post::create($validatedData);
        return $post;
    }

    public function updatePost($validatedData)
    {
        $post = Post::update($validatedData);
        return $post;
    }
}
