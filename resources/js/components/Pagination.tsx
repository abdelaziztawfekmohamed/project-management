import { Link } from '@inertiajs/react';
interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: LinkItem[];
}
const Pagination = ({ links }: PaginationProps) => {
    return (
        <nav className="mt-4 text-center">
            {links.map((link) => (
                <Link
                    key={link.label}
                    preserveScroll
                    href={link.url || '#'}
                    className={`inline-block rounded-lg px-3 py-2 text-xs ${
                        link.active ? 'bg-green-600 text-white' : 'text-black dark:text-white'
                    } ${!link.url ? 'cursor-default opacity-50' : 'hover:bg-green-600 hover:text-white'}`}
                    aria-disabled={!link.url}
                >
                    {link.label.replace(/&[^;]+;/g, '')}
                </Link>
            ))}
        </nav>
    );
};

export default Pagination;
