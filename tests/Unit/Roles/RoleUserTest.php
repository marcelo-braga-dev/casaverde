<?php

use App\src\Roles\RoleUser;

describe('RoleUser', function () {

    it('defines the four role IDs correctly', function () {
        expect(RoleUser::$ADMIN)->toBe(1)
            ->and(RoleUser::$CONSULTOR)->toBe(2)
            ->and(RoleUser::$PRODUTOR)->toBe(3)
            ->and(RoleUser::$CLIENTE)->toBe(4);
    });

    it('defines the four role names correctly', function () {
        expect(RoleUser::$ADMIN_NAME)->toBe('admin')
            ->and(RoleUser::$CONSULTOR_NAME)->toBe('consultor')
            ->and(RoleUser::$PRODUTOR_NAME)->toBe('produtor')
            ->and(RoleUser::$CLIENTE_NAME)->toBe('cliente');
    });

    it('resolves name by id for all roles', function () {
        expect(RoleUser::nameById(1))->toBe('admin')
            ->and(RoleUser::nameById(2))->toBe('consultor')
            ->and(RoleUser::nameById(3))->toBe('produtor')
            ->and(RoleUser::nameById(4))->toBe('cliente');
    });

    it('returns null for unknown id in nameById', function () {
        expect(RoleUser::nameById(99))->toBeNull();
    });

    it('resolves id by name for all roles', function () {
        expect(RoleUser::idByName('admin'))->toBe(1)
            ->and(RoleUser::idByName('consultor'))->toBe(2)
            ->and(RoleUser::idByName('produtor'))->toBe(3)
            ->and(RoleUser::idByName('cliente'))->toBe(4);
    });

    it('returns null for unknown name in idByName', function () {
        expect(RoleUser::idByName('unknown'))->toBeNull();
    });

    it('returns null for null name in idByName', function () {
        expect(RoleUser::idByName(null))->toBeNull();
    });

    it('ids() returns all four role ids', function () {
        $ids = RoleUser::ids();
        expect($ids)->toContain(1)
            ->toContain(2)
            ->toContain(3)
            ->toContain(4)
            ->toHaveCount(4);
    });

    it('names() returns all four role names', function () {
        $names = RoleUser::names();
        expect($names)->toContain('admin')
            ->toContain('consultor')
            ->toContain('produtor')
            ->toContain('cliente')
            ->toHaveCount(4);
    });
});
