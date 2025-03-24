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
            // 'image_path' => $this->image_path,
            'project' => new ProjectResource($this->project),
            'assigned_team_leader' => $this->assigned_team_leader_id ? new UserResource($this->assignedTeamLeader) : null,
            'assigned_team_member' => $this->assigned_team_member_id ? new UserResource($this->assignedTeamMember) : null,
            // 'assigned_user' => new UserResource($this->assignedUser),
            'created_by' => new UserResource($this->createdBy),
            'updated_by' => new UserResource($this->updatedBy),
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'),
        ];
    }
}
