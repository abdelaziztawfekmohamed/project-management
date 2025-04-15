import { AuthUser, User } from '@/types';

export function can(user: User | AuthUser, permission: string): boolean {
    return user.permissions.includes(permission);
}

export function hasRole(user: User | AuthUser, role: string): boolean {
    if (typeof user.roles[0] === 'object') {
        return user.roles.some((r) => r.name === role);
    }
    if (user.roles) {
        return user.roles.includes(role);
    }
    return false;
}
