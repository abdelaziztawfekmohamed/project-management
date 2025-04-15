import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { User, Users } from '@/types';
import { KeyPressEvent } from '@/types/keyPressEvent';
import { Project } from '@/types/project';
import { Projects } from '@/types/projects';
import { QueryParams } from '@/types/queryParams';
import { Status } from '@/URLconstants';
import { router } from '@inertiajs/react';
import { SquareCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { IoCloseSharp } from 'react-icons/io5';
import { toast } from 'sonner';
import AssigneeDropdown from './assignee-dropdown';
import { CreateProjectModal } from './create-project-modal';
import { DataTable } from './data-table';
import { DeleteProjectAlert } from './delete-project-alert';
import { EditProjectModal } from './edit-project-modal';
import { getColumns } from './get-project-columns';
import Pagination from './Pagination';
import { ShowProjectModal } from './show-project-modal';
import StatusDropdown from './status-dropdown';
import TextInput from './text-input';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const ProjectViewSwitcher = ({
    projects,
    users,
    queryParams,
    page,
}: {
    projects: Projects;
    users: Users;
    queryParams: QueryParams | null;
    page: number;
}) => {
    const [selectedStatuses, setSelectedStatuses] = useState<Status[]>([]);
    const [selectedAssignees, setSelectedAssignees] = useState<User[]>([]);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editProject, setEditProject] = useState<Project | null>(null);
    const [deleteProject, setDeleteProject] = useState<Project | null>(null);
    const [showProject, setShowProject] = useState<Project | null>(null);

    // Define valid views and determine the current view from queryParams
    const validViews = ['table', 'kanban', 'calendar'];
    const currentView = queryParams?.view && validViews.includes(queryParams.view) ? queryParams.view : 'table'; // Default to 'table' if view is invalid or absent
    console.log(projects);

    const { searchFieldChanged, onKeyPress } = useSearch({
        queryParams,
        routeName: 'project.index',
    });

    const { sortChanged } = useSort({ queryParams, routeName: 'project.index' });

    // Handle tab change by updating the URL with the new view
    const handleViewChange = (newView: string) => {
        router.get(
            route('project.index'),
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
        setSelectedAssignees([]);
        // Reset filters but preserve the current view
        router.get(route('project.index'), { view: currentView }, { preserveState: true });
    };
    // Action handlers
    const handleEdit = (project: Project) => {
        setEditProject(project);
        setIsEditDialogOpen(true);
    };

    const handleShow = (project: Project) => {
        setShowProject(project);
        setIsShowDialogOpen(true);
    };

    const handleDelete = (project: Project) => {
        setDeleteProject(project);
        setIsDeleteDialogOpen(true);
    };

    const handleCopy = (project: Project) => {
        navigator.clipboard.writeText(JSON.stringify(project, null, 2));
        toast.success('Copied', {
            description: 'Project data copied to clipboard',
            icon: <SquareCheck className="bg-green-600 text-white" />, // Green checkmark
        });
    };

    // Compute columns dynamically using useMemo
    const tableColumns = useMemo(
        () => getColumns(sortChanged, queryParams, handleEdit, handleDelete, handleCopy, handleShow),
        [sortChanged, queryParams],
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
                    <CreateProjectModal
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
                            />{' '}
                        </div>
                        <div className="mx-2 flex w-auto gap-2">
                            <div className="flex items-center space-x-4">
                                <StatusDropdown
                                    selectedStatuses={selectedStatuses}
                                    setSelectedStatuses={setSelectedStatuses}
                                    queryParams={queryParams ?? null}
                                    routeName={'project.index'}
                                />
                            </div>

                            <div className="flex items-center space-x-4">
                                <AssigneeDropdown
                                    assignees={users.data} // Pass backend projects
                                    selectedAssignees={selectedAssignees}
                                    setSelectedAssignees={setSelectedAssignees}
                                    queryParams={queryParams ?? null}
                                    routeName={'project.index'}
                                />
                            </div>

                            {(selectedStatuses.length > 0 || selectedAssignees.length > 0) && (
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
                        <DataTable columns={tableColumns} data={projects.data} />
                        <Pagination links={projects.meta.links} />
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        Data Kanban
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-0">
                        Data Calendar
                    </TabsContent>
                </>
            </div>
            {/* Edit Dialog */}
            {editProject && (
                <EditProjectModal
                    project={editProject}
                    users={users}
                    open={isEditDialogOpen}
                    onOpenChange={setIsEditDialogOpen}
                    page={page}
                    queryParams={queryParams}
                />
            )}

            {/* Show Dialog */}
            {showProject && <ShowProjectModal project={showProject} open={isShowDialogOpen} onOpenChange={setIsShowDialogOpen} />}

            {/* Delete Dialog */}
            {deleteProject && (
                <DeleteProjectAlert
                    project={deleteProject}
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    page={page}
                    queryParams={queryParams}
                />
            )}
        </Tabs>
    );
};

export default ProjectViewSwitcher;
