import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookCheck, BookOpen, Folder, LayoutGrid, Users } from 'lucide-react';
import { FaTasks } from 'react-icons/fa';
import { GoProjectSymlink } from 'react-icons/go';
import { PiMicrosoftTeamsLogoLight } from 'react-icons/pi';
import { RiUserCommunityLine } from 'react-icons/ri';

import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Projects',
        href: '/project',
        icon: GoProjectSymlink,
    },
    {
        title: 'Tasks',
        href: '/task',
        icon: BookCheck,
    },
    {
        title: 'My Tasks',
        href: '/task/my-tasks',
        icon: FaTasks,
    },
    {
        title: 'Members',
        href: '/user',
        icon: Users,
    },
    {
        title: 'Teams',
        href: '/team',
        icon: PiMicrosoftTeamsLogoLight,
    },
    {
        title: 'Community',
        href: '/post',
        icon: RiUserCommunityLine,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            asChild
                            className="mb-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0"
                        >
                            <Link href="/dashboard" className="flex h-full w-full items-center justify-center" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
