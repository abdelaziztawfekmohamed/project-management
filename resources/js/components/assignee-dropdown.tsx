import { hasRole } from '@/helpers';
import { useSearch } from '@/hooks/useSearch';
import { User } from '@/types';
import { QueryParams } from '@/types/queryParams';
import { CommandEmpty, CommandGroup, CommandInput } from 'cmdk';
import { useState } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Command, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

type AssigneeDropdownProps = {
    assignees: User[];
    selectedAssignees: User[];
    setSelectedAssignees: (assignees: User[]) => void;
    queryParams: QueryParams | null;
    routeName: string;
};

const AssigneeDropdown = ({ assignees, selectedAssignees, setSelectedAssignees, queryParams, routeName }: AssigneeDropdownProps) => {
    const [open, setOpen] = useState(false);

    const { searchFieldChanged } = useSearch({
        queryParams,
        routeName: routeName,
    });

    // Handle checkbox selection
    const handleCheckBoxSelection = (assignee: User) => {
        // Compute the new selected assignees
        const newSelectedAssignees = selectedAssignees.some((a) => a.name === assignee.name)
            ? selectedAssignees.filter((a) => a.name !== assignee.name) // Remove if already selected
            : [...selectedAssignees, assignee]; // Add if not selected

        // Update local state
        setSelectedAssignees(newSelectedAssignees);

        // Update the URL with the new selection
        searchFieldChanged({
            name: 'assignees',
            value: newSelectedAssignees.map((a) => a.name),
        });
    };

    return (
        <div className="flex items-center space-x-4">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        size="sm"
                        className="h-10 justify-start border-dashed px-3 hover:border-solid hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white"
                    >
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                                <GoPlusCircle />
                                <span className="text-sm">Assignee</span>
                            </div>
                            {selectedAssignees.length > 0 && (
                                <>
                                    <Separator orientation="vertical" className="border-1 border-gray-100 dark:border-gray-900" />
                                    <div className="flex items-center gap-2">
                                        {selectedAssignees.map((assignee: User) => (
                                            <Badge key={assignee.id} variant={'secondary'}>
                                                <span className="text-xs">{assignee.name}</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-65 px-3 sm:w-fit" side="bottom" align="center">
                    <Command>
                        <CommandInput placeholder="Select assignee..." className="mb-2 px-3 py-1 outline-gray-300" />
                        <CommandList>
                            <CommandEmpty>No assignees found.</CommandEmpty>
                            <CommandGroup>
                                {assignees.map(
                                    (assignee: User) =>
                                        (routeName === 'task.index'
                                            ? hasRole(assignee, 'team_member') || hasRole(assignee, 'team_leader')
                                            : hasRole(assignee, 'project_manager')) && (
                                            <CommandItem
                                                key={assignee.id}
                                                value={assignee.name} // For filtering
                                                className="flex justify-between"
                                                onSelect={() => handleCheckBoxSelection(assignee)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Checkbox checked={selectedAssignees.some((a) => a.name === assignee.name)} />
                                                    <span>{assignee.name}</span>
                                                </div>
                                            </CommandItem>
                                        ),
                                )}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default AssigneeDropdown;
