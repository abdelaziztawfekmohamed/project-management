import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { User, Users } from '@/types';
import { KeyPressEvent } from '@/types/keyPressEvent';
import { Project } from '@/types/project';
import { Projects } from '@/types/projects';
import { QueryParams } from '@/types/queryParams';
import { Task } from '@/types/task';
import { Tasks } from '@/types/tasks';
import { Priority, Status } from '@/URLconstants';
import { router } from '@inertiajs/react';
import { SquareCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { toast } from 'sonner';
import AssigneeDropdown from './assignee-dropdown';
import { CreateTaskModal } from './create-task-modal';
import { DataTable } from './data-table';
import { DeleteTaskAlert } from './delete-task-alert';
import { EditTaskModal } from './edit-task-modal';
import { getColumns } from './get-task-columns';
import Pagination from './Pagination';
import PriorityDropdown from './priority-dropdown';
import ProjectDropdown from './project-dropdown';
import { ShowTaskModal } from './show-task-modal';
import StatusDropdown from './status-dropdown';
import TextInput from './text-input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const TaskViewSwitcher = ({
    tasks,
    projects,
    users,
    queryParams,
    page,
    prevRouteName,
}: {
    tasks: Tasks;
    projects: Projects;
    users: Users;
    queryParams: QueryParams | null;
    page: number;
    prevRouteName: string;
}) => {
    const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
    const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([]);
    const [selectedProjects, setSelectedProjects] = useState<Project[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editTask, setEditTask] = useState<Task | null>(null);
    const [deleteTask, setDeleteTask] = useState<Task | null>(null);
    const [showTask, setShowTask] = useState<Task | null>(null);

    // Define valid views and determine the current view from queryParams
    const validViews = ['table', 'kanban', 'calendar'];
    const currentView = queryParams?.view && validViews.includes(queryParams.view) ? queryParams.view : 'table'; // Default to 'table' if view is invalid or absent
    console.log(tasks);

    const { searchFieldChanged, onKeyPress } = useSearch({
        queryParams,
        routeName: 'task.index',
    });

    const { sortChanged } = useSort({ queryParams, routeName: 'task.index' });

    // Handle tab change by updating the URL with the new view
    const handleViewChange = (newView: string) => {
        router.get(
            route('task.index'),
            { ...queryParams, view: newView }, // Merge with existing query parameters
            {
                preserveState: true, // Preserve current page state
                preserveScroll: true, // Prevent scrolling to top
                replace: true, // Update URL without adding to history
            },
        );
    };

    const handleReset = () => {
        setSelectedStatuses([]);
        setSelectedPriorities([]);
        setSelectedProjects([]);
        setSelectedAssignees([]);
        // Reset filters but preserve the current view
        router.get(route('task.index'), { view: currentView }, { preserveState: true });
    };
    // Action handlers
    const handleEdit = (task: Task) => {
        setEditTask(task);
        setIsEditDialogOpen(true);
    };

    const handleShow = (task: Task) => {
        setShowTask(task);
        setIsShowDialogOpen(true);
    };

    const handleDelete = (task: Task) => {
        setDeleteTask(task);
        setIsDeleteDialogOpen(true);
    };

    const handleCopy = (task: Task) => {
        navigator.clipboard.writeText(JSON.stringify(task, null, 2));
        toast.success('Copied', {
            description: 'Task data copied to clipboard',
            icon: <SquareCheck className="bg-green-600 text-white" />, // Green checkmark
        });
    };

    // Compute columns dynamically using useMemo
    const tableColumns = useMemo(
        () => getColumns(sortChanged, queryParams, projects, users, handleEdit, handleDelete, handleCopy, handleShow),
        [sortChanged, queryParams, projects, users],
    );

    return (
        <Tabs value={currentView} onValueChange={handleViewChange} className="w-full flex-1 rounded-lg border">
            <div className="flex h-full flex-col overflow-auto p-2">
                <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-auto" value="table">
                            <span className="text-sm">Table</span>
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-auto" value="kanban">
                            <span className="text-sm">Kanban</span>
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-auto" value="calendar">
                            <span className="text-sm">Calendar</span>
                        </TabsTrigger>
                    </TabsList>
                    <CreateTaskModal
                        projects={projects}
                        users={users}
                        open={isCreateDialogOpen}
                        onOpenChange={setIsCreateDialogOpen}
                        queryParams={queryParams}
                        page={page}
                    />
                </div>
                <Separator className="my-4" />
                {/* Add filters */}
                <div className="flex w-full overflow-auto">
                    <div className="flex w-full flex-col justify-start gap-1">
                        <div className="mx-2 flex w-[50%] justify-start">
                            <TextInput
                                className="my-2 mt-2 w-full"
                                placeholder="Filter By Search....."
                                defaultValue={queryParams?.name || ''}
                                onBlur={(e) =>
                                    searchFieldChanged({
                                        name: 'name',
                                        value: [e.target.value],
                                    })
                                }
                                onKeyUp={(e) => onKeyPress('name', e as KeyPressEvent)}
                            />
                        </div>
                        <div className="mx-2 flex w-auto gap-2">
                            <div className="flex items-center space-x-4">
                                <StatusDropdown
                                    selectedStatuses={selectedStatuses}
                                    setSelectedStatuses={setSelectedStatuses}
                                    queryParams={queryParams ?? null}
                                    routeName={'task.index'}
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <PriorityDropdown
                                    selectedPriorities={selectedPriorities}
                                    setSelectedPriorities={setSelectedPriorities}
                                    queryParams={queryParams ?? null}
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <ProjectDropdown
                                    projects={projects.data} // Pass backend projects
                                    selectedProjects={selectedProjects}
                                    setSelectedProjects={setSelectedProjects}
                                    queryParams={queryParams ?? null}
                                />
                            </div>
                            <div className="flex items-center space-x-4">
                                <AssigneeDropdown
                                    assignees={users.data} // Pass backend projects
                                    selectedAssignees={selectedAssignees}
                                    setSelectedAssignees={setSelectedAssignees}
                                    queryParams={queryParams ?? null}
                                    routeName={'task.index'}
                                />
                            </div>
                            {(selectedStatuses.length > 0 ||
                                selectedPriorities.length > 0 ||
                                selectedProjects.length > 0 ||
                                selectedAssignees.length > 0) && (
                                <Button
                                    variant={'ghost'}
                                    className="h-10 hover:border-solid hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
                                    onClick={handleReset}
                                >
                                    <span>Reset</span>
                                    <IoCloseSharp />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <>
                    <TabsContent value="table" className="mt-0">
                        <DataTable columns={tableColumns} data={tasks.data} />
                        <Pagination links={tasks.meta.links} />
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        Data Kanban
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-0">
                        Data Calendar
                    </TabsContent>
                </>
                {/* Edit Dialog */}
                {editTask && (
                    <EditTaskModal
                        task={editTask}
                        projects={projects}
                        users={users}
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                        page={page}
                        prevRouteName={prevRouteName}
                        queryParams={queryParams}
                    />
                )}

                {/* Show Dialog */}
                {showTask && <ShowTaskModal task={showTask} open={isShowDialogOpen} onOpenChange={setIsShowDialogOpen} />}

                {/* Delete Dialog */}
                {deleteTask && (
                    <DeleteTaskAlert
                        task={deleteTask}
                        open={isDeleteDialogOpen}
                        onOpenChange={setIsDeleteDialogOpen}
                        page={page}
                        prevRouteName={prevRouteName}
                        queryParams={queryParams}
                    />
                )}
            </div>
        </Tabs>
    );
};

export default TaskViewSwitcher;
