<?php

namespace App\Repositories;

use App\Interfaces\PostInterface;
use App\Models\Post;
use App\Models\Upvote;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PostRepository implements PostInterface
{
    public function getAllPosts()
    {
        return Post::query();
    }

    public function getPostComments(Post $post)
    {
        return $post->comments();
    }

    public function getPaginatedResults($currentUserId)
    {
        $pginatedQuery = Post::latest()
            ->withCount(['upvotes as upvote_count' => function ($query) {
                $query->select(DB::raw('SUM(CASE WHEN upvote = 1 THEN 1 ELSE -1 END)'));
            }])
            ->withExists([
                'upvotes as user_has_upvoted' => function ($query) use ($currentUserId) {
                    $query->where('user_id', $currentUserId)
                        ->where('upvote', 1);
                },
                'upvotes as user_has_downvoted' => function ($query) use ($currentUserId) {
                    $query->where('user_id', $currentUserId)
                        ->where('upvote', 0);
                }
            ])
            ->paginate();
        return $pginatedQuery;
    }

    public function getUpvoteCount(Post $post)
    {
        return Upvote::where('post_id', $post->id)
            ->sum(DB::raw('CASE WHEN upvote = 1 THEN 1 ELSE -1 END'));
    }

    public function hasUserUpvoted(Post $post)
    {
        return Upvote::where('post_id', $post->id)
            ->where('user_id', Auth::id())
            ->where('upvote', 1)
            ->exists();
    }

    public function hasUserDownvoted(Post $post)
    {
        return Upvote::where('post_id', $post->id)
            ->where('user_id', Auth::id())
            ->where('upvote', 0)
            ->exists();
    }
}
