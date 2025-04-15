import { QueryParams } from '@/types/queryParams';
import { router } from '@inertiajs/react';
import { useCallback } from 'react';

interface UseSearchProps {
    queryParams?: QueryParams | null;
    routeName: string;
}

export const useSearch = ({ queryParams, routeName }: UseSearchProps) => {
    const searchFieldChanged = useCallback(
        ({ name, value }: { name: string; value: string[] }) => {
            const updatedParams = { ...queryParams };
            if (value.length > 0) {
                updatedParams[name] = value.join(',');
            } else {
                delete updatedParams[name];
            }
            router.get(route(routeName), updatedParams, { preserveState: true });
        },
        [queryParams, routeName],
    );

    const onKeyPress = useCallback(
        (name: string, e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== 'Enter') return;
            searchFieldChanged({ name, value: [e.currentTarget.value] });
        },
        [searchFieldChanged],
    );

    return { searchFieldChanged, onKeyPress };
};
