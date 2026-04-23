<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientProfile;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CreateOrFindClientProfileService
{
    public function handle(array $data): array
    {
        $tipoPessoa = $data['tipo_pessoa'] ?? null;
        $cpf = ClientProfile::normalizeDocument($data['cpf'] ?? null);
        $cnpj = ClientProfile::normalizeDocument($data['cnpj'] ?? null);

        if ($tipoPessoa === 'pf' && !$cpf) {
            throw new InvalidArgumentException('CPF é obrigatório para pessoa física.');
        }

        if ($tipoPessoa === 'pj' && !$cnpj) {
            throw new InvalidArgumentException('CNPJ é obrigatório para pessoa jurídica.');
        }

        $documentField = $tipoPessoa === 'pf' ? 'cpf' : 'cnpj';
        $documentValue = $tipoPessoa === 'pf' ? $cpf : $cnpj;

        return DB::transaction(function () use ($data, $documentField, $documentValue, $tipoPessoa, $cpf, $cnpj) {
            $existing = ClientProfile::query()
                ->where($documentField, $documentValue)
                ->first();

            if ($existing) {
                return [
                    'client_profile' => $existing,
                    'created' => false,
                    'already_exists' => true,
                    'message' => 'Cliente já existente, cadastro reutilizado.',
                ];
            }

            $authUser = auth()->user();

            $consultorId = $data['consultor_user_id'] ?? null;

            if (!$consultorId && $authUser && $authUser->role_id === RoleUser::$CONSULTOR) {
                $consultorId = $authUser->id;
            }

            $clientProfile = ClientProfile::create([
                'tipo_pessoa' => $tipoPessoa,
                'cpf' => $cpf,
                'cnpj' => $cnpj,
                'nome' => $data['nome'] ?? null,
                'razao_social' => $data['razao_social'] ?? null,
                'nome_fantasia' => $data['nome_fantasia'] ?? null,
                'cidade' => $data['cidade'],
                'email' => $data['email'] ?? null,
                'telefone' => $data['telefone'] ?? null,
                'consultor_user_id' => $consultorId,
                'status' => $data['status'] ?? 'prospect',
                'is_active_client' => false,
            ]);

            return [
                'client_profile' => $clientProfile,
                'created' => true,
                'already_exists' => false,
                'message' => 'Cliente criado com sucesso.',
            ];
        });
    }
}