<?php

namespace App\src\Roles;

class RoleUser
{
    public static int $ADMIN = 1;
    public static int $CONSULTOR = 2;
    public static int $PRODUTOR = 3;
    public static int $CLIENTE = 4;

    public static string $ADMIN_NAME = 'admin';
    public static string $CONSULTOR_NAME = 'consultor';
    public static string $PRODUTOR_NAME = 'produtor';
    public static string $CLIENTE_NAME = 'cliente';

    public static function nameById(int $roleId): ?string
    {
        return match ($roleId) {
            self::$ADMIN => self::$ADMIN_NAME,
            self::$CONSULTOR => self::$CONSULTOR_NAME,
            self::$PRODUTOR => self::$PRODUTOR_NAME,
            self::$CLIENTE => self::$CLIENTE_NAME,
            default => null,
        };
    }

    public static function idByName(?string $roleName): ?int
    {
        return match ($roleName) {
            self::$ADMIN_NAME => self::$ADMIN,
            self::$CONSULTOR_NAME => self::$CONSULTOR,
            self::$PRODUTOR_NAME => self::$PRODUTOR,
            self::$CLIENTE_NAME => self::$CLIENTE,
            default => null,
        };
    }

    public static function ids(): array
    {
        return [
            self::$ADMIN,
            self::$CONSULTOR,
            self::$PRODUTOR,
            self::$CLIENTE,
        ];
    }

    public static function names(): array
    {
        return [
            self::$ADMIN_NAME,
            self::$CONSULTOR_NAME,
            self::$PRODUTOR_NAME,
            self::$CLIENTE_NAME,
        ];
    }
}