<?php

namespace App\Interfaces;

use App\Models\Post;

interface PostInterface
{
    public function getAllPosts();
    public function getPostComments(Post $post);
    public function getPaginatedResults($currentUserId);
    public function getUpvoteCount(Post $post);
    public function hasUserUpvoted(Post $post);
    public function hasUserDownvoted(Post $post);
}
