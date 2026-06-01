<?php

use App\Models\Users\User;
use App\src\Roles\RoleUser;

describe('User model', function () {

    it('isAdmin returns true only for admin role', function () {
        $admin     = new User(['role_id' => RoleUser::$ADMIN]);
        $consultor = new User(['role_id' => RoleUser::$CONSULTOR]);

        expect($admin->isAdmin())->toBeTrue()
            ->and($consultor->isAdmin())->toBeFalse();
    });

    it('isConsultor returns true only for consultor role', function () {
        $consultor = new User(['role_id' => RoleUser::$CONSULTOR]);
        $admin     = new User(['role_id' => RoleUser::$ADMIN]);

        expect($consultor->isConsultor())->toBeTrue()
            ->and($admin->isConsultor())->toBeFalse();
    });

    it('isProdutor returns true only for produtor role', function () {
        $produtor = new User(['role_id' => RoleUser::$PRODUTOR]);
        $cliente  = new User(['role_id' => RoleUser::$CLIENTE]);

        expect($produtor->isProdutor())->toBeTrue()
            ->and($cliente->isProdutor())->toBeFalse();
    });

    it('isCliente returns true only for cliente role', function () {
        $cliente  = new User(['role_id' => RoleUser::$CLIENTE]);
        $produtor = new User(['role_id' => RoleUser::$PRODUTOR]);

        expect($cliente->isCliente())->toBeTrue()
            ->and($produtor->isCliente())->toBeFalse();
    });

    it('role_name appended attribute returns correct name', function () {
        $user = new User(['role_id' => RoleUser::$CONSULTOR]);
        expect($user->role_name)->toBe('consultor');
    });

    it('role_name returns null for unknown role', function () {
        $user = new User(['role_id' => 99]);
        expect($user->role_name)->toBeNull();
    });

    it('status_nome returns correct label for active status', function () {
        $user = new User(['status' => '1']);
        expect($user->status_nome)->toBe('Ativo');
    });

    it('status_nome returns correct label for blocked status', function () {
        $user = new User(['status' => '0']);
        expect($user->status_nome)->toBe('Bloqueado');
    });

    it('status_nome returns dash for unknown status', function () {
        $user = new User(['status' => 'xyz']);
        expect($user->status_nome)->toBe('-');
    });

    it('nome attribute mirrors name field', function () {
        $user = new User(['name' => 'João Silva']);
        expect($user->nome)->toBe('João Silva');
    });

    it('dados_acesso returns status and label', function () {
        $user = new User(['email' => 'test@example.com', 'status' => '1']);
        $dados = $user->dados_acesso;

        expect($dados)->toHaveKey('email')
            ->toHaveKey('status')
            ->toHaveKey('status_nome');

        expect($dados['status_nome'])->toBe('Ativo');
    });
});
