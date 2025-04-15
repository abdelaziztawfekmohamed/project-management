import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { ReactNode } from 'react';
interface AppLayoutTemplateProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    button?: ReactNode;
}
export default function AppSidebarLayout({ children, breadcrumbs = [], button }: AppLayoutTemplateProps) {
    return (
        <AppShell variant="sidebar">
            <AppSidebar />
            <AppContent variant="sidebar" className="overflow-auto">
                <AppSidebarHeader breadcrumbs={breadcrumbs} button={button} />
                {children}
            </AppContent>
        </AppShell>
    );
}
