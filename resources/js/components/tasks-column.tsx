import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Column, ColumnDef } from '@tanstack/react-table';
import { ArrowUpCircle, CheckCircle2, Circle, XCircle } from 'lucide-react';
import { IoMdArrowDown, IoMdArrowUp } from 'react-icons/io';
import { IoArrowBack, IoArrowDown } from 'react-icons/io5';
// import {Status,Priority,Task}from '@/constants';
import { Task } from '@/types/task';
import { ArrowUpDown } from 'lucide-react';
import { GrHide } from 'react-icons/gr';
import { Checkbox } from './ui/checkbox';

export type Status = 'todo' | 'in_progress' | 'in_review' | 'done';
export type Priority = 'low' | 'medium' | 'high';

function renderStatusIcons(status: Status) {
    switch (status) {
        case 'todo':
            return Circle;
        case 'in_progress':
            return ArrowUpCircle;
        case 'in_review':
            return ArrowUpCircle;
        case 'done':
            return CheckCircle2;
        default:
            return XCircle;
    }
}

function renderPriorityIcons(priority: Priority) {
    switch (priority) {
        case 'low':
            return IoArrowDown;
        case 'medium':
            return IoArrowBack;
        case 'high':
            return IoMdArrowUp;
        default:
            return IoMdArrowUp;
    }
}

function formatDate(date: Date) {
    // Extract Date Parts
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    //Add Original Suffix
    const suffix = day % 10 == 1 && day != 11 ? 'st' : day % 10 == 2 && day != 12 ? 'nd' : day % 10 == 3 && day != 13 ? 'rd' : 'th';

    return `${day}${suffix} ${month} ${year}`;
}

type SortableHeaderProps = {
    column: Column<Task, unknown>;
    label: string;
};

const SortableHeader = ({ column, label }: SortableHeaderProps) => {
    const isSorted = column.getIsSorted();
    const SortingIcon = isSorted === 'asc' ? IoMdArrowUp : isSorted === 'desc' ? IoMdArrowDown : ArrowUpDown;
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <div
                    className={`flex cursor-pointer items-center gap-1 p-2 py-[14px] select-none ${isSorted ? 'text-primary' : ''}`}
                    aria-label={`Sort by ${label}`}
                >
                    {label}
                    <SortingIcon className="h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" side="bottom">
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                    <IoMdArrowUp className="mr-2 h-4 w-4" />
                    Asc
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                    <IoMdArrowDown className="mr-2 h-4 w-4" />
                    Desc
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <GrHide className="mr-2 h-4 w-4" />
                    Hide
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export const tasksColumn: ColumnDef<Task>[] = [
    {
        id: 'select',
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label="Select row" />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'id',
        header: 'Task',
    },
    {
        accessorKey: 'title',
        header: ({ column }) => <SortableHeader column={column} label="Title" />,
        cell: ({ row }) => {
            const taskTitle = row.original.name;
            return (
                <div className="flex items-center gap-2">
                    <span>{taskTitle}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'Status',
        header: ({ column }) => <SortableHeader column={column} label="Status" />,
        cell: ({ row }) => {
            const StatusIcon = renderStatusIcons(row.original.status as Status);
            const status = row.original.status;
            return (
                <div className="flex items-center gap-2 text-sm">
                    {StatusIcon && <StatusIcon size={17} className="text-gray-600 opacity-95" />}
                    <span>{status}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'Priority',
        header: ({ column }) => <SortableHeader column={column} label="Priority" />,
        cell: ({ row }) => {
            const PriorityIcon = renderPriorityIcons(row.original.priority as Priority);
            const priority = row.original.priority;
            return (
                <div className="flex items-center gap-2 text-sm">
                    {PriorityIcon && <PriorityIcon size={17} className="text-gray-600 opacity-95" />}
                    <span>{priority}</span>
                </div>
            );
        },
    },
    {
        accessorKey: 'createdAt',
        header: ({ column }) => <SortableHeader column={column} label="Created At" />,
        cell: ({ row }) => {
            const date = row.original.created_at;
            const formattedDate = formatDate(new Date(date));
            return formattedDate;
        },
    },
    {
        id: 'actions',
    },
];
