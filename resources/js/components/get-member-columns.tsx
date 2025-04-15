import { User } from '@/types';
import { QueryParams } from '@/types/queryParams';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { MoreHorizontal } from 'lucide-react';
import SortableHeader from './sortable-header';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

// Define the getColumns function to accept sortChanged and queryParams
export const getColumns = (
    sortChanged: (field: string) => void,
    queryParams: QueryParams | null,
    handleDelete: (user: User) => void,
    handleCopy: (user: User) => void,
    handleShow: (user: User) => void,
): ColumnDef<User>[] => [
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
        header: () => <SortableHeader field="name" label="Name" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <Button variant={'ghost'} onClick={() => handleShow(row.original)}>
                    {row.original.name}
                </Button>
            </div>
        ),
    },
    {
        accessorKey: 'email',
        header: () => <SortableHeader field="email" label="Email" sortChanged={sortChanged} queryParams={queryParams} />,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-sm font-medium">
                <Button variant={'ghost'} onClick={() => handleShow(row.original)}>
                    {row.original.email}
                </Button>
            </div>
        ),
    },
    {
        accessorKey: 'role',
        header: () => <div className="ml-4 flex items-center gap-2">Role</div>,
        cell: ({ row }) => (
            <div className="flex items-center justify-start gap-2 text-sm font-medium">
                <Button variant={'ghost'} onClick={() => handleShow(row.original)}>
                    {row.original.roles[0]}
                </Button>
            </div>
        ),
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
                    <DropdownMenuItem onClick={() => handleDelete(row.original)}>Delete</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCopy(row.original)}>Copy</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        ),
    },
];
