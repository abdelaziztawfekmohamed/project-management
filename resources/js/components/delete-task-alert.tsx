import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { QueryParams } from '@/types/queryParams';
import { Task } from '@/types/task';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
interface DeleteTaskAlertProps {
    task: Task;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page?: number;
    prevRouteName?: string;
    queryParams: QueryParams | null;
}
export function DeleteTaskAlert({ task, open, onOpenChange, page, prevRouteName, queryParams }: DeleteTaskAlertProps) {
    const handleDelete = () => {
        router.delete(
            route('task.destroy', {
                task: task.id,
                page: page,
                prevRouteName: prevRouteName,
                ...queryParams,
            }),
            {
                onSuccess: () => {
                    toast.success('Task Deleted', {
                        description: `Task "${task.name}" has been deleted successfully.`,
                    });
                    onOpenChange(false); // Close the dialog after successful deletion
                },
                onError: () => {
                    toast.error('Deletion Failed', {
                        description: 'An error occurred while deleting the task.',
                    });
                },
            },
        );
    };

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure you want to delte the task?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your task and remove the task from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 text-white" onClick={() => handleDelete()}>
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
