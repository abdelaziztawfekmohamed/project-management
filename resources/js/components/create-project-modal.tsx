import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { hasRole } from '@/helpers';
import { AuthUser, SharedData, User, Users } from '@/types';
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

interface CreateProjectModalProps {
    users: Users;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page?: number;
    queryParams?: QueryParams | null;
}

export function CreateProjectModal({ users, open, onOpenChange, page, queryParams }: CreateProjectModalProps) {
    const { user }: { user: AuthUser } = usePage<SharedData>().props.auth;

    // console.log(user);
    // console.log(users);

    const { data, setData, post, errors } = useForm({
        name: '',
        description: '',
        status: '',
        due_date: '',
        assigned_project_manager_id: '',
    });

    const onSubmit: FormEventHandler = (e) => {
        e.preventDefault();

        post(
            route('project.store', {
                page: page,
                ...queryParams,
            }),
            {
                onSuccess: () => {
                    toast.success('Project Created', {
                        description: `Project "${data.name}" has been created successfully.`,
                    });
                    onOpenChange(false); // Close the dialog
                },
                onError: () => {
                    toast.error('Creation Failed', {
                        description: 'An error occurred while creating the project.',
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
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>Add a new Project here. Click save when you're done.</DialogDescription>
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
                                isFocused={true}
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

                                <Select name="project_status" onValueChange={(value) => setData('status', value)}>
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
                                                            <SelectItem value={user.name} key={user.id}>
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
