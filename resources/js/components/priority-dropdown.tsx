import { useSearch } from '@/hooks/useSearch';
import { QueryParams } from '@/types/queryParams';
import { priorities, Priority } from '@/URLconstants';
import { CommandEmpty, CommandGroup, CommandInput } from 'cmdk';
import { useState } from 'react';
import { GoPlusCircle } from 'react-icons/go';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Command, CommandItem, CommandList } from './ui/command';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Separator } from './ui/separator';

type PriorityDropdownProps = {
    selectedPriorities: Priority[];
    setSelectedPriorities: (priorities: Priority[]) => void;
    queryParams: QueryParams | null;
};

const PriorityDropdown = ({ selectedPriorities, setSelectedPriorities, queryParams }: PriorityDropdownProps) => {
    const [open, setOpen] = useState(false);
    console.log(selectedPriorities);

    const { searchFieldChanged } = useSearch({
        queryParams,
        routeName: 'task.index',
    });

    const handleCheckBoxSelection = (priority: Priority) => {
        // Compute the new selected priorities
        const newSelectedPriorities = selectedPriorities.some((p) => p.value === priority.value)
            ? selectedPriorities.filter((p) => p.value !== priority.value) // Remove if already selected
            : [...selectedPriorities, priority]; // Add if not selected

        // Update local state
        setSelectedPriorities(newSelectedPriorities);

        // Update the URL with the new selection
        searchFieldChanged({
            name: 'priorities',
            value: newSelectedPriorities.map((p) => p.value),
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
                            {/* Priority Label */}
                            <div className="flex items-center gap-2">
                                <GoPlusCircle />
                                <span className="text-sm">Priority</span>
                            </div>
                            {selectedPriorities.length > 0 && (
                                <>
                                    {/* Separator */}
                                    <Separator orientation="vertical" className="border-1 border-gray-100 dark:border-gray-900" />
                                    {/* Badges */}
                                    <div className="flex items-center gap-2">
                                        {selectedPriorities.map((priority) => (
                                            <Badge key={priority.value} variant={'secondary'}>
                                                <span className="text-xs">{priority.label}</span>
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
                        <CommandInput placeholder="Change Priority..." className="mb-2 px-3 py-1 outline-gray-300" />
                        {/* command list of Items */}
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup>
                                {priorities.map((priority) => (
                                    <CommandItem
                                        key={priority.value}
                                        value={priority.value}
                                        className="flex justify-between"
                                        onSelect={() => handleCheckBoxSelection(priority)}
                                    >
                                        <div className="flex items-center gap-3">
                                            {/* checkbox*/}
                                            <Checkbox checked={selectedPriorities.some((s) => s.value === priority.value)} />
                                            {/* item icon */}
                                            <priority.icon />
                                            {/* item label */}
                                            <span>{priority.label}</span>
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

export default PriorityDropdown;
