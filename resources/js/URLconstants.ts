import { ArrowUpCircle, CheckCircle2, Circle, LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons';
import { IoMdArrowUp } from 'react-icons/io';
import { IoArrowBack, IoArrowDown } from 'react-icons/io5';

export type Status = {
    value: string;
    label: string;
    icon: IconType | LucideIcon;
};

export const statuses: Status[] = [
    { value: 'todo', label: 'Todo', icon: Circle },
    { value: 'in_progress', label: 'In Progress', icon: ArrowUpCircle },
    { value: 'in_review', label: 'In Review', icon: ArrowUpCircle },
    { value: 'done', label: 'Done', icon: CheckCircle2 },
];

export type Priority = {
    value: string;
    label: string;
    icon: IconType | LucideIcon;
};

export const priorities: Priority[] = [
    {
        value: 'low',
        label: 'Low',
        icon: IoArrowDown,
    },
    {
        value: 'medium',
        label: 'Medium',
        icon: IoArrowBack,
    },
    {
        value: 'high',
        label: 'High',
        icon: IoMdArrowUp,
    },
];
