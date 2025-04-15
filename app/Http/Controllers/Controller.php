<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class Controller
{
    public function extractQueryParams(Request $request): array
    {
        $filters = [
            'name' => $request->input('name') ?: null,
            'email' => $request->input('email') ?: null,
            'statuses' => $request->input('statuses') ?: null,
            'priorities' => $request->input('priorities') ?: null,
            'projects' => $request->input('projects') ?: null,
            'assignees' => $request->input('assignees') ?: null,
        ];

        $sortField = $request->input('sort_field', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');

        return [$filters, $sortField, $sortDirection];
    }
}
