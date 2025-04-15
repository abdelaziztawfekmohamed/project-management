import { QueryParams } from '@/types/queryParams';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import { Button } from './ui/button';

interface SortableHeaderProps {
    field: string;
    label: string;
    sortChanged: (field: string) => void;
    queryParams: QueryParams | null;
}

const SortableHeader = ({ field, label, sortChanged, queryParams }: SortableHeaderProps) => {
    const isSorted = queryParams?.sort_field === field;
    const direction = isSorted ? queryParams.sort_direction : null;

    return (
        <Button
            variant="ghost"
            onClick={() => sortChanged(field)}
            className={isSorted ? (direction === 'asc' ? 'text-green-600' : 'text-red-600') : ''}
        >
            {label}
            {isSorted ? (
                direction === 'asc' ? (
                    <ArrowUp className="ml-2 h-4 w-4" />
                ) : (
                    <ArrowDown className="ml-2 h-4 w-4" />
                )
            ) : (
                <ArrowUpDown className="ml-2 h-4 w-4" />
            )}
        </Button>
    );
};

export default SortableHeader;
