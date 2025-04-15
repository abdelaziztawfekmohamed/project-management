import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Added DialogHeader, Title, Description
import { User } from '@/types';
import { DialogClose } from '@radix-ui/react-dialog';
import { Label } from './ui/label';
import { Separator } from './ui/separator'; // Added Separator for visual structure

interface ShowMemberModalProps {
    user: User;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShowMemberModal({ user, open, onOpenChange }: ShowMemberModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Using max-h-[90vh] allows content scrolling within the modal */}
            {/* Increased base padding slightly, refined max-width progression */}
            <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto rounded-lg p-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                {/* Use DialogHeader for semantic structure and consistent padding */}
                <DialogHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
                    <DialogTitle className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-50">{user.name}</DialogTitle>
                </DialogHeader>

                {/* Separator after header */}
                <Separator className="my-4" />

                {/* Main content area with padding */}
                <div className="space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
                    {/* Grid layout for better alignment, especially on larger screens */}
                    {/* Increased gap for better spacing */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">{user.email}</div>

                    {/* Role-based Fields Section (only shown if relevant fields exist) */}

                    <>
                        <Separator className="my-4" />
                        <div className="space-y-4">
                            <h3 className="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">Assignments</h3>
                            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                <div>
                                    <Label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Role:</Label>
                                    <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{user.roles[0]}</p>
                                </div>
                            </div>
                        </div>
                    </>
                </div>

                {/* Footer with consistent padding and border */}
                <DialogFooter className="border-t border-gray-200 bg-gray-50 p-4 sm:justify-end dark:border-gray-700 dark:bg-gray-800">
                    <DialogClose asChild>
                        {/* Button takes full width on mobile, auto on larger screens */}
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
