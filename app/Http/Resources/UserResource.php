<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class UserResource extends JsonResource
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
            'email' => $this->email,
            'image_path' => $this->image_path && !(str_starts_with($this->image_path, 'http')) ?
                Storage::url($this->image_path) : $this->image_path,
            'created_at' => Carbon::parse($this->created_at)->format('Y-m-d'),
            'roles' => $this->getRoleNames(),
            // 'permissions' => $this->getAllPermissions()->pluck('name'),
            'team' => $this->team ? [
                'name' => $this->team->name,
            ] : null,
        ];
    }
}
