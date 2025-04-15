<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
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
            'assigned_project_manager' => $this->assigned_project_manager_id ?
                [
                    'id' => $this->assignedProjectManager->id,
                    'name' => $this->assignedProjectManager->name,
                ] : null,
            // 'image_path' => $this->image_path,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'),
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
        ];
    }
}
