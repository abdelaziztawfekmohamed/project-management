import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Added DialogHeader, Title, Description
import { PROJECT_STATUS_CLASS_MAP } from '@/constants';
import { hasRole } from '@/helpers';
import { AuthUser, SharedData } from '@/types';
import { Project } from '@/types/project';
import { usePage } from '@inertiajs/react';
import { DialogClose } from '@radix-ui/react-dialog';
import DateFormat from './task-date';
import { Label } from './ui/label';
import { Separator } from './ui/separator'; // Added Separator for visual structure

interface ShowProjectModalProps {
    project: Project;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ShowProjectModal({ project, open, onOpenChange }: ShowProjectModalProps) {
    const { user }: { user: AuthUser } = usePage<SharedData>().props.auth;

    // Determine if any role-specific fields will be shown
    const showProjectManagerFields = hasRole(user, 'project_manager') || hasRole(user, 'admin');
    const showRoleSpecificSection = showProjectManagerFields;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Using max-h-[90vh] allows content scrolling within the modal */}
            {/* Increased base padding slightly, refined max-width progression */}
            <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto rounded-lg p-0 sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
                {/* Use DialogHeader for semantic structure and consistent padding */}
                <DialogHeader className="p-4 pb-0 sm:p-6 sm:pb-0">
                    <DialogTitle className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-50">{project.name}</DialogTitle>
                    <DialogDescription className="pt-1 text-sm text-gray-600 dark:text-gray-400">
                        {project.description || 'No description provided.'}
                    </DialogDescription>
                </DialogHeader>

                {/* Separator after header */}
                <Separator className="my-4" />

                {/* Main content area with padding */}
                <div className="space-y-6 px-4 pb-4 sm:px-6 sm:pb-6">
                    {/* Grid layout for better alignment, especially on larger screens */}
                    {/* Increased gap for better spacing */}
                    <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                        {/* Status */}
                        <div className="flex items-center gap-2">
                            <Label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Status :</Label>
                            <span
                                className={`mt-1 inline-block rounded-full px-3 py-1 text-xs font-medium text-white ${
                                    PROJECT_STATUS_CLASS_MAP[project.status as keyof typeof PROJECT_STATUS_CLASS_MAP] || 'bg-gray-400' // Fallback class
                                }`}
                            >
                                {project.status}
                            </span>
                        </div>

                        {/* Due Date */}
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Due Date</Label>
                            {/* Assuming TaskDate component handles null/undefined gracefully */}
                            <DateFormat value={project.due_date} className="mt-1 block text-sm text-gray-800 dark:text-gray-200" />
                        </div>

                        {/* Created By */}
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Created By</Label>
                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{project.created_by?.name ?? 'N/A'}</p>
                        </div>

                        {/* Updated By */}
                        <div>
                            <Label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">Updated By</Label>
                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">{project.updated_by?.name ?? 'N/A'}</p>
                        </div>
                    </div>

                    {/* Role-based Fields Section (only shown if relevant fields exist) */}
                    {showRoleSpecificSection && (
                        <>
                            <Separator className="my-4" />
                            <div className="space-y-4">
                                <h3 className="text-sm font-semibold text-gray-500 uppercase dark:text-gray-400">Assignments</h3>
                                <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                                    {/* Team Leader */}
                                    {showProjectManagerFields && (
                                        <div>
                                            <Label className="text-xs font-semibold text-gray-500 uppercase dark:text-gray-400">
                                                Assigned Project Manager
                                            </Label>
                                            <p className="mt-1 text-sm text-gray-800 dark:text-gray-200">
                                                {project.assigned_project_manager?.name ?? 'N/A'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
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
