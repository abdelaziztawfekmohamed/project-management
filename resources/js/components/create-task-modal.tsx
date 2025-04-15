import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { hasRole } from '@/helpers';
import { AuthUser, SharedData, User, Users } from '@/types';
import { Project } from '@/types/project';
import { Projects } from '@/types/projects';
import { QueryParams } from '@/types/queryParams';
import { useForm, usePage } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { SelectLabel } from '@radix-ui/react-select';
import { PlusIcon } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import InputError from './input-error';
import TextInput from './text-input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';

interface CreateTaskModalProps {
    projects: Projects;
    users: Users;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page?: number;
    queryParams?: QueryParams | null;
}

export function CreateTaskModal({ projects, users, open, onOpenChange, page, queryParams }: CreateTaskModalProps) {
    const { user }: { user: AuthUser } = usePage<SharedData>().props.auth;
    console.log(user);
    console.log(users);
    const { data, setData, post, errors } = useForm({
        name: '',
        description: '',
        status: '',
        priority: '',
        due_date: '',
        assigned_team_leader_id: '',
        assigned_team_member_id: '',
        project_id: '',
    });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(
            route('task.store', {
                page: page,
                ...queryParams,
            }),
            {
                onSuccess: () => {
                    toast.success('Task Created', {
                        description: `Task "${data.name}" has been created successfully.`,
                    });
                    onOpenChange(false); // Close the dialog
                },
                onError: () => {
                    toast.error('Creation Failed', {
                        description: 'An error occurred while creating the task.',
                    });
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button size={'sm'} className="w-full bg-green-600 text-white hover:bg-green-700 lg:w-auto dark:bg-green-600">
                    <PlusIcon className="mr-1 size-4" />
                    Add New
                </Button>
            </DialogTrigger>
            <DialogContent className="h-[80%] overflow-auto sm:max-h-[80%] md:max-w-[70%]">
                <DialogHeader>
                    <DialogTitle>Create task</DialogTitle>
                    <DialogDescription>Add a new task here. Click save when you're done.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
                            <div className="w-full items-center gap-4 md:w-[47%]">
                                <Label htmlFor="task_project" className="text-right">
                                    Project
                                </Label>
                                <Select name="task_project" onValueChange={(value) => setData('project_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a project" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-70 w-75 overflow-auto sm:w-fit lg:w-fit">
                                        <SelectGroup>
                                            {projects.data.map((project: Project) => (
                                                <SelectItem value={String(project.id)} key={project.id}>
                                                    {project.name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.project_id} className="mt-2" />
                            </div>
                            <div className="w-full items-center gap-4 md:w-[47%]">
                                <Label htmlFor="task_name" className="text-right">
                                    Task Name
                                </Label>
                                <TextInput
                                    id="task_name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="task_description" className="text-right">
                                Task Description
                            </Label>

                            <Textarea
                                id="task_description"
                                name="name"
                                value={data.description}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('description', e.target.value)}
                            />

                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="task_due_date" className="text-right">
                                Due Date
                            </Label>

                            <TextInput
                                id="task_due_date"
                                type="date"
                                name="due_date"
                                value={data.due_date}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('due_date', e.target.value)}
                            />

                            <InputError message={errors.due_date} className="mt-2" />
                        </div>
                        <div className="flex flex-col items-center justify-between gap-2 md:flex-row">
                            <div className="w-full items-center gap-4 md:w-[47%]">
                                <Label htmlFor="task_status" className="text-right">
                                    Status
                                </Label>

                                <Select name="task_status" onValueChange={(value) => setData('status', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-70 w-75 overflow-auto sm:w-fit lg:w-fit">
                                        <SelectGroup>
                                            <SelectLabel>Task Status</SelectLabel>
                                            <SelectItem value="todo">Todo</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="in_review">In Review</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.status} className="mt-2" />
                            </div>
                            <div className="w-full items-center gap-4 md:w-[47%]">
                                <Label htmlFor="task_priority" className="text-right">
                                    Priority
                                </Label>

                                <Select name="task_priority" onValueChange={(value) => setData('priority', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Priority" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-70 w-75 overflow-auto sm:w-fit lg:w-fit">
                                        <SelectGroup>
                                            <SelectLabel>Task Priority</SelectLabel>
                                            <SelectItem value="low">Low</SelectItem>
                                            <SelectItem value="medium">Medium</SelectItem>
                                            <SelectItem value="high">High</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.status} className="mt-2" />
                            </div>
                        </div>
                        {(hasRole(user, 'project_manager') || hasRole(user, 'admin')) && (
                            <div className="items-center gap-4">
                                <Label htmlFor="task_assigned_team_leader" className="text-right">
                                    Assigned Team Leader
                                </Label>

                                <Select name="task_assigned_team_leader" onValueChange={(value) => setData('assigned_team_leader_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Team Leader" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-70 w-75 overflow-auto sm:w-fit lg:w-fit">
                                        <SelectGroup>
                                            <SelectLabel>Team Leader</SelectLabel>
                                            {users.data.map(
                                                (user: User) =>
                                                    hasRole(user, 'team_leader') && (
                                                        <SelectItem value={String(user.id)} key={user.id}>
                                                            {user.name}
                                                        </SelectItem>
                                                    ),
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.assigned_team_leader_id} className="mt-2" />
                            </div>
                        )}
                        {(hasRole(user, 'team_leader') || hasRole(user, 'admin')) && (
                            <div className="items-center gap-4">
                                <Label htmlFor="task_assigned_team_member" className="text-right">
                                    Assigned Team Member
                                </Label>

                                <Select name="task_assigned_team_member" onValueChange={(value) => setData('assigned_team_member_id', value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Team Member" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-70 w-75 overflow-auto sm:w-fit lg:w-fit">
                                        <SelectGroup>
                                            <SelectLabel>Team Member</SelectLabel>
                                            {users.data.map(
                                                (user: User) =>
                                                    hasRole(user, 'team_member') && (
                                                        <SelectItem value={String(user.id)} key={user.id}>
                                                            {user.name}
                                                        </SelectItem>
                                                    ),
                                            )}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.assigned_team_member_id} className="mt-2" />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                            Submit
                        </Button>
                        <DialogClose asChild>
                            <Button variant="secondary" type="button" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
