<?php

namespace App\Services\Produtor;

use App\Models\Cliente\ClientProfile;
use App\Models\Produtor\ProducerProfile;
use App\Models\Users\UserContact;
use App\Services\Config\SystemSettingService;
use App\src\Roles\RoleUser;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class CreateOrFindProducerProfileService
{
    public function handle(array $data): array
    {
        $tipoPessoa = $data['tipo_pessoa'] ?? null;
        $cpf  = ClientProfile::normalizeDocument($data['cpf']  ?? null);
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

            $existing = ProducerProfile::query()
                ->where($documentField, $documentValue)
                ->first();

            if ($existing) {
                return [
                    'producer_profile' => $existing,
                    'created'          => false,
                    'already_exists'   => true,
                    'message'          => 'Produtor já existente, cadastro reutilizado.',
                ];
            }

            $authUser   = auth()->user();
            $consultorId = $data['consultor_user_id'] ?? null;

            if (!$consultorId && $authUser && $authUser->role_id === RoleUser::$CONSULTOR) {
                $consultorId = $authUser->id;
            }

            $contacts = UserContact::create([
                'celular'  => $data['celular']  ?? null,
                'telefone' => $data['telefone'] ?? null,
                'email'    => $data['email']    ?? null,
            ]);

            $producerProfile = ProducerProfile::create([
                'tipo_pessoa'      => $tipoPessoa,
                'cpf'              => $cpf,
                'cnpj'             => $cnpj,
                'nome'             => $data['nome']          ?? null,
                'razao_social'     => $data['razao_social']  ?? null,
                'nome_fantasia'    => $data['nome_fantasia'] ?? null,
                'contacts_id'      => $contacts->id,
                'consultor_user_id'=> $consultorId,
                'status'           => $data['status'] ?? 'prospect',
                'is_active_producer' => false,
            ]);

            // Usa a chave correta: taxa de administração do produtor
            $defaultFee = (float) app(SystemSettingService::class)
                ->get('default_producer_fee_percentage', 15);

            app(StoreProducerFeeRuleService::class)->handle(
                producerProfile: $producerProfile,
                feePercent:      $defaultFee,
                startsOn:        now()->toDateTimeString(),
            );

            // Carrega a relação correta (taxa de administração, não desconto do cliente)
            $producerProfile->load('activeFeeRule');

            return [
                'producer_profile' => $producerProfile,
                'created'          => true,
                'already_exists'   => false,
                'message'          => 'Produtor criado com sucesso.',
            ];
        });
    }
}
