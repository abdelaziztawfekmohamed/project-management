<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateTaskRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "name" => ['required', 'max:255'],
            "description" => ['nullable', 'string'],
            'due_date' => ['nullable', 'date'],
            'project_id' => ['required', 'exists:projects,id'],
            'assigned_team_leader_id' => ['nullable'],
            'assigned_team_member_id' => ['nullable'],
            'status' => [
                'required',
                Rule::in(['backlog', 'todo', 'in_progress', 'in_review', 'done'])
            ],
            'priority' => [
                'required',
                Rule::in(['low', 'medium', 'high'])
            ],
            'page' => ['nullable', 'integer'],
            'prevRouteName' => ['nullable', 'string']
        ];
    }
}
