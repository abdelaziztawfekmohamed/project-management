export interface Status {
    todo: string;
    in_progress: string;
    in_review: string;
    done: string;
}

export interface Priority {
    low: string;
    medium: string;
    high: string;
}

export const PROJECT_STATUS_CLASS_MAP: Status = {
    todo: 'bg-amber-500',
    in_progress: 'bg-blue-500',
    in_review: 'bg-slate-500',
    done: 'bg-green-500',
};

export const PROJECT_STATUS_TEXT_MAP: Status = {
    todo: 'Todo',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done',
};

export const TASK_STATUS_CLASS_MAP: Status = {
    todo: 'bg-amber-500',
    in_progress: 'bg-blue-500',
    in_review: 'bg-slate-500',
    done: 'bg-green-500',
};

export const TASK_STATUS_TEXT_MAP: Status = {
    todo: 'Todo',
    in_progress: 'In Progress',
    in_review: 'In Review',
    done: 'Done',
};

export const TASK_PRIORITY_CLASS_MAP: Priority = {
    low: 'bg-gray-600',
    medium: 'bg-amber-600',
    high: 'bg-red-600',
};

export const TASK_PRIORITY_TEXT_MAP: Priority = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
};
