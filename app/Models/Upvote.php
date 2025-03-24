<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Upvote extends Model
{
    public $timestamps = false;

    protected $fillable = ['post_id', 'user_id', 'upvote'];

    public function post(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
}
