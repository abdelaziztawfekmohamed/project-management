import { useSearch } from '@/hooks/useSearch';
import { QueryParams } from '@/types/queryParams';
import { Status, statuses } from '@/URLconstants';
import { CommandEmpty, CommandGroup, CommandInput } from 'cmdk';
import { useState } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Command, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

type StatusDropdownProps = {
    selectedStatuses: Status[];
    setSelectedStatuses: (statuses: Status[]) => void;
    queryParams: QueryParams | null;
    routeName: string;
};

const StatusDropdown = ({ selectedStatuses, setSelectedStatuses, queryParams, routeName }: StatusDropdownProps) => {
    const [open, setOpen] = useState(false);
    console.log(selectedStatuses);
    const { searchFieldChanged } = useSearch({
        queryParams,
        routeName: routeName,
    });

    const handleCheckBoxSelection = (status: Status) => {
        // Compute the new selected statuses
        const newSelectedStatuses = selectedStatuses.some((s) => s.value === status.value)
            ? selectedStatuses.filter((s) => s.value !== status.value) // Remove if already selected
            : [...selectedStatuses, status]; // Add if not selected

        // Update local state
        setSelectedStatuses(newSelectedStatuses);

        // Update the URL with the new selection
        searchFieldChanged({
            name: 'statuses',
            value: newSelectedStatuses.map((s) => s.value),
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
                            {/* Status Label */}
                            <div className="flex items-center gap-2">
                                <GoPlusCircle />
                                <span className="text-sm">Status</span>
                            </div>
                            {selectedStatuses.length > 0 && (
                                <>
                                    {/* Separator */}
                                    <Separator orientation="vertical" className="border-1 border-gray-100 dark:border-gray-900" />
                                    {/* Badges */}
                                    <div className="flex items-center gap-2">
                                        {selectedStatuses.map((status) => (
                                            <Badge key={status.value} variant={'secondary'}>
                                                <span className="text-xs">{status.label}</span>
                                            </Badge>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </Button>
                </PopoverTrigger>
                {/* Popover Content */}
                <PopoverContent className="w-52 p-0" side="bottom" align="center">
                    {/* command component */}
                    <Command>
                        {/* command input */}
                        <CommandInput placeholder="Change status..." className="mb-2 px-3 py-1 outline-gray-300" />
                        {/* command list of Items */}
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {statuses.map((status) => (
                                    <CommandItem
                                        key={status.value}
                                        value={status.value}
                                        className="flex justify-between"
                                        onSelect={() => handleCheckBoxSelection(status)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* checkbox*/}
                                            <Checkbox checked={selectedStatuses.some((s) => s.value === status.value)} />
                                            {/* item icon */}
                                            <status.icon />
                                            {/* item label */}
                                            <span>{status.label}</span>
                                        </div>
                                        <span>23</span>
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
};

export default StatusDropdown;
