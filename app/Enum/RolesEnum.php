<?php

namespace App\Enum;

enum RolesEnum: string
{
    case Admin = 'admin';
    case ProjectManager = 'project_manager';
    case TeamLeader = 'team_leader';
    case TeamMember = 'team_member';

    public static function labels(): array
    {
        return [
            self::Admin->value => 'admin',
            self::ProjectManager->value => 'project_manager',
            self::TeamLeader->value => 'team_leader',
            self::TeamMember->value => 'team_member',
        ];
    }

    public function label()
    {
        return match ($this) {
            self::Admin => 'admin',
            self::ProjectManager => 'project_manager',
            self::TeamLeader => 'team_leader',
            self::TeamMember => 'team_member',
        };
    }
}
