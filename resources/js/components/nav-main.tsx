import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { hasRole } from '@/helpers';
import { SharedData, type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    const { user } = usePage<SharedData>().props.auth;
    const conditionalExcludedMenuItem = 'My Tasks';
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map(
                    (item) =>
                        item.title !== conditionalExcludedMenuItem &&
                        (hasRole(user, 'admin') || hasRole(user, 'project_manager') || hasRole(user, 'team_leader')) && (
                            <SidebarMenuItem key={item.title}>
                                <SidebarMenuButton asChild isActive={item.href === page.url} tooltip={{ children: item.title }}>
                                    <Link href={item.href} prefetch>
                                        {item.icon && <item.icon />}
                                        <span>{item.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ),
                )}
            </SidebarMenu>
        </SidebarGroup>
    );
}
