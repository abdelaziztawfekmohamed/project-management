<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    public static $wrap = false;
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'due_date' => Carbon::parse($this->due_date)->format('Y-m-d'),
            'status' => $this->status,
            'priority' => $this->priority,
            // 'project' => new ProjectResource($this->project),
            'project' => $this->project_id ? [
                'id' => $this->project_id,
                'name' => $this->project->name,
            ] : null,
            // 'assigned_team_leader' => $this->assigned_team_leader_id ? new UserResource($this->assignedTeamLeader) : null,
            // 'assigned_team_member' => $this->assigned_team_member_id ? new UserResource($this->assignedTeamMember) : null,
            'assigned_team_leader' => $this->assigned_team_leader_id ? [
                'id' => $this->assignedTeamLeader->id,
                'name' => $this->assignedTeamLeader->name,
            ] : null,
            'assigned_team_member' => $this->assigned_team_member_id ? [
                'id' => $this->assignedTeamMember->id,
                'name' => $this->assignedTeamMember->name,
            ] : null,
            // 'created_by' => new UserResource($this->createdBy),
            // 'updated_by' => new UserResource($this->updatedBy),
            'created_by' => [
                // 'id' => $this->createdBy->id,
                'name' => $this->createdBy->name,
            ],
            'updated_by' => [
                // 'id' => $this->updatedBy->id,
                'name' => $this->updatedBy->name,
            ],
            // 'parent_task' => $this->parent_id ? new TaskResource($this->parentTask) : null,
            // 'child_tasks' => $this->childTasks ? TaskResource::collection($this->childTasks) : null,
            'parent_task' => $this->parent_id ? [
                // 'id' => $this->parentTask->id,
                'name' => $this->parentTask->name,
            ] : null,
            'child_tasks' => $this->childTasks->isNotEmpty() ? $this->childTasks->map(fn($task) => [
                // 'id' => $task->id,
                'name' => $task->name,
            ]) : null,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'),
        ];
    }
}
