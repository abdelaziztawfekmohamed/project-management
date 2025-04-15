<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'status',
        'priority',
        'due_date',
        'assigned_team_leader_id',
        'assigned_team_member_id',
        'created_by',
        'updated_by',
        'project_id',
    ];

    protected $casts = [
        'due_date' => 'datetime',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function assignedTeamLeader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_team_leader_id');
    }

    public function assignedTeamMember(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_team_member_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updatedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }

    public function parentTask(): BelongsTo
    {
        return $this->belongsTo(Task::class, 'parent_id');
    }

    public function childTasks(): HasMany
    {
        return $this->hasMany(Task::class, 'parent_id');
    }
}
