import { LucideIcon } from 'lucide-react';
/*
 ** I need to import the same type but for @react-icons library
 */
import { IconType } from 'react-icons';

import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | IconType | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    permissions: string[];
    roles: Role[];
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    permissions: string[];
    roles: string[];
    created_at: string;
    updated_at: string;
    role: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Users {
    data: User[];
    meta: Meta;
}
