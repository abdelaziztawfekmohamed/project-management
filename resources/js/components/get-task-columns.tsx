import { TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP, TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from '@/constants';
import { Users } from '@/types';
import { Projects } from '@/types/projects';
import { QueryParams } from '@/types/queryParams';
import { Task } from '@/types/task';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import SortableHeader from './sortable-header';
import DateFormat from './task-date';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

// Define the getColumns function to accept sortChanged and queryParams
export const getColumns = (
    sortChanged: (field: string) => void,
    queryParams: QueryParams | null,
    projects: Projects,
    users: Users,
    handleEdit: (task: Task) => void,
    handleDelete: (task: Task) => void,
    handleCopy: (task: Task) => void,
    handleShow: (task: Task) => void,
): ColumnDef<Task>[] => [
    {
        accessorKey: 'id',
        header: () => <SortableHeader field="id" label="ID" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 pl-3 text-sm font-medium">
                <span>{row.original.id}</span>
            </div>
        ),
    },
    {
        accessorKey: 'name',
        header: () => <SortableHeader field="name" label="Task Name" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <Button variant={'ghost'} onClick={() => handleShow(row.original)}>
                    {row.original.name}
                </Button>
            </div>
        ),
    },
    {
        accessorKey: 'project',
        header: 'Project Name', // Non-sortable
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <span>{row.original.project.name}</span>
            </div>
        ),
    },
    {
        accessorKey: 'status',
        header: () => <SortableHeader field="status" label="Status" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => {
            const status = row.original.status;
            return (
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <span
                        className={`flex w-full items-center justify-center rounded-xl py-1 text-white ${TASK_STATUS_CLASS_MAP[status as keyof typeof TASK_STATUS_CLASS_MAP]}`}
                    >
                        {TASK_STATUS_TEXT_MAP[status as keyof typeof TASK_STATUS_TEXT_MAP]}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'priority',
        header: () => <SortableHeader field="priority" label="Priority" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => {
            const priority = row.original.priority;
            return (
                <div className="flex items-center justify-center gap-2 text-sm font-medium">
                    <span
                        className={`flex w-full items-center justify-center rounded-xl py-1 text-white ${TASK_PRIORITY_CLASS_MAP[priority as keyof typeof TASK_PRIORITY_CLASS_MAP]}`}
                    >
                        {TASK_PRIORITY_TEXT_MAP[priority as keyof typeof TASK_PRIORITY_TEXT_MAP]}
                    </span>
                </div>
            );
        },
    },
    {
        accessorKey: 'created_at', // Corrected from 'created_date' to match cell usage
        header: () => <SortableHeader field="created_at" label="Created Date" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 pl-3 text-sm font-medium">
                <span>{format(row.original.created_at, 'PPP')}</span>
            </div>
        ),
    },
    {
        accessorKey: 'due_date',
        header: () => <SortableHeader field="due_date" label="Due Date" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => (
            <DateFormat
                value={row.original.due_date}
                status={row.original.status}
                className="flex items-center justify-start gap-2 pl-2 text-sm font-medium"
            />
        ),
    },
    {
        accessorKey: 'created_by',
        header: 'Created By', // Non-sortable
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <span>{row.original.created_by.name}</span>
            </div>
        ),
    },
    {
        accessorKey: 'updated_by',
        header: 'Updated By', // Non-sortable
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <span>{row.original.updated_by?.name ?? 'N/A'}</span>
            </div>
        ),
    },
    {
        accessorKey: 'assigned_team_leader',
        header: 'Assigned Team Leader', // Non-sortable
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <span>{row.original.assigned_team_leader?.name ?? 'N/A'}</span>
            </div>
        ),
    },
    {
        accessorKey: 'assigned_team_member',
        header: 'Assigned Team Member', // Non-sortable
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <span>{row.original.assigned_team_member?.name ?? 'N/A'}</span>
            </div>
        ),
    },
    {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(row.original)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleDelete(row.original)}>Delete</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopy(row.original)}>Copy</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
