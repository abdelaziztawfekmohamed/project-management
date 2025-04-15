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
import { Project } from '@/types/project';
import { QueryParams } from '@/types/queryParams';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';
interface DeleteProjectAlertProps {
    project: Project;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page?: number;
    queryParams: QueryParams | null;
}
export function DeleteProjectAlert({ project, open, onOpenChange, page, queryParams }: DeleteProjectAlertProps) {
    const handleDelete = () => {
        router.delete(
            route('project.destroy', {
                project: project.id,
                page: page,
                ...queryParams,
            }),
            {
                onSuccess: () => {
                    toast.success('Project Deleted', {
                        description: `Project "${project.name}" has been deleted successfully.`,
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
                    <AlertDialogTitle>Are you absolutely sure you want to delete the project?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your project and remove the project from our servers.
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
