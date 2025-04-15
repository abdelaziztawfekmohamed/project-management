import { useSearch } from '@/hooks/useSearch';
import { Project } from '@/types/project';
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

type ProjectDropdownProps = {
    projects: Project[];
    selectedProjects: Project[];
    setSelectedProjects: (projects: Project[]) => void;
    queryParams: QueryParams | null;
};

const ProjectDropdown = ({ projects, selectedProjects, setSelectedProjects, queryParams }: ProjectDropdownProps) => {
    const [open, setOpen] = useState(false);

    const { searchFieldChanged } = useSearch({
        queryParams,
        routeName: 'task.index',
    });
    // Handle checkbox selection
    const handleCheckBoxSelection = (project: Project) => {
        // Compute the new selected projects
        const newSelectedProjects = selectedProjects.some((p) => p.name === project.name)
            ? selectedProjects.filter((p) => p.name !== project.name) // Remove if already selected
            : [...selectedProjects, project]; // Add if not selected

        // Update local state
        setSelectedProjects(newSelectedProjects);

        // Update the URL with the new selection
        searchFieldChanged({
            name: 'projects',
            value: newSelectedProjects.map((p) => p.name),
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
                                <span className="text-sm">Project</span>
                            </div>
                            {selectedProjects.length > 0 && (
                                <>
                                    <Separator orientation="vertical" className="border-1 border-gray-100 dark:border-gray-900" />
                                    <div className="flex items-center gap-2">
                                        {selectedProjects.map((project: Project) => (
                                            <Badge key={project.id} variant={'secondary'}>
                                                <span className="text-xs">{project.name}</span>
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
                        <CommandInput placeholder="Select project..." className="mb-2 px-3 py-1 outline-gray-300" />
                        <CommandList>
                            <CommandEmpty>No projects found.</CommandEmpty>
                            <CommandGroup>
                                {projects.map((project) => (
                                    <CommandItem
                                        key={project.id}
                                        value={project.name} // For filtering
                                        className="flex justify-between"
                                        onSelect={() => handleCheckBoxSelection(project)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Checkbox checked={selectedProjects.some((p) => p.name === project.name)} />
                                            <span>{project.name}</span>
                                        </div>
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

export default ProjectDropdown;
