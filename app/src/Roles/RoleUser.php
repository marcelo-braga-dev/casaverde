<?php

namespace App\src\Roles;

class RoleUser
{
    public static int $ADMIN = 1;
    public static int $CONSULTOR = 2;
    public static int $PRODUTOR = 3; // legado temporário
    public static int $CLIENTE = 4;

    public static string $ADMIN_NAME = 'admin';
    public static string $CONSULTOR_NAME = 'consultor';
    public static string $CLIENTE_NAME = 'cliente';

    public static function nameById(int $roleId): ?string
    {
        return match ($roleId) {
            1 => self::$ADMIN_NAME,
            2 => self::$CONSULTOR_NAME,
            4 => self::$CLIENTE_NAME,
            default => null,
        };
    }
}