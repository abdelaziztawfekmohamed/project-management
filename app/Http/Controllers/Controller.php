<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

abstract class Controller
{
    public function extractQueryParams(Request $request): array
    {
        $filters = [
            'name' => $request->input('name') ?: null,
            'status' => $request->input('status') ?: null,
        ];

        $sortField = $request->input('sort_field', 'id');
        $sortDirection = $request->input('sort_direction', 'asc');

        return [$filters, $sortField, $sortDirection];
    }
}
