import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { hasRole } from '@/helpers';
import { AuthUser, SharedData, User, Users } from '@/types';
import { Project } from '@/types/project';
import { useForm, usePage } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import { SelectLabel } from '@radix-ui/react-select';
import { FormEventHandler, useEffect } from 'react';

import { Status } from '@/constants';
import { QueryParams } from '@/types/queryParams';
import { toast } from 'sonner';
import InputError from './input-error';
import TextInput from './text-input';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
interface EditProjectModalProps {
    project: Project;
    users: Users;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page?: number;
    queryParams?: QueryParams | null;
}
export function EditProjectModal({ project, users, open, onOpenChange, page, queryParams }: EditProjectModalProps) {
    const { user }: { user: AuthUser } = usePage<SharedData>().props.auth;
    // console.log(user);
    // console.log(users);
    // console.log('Task:', task);

    const { data, setData, put, errors } = useForm({
        name: project.name || '',
        description: project.description || '',
        status: project.status || '',
        due_date: project.due_date || '',
        assigned_project_manager_id: project.assigned_project_manager ? String(project.assigned_project_manager.id) : '',
        page: page || 1,
    });

    console.log('Assigned Project Manager:', project.assigned_project_manager);

    // console.log('Task Assigned Team Leader ID:', task?.assigned_team_leader?.id);
    // console.log('Task status:', task.status);

    // console.log('Form Data Assigned Team Leader ID:', data?.assigned_team_leader_id);
    // console.log('Task status:', data.status);

    // console.log(
    //     'Available Team Leaders:',
    //     users.data.filter((user: User) => hasRole(user, 'team_leader')).map((u) => ({ id: String(u.id), name: u.name })),
    // );

    // Inside EditTaskModal component
    useEffect(() => {
        setData({
            name: project.name || '',
            description: project.description || '',
            status: project.status || '',
            due_date: project.due_date || '',
            assigned_project_manager_id: project.assigned_project_manager ? String(project.assigned_project_manager.id) : '',
            page: page || 1,
        });
    }, [project, page, setData]); // Dependency array includes task, page, prevRouteName, and setData

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        put(
            route('project.update', {
                project: project.id,
                page: page,
                ...queryParams,
            }),
            {
                onSuccess: () => {
                    toast.success('Project Updated', {
                        description: `Project "${data.name}" has been updated successfully.`,
                    });
                    onOpenChange(false); // Close the dialog
                },
                onError: () => {
                    toast.error('Update Failed', {
                        description: 'An error occurred while updating the task.',
                    });
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="h-[80%] overflow-auto sm:max-h-[80%] md:max-w-[70%]">
                <DialogHeader>
                    <DialogTitle>update project</DialogTitle>
                    <DialogDescription>update the project here. Click update when you're done.</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="items-center gap-4">
                            <Label htmlFor="project_name" className="text-right">
                                Project Name
                            </Label>
                            <TextInput
                                id="project_name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('name', e.target.value)}
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="project_description" className="text-right">
                                Project Description
                            </Label>

                            <Textarea
                                id="project_description"
                                name="name"
                                value={data.description}
                                className="mt-1 block w-full"
                                onChange={(e) => setData('description', e.target.value)}
                            />

                            <InputError message={errors.description} className="mt-2" />
                        </div>
                        <div className="items-center gap-4">
                            <Label htmlFor="project_due_date" className="text-right">
                                Due Date
                            </Label>

                            <TextInput
                                id="project_due_date"
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
                                <Label htmlFor="project_status" className="text-right">
                                    Status
                                </Label>

                                <Select name="project_status" value={data.status} onValueChange={(value) => setData('status', value as keyof Status)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-70 w-75 overflow-auto sm:w-fit lg:w-fit">
                                        <SelectGroup>
                                            <SelectLabel>Project Status</SelectLabel>
                                            <SelectItem value="todo">Todo</SelectItem>
                                            <SelectItem value="in_progress">In Progress</SelectItem>
                                            <SelectItem value="in_review">In Review</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <InputError message={errors.status} className="mt-2" />
                            </div>
                            {hasRole(user, 'admin') && (
                                <div className="w-full items-center gap-4 md:w-[47%]">
                                    <Label htmlFor="assigned_project_manager_id" className="text-right">
                                        Assigned Project Manager
                                    </Label>

                                    <Select
                                        name="assigned_project_manager_id"
                                        value={data.assigned_project_manager_id}
                                        onValueChange={(value) => setData('assigned_project_manager_id', value)}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Project Manager" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-70 w-75 overflow-auto sm:w-fit lg:w-fit">
                                            <SelectGroup>
                                                <SelectLabel>Project Manager</SelectLabel>
                                                {users.data.map(
                                                    (user: User) =>
                                                        hasRole(user, 'project_manager') && (
                                                            <SelectItem value={String(user.id)} key={user.id}>
                                                                {user.name}
                                                            </SelectItem>
                                                        ),
                                                )}
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <InputError message={errors.assigned_project_manager_id} className="mt-2" />
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" className="bg-green-600 text-white hover:bg-green-700">
                            Submit
                        </Button>
                        <DialogClose asChild>
                            <Button variant="secondary" type="button">
                                Cancel
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
