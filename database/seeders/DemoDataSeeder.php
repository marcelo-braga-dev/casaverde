<?php

namespace Database\Seeders;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Enums\Usina\UsinaOperationalStatus;
use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientContract;
use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Concessionarias;
use App\Models\Endereco\Address;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Produtor\ProducerAdministrationFeeRules;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Proposta\ProducerProposal;
use App\Models\Usina\UsinaBlock;
use App\Models\Usina\UsinaGenerationRecord;
use App\Models\Usina\UsinaSolar;
use App\Models\Users\User;
use App\Models\Users\UserContact;
use App\src\Roles\RoleUser;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoDataSeeder extends Seeder
{
    private int $copelId = 1;

    public function run(): void
    {
        $this->command->info('Iniciando seed de dados de demonstração...');

        // Resolve a Copel pelo nome
        $copel = Concessionarias::where('nome', 'like', '%Copel%')->first();
        if ($copel) {
            $this->copelId = $copel->id;
        } else {
            $copel = Concessionarias::first();
            $this->copelId = $copel?->id ?? 1;
        }

        $admin      = $this->createAdmin();
        $consultores = $this->createConsultores();
        $produtores  = $this->createProdutores($consultores);
        $blocos      = $this->createUsinaBlocks();
        $usinas      = $this->createUsinas($produtores, $consultores, $blocos);
        $clientes    = $this->createClientes($consultores);

        $this->createUsinaLinks($clientes, $usinas);
        $this->createProposals($clientes, $consultores);
        $this->createContracts($clientes, $consultores);
        $this->createBillsAndCharges($clientes, $usinas);
        $this->createProducerProposals($produtores, $consultores);
        $this->createGenerationRecords($usinas, $admin);
        $this->createOperationalAlerts($clientes, $usinas, $consultores);

        $this->command->info('');
        $this->command->info('✅  Seed concluído! Credenciais de acesso:');
        $this->command->info('');
        $this->command->info('  ADMIN         → admin@teste.com         / 1020');
        $this->command->info('  CONSULTOR 1   → joao.consultor@demo.com / 1020');
        $this->command->info('  CONSULTOR 2   → ana.consultor@demo.com  / 1020');
        $this->command->info('  CLIENTE 1     → carlos.silva@demo.com   / 1020  (dados completos)');
        $this->command->info('  CLIENTE 2     → mariana.costa@demo.com  / 1020');
        $this->command->info('  CLIENTE 3     → pedro.santos@demo.com   / 1020');
        $this->command->info('  PRODUTOR 1    → fazenda.sol@demo.com    / 1020');
        $this->command->info('');
    }

    // ─── Usuários ────────────────────────────────────────────────────────

    private function createAdmin(): User
    {
        return User::firstOrCreate(
            ['email' => 'admin@teste.com'],
            [
                'name'     => 'ADMIN',
                'password' => Hash::make('1020'),
                'role_id'  => RoleUser::$ADMIN,
                'status'   => '1',
            ]
        );
    }

    private function createConsultores(): array
    {
        $consultores = [
            ['name' => 'João Oliveira',    'email' => 'joao.consultor@demo.com'],
            ['name' => 'Ana Ferreira',     'email' => 'ana.consultor@demo.com'],
            ['name' => 'Lucas Mendes',     'email' => 'lucas.consultor@demo.com'],
        ];

        $result = [];
        foreach ($consultores as $data) {
            $result[] = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('1020'),
                    'role_id'  => RoleUser::$CONSULTOR,
                    'status'   => '1',
                ]
            );
        }
        $this->command->line('  → Consultores criados: ' . count($result));
        return $result;
    }

    private function createProdutores(array $consultores): array
    {
        $produtoresData = [
            [
                'name'  => 'Fazenda Sol Nascente',
                'email' => 'fazenda.sol@demo.com',
                'cpf'   => '12345678901',
                'nome'  => 'José Carlos Pereira',
                'celular' => '41999110001',
                'consultor' => 0,
            ],
            [
                'name'  => 'Rancho Solar Brilhante',
                'email' => 'rancho.solar@demo.com',
                'cpf'   => '23456789012',
                'nome'  => 'Maria Aparecida Lima',
                'celular' => '41999110002',
                'consultor' => 1,
            ],
            [
                'name'  => 'Sítio Verde Energia',
                'email' => 'sitio.verde@demo.com',
                'cpf'   => '34567890123',
                'nome'  => 'Raimundo Sousa Neto',
                'celular' => '41999110003',
                'consultor' => 0,
            ],
        ];

        $result = [];
        foreach ($produtoresData as $data) {
            $contact = UserContact::create([
                'email'   => $data['email'],
                'celular' => $data['celular'],
            ]);

            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make('1020'),
                    'role_id'  => RoleUser::$PRODUTOR,
                    'status'   => '1',
                    'consultor_id' => $consultores[$data['consultor']]->id,
                ]
            );

            $profile = ProducerProfile::firstOrCreate(
                ['cpf' => $data['cpf']],
                [
                    'tipo_pessoa'        => 'pf',
                    'nome'               => $data['nome'],
                    'contacts_id'        => $contact->id,
                    'platform_user_id'   => $user->id,
                    'consultor_user_id'  => $consultores[$data['consultor']]->id,
                    'status'             => 'ativo',
                    'is_active_producer' => true,
                    'activated_at'       => now()->subMonths(8),
                ]
            );

            ProducerAdministrationFeeRules::create([
                'producer_profile_id' => $profile->id,
                'fee_percent'         => 15.00,
                'starts_on'           => now()->subYear(),
                'is_active'           => true,
            ]);

            $result[] = ['user' => $user, 'profile' => $profile];
        }
        $this->command->line('  → Produtores criados: ' . count($result));
        return $result;
    }

    // ─── Usinas ──────────────────────────────────────────────────────────

    private function createUsinaBlocks(): array
    {
        $blocks = [
            ['nome' => 'Bloco Norte PR-01',   'status' => 'ativo'],
            ['nome' => 'Bloco Sul PR-02',     'status' => 'ativo'],
            ['nome' => 'Bloco Central SP-01', 'status' => 'ativo'],
        ];
        $result = [];
        foreach ($blocks as $b) {
            $result[] = UsinaBlock::firstOrCreate(['nome' => $b['nome']], $b);
        }
        $this->command->line('  → Blocos de usina criados: ' . count($result));
        return $result;
    }

    private function createUsinas(array $produtores, array $consultores, array $blocos): array
    {
        $address1 = Address::create(['cep' => '83800000', 'rua' => 'Rodovia PR-092', 'numero' => 'KM 14', 'bairro' => 'Zona Rural', 'cidade' => 'Colombo', 'estado' => 'PR']);
        $address2 = Address::create(['cep' => '84200000', 'rua' => 'Estrada Municipal', 'numero' => '1200', 'bairro' => 'Sítio Bom', 'cidade' => 'Ponta Grossa', 'estado' => 'PR']);
        $address3 = Address::create(['cep' => '13140000', 'rua' => 'Rodovia SP-340', 'numero' => 'KM 22', 'bairro' => 'Zona Rural', 'cidade' => 'Paulínia', 'estado' => 'SP']);

        $usinasData = [
            [
                'nome'               => 'Usina Solar Fazenda Sol Nascente',
                'producer'           => 0,
                'consultor'          => 0,
                'bloco'              => 0,
                'address'            => $address1,
                'potencia'           => 75.00,
                'geracao'            => 8500.00,
                'disponivel'         => 8500.000,
                'uc'                 => '4001234567',
                'concessionaria_id'  => $this->copelId,
            ],
            [
                'nome'               => 'Usina Solar Rancho Brilhante',
                'producer'           => 1,
                'consultor'          => 1,
                'bloco'              => 1,
                'address'            => $address2,
                'potencia'           => 120.00,
                'geracao'            => 14000.00,
                'disponivel'         => 14000.000,
                'uc'                 => '4007654321',
                'concessionaria_id'  => $this->copelId,
            ],
            [
                'nome'               => 'Usina Solar Sítio Verde',
                'producer'           => 2,
                'consultor'          => 2,
                'bloco'              => 2,
                'address'            => $address3,
                'potencia'           => 50.00,
                'geracao'            => 6000.00,
                'disponivel'         => 6000.000,
                'uc'                 => '3500111222',
                'concessionaria_id'  => $this->copelId,
            ],
        ];

        $result = [];
        foreach ($usinasData as $u) {
            $usina = UsinaSolar::create([
                'usina_nome'             => $u['nome'],
                'producer_profile_id'    => $produtores[$u['producer']]['profile']->id,
                'consultor_user_id'      => $consultores[$u['consultor']]->id,
                'concessionaria_id'      => $u['concessionaria_id'],
                'usina_block_id'         => $blocos[$u['bloco']]->id,
                'address_id'             => $u['address']->id,
                'status'                 => 'ativo',
                'uc'                     => $u['uc'],
                'media_geracao'          => $u['geracao'],
                'prazo_locacao'          => 20,
                'potencia_usina'         => $u['potencia'],
                'taxa_comissao'          => 5.00,
                'inversores'             => 'Growatt ' . $u['potencia'] . 'kW',
                'modulos'                => round($u['potencia'] / 0.415) . ' x JA Solar 415W',
                'operational_status'     => UsinaOperationalStatus::Active,
                'operation_started_at'   => now()->subMonths(14)->toDateString(),
                'energia_disponivel_kwh' => $u['disponivel'],
                'energia_alocada_kwh'    => 0.000,
                'energia_saldo_kwh'      => $u['disponivel'],
            ]);
            $result[] = $usina;
        }
        $this->command->line('  → Usinas criadas: ' . count($result));
        return $result;
    }

    // ─── Clientes ─────────────────────────────────────────────────────────

    private function createClientes(array $consultores): array
    {
        $clientesData = [
            // Cliente 1 — completo (contrato assinado)
            [
                'name'      => 'Carlos Eduardo Silva',
                'email'     => 'carlos.silva@demo.com',
                'cpf'       => '11122233344',
                'tipo'      => 'pf',
                'nome'      => 'Carlos Eduardo Silva',
                'celular'   => '41988001001',
                'status'    => 'contrato_assinado',
                'active'    => true,
                'discount'  => 20.0,
                'consultor' => 0,
            ],
            // Cliente 2 — ativo
            [
                'name'      => 'Mariana Costa Ribeiro',
                'email'     => 'mariana.costa@demo.com',
                'cpf'       => '22233344455',
                'tipo'      => 'pf',
                'nome'      => 'Mariana Costa Ribeiro',
                'celular'   => '41988002002',
                'status'    => 'contrato_assinado',
                'active'    => true,
                'discount'  => 15.0,
                'consultor' => 0,
            ],
            // Cliente 3 — com contrato
            [
                'name'      => 'Pedro Henrique Santos',
                'email'     => 'pedro.santos@demo.com',
                'cpf'       => '33344455566',
                'tipo'      => 'pf',
                'nome'      => 'Pedro Henrique Santos',
                'celular'   => '41988003003',
                'status'    => 'contrato_assinado',
                'active'    => true,
                'discount'  => 18.0,
                'consultor' => 1,
            ],
            // Cliente 4 — empresa PJ
            [
                'name'      => 'Padaria Pão de Ouro LTDA',
                'email'     => 'padariapaodeouro@demo.com',
                'cnpj'      => '12345678000190',
                'tipo'      => 'pj',
                'razao'     => 'Padaria Pão de Ouro LTDA',
                'fantasia'  => 'Padaria Pão de Ouro',
                'celular'   => '41988004004',
                'status'    => 'contrato_assinado',
                'active'    => true,
                'discount'  => 22.0,
                'consultor' => 1,
            ],
            // Cliente 5 — prospecto
            [
                'name'      => 'Fernanda Lima Alves',
                'email'     => 'fernanda.lima@demo.com',
                'cpf'       => '55566677788',
                'tipo'      => 'pf',
                'nome'      => 'Fernanda Lima Alves',
                'celular'   => '41988005005',
                'status'    => 'proposta_emitida',
                'active'    => false,
                'discount'  => 20.0,
                'consultor' => 2,
            ],
        ];

        $result = [];
        foreach ($clientesData as $cd) {
            $contact = UserContact::create([
                'email'   => $cd['email'],
                'celular' => $cd['celular'],
            ]);

            $user = User::firstOrCreate(
                ['email' => $cd['email']],
                [
                    'name'         => $cd['name'],
                    'password'     => Hash::make('1020'),
                    'role_id'      => RoleUser::$CLIENTE,
                    'status'       => '1',
                    'consultor_id' => $consultores[$cd['consultor']]->id,
                ]
            );

            $profileData = [
                'tipo_pessoa'       => $cd['tipo'],
                'contacts_id'       => $contact->id,
                'consultor_user_id' => $consultores[$cd['consultor']]->id,
                'platform_user_id'  => $user->id,
                'status'            => $cd['status'],
                'is_active_client'  => $cd['active'],
                'activated_at'      => $cd['active'] ? now()->subMonths(10) : null,
            ];

            if ($cd['tipo'] === 'pf') {
                $profileData['cpf']  = $cd['cpf'];
                $profileData['nome'] = $cd['nome'];
            } else {
                $profileData['cnpj']         = $cd['cnpj'];
                $profileData['razao_social']  = $cd['razao'];
                $profileData['nome_fantasia'] = $cd['fantasia'];
            }

            $profile = ClientProfile::create($profileData);

            // Regra de desconto ativa
            ClientDiscountRule::create([
                'client_profile_id' => $profile->id,
                'discount_percent'  => $cd['discount'],
                'starts_on'         => now()->subYear(),
                'ends_on'           => null,
                'is_active'         => true,
                'notes'             => 'Desconto contratual padrão',
            ]);

            $result[] = ['user' => $user, 'profile' => $profile, 'discount' => $cd['discount']];
        }
        $this->command->line('  → Clientes criados: ' . count($result));
        return $result;
    }

    // ─── Vínculos usina ───────────────────────────────────────────────────

    private function createUsinaLinks(array $clientes, array $usinas): void
    {
        // 4 clientes ativos recebem usina (exceto prospecto)
        $links = [
            ['cliente' => 0, 'usina' => 0, 'kwh' => 1800.0, 'desc' => 20.0],
            ['cliente' => 1, 'usina' => 0, 'kwh' => 1200.0, 'desc' => 15.0],
            ['cliente' => 2, 'usina' => 1, 'kwh' => 2500.0, 'desc' => 18.0],
            ['cliente' => 3, 'usina' => 1, 'kwh' => 3000.0, 'desc' => 22.0],
        ];

        foreach ($links as $link) {
            $profile = $clientes[$link['cliente']]['profile'];
            $usina   = $usinas[$link['usina']];

            ClientUsinaLink::create([
                'client_profile_id'  => $profile->id,
                'usina_id'           => $usina->id,
                'started_at'         => now()->subMonths(10),
                'ended_at'           => null,
                'is_active'          => true,
                'allocated_energy_kwh' => $link['kwh'],
                'discount_percentage'  => $link['desc'],
                'status'             => ClientUsinaLinkStatus::Active->value,
                'notes'              => 'Vínculo ativo via contrato Casa Verde',
            ]);

            // Atualiza energia alocada na usina
            $usina->increment('energia_alocada_kwh', $link['kwh']);
            $usina->decrement('energia_saldo_kwh',    $link['kwh']);
        }

        $this->command->line('  → Vínculos usina-cliente criados: ' . count($links));
    }

    // ─── Propostas comerciais ─────────────────────────────────────────────

    private function createProposals(array $clientes, array $consultores): void
    {
        $count = 0;
        foreach ($clientes as $i => $c) {
            $profile   = $c['profile'];
            $consultor = $consultores[$i % count($consultores)];

            $proposal = CommercialProposal::create([
                'client_profile_id' => $profile->id,
                'consultor_user_id' => $consultor->id,
                'concessionaria_id' => $this->copelId,
                'status'            => in_array($profile->status, ['contrato_assinado']) ? 'aprovada' : 'emitida',
                'issued_at'         => now()->subMonths(11)->toDateString(),
                'valid_until'       => now()->subMonths(5)->toDateString(),
                'media_consumo'     => 350.00 + ($i * 50),
                'discount_percent'  => $c['discount'],
                'prazo_locacao'     => 12,
                'valor_medio'       => 350.00 + ($i * 50),
                'unidade_consumidora' => '400' . str_pad($i + 1, 7, '0', STR_PAD_LEFT),
                'notes'             => 'Proposta gerada pelo sistema de demonstração.',
            ]);

            $count++;
        }
        $this->command->line('  → Propostas de cliente criadas: ' . $count);
    }

    // ─── Contratos ────────────────────────────────────────────────────────

    private function createContracts(array $clientes, array $consultores): void
    {
        $count = 0;
        foreach ($clientes as $i => $c) {
            if (!$c['profile']->is_active_client) continue;

            $proposal = CommercialProposal::where('client_profile_id', $c['profile']->id)->first();
            if (!$proposal) continue;

            $date = now()->format('Ymd');
            $code = 'CTR-' . $date . '-' . str_pad($i + 1, 4, '0', STR_PAD_LEFT);

            ClientContract::create([
                'contract_code'        => $code,
                'commercial_proposal_id' => $proposal->id,
                'client_profile_id'    => $c['profile']->id,
                'user_id'              => $consultores[$i % count($consultores)]->id,
                'status'               => 'assinado',
                'issued_at'            => now()->subMonths(10)->toDateString(),
                'signed_at'            => now()->subMonths(10)->subDays(5)->toDateString(),
                'notes'                => 'Contrato assinado digitalmente.',
            ]);

            $count++;
        }
        $this->command->line('  → Contratos criados: ' . $count);
    }

    // ─── Faturas e Cobranças ──────────────────────────────────────────────

    private function createBillsAndCharges(array $clientes, array $usinas): void
    {
        $billCount   = 0;
        $chargeCount = 0;

        // Gera 10 meses de faturas para clientes ativos
        foreach ($clientes as $i => $c) {
            if (!$c['profile']->is_active_client) continue;

            $usinaIndex = $i < 2 ? 0 : 1;
            $usina      = $usinas[$usinaIndex];
            $discount   = $c['discount'];

            // Consumo base varia por cliente
            $baseConsumo = [350, 280, 420, 580][$i] ?? 320;
            $baseValor   = $baseConsumo * 0.72; // ~R$ 0,72/kWh Copel

            for ($m = 10; $m >= 1; $m--) {
                $period   = now()->startOfMonth()->subMonths($m);
                $refMonth = (int) $period->format('m');
                $refYear  = (int) $period->format('Y');

                // Variação sazonal de consumo (inverno consome mais)
                $sazonalFactor = in_array($refMonth, [6, 7, 8]) ? 1.15 : (in_array($refMonth, [12, 1, 2]) ? 0.88 : 1.0);
                $consumo  = round($baseConsumo * $sazonalFactor * (0.90 + mt_rand(0, 20) / 100), 1);
                $valor    = round($consumo * 0.72, 2);

                $bill = ConcessionaireBill::create([
                    'client_profile_id'   => $c['profile']->id,
                    'usina_id'            => $usina->id,
                    'created_by_user_id'  => 1,
                    'reviewed_by_user_id' => 1,
                    'import_source'       => 'manual',
                    'concessionaria_id'   => $this->copelId,
                    'reference_month'     => $refMonth,
                    'reference_year'      => $refYear,
                    'reference_label'     => sprintf('%02d/%d', $refMonth, $refYear),
                    'unidade_consumidora' => '400' . str_pad($i + 1, 7, '0', STR_PAD_LEFT),
                    'numero_instalacao'   => '9900' . str_pad($i + 1, 6, '0', STR_PAD_LEFT),
                    'vencimento'          => $period->copy()->addDays(10)->toDateString(),
                    'valor_total'         => $valor,
                    'consumo_kwh'         => $consumo,
                    'pdf_disk'            => 'local',
                    'pdf_path'            => 'demo/faturas/demo_' . $i . '_' . $refYear . $refMonth . '.pdf',
                    'review_status'       => 'approved',
                    'import_status'       => 'imported',
                    'reviewed_at'         => $period->copy()->addDays(2),
                ]);

                $billCount++;

                // Cobrança vinculada
                $discountAmt = round($valor * ($discount / 100), 2);
                $finalAmt    = round($valor - $discountAmt, 2);

                // Status da cobrança baseado em como antigo é
                $status = 'paid';
                if ($m <= 1) $status = 'open';
                elseif ($m == 2) $status = 'paid';

                $charge = CustomerCharge::create([
                    'client_profile_id'      => $c['profile']->id,
                    'platform_user_id'       => $c['user']->id,
                    'usina_id'               => $usina->id,
                    'concessionaria_id'      => $this->copelId,
                    'concessionaire_bill_id' => $bill->id,
                    'reference_month'        => $refMonth,
                    'reference_year'         => $refYear,
                    'reference_label'        => sprintf('%02d/%d', $refMonth, $refYear),
                    'due_date'               => $period->copy()->addDays(10)->toDateString(),
                    'original_amount'        => $valor,
                    'discount_percent'       => $discount,
                    'discount_amount'        => $discountAmt,
                    'manual_discount_amount' => 0,
                    'manual_addition_amount' => 0,
                    'final_amount'           => $finalAmt,
                    'status'                 => $status,
                    'generated_by_user_id'   => 1,
                    'approved_by_user_id'    => 1,
                    'approved_at'            => $period->copy()->addDays(3),
                    'paid_at'                => $status === 'paid' ? $period->copy()->addDays(8) : null,
                ]);

                $chargeCount++;
            }
        }

        $this->command->line('  → Faturas criadas: ' . $billCount);
        $this->command->line('  → Cobranças criadas: ' . $chargeCount);
    }

    // ─── Propostas de produtor ────────────────────────────────────────────

    private function createProducerProposals(array $produtores, array $consultores): void
    {
        $count = 0;
        foreach ($produtores as $i => $p) {
            $consultor = $consultores[$i % count($consultores)];

            ProducerProposal::create([
                'producer_profile_id' => $p['profile']->id,
                'consultor_user_id'   => $consultor->id,
                'concessionaria_id'   => $this->copelId,
                'status'              => 'aprovada',
                'issued_at'           => now()->subMonths(14)->toDateString(),
                'valid_until'         => now()->subMonths(8)->toDateString(),
                'fill_percent'        => 85.00,
                'prazo_contrato'      => 20,
                'media_geracao'       => [8500, 14000, 6000][$i] ?? 8000,
                'potencia_usina'      => [75, 120, 50][$i] ?? 60,
                'valor_investimento'  => [380000, 620000, 250000][$i] ?? 300000,
                'notes'               => 'Proposta formalizada e aceita pelo produtor.',
            ]);
            $count++;
        }
        $this->command->line('  → Propostas de produtor criadas: ' . $count);
    }

    // ─── Registros de geração ─────────────────────────────────────────────

    private function createGenerationRecords(array $usinas, User $admin): void
    {
        $count = 0;
        foreach ($usinas as $u => $usina) {
            $baseGeracao = [8500, 14000, 6000][$u] ?? 7000;

            for ($m = 12; $m >= 1; $m--) {
                $period   = now()->startOfMonth()->subMonths($m);
                $refMonth = (int) $period->format('m');
                $refYear  = (int) $period->format('Y');

                // Sazonalidade solar (verão gera mais)
                $factor = in_array($refMonth, [11, 12, 1, 2]) ? 1.15 :
                          (in_array($refMonth, [6, 7, 8]) ? 0.82 : 1.0);

                $gerado       = round(($baseGeracao / 12) * $factor * (0.92 + mt_rand(0, 16) / 100), 3);
                $compensado   = round($gerado * 0.75, 3);
                $disponivel   = round($gerado - $compensado, 3);

                UsinaGenerationRecord::create([
                    'usina_id'              => $usina->id,
                    'reference_year'        => $refYear,
                    'reference_month'       => $refMonth,
                    'generated_energy_kwh'  => $gerado,
                    'injected_energy_kwh'   => $gerado,
                    'compensated_energy_kwh'=> $compensado,
                    'available_energy_kwh'  => $disponivel,
                    'created_by_user_id'    => $admin->id,
                ]);
                $count++;
            }
        }
        $this->command->line('  → Registros de geração criados: ' . $count);
    }

    // ─── Alertas operacionais ─────────────────────────────────────────────

    private function createOperationalAlerts(array $clientes, array $usinas, array $consultores): void
    {
        $alertsData = [
            [
                'module'   => 'fatura',
                'type'     => 'bill_high_consumption',
                'severity' => 'warning',
                'title'    => 'Consumo acima da média detectado',
                'message'  => 'O cliente apresentou consumo 25% acima da média dos últimos 6 meses.',
                'client'   => 1,
                'usina'    => 0,
                'status'   => 'open',
            ],
            [
                'module'   => 'usina',
                'type'     => 'usina_low_generation',
                'severity' => 'error',
                'title'    => 'Geração abaixo do esperado',
                'message'  => 'A usina gerou 18% abaixo da média prevista para o mês.',
                'client'   => null,
                'usina'    => 1,
                'status'   => 'open',
            ],
            [
                'module'   => 'cobranca',
                'type'     => 'charge_overdue',
                'severity' => 'critical',
                'title'    => 'Cobrança em atraso',
                'message'  => 'Cobrança de outubro/2025 encontra-se vencida há 15 dias.',
                'client'   => 2,
                'usina'    => null,
                'status'   => 'in_progress',
            ],
            [
                'module'   => 'fatura',
                'type'     => 'bill_pending_review',
                'severity' => 'warning',
                'title'    => 'Fatura aguardando revisão há mais de 7 dias',
                'message'  => 'A fatura de setembro/2025 não foi revisada dentro do prazo padrão.',
                'client'   => 3,
                'usina'    => null,
                'status'   => 'open',
            ],
            [
                'module'   => 'usina',
                'type'     => 'usina_maintenance',
                'severity' => 'info',
                'title'    => 'Manutenção preventiva agendada',
                'message'  => 'Manutenção preventiva anual programada para a próxima semana.',
                'client'   => null,
                'usina'    => 2,
                'status'   => 'open',
            ],
        ];

        foreach ($alertsData as $a) {
            OperationalAlert::create([
                'module'           => $a['module'],
                'type'             => $a['type'],
                'severity'         => $a['severity'],
                'title'            => $a['title'],
                'message'          => $a['message'],
                'usina_id'         => isset($a['usina']) ? $usinas[$a['usina']]->id : null,
                'client_profile_id'=> isset($a['client']) ? $clientes[$a['client']]['profile']->id : null,
                'status'           => $a['status'],
                'reference_year'   => now()->year,
                'reference_month'  => now()->month,
                'detected_at'      => now()->subDays(rand(1, 15)),
            ]);
        }
        $this->command->line('  → Alertas operacionais criados: ' . count($alertsData));
    }
}
