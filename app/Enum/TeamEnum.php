<?php

namespace App\Enum;

enum TeamEnum: string
{
    case BACKEND = 'backend';
    case FRONTEND = 'frontend';
    case TESTING = 'testing';
    case DEVOPS = 'devops';

    public static function categories(): array
    {
        return [
            self::BACKEND->value => 'backend',
            self::FRONTEND->value => 'frontend',
            self::TESTING->value => 'testing',
            self::DEVOPS->value => 'devops',
        ];
    }
}
