import { PROJECT_STATUS_CLASS_MAP, PROJECT_STATUS_TEXT_MAP } from '@/constants';
import { Project } from '@/types/project';
import { QueryParams } from '@/types/queryParams';
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
    handleEdit: (project: Project) => void,
    handleDelete: (project: Project) => void,
    handleCopy: (project: Project) => void,
    handleShow: (project: Project) => void,
): ColumnDef<Project>[] => [
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
        header: () => <SortableHeader field="name" label="Project Name" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <Button variant={'ghost'} onClick={() => handleShow(row.original)}>
                    {row.original.name}
                </Button>
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
                        className={`flex w-full items-center justify-center rounded-xl py-1 text-white ${PROJECT_STATUS_CLASS_MAP[status as keyof typeof PROJECT_STATUS_CLASS_MAP]}`}
                    >
                        {PROJECT_STATUS_TEXT_MAP[status as keyof typeof PROJECT_STATUS_TEXT_MAP]}
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
        accessorKey: 'assigned_project_manager',
        header: 'Assigned Project Manager', // Non-sortable
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <span>{row.original.assigned_project_manager?.name ?? 'N/A'}</span>
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
