<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Upvote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class UpvoteController extends Controller
{
    public function store(Request $request, Post $post)
    {
        $data = $request->validate([
            'upvote' => ['required', 'boolean']
        ]);

        Upvote::updateOrCreate(
            ['post_id' => $post->id, 'user_id' => Auth::id()],
            ['upvote' => $data['upvote']]
        );

        return back();
    }

    public function destroy(Post $post)
    {
        $post->upvotes()->where('user_id', Auth::id())->delete();

        return back();
    }
}
