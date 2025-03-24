<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCommentRequest;
use App\Models\Comment;
use App\Models\Post;
use Illuminate\Contracts\Cache\Store;
use Illuminate\Support\Facades\Auth;

class CommentController extends Controller
{
    public function store(StoreCommentRequest $request, Post $post)
    {
        $validatedData = $request->validated();
        $validatedData['post_id'] = $post->id;
        $validatedData['created_by'] = Auth::id();

        Comment::create($validatedData);

        return back()
            ->with('success', 'Comment created successfully.');
    }

    public function destroy(Comment $comment)
    {
        if ($comment->created_by !== Auth::id()) {
            abort(403);
        }
        // dd($comment->created_by, Auth::id());
        // $postId = $comment->post_id;
        $comment->delete();

        return back()
            ->with('success', 'Comment deleted successfully.');
    }
}
