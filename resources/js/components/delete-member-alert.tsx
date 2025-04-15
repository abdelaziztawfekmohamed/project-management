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
import { User } from '@/types';
import { QueryParams } from '@/types/queryParams';
import { router } from '@inertiajs/react';
import { toast } from 'sonner';

interface DeleteMemberAlertProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    page?: number;
    queryParams: QueryParams | null;
}
export function DeleteMemberAlert({ user, open, onOpenChange, page, queryParams }: DeleteMemberAlertProps) {
    const handleDelete = () => {
        router.delete(
            route('user.destroy', {
                user: user.id,
                page: page,
                ...queryParams,
            }),
            {
                onSuccess: () => {
                    toast.success('User Deleted', {
                        description: ` ${user.name} has been deleted successfully.`,
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
                    <AlertDialogTitle>Are you absolutely sure you want to delete this user?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your user and remove the user from our servers.
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
