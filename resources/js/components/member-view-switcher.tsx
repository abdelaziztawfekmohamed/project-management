import { useSearch } from '@/hooks/useSearch';
import { useSort } from '@/hooks/useSort';
import { User, Users } from '@/types';
import { KeyPressEvent } from '@/types/keyPressEvent';
import { QueryParams } from '@/types/queryParams';
import { router } from '@inertiajs/react';
import { SquareCheck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { DataTable } from './data-table';
import { DeleteMemberAlert } from './delete-member-alert';
import { getColumns } from './get-member-columns';
import Pagination from './Pagination';
import { ShowMemberModal } from './show-member-modal';
import TextInput from './text-input';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const MemberViewSwitcher = ({ users, queryParams, page }: { users: Users; queryParams: QueryParams | null; page: number }) => {
    // const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [isShowDialogOpen, setIsShowDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [deleteUser, setDeleteUser] = useState<User | null>(null);
    const [showUser, setShowUser] = useState<User | null>(null);

    // Define valid views and determine the current view from queryParams
    const validViews = ['table', 'kanban', 'calendar'];
    const currentView = queryParams?.view && validViews.includes(queryParams.view) ? queryParams.view : 'table'; // Default to 'table' if view is invalid or absent
    console.log(users);

    const { searchFieldChanged, onKeyPress } = useSearch({
        queryParams,
        routeName: 'user.index',
    });

    const { sortChanged } = useSort({ queryParams, routeName: 'user.index' });

    // Handle tab change by updating the URL with the new view
    const handleViewChange = (newView: string) => {
        router.get(
            route('user.index'),
            { ...queryParams, view: newView }, // Merge with existing query parameters
            {
                preserveState: true, // Preserve current page state
                preserveScroll: true, // Prevent scrolling to top
                replace: true, // Update URL without adding to history
            },
        );
    };

    const handleShow = (user: User) => {
        setShowUser(user);
        setIsShowDialogOpen(true);
    };

    const handleDelete = (user: User) => {
        setDeleteUser(user);
        setIsDeleteDialogOpen(true);
    };

    const handleCopy = (user: User) => {
        navigator.clipboard.writeText(JSON.stringify(user, null, 2));
        toast.success('Copied', {
            description: 'User data copied to clipboard',
            icon: <SquareCheck className="bg-green-600 text-white" />, // Green checkmark
        });
    };

    // Compute columns dynamically using useMemo
    const tableColumns = useMemo(() => getColumns(sortChanged, queryParams, handleDelete, handleCopy, handleShow), [sortChanged, queryParams]);

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
                </div>
                <Separator className="my-4" />
                {/* Add filters */}
                <div className="flex w-full overflow-auto">
                    <div className="flex w-full justify-start gap-2">
                        <div className="mx-2 flex w-[20%] justify-start">
                            <TextInput
                                className="my-2 mt-2 w-full"
                                placeholder="Filter By Name....."
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
                        <div className="mx-2 flex w-[20%] justify-start">
                            <TextInput
                                className="my-2 mt-2 w-full"
                                placeholder="Filter By Email....."
                                defaultValue={queryParams?.email || ''}
                                onBlur={(e) =>
                                    searchFieldChanged({
                                        name: 'email',
                                        value: [e.target.value],
                                    })
                                }
                                onKeyUp={(e) => onKeyPress('email', e as KeyPressEvent)}
                            />{' '}
                        </div>
                    </div>
                </div>
                <Separator className="my-4" />
                <>
                    <TabsContent value="table" className="mt-0">
                        <DataTable columns={tableColumns} data={users.data} />
                        <Pagination links={users.meta.links} />
                    </TabsContent>
                    <TabsContent value="kanban" className="mt-0">
                        Data Kanban
                    </TabsContent>
                    <TabsContent value="calendar" className="mt-0">
                        Data Calendar
                    </TabsContent>
                </>
            </div>

            {/* Show Dialog */}
            {showUser && <ShowMemberModal user={showUser} open={isShowDialogOpen} onOpenChange={setIsShowDialogOpen} />}

            {/* Delete Dialog */}
            {deleteUser && (
                <DeleteMemberAlert
                    user={deleteUser}
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                    page={page}
                    queryParams={queryParams}
                />
            )}
        </Tabs>
    );
};

export default MemberViewSwitcher;
