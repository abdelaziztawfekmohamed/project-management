import { Status } from '@/constants';
import { User } from './index';

export interface Project {
    id: number;
    name: string;
    description: string;
    due_date: string;
    status: keyof Status;
    assigned_project_manager: User;
    created_at: string;
    created_by: User;
    updated_by: User;
}
