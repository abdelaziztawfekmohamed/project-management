import { QueryParams } from '@/types/queryParams';
import { router } from '@inertiajs/react';
import { useCallback } from 'react';

interface UseSortProps {
    queryParams?: QueryParams | null;
    routeName: string;
}

export const useSort = ({ queryParams = {}, routeName }: UseSortProps) => {
    const sortChanged = useCallback(
        (name: string) => {
            const updatedParams = { ...queryParams };
            if (name === updatedParams.sort_field) {
                if (updatedParams.sort_direction === 'asc') {
                    updatedParams.sort_direction = 'desc';
                } else {
                    // Third click: remove sorting
                    delete updatedParams.sort_field;
                    delete updatedParams.sort_direction;
                }
            } else {
                // First click: set to ascending
                updatedParams.sort_field = name;
                updatedParams.sort_direction = 'asc';
            }
            router.get(route(routeName), updatedParams);
        },
        [queryParams, routeName],
    );

    return { sortChanged };
};
