<?php

namespace App\Services\Cliente;

use App\Models\Cliente\ClientContract;
use App\Models\Endereco\Address;
use App\Models\Proposta\CommercialProposal;
use App\Models\Users\User;
use App\Models\Users\UserData;
use App\src\Roles\RoleUser;
use App\src\User\StatusUser;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class IssueClientContractService
{
    public function handle(CommercialProposal $proposal, array $data): array
    {
        return DB::transaction(function () use ($proposal, $data) {
            $proposal->loadMissing(['clientProfile', 'address']);

            $clientProfile = $proposal->clientProfile;
            $temporaryPassword = null;

            $address = $this->createOrUpdateProposalAddress($proposal, $data['address'] ?? []);

            if ($address && $proposal->address_id !== $address->id) {
                $proposal->update([
                    'address_id' => $address->id,
                ]);
            }

            $user = $clientProfile->platformUser;

            if (!$user) {
                $temporaryPassword = Str::password(10);

                $user = User::create([
                    'name' => $clientProfile->display_name,
                    'email' => $clientProfile->email ?: 'cliente-' . $clientProfile->id . '@casaverde.local',
                    'password' => Hash::make($temporaryPassword),
                    'role_id' => RoleUser::$CLIENTE,
                    'consultor_id' => $clientProfile->consultor_user_id ?? auth()->id(),
                    'status' => StatusUser::$ATIVO,
                ]);

                $clientProfile->update([
                    'platform_user_id' => $user->id,
                ]);
            }

            UserData::updateOrCreate(
                ['user_id' => $user->id],
                [
                    'user_id' => $user->id,
                    'address_id' => $proposal->address_id,

                    'tipo_pessoa' => $data['tipo_pessoa'],
                    'nome' => $data['nome'] ?? null,
                    'cpf' => $data['cpf'] ?? null,
                    'data_nascimento' => $data['data_nascimento'] ?? null,
                    'rg' => $data['rg'] ?? null,
                    'genero' => $data['genero'] ?? null,
                    'estado_civil' => $data['estado_civil'] ?? null,
                    'profissao' => $data['profissao'] ?? null,

                    'data_fundacao' => $data['data_fundacao'] ?? null,
                    'cnpj' => $data['cnpj'] ?? null,
                    'razao_social' => $data['razao_social'] ?? null,
                    'nome_fantasia' => $data['nome_fantasia'] ?? null,
                    'tipo_empresa' => $data['tipo_empresa'] ?? null,
                    'ie' => $data['ie'] ?? null,
                    'im' => $data['im'] ?? null,
                    'ramo_atividade' => $data['ramo_atividade'] ?? null,
                ]
            );

            $contract = ClientContract::updateOrCreate(
                ['commercial_proposal_id' => $proposal->id],
                [
                    'client_profile_id' => $clientProfile->id,
                    'user_id' => $user->id,
                    'status' => $data['status'],
                    'issued_at' => $data['issued_at'] ?? now()->toDateString(),
                    'signed_at' => $data['signed_at'] ?? null,
                    'notes' => $data['notes'] ?? null,
                ]
            );

            if (in_array($contract->status, ['signed', 'active'], true)) {
                $clientProfile->update([
                    'status' => 'contrato_fechado',
                    'is_active_client' => true,
                    'activated_at' => now(),
                ]);
            }

            return [
                'contract' => $contract->load(['clientProfile', 'proposal.address', 'user.userData.address']),
                'user' => $user,
                'temporary_password' => $temporaryPassword,
            ];
        });
    }

    private function createOrUpdateProposalAddress(CommercialProposal $proposal, array $addressData): ?Address
    {
        $addressData = collect($addressData)
            ->only([
                'cep',
                'rua',
                'numero',
                'complemento',
                'bairro',
                'cidade',
                'estado',
                'referencia',
                'latitude',
                'longitude',
            ])
            ->map(fn ($value) => $value === '' ? null : $value)
            ->toArray();

        $hasAddress = collect($addressData)
            ->filter(fn ($value) => filled($value))
            ->isNotEmpty();

        if (!$hasAddress) {
            return $proposal->address;
        }

        if ($proposal->address) {
            $proposal->address->update($addressData);

            return $proposal->address;
        }

        return Address::create($addressData);
    }
}
