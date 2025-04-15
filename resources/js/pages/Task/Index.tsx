import TaskViewSwitcher from '@/components/task-view-switcher';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { Users, type BreadcrumbItem } from '@/types';
import { Projects } from '@/types/projects';
import { QueryParams } from '@/types/queryParams';
import { Tasks } from '@/types/tasks';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tasks',
        href: '/task',
    },
];

interface IndexProps {
    tasks: Tasks;
    projects: Projects;
    users: Users;
    queryParams?: QueryParams | null;
    success: string | null;
}

const Index = ({ tasks, projects, users, queryParams }: IndexProps) => {
    const prevRouteName = tasks.meta.path.split('/')[3];
    const page = tasks.meta.current_page;
    console.log('prevRouteName', prevRouteName);
    console.log('page', page);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tasks" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" />
                    </div>
                </div>

                <div className="border-sidebar-border/70 dark:border-sidebar-border bg-card text-card-foreground relative min-h-[100vh] flex-1 overflow-auto rounded-xl border md:min-h-min">
                    {/* <PlaceholderPattern className="absolute inset-0 size-full stroke-neutral-900/20 dark:stroke-neutral-100/20" /> */}
                    <div className="flex w-full flex-col space-y-1.5">
                        <div className="w-full">
                            <TaskViewSwitcher
                                projects={projects}
                                queryParams={queryParams ?? null}
                                users={users}
                                tasks={tasks}
                                page={page}
                                prevRouteName={prevRouteName}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
