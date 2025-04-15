import { Priority, Status } from '@/constants';
import { User } from './index';
import { Project } from './project';

export interface Task {
    id: number;
    name: string;
    description: string;
    project: Project;
    priority: keyof Priority;
    due_date: string;
    assigned_team_leader: User;
    assigned_team_member: User;
    child_tasks: Task[];
    parent_task: Task | null;
    parent_id: number | null;
    status: keyof Status;
    created_at: string;
    created_by: User;
    updated_by: User;
}
