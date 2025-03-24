<?php

namespace App\Enum;

enum PermissionsEnum: string
{
    case EditUsers = 'edit_users';
    case EditPosts = 'edit_posts';
    case EditComments = 'edit_comments';
    case EditProjects = 'edit_projects';
    case EditTasks = 'edit_tasks';

    case CreateUsers = 'create_users';
    case CreatePosts = 'create_posts';
    case CreateComments = 'create_comments';
    case CreateProjects = 'create_projects';
    case CreateTasks = 'create_tasks';

    case DeleteUsers = 'delete_users';
    case DeletePosts = 'delete_posts';
    case DeleteComments = 'delete_comments';
    case DeleteProjects = 'delete_projects';
    case DeleteTasks = 'delete_tasks';

    case UpvoteDownvote = 'upvote_downvote';
}
