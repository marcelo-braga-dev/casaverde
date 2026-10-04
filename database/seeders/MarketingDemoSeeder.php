<?php

namespace Database\Seeders;

use App\Enums\Cliente\ClientUsinaLinkStatus;
use App\Enums\Usina\UsinaOperationalStatus;
use App\Models\Acesso\UserAccessLog;
use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientContract;
use App\Models\Cliente\ClientDiscountRule;
use App\Models\Cliente\ClientProfile;
use App\Models\Cliente\ClientUsinaLink;
use App\Models\Cliente\ConsumerUnit;
use App\Models\Cobranca\CustomerCharge;
use App\Models\Cobranca\CustomerChargeAdjustment;
use App\Models\Cobranca\CustomerChargeHistory;
use App\Models\Concessionarias;
use App\Models\Endereco\Address;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Pagamento\PaymentProviderAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Pagamento\PaymentTransaction;
use App\Models\Pagamento\PaymentWebhookEvent;
use App\Models\Produtor\ProducerAdministrationFeeRules;
use App\Models\Produtor\ProducerLead;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Proposta\ProducerProposal;
use App\Models\Support\SupportTicket;
use App\Models\Support\SupportTicketMessage;
use App\Models\Users\User;
use App\Models\Users\UserContact;
use App\Models\Usina\UsinaBlock;
use App\Models\Usina\UsinaGenerationRecord;
use App\Models\Usina\UsinaSolar;
use App\src\Roles\RoleUser;
use Carbon\CarbonImmutable;
use Database\Seeders\Support\DemoPix;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Base de demonstração para marketing: ~18 meses de operação fictícia sobre os dados do
 * DemoDataSeeder (clientes entrando mês a mês, faturas, cobranças, boletos/Pix pagos,
 * atrasos, fila atual de revisão e pagamento, geração das usinas, funil comercial,
 * suporte e alertas). O histórico de importação vem do MarketingImportHistorySeeder.
 *
 * Todos os dados são fictícios. Logins novos usam a senha 1020.
 * Uso: php artisan db:seed --class=MarketingDemoSeeder
 */
class MarketingDemoSeeder extends Seeder
{
    private const DOMAIN = 'cliente.demo';

    // Concessionárias onde a operação atua. Na geração compartilhada a usina e os clientes
    // que recebem a energia dela ficam na área da MESMA concessionária.
    // chave => [trecho do nome, UF, cidades, tarifa média R$/kWh com tributos, prefixo de CEP]
    private const REGIONS = [
        'copel' => ['Copel', 'PR', ['Curitiba', 'Ponta Grossa', 'Londrina', 'Maringá', 'Cascavel'], 0.94, '8'],
        'cemig' => ['Cemig Distribuição', 'MG', ['Montes Claros', 'Belo Horizonte', 'Uberlândia', 'Juiz de Fora'], 1.02, '3'],
        'cpfl' => ['CPFL Paulista', 'SP', ['Ribeirão Preto', 'Campinas', 'Bauru', 'Araraquara'], 0.92, '1'],
        'rge' => ['RGE (Rio Grande Energia)', 'RS', ['Passo Fundo', 'Caxias do Sul', 'Santa Maria', 'Erechim'], 0.98, '9'],
        'celesc' => ['Celesc', 'SC', ['Chapecó', 'Joinville', 'Blumenau', 'Florianópolis'], 0.86, '8'],
        'enel_go' => ['Enel Distribuição Goiás', 'GO', ['Rio Verde', 'Goiânia', 'Anápolis', 'Jataí'], 0.95, '7'],
        'energisa_mt' => ['Energisa Mato Grosso', 'MT', ['Sinop', 'Cuiabá', 'Rondonópolis', 'Sorriso'], 1.05, '7'],
        'coelba' => ['Neoenergia Coelba', 'BA', ['Barreiras', 'Salvador', 'Feira de Santana', 'Vitória da Conquista'], 0.99, '4'],
        'enel_ce' => ['Enel Distribuição Ceará', 'CE', ['Quixadá', 'Fortaleza', 'Juazeiro do Norte', 'Sobral'], 0.97, '6'],
        'neo_pe' => ['Neoenergia Pernambuco', 'PE', ['Petrolina', 'Recife', 'Caruaru', 'Garanhuns'], 0.96, '5'],
    ];

    private CarbonImmutable $today;

    private CarbonImmutable $lastRef; // última competência faturada (mês anterior)

    private int $copelId;

    /** @var array<string, array{id:int, uf:string, cities:array, tariff:float, cep:string}> */
    private array $regions = [];

    private int $adminId;

    private string $passwordHash;

    private ?PaymentProviderAccount $account;

    private int $ucSequence = 41000000;

    private int $installationSequence = 910000000;

    private array $stats = [];

    public function run(): void
    {
        if (User::where('email', 'like', '%@'.self::DOMAIN)->exists()) {
            $this->command->warn('MarketingDemoSeeder já foi aplicado (há usuários @'.self::DOMAIN.'). Nada a fazer.');

            return;
        }

        mt_srand(2026);
        Model::unguard();

        $this->today = CarbonImmutable::today();
        $this->lastRef = $this->today->startOfMonth()->subMonth();
        $this->copelId = Concessionarias::where('nome', 'like', '%Copel%')->value('id') ?? 1;
        foreach (self::REGIONS as $key => [$name, $uf, $cities, $tariff, $cep]) {
            $id = Concessionarias::where('nome', 'like', '%'.$name.'%')->where('estado', $uf)->value('id');
            if ($id) {
                $this->regions[$key] = compact('id', 'uf', 'cities', 'tariff', 'cep');
            }
        }
        $this->adminId = User::where('role_id', RoleUser::$ADMIN)->orderBy('id')->value('id');
        $this->passwordHash = Hash::make('1020');
        $this->account = PaymentProviderAccount::where('is_default', true)->first() ?? PaymentProviderAccount::first();

        DB::transaction(function () {
            $consultores = $this->createConsultores();
            $blocks = $this->createBlocks();
            $this->createProducersAndUsinas($consultores, $blocks);
            $this->completeIncompletePlants();
            $allUsinas = UsinaSolar::query()->orderBy('id')->get();

            $this->createClients($consultores, $allUsinas);
            $this->extendExistingClients();
            $this->createGenerationHistory($allUsinas);
            $this->createCommercialPipeline($consultores);
            $this->createProducerPipeline($consultores);
            $this->createSupportTickets($consultores);
            $this->createOperationalAlerts($allUsinas, $consultores);
            $this->createAccessLogs();
        });

        Model::reguard();

        $this->call(MarketingImportHistorySeeder::class);
        $this->call(DemoTariffSeeder::class);
        // Por último: marca tudo como fictício e gera os PDFs das faturas com os nomes finais.
        $this->call(MarkFictitiousDataSeeder::class);

        $this->command->info('Base de marketing criada:');
        foreach ($this->stats as $label => $count) {
            $this->command->line(sprintf('  → %-28s %d', $label, $count));
        }
        $this->command->line('  Logins novos: <nome>@'.self::DOMAIN.' / 1020 (ex.: beatriz.rocha@'.self::DOMAIN.')');
    }

    // ─── Equipe ───────────────────────────────────────────────────────────

    private function createConsultores(): array
    {
        $existing = User::where('role_id', RoleUser::$CONSULTOR)->orderBy('id')->get()->all();

        foreach ([['Beatriz Rocha', 'beatriz.rocha'], ['Rafael Tavares', 'rafael.tavares'], ['Camila Duarte', 'camila.duarte']] as $i => [$name, $slug]) {
            $existing[] = User::create([
                'name' => $name,
                'email' => $slug.'@'.self::DOMAIN,
                'password' => $this->passwordHash,
                'role_id' => RoleUser::$CONSULTOR,
                'status' => '1',
                'created_at' => $this->today->subMonths(16 - $i * 4),
            ]);
        }
        $this->count('Consultores novos', 3);

        return $existing;
    }

    private function createBlocks(): array
    {
        $blocks = UsinaBlock::orderBy('id')->get()->all();
        foreach ([['Bloco Campos Gerais PR-03', 'Usinas da região de Ponta Grossa e Castro'], ['Bloco Litoral PR-04', 'Usinas do litoral paranaense']] as [$nome, $descricao]) {
            $blocks[] = UsinaBlock::create(['nome' => $nome, 'descricao' => $descricao, 'status' => 'ativo']);
        }
        $this->count('Blocos de usina novos', 2);

        return $blocks;
    }

    // ─── Produtores e usinas ──────────────────────────────────────────────

    private function createProducersAndUsinas(array $consultores, array $blocks): array
    {
        $producers = [
            // nome, tipo, documento, usina, região, potência kWp, geração média kWh/mês, status operacional, meses em operação
            ['Agropecuária Bela Vista LTDA', 'pj', '41222333000181', 'Usina Solar Bela Vista', 'cemig', 280.0, 33600, 'active', 17],
            ['Antônio Ribeiro Campos', 'pf', '45678901234', null, null, 0, 0, null, 0], // produtor já existente (sem usina)
            ['Helena Martins Prado', 'pf', '52345678911', 'Usina Solar Recanto do Sol', 'cpfl', 150.0, 18000, 'active', 15],
            ['Cooperativa Energia Limpa Sul', 'pj', '38111222000155', 'Usina Solar Cooperativa Sul', 'rge', 350.0, 42000, 'active', 13],
            ['Gustavo Henrique Lacerda', 'pf', '61234567822', 'Usina Solar Serra Verde', 'celesc', 95.0, 11400, 'maintenance', 11],
            ['Fazenda Três Irmãos LTDA', 'pj', '29444555000102', 'Usina Solar Três Irmãos', 'enel_go', 200.0, 24000, 'active', 9],
            ['Marcos Vinícius Teixeira', 'pf', '73456789033', 'Usina Solar Vale Dourado', 'coelba', 60.0, 7200, 'pending_documentation', 1],
            ['Sertão Solar Energia LTDA', 'pj', '47555666000130', 'Usina Solar Sertão Forte', 'enel_ce', 180.0, 23400, 'active', 12],
            ['Agro Cerrado Participações LTDA', 'pj', '35666777000148', 'Usina Solar Cerrado Vivo', 'energisa_mt', 240.0, 30000, 'active', 10],
            ['Renata Albuquerque Lins', 'pf', '84567890144', 'Usina Solar Litoral Norte', 'neo_pe', 120.0, 15600, 'active', 7],
        ];

        $usinas = [];
        foreach ($producers as $i => [$nome, $tipo, $doc, $usinaNome, $regionKey, $kwp, $geracao, $opStatus, $months]) {
            $consultor = $consultores[$i % count($consultores)];

            $profile = ProducerProfile::where($tipo === 'pf' ? 'cpf' : 'cnpj', $doc)->first();
            if (! $profile) {
                $slug = $this->slug($nome);
                $contact = UserContact::create(['email' => $slug.'@'.self::DOMAIN, 'celular' => '4199'.mt_rand(1000000, 9999999)]);
                $user = User::create([
                    'name' => $nome,
                    'email' => $slug.'@'.self::DOMAIN,
                    'password' => $this->passwordHash,
                    'role_id' => RoleUser::$PRODUTOR,
                    'status' => '1',
                    'consultor_id' => $consultor->id,
                ]);
                $profile = ProducerProfile::create([
                    'tipo_pessoa' => $tipo,
                    $tipo === 'pf' ? 'cpf' : 'cnpj' => $doc,
                    $tipo === 'pf' ? 'nome' : 'razao_social' => $nome,
                    'nome_fantasia' => $tipo === 'pj' ? str_replace(' LTDA', '', $nome) : null,
                    'contacts_id' => $contact->id,
                    'platform_user_id' => $user->id,
                    'consultor_user_id' => $consultor->id,
                    'status' => 'ativo',
                    'is_active_producer' => true,
                    'activated_at' => $this->today->subMonths(max($months, 1) + 1),
                    'created_at' => $this->today->subMonths(max($months, 1) + 2),
                ]);
                ProducerAdministrationFeeRules::create([
                    'producer_profile_id' => $profile->id,
                    'fee_percent' => [12.0, 15.0, 10.0, 15.0, 12.5][$i % 5],
                    'starts_on' => $this->today->subMonths(max($months, 1) + 1),
                    'is_active' => true,
                ]);
                $this->count('Produtores novos');
            }

            if (! $usinaNome) {
                continue;
            }

            $region = $this->regions[$regionKey] ?? $this->regions['copel'];
            $address = Address::create([
                'cep' => $region['cep'].mt_rand(1000000, 9999999), 'rua' => 'Estrada Rural '.mt_rand(10, 99),
                'numero' => 'KM '.mt_rand(2, 40), 'bairro' => 'Zona Rural', 'cidade' => $region['cities'][0], 'estado' => $region['uf'],
            ]);

            $usinas[] = UsinaSolar::create([
                'usina_nome' => $usinaNome,
                'producer_profile_id' => $profile->id,
                'consultor_user_id' => $consultor->id,
                'concessionaria_id' => $region['id'],
                'usina_block_id' => $blocks[$i % count($blocks)]->id,
                'address_id' => $address->id,
                'status' => 'ativo',
                'uc' => (string) (3000000000 + $i * 104729 + $region['id'] * 7),
                'media_geracao' => $geracao,
                'prazo_locacao' => [15, 20, 25][$i % 3],
                'potencia_usina' => $kwp,
                'taxa_comissao' => [5.0, 6.0, 4.5][$i % 3],
                'inversores' => ($kwp >= 150 ? 'WEG SIW500H ' : 'Growatt MAX ').round($kwp).'kW',
                'modulos' => round($kwp / 0.55).' x Canadian Solar 550W',
                'operational_status' => UsinaOperationalStatus::from($opStatus),
                'operation_started_at' => $this->today->subMonths($months)->startOfMonth()->toDateString(),
                'energia_disponivel_kwh' => $geracao,
                'energia_alocada_kwh' => 0,
                'energia_saldo_kwh' => $geracao,
                'admin_notes' => $opStatus === 'maintenance' ? 'Troca preventiva de inversor agendada.' : null,
                'created_at' => $this->today->subMonths($months + 1),
            ]);
            $this->count('Usinas novas');

            ProducerProposal::create([
                'producer_profile_id' => $profile->id,
                'consultor_user_id' => $consultor->id,
                'concessionaria_id' => $region['id'],
                'status' => 'aprovada',
                'issued_at' => $this->today->subMonths($months + 3)->toDateString(),
                'valid_until' => $this->today->subMonths($months + 2)->toDateString(),
                'fill_percent' => mt_rand(80, 95),
                'prazo_contrato' => [120, 180, 240][$profile->id % 3], // meses
                'media_geracao' => $geracao,
                'potencia_usina' => $kwp,
                'valor_investimento' => round($kwp * 3900, -3),
                'notes' => 'Proposta aceita; usina incorporada à operação.',
                'created_at' => $this->today->subMonths($months + 3),
            ]);
        }

        return $usinas;
    }

    // Usina cadastrada em teste sem energia disponível: estragaria indicadores e gráficos.
    private function completeIncompletePlants(): void
    {
        UsinaSolar::query()->where(fn ($q) => $q->whereNull('media_geracao')->orWhere('media_geracao', '<=', 0)->orWhere('energia_disponivel_kwh', '<=', 0))
            ->get()
            ->each(function (UsinaSolar $usina) {
                $usina->update([
                    'potencia_usina' => 80,
                    'media_geracao' => 9600,
                    'energia_disponivel_kwh' => 9600,
                    'energia_saldo_kwh' => 9600 - (float) $usina->energia_alocada_kwh,
                    'inversores' => 'Growatt MAX 80kW',
                    'modulos' => '145 x Canadian Solar 550W',
                    'prazo_locacao' => 20,
                    'taxa_comissao' => 5.0,
                    'operation_started_at' => $this->today->subMonths(8)->startOfMonth()->toDateString(),
                ]);
                UsinaGenerationRecord::where('usina_id', $usina->id)->delete();
                $this->count('Usinas completadas');
            });
    }

    // ─── Clientes ────────────────────────────────────────────────────────

    private function createClients(array $consultores, $usinas): void
    {
        $pf = [
            'Ana Paula Moreira', 'Bruno Cesar Albuquerque', 'Cláudia Regina Fontes', 'Diego Alves Pacheco',
            'Eduarda Nogueira Lima', 'Fábio Augusto Mendes', 'Gabriela Souza Pires', 'Henrique Batista Rocha',
            'Isabela Cristina Gomes', 'Jorge Luiz Carvalho', 'Larissa Fernandes Dias', 'Marcelo Antunes Barros',
            'Natália Ribeiro Couto', 'Otávio Prado Siqueira', 'Patrícia Helena Vaz', 'Renato Silveira Lopes',
            'Simone Aparecida Cruz', 'Thiago Martins Neves', 'Vanessa Duarte Melo', 'William Costa Freitas',
            'Juliana Rezende Paiva', 'Leonardo Castro Viana', 'Mônica Azevedo Brito', 'Rodrigo Fagundes Leal',
            'Sabrina Moura Teles', 'Vinícius Rocha Damasceno',
        ];
        $pj = [
            ['Supermercado Bom Preço LTDA', 'Supermercado Bom Preço', 2400],
            ['Clínica Odontológica Sorriso LTDA', 'Clínica Sorriso', 900],
            ['Panificadora Trigo de Ouro LTDA', 'Trigo de Ouro', 1600],
            ['Auto Mecânica Pista Livre LTDA', 'Pista Livre', 1100],
            ['Escola Infantil Pequeno Saber LTDA', 'Pequeno Saber', 1300],
            ['Restaurante Sabor da Serra LTDA', 'Sabor da Serra', 2100],
            ['Academia Corpo em Forma LTDA', 'Corpo em Forma', 1800],
            ['Farmácia Vida Plena LTDA', 'Vida Plena', 950],
            ['Hotel Pousada Araucária LTDA', 'Pousada Araucária', 3200],
            ['Laticínios Campo Verde LTDA', 'Laticínios Campo Verde', 3800],
        ];

        // Clientes ativos entram aos poucos (crescimento): mais antigos primeiro.
        $entries = [];
        foreach ($pf as $i => $name) {
            $entries[] = ['tipo' => 'pf', 'nome' => $name, 'kwh' => mt_rand(220, 650)];
        }
        foreach ($pj as [$razao, $fantasia, $kwh]) {
            $entries[] = ['tipo' => 'pj', 'nome' => $razao, 'fantasia' => $fantasia, 'kwh' => $kwh];
        }
        shuffle($entries);

        // Usinas que já podem receber clientes; o cliente fica na concessionária da usina.
        $usinaPool = collect($usinas)
            ->filter(fn ($u) => $u->operational_status !== UsinaOperationalStatus::PendingDocumentation)
            ->sortBy('concessionaria_id')
            ->values();
        $total = count($entries);

        foreach ($entries as $i => $entry) {
            // 28 ativos, 4 com contrato emitido (aguardando assinatura), 4 em proposta.
            $stage = $i < 28 ? 'ativo' : ($i < 32 ? 'contrato_emitido' : 'proposta');
            $monthsActive = $stage === 'ativo' ? max(1, 17 - (int) floor($i * 16 / 28)) : 0;
            $consultor = $consultores[$i % count($consultores)];
            $discount = [15.0, 18.0, 20.0, 22.0, 25.0][$i % 5];

            $profile = $this->createClientProfile($entry, $consultor, $stage, $monthsActive);
            $since = $this->today->subMonths(max($monthsActive, 1) + 1);
            $usina = $usinaPool[($i * 7) % $usinaPool->count()];
            $region = $this->regionOf($usina->concessionaria_id);

            $proposal = CommercialProposal::create([
                'client_profile_id' => $profile->id,
                'consultor_user_id' => $consultor->id,
                'concessionaria_id' => $usina->concessionaria_id,
                'status' => $stage === 'proposta' ? ['enviada', 'emitida'][$i % 2] : 'aprovada',
                'issued_at' => $since->subDays(20)->toDateString(),
                'valid_until' => $since->addDays(10)->toDateString(),
                'media_consumo' => $entry['kwh'],
                'valor_medio' => round($entry['kwh'] * $region['tariff'], 2),
                'discount_percent' => $discount,
                'prazo_locacao' => [12, 24, 36][$i % 3],
                'unidade_consumidora' => (string) ($this->ucSequence + 1),
                'notes' => 'Simulação com base na média dos últimos 12 meses.',
                'created_at' => $since->subDays(20),
            ]);
            $this->count('Propostas comerciais');

            if ($stage === 'proposta') {
                continue;
            }

            ClientDiscountRule::create([
                'client_profile_id' => $profile->id,
                'discount_percent' => $discount,
                'starts_on' => $since->toDateString(),
                'is_active' => true,
                'notes' => 'Desconto contratual',
            ]);

            $units = $this->createConsumerUnits($profile, $entry, $since, $usina);

            ClientContract::create([
                'commercial_proposal_id' => $proposal->id,
                'client_profile_id' => $profile->id,
                'consumer_unit_id' => $units[0]->id,
                'user_id' => $consultor->id,
                'status' => $stage === 'ativo' ? ($i % 3 === 0 ? 'active' : 'signed') : 'issued',
                'issued_at' => $since->subDays(10)->toDateString(),
                'signed_at' => $stage === 'ativo' ? $since->subDays(5)->toDateString() : null,
                'notes' => $stage === 'ativo' ? 'Assinado digitalmente.' : 'Enviado ao cliente para assinatura.',
                'created_at' => $since->subDays(10),
            ]);
            $this->count('Contratos');

            if ($stage !== 'ativo') {
                continue;
            }

            // Todas as unidades do cliente ficam na área da concessionária da usina.
            foreach ($units as $unit) {
                $this->linkUnitToUsina($profile, $unit, $usina, $discount, $since);
                $this->createBillingHistory($profile, $unit, $usina, $discount, $since, $i);
            }
        }
    }

    private function createClientProfile(array $entry, User $consultor, string $stage, int $monthsActive): ClientProfile
    {
        $slug = $this->slug($entry['fantasia'] ?? $entry['nome']);
        $contact = UserContact::create([
            'email' => $slug.'@'.self::DOMAIN,
            'celular' => '419'.mt_rand(80000000, 99999999),
            'telefone' => $entry['tipo'] === 'pj' ? '413'.mt_rand(1000000, 9999999) : null,
        ]);

        $user = null;
        if ($stage === 'ativo') {
            $user = User::create([
                'name' => $entry['fantasia'] ?? $entry['nome'],
                'email' => $slug.'@'.self::DOMAIN,
                'password' => $this->passwordHash,
                'role_id' => RoleUser::$CLIENTE,
                'status' => '1',
                'consultor_id' => $consultor->id,
                'created_at' => $this->today->subMonths($monthsActive + 1),
            ]);
        }

        $data = [
            'tipo_pessoa' => $entry['tipo'],
            'contacts_id' => $contact->id,
            'consultor_user_id' => $consultor->id,
            'platform_user_id' => $user?->id,
            'status' => match ($stage) {
                'ativo' => 'contrato_assinado',
                'contrato_emitido' => 'contrato_emitido',
                default => 'proposta_emitida',
            },
            'is_active_client' => $stage === 'ativo',
            'activated_at' => $stage === 'ativo' ? $this->today->subMonths($monthsActive + 1) : null,
            'created_at' => $this->today->subMonths(max($monthsActive, 1) + 2),
        ];

        if ($entry['tipo'] === 'pf') {
            $data['nome'] = $entry['nome'];
            $data['cpf'] = (string) mt_rand(100000000, 999999999).str_pad((string) mt_rand(0, 99), 2, '0', STR_PAD_LEFT);
        } else {
            $data['razao_social'] = $entry['nome'];
            $data['nome_fantasia'] = $entry['fantasia'];
            $data['cnpj'] = (string) mt_rand(10000000, 99999999).'0001'.str_pad((string) mt_rand(0, 99), 2, '0', STR_PAD_LEFT);
        }

        $this->count('Clientes novos');

        return ClientProfile::create($data);
    }

    private function createConsumerUnits(ClientProfile $profile, array $entry, CarbonImmutable $since, UsinaSolar $usina): array
    {
        // Empresas maiores têm duas unidades (matriz e filial/depósito).
        $labels = $entry['tipo'] === 'pj' && $entry['kwh'] >= 1800 ? ['Matriz', 'Filial'] : ['Residência'];
        if ($entry['tipo'] === 'pj' && count($labels) === 1) {
            $labels = ['Estabelecimento'];
        }

        $region = $this->regionOf($usina->concessionaria_id);
        $city = $region['cities'][mt_rand(1, count($region['cities']) - 1)];

        $units = [];
        foreach ($labels as $n => $label) {
            $address = Address::create([
                'cep' => $region['cep'].mt_rand(1000000, 9999999),
                'rua' => ['Rua das Flores', 'Avenida Brasil', 'Rua XV de Novembro', 'Rua Sete de Setembro', 'Avenida Getúlio Vargas'][mt_rand(0, 4)],
                'numero' => (string) mt_rand(10, 2500),
                'bairro' => ['Centro', 'Jardim América', 'Vila Nova', 'Boa Vista', 'São José'][mt_rand(0, 4)],
                'cidade' => $city,
                'estado' => $region['uf'],
            ]);
            $units[] = ConsumerUnit::create([
                'client_profile_id' => $profile->id,
                'uc_code' => (string) (++$this->ucSequence),
                'label' => $label,
                'consumo_previsto_kwh_mes' => round($entry['kwh'] / count($labels) * ($n === 0 ? 1.1 : 0.9)),
                'concessionaria_id' => $usina->concessionaria_id,
                'address_id' => $address->id,
                'status' => 'active',
                'created_at' => $since,
            ]);
            $this->count('Unidades consumidoras');
        }

        return $units;
    }

    private function linkUnitToUsina(ClientProfile $profile, ConsumerUnit $unit, UsinaSolar $usina, float $discount, CarbonImmutable $since): void
    {
        $kwh = (float) $unit->consumo_previsto_kwh_mes;

        ClientUsinaLink::create([
            'client_profile_id' => $profile->id,
            'consumer_unit_id' => $unit->id,
            'usina_id' => $usina->id,
            'started_at' => $since->toDateString(),
            'is_active' => true,
            'allocated_energy_kwh' => $kwh,
            'discount_percentage' => $discount,
            'consumption_percentage' => 100,
            'status' => ClientUsinaLinkStatus::Active->value,
            'created_by_user_id' => $this->adminId,
            'created_at' => $since,
        ]);
        $usina->increment('energia_alocada_kwh', $kwh);
        $usina->decrement('energia_saldo_kwh', $kwh);
        $this->count('Vínculos cliente-usina');
    }

    // ─── Faturas, cobranças e pagamentos ─────────────────────────────────

    private function createBillingHistory(ClientProfile $profile, ConsumerUnit $unit, UsinaSolar $usina, float $discount, CarbonImmutable $since, int $clientIndex): void
    {
        $base = (float) $unit->consumo_previsto_kwh_mes;
        // Alguns clientes ficam com atraso no mês anterior ao atual (inadimplência realista).
        $lateClient = in_array($clientIndex, [6, 11, 19], true);

        for ($ref = $since->startOfMonth(); $ref->lte($this->lastRef); $ref = $ref->addMonth()) {
            $isCurrent = $ref->equalTo($this->lastRef);
            $isPrevious = $ref->equalTo($this->lastRef->subMonth());

            // Fila atual: algumas faturas do mês ainda aguardam revisão (sem cobrança).
            if ($isCurrent && $clientIndex % 6 === 1) {
                $this->createBill($profile, $unit, $usina, $ref, $base, 'pending_review');

                continue;
            }

            $bill = $this->createBill($profile, $unit, $usina, $ref, $base, 'approved');
            $status = match (true) {
                $isCurrent && $clientIndex % 9 === 4 => 'draft',
                $isCurrent && $clientIndex % 7 === 2 => 'open',
                // Parte dos clientes paga assim que recebe a cobrança, antes do vencimento.
                $isCurrent && $clientIndex % 5 < 2 => 'paid',
                $isCurrent => 'waiting_payment',
                $isPrevious && $lateClient => 'overdue',
                $clientIndex === 7 && $ref->equalTo($since->startOfMonth()->addMonths(2)) => 'cancelled',
                default => 'paid',
            };

            $this->createCharge($profile, $bill, $usina, $discount, $status, $clientIndex);
        }
    }

    private function createBill(ClientProfile $profile, ConsumerUnit $unit, UsinaSolar $usina, CarbonImmutable $ref, float $base, string $review): ConcessionaireBill
    {
        $season = match ((int) $ref->month) {
            12, 1, 2 => 1.18, // verão: ar-condicionado
            6, 7, 8 => 1.08,  // inverno: chuveiro
            default => 1.0,
        };
        $kwh = round($base * $season * (0.9 + mt_rand(0, 20) / 100), 1);
        $region = $this->regionOf($usina->concessionaria_id);
        $total = round($kwh * $region['tariff'], 2);
        // A fatura chega nos primeiros dias do mês seguinte. Limite de 3 dias atrás para
        // revisão (+1), cobrança (+1) e aprovação (+2) nunca caírem no futuro.
        $issued = $ref->addMonth()->startOfMonth()->addDays(mt_rand(1, 4))->min($this->today->subDays(3));

        $this->count('Faturas de concessionária');

        return ConcessionaireBill::create([
            'client_profile_id' => $profile->id,
            'consumer_unit_id' => $unit->id,
            'usina_id' => $usina->id,
            'concessionaria_id' => $usina->concessionaria_id,
            'created_by_user_id' => $this->adminId,
            'reviewed_by_user_id' => $review === 'approved' ? $this->adminId : null,
            // Leitura automática por e-mail só existe para a Copel; as demais entram por envio manual.
            'import_source' => $usina->concessionaria_id === $this->copelId && mt_rand(0, 4) !== 0 ? 'imap' : 'manual',
            'reference_month' => $ref->month,
            'reference_year' => $ref->year,
            'reference_label' => $ref->format('m/Y'),
            'unidade_consumidora' => $unit->uc_code,
            'numero_instalacao' => (string) (++$this->installationSequence),
            'nome' => mb_strtoupper($profile->nome ?? $profile->razao_social),
            'vencimento' => $issued->addDays(15)->toDateString(),
            'valor_total' => $total,
            'consumo_kwh' => $kwh,
            'injected_energy_kwh' => $kwh,
            'injected_consumption_kwh' => $kwh,
            'injected_consumption_amount' => $total,
            'import_status' => 'imported',
            'parser_status' => 'success',
            'review_status' => $review,
            'reviewed_at' => $review === 'approved' ? $issued->addDays(1) : null,
            'created_at' => $issued,
            'updated_at' => $issued->addDay(),
        ]);
    }

    private function createCharge(ClientProfile $profile, ConcessionaireBill $bill, UsinaSolar $usina, float $discount, string $status, int $clientIndex): void
    {
        $issued = CarbonImmutable::parse($bill->created_at);
        $due = CarbonImmutable::parse($bill->vencimento)->addDays(5);
        $original = (float) $bill->valor_total;
        $discountAmount = round($original * $discount / 100, 2);

        // Ajustes manuais pontuais (crédito de compensação, taxa de religação).
        $manualDiscount = $status === 'paid' && $clientIndex % 8 === 5 && $issued->month === 3 ? 25.0 : 0.0;
        $manualAddition = $status === 'paid' && $clientIndex % 10 === 6 && $issued->month === 7 ? 18.5 : 0.0;
        $final = round($original - $discountAmount - $manualDiscount + $manualAddition, 2);

        $paidAt = null;
        if ($status === 'paid') {
            $paidAt = $due->subDays(mt_rand(-4, 6))->setTime(mt_rand(8, 20), mt_rand(0, 59));
            // Cobrança do mês corrente ainda não venceu: pagamento antecipado, nunca no futuro.
            if ($paidAt->gt($this->today->subHours(2))) {
                $earliest = $issued->addDays(2)->setTime(9, 0);
                $window = max(0, (int) $earliest->diffInSeconds($this->today->subHours(2), false));
                $paidAt = $earliest->addSeconds(mt_rand(0, $window));
            }
        }

        $charge = CustomerCharge::create([
            'client_profile_id' => $profile->id,
            'platform_user_id' => $profile->platform_user_id,
            'usina_id' => $usina->id,
            'concessionaria_id' => $bill->concessionaria_id,
            'concessionaire_bill_id' => $bill->id,
            'reference_month' => $bill->reference_month,
            'reference_year' => $bill->reference_year,
            'reference_label' => $bill->reference_label,
            'due_date' => $due->toDateString(),
            'original_amount' => $original,
            'discount_percent' => $discount,
            'discount_amount' => $discountAmount,
            'manual_discount_amount' => $manualDiscount,
            'manual_addition_amount' => $manualAddition,
            'final_amount' => $final,
            'status' => $status,
            'generated_by_user_id' => $this->adminId,
            'approved_by_user_id' => $status === 'draft' ? null : $this->adminId,
            'approved_at' => $status === 'draft' ? null : $issued->addDays(2),
            'paid_at' => $paidAt,
            'cancelled_at' => $status === 'cancelled' ? $issued->addDays(4) : null,
            'notes' => $status === 'cancelled' ? 'Cancelada: fatura reemitida pela concessionária.' : null,
            'created_at' => $issued->addDay(),
            'updated_at' => $paidAt ?? $issued->addDays(2),
        ]);
        $this->count('Cobranças');

        $this->log($charge, 'created', 'Cobrança gerada a partir da fatura aprovada.', $issued->addDay());
        if ($status !== 'draft') {
            $this->log($charge, 'approved', 'Cobrança aberta para pagamento.', $issued->addDays(2));
        }
        if ($manualDiscount > 0) {
            $this->adjust($charge, 'discount', $manualDiscount, 'Crédito de compensação de mês anterior', $issued->addDays(2));
        }
        if ($manualAddition > 0) {
            $this->adjust($charge, 'addition', $manualAddition, 'Taxa de religação repassada', $issued->addDays(2));
        }

        match ($status) {
            'paid' => $this->createPaidSlip($charge, $issued->addDays(2), $due, $paidAt),
            'waiting_payment' => $this->createSlip($charge, $issued->addDays(2), $due, 'pending'),
            'overdue' => $this->createOverdue($charge, $issued->addDays(2), $due),
            'cancelled' => $this->log($charge, 'cancelled', 'Cancelada: fatura reemitida pela concessionária.', $issued->addDays(4)),
            default => null,
        };
    }

    private function createSlip(CustomerCharge $charge, CarbonImmutable $generated, CarbonImmutable $due, string $status): PaymentSlip
    {
        $method = $charge->id % 3 === 0 ? 'boleto' : 'pix';
        $factor = 1000 + (int) CarbonImmutable::parse('2025-02-22')->diffInDays($due, false);
        $amount = (float) $charge->final_amount;

        $slip = PaymentSlip::create([
            'customer_charge_id' => $charge->id,
            'payment_provider_account_id' => $this->account?->id,
            'provider' => 'mercado_pago',
            'provider_payment_id' => 'DEMO-'.$charge->id.'-'.$method,
            'provider_status' => $status === 'paid' ? 'processed' : ($status === 'expired' ? 'expired' : 'action_required'),
            'payment_method' => $method,
            'status' => $status,
            'amount' => $amount,
            'due_date' => $due->toDateString(),
            'barcode' => $method === 'boleto' ? '34191'.$factor.str_pad((string) round($amount * 100), 10, '0', STR_PAD_LEFT).str_repeat('1', 25) : null,
            'digitable_line' => $method === 'boleto' ? '34191790010104351004791020150008'.$factor.str_pad((string) round($amount * 100), 10, '0', STR_PAD_LEFT) : null,
            'pix_copy_paste' => DemoPix::copyPaste($charge->id, $amount),
            'generated_at' => $generated,
            'created_at' => $generated,
            'updated_at' => $generated,
        ]);
        $this->count('Boletos/Pix');
        $this->log($charge, 'payment_generated', ($method === 'pix' ? 'Pix' : 'Boleto').' emitido pelo Mercado Pago.', $generated);

        return $slip;
    }

    private function createPaidSlip(CustomerCharge $charge, CarbonImmutable $generated, CarbonImmutable $due, CarbonImmutable $paidAt): void
    {
        $slip = $this->createSlip($charge, $generated, $due, 'paid');
        $slip->update(['paid_at' => $paidAt, 'updated_at' => $paidAt]);

        PaymentTransaction::create([
            'payment_slip_id' => $slip->id,
            'customer_charge_id' => $charge->id,
            'provider' => 'mercado_pago',
            'provider_transaction_id' => 'DEMO-TX-'.$slip->id,
            'amount' => $slip->amount,
            'paid_at' => $paidAt,
            'status' => 'paid',
            'created_at' => $paidAt,
            'updated_at' => $paidAt,
        ]);

        // Notificação de pagamento recebida pelo webhook nos últimos meses.
        if ($paidAt->gte($this->today->subMonths(3))) {
            PaymentWebhookEvent::create([
                'provider' => 'mercado_pago',
                'event_id' => 'DEMO-EVT-'.$slip->id,
                'event_type' => 'order',
                'payment_slip_id' => $slip->id,
                'provider_payment_id' => $slip->provider_payment_id,
                'payload' => ['type' => 'order', 'action' => 'order.processed', 'data' => ['id' => $slip->provider_payment_id]],
                'status' => 'processed',
                'attempts' => 1,
                'last_attempt_at' => $paidAt,
                'processed_at' => $paidAt->addSeconds(4),
                'created_at' => $paidAt,
                'updated_at' => $paidAt->addSeconds(4),
            ]);
            $this->count('Webhooks recebidos');
        }

        $this->count('Pagamentos confirmados');
        $this->log($charge, 'paid', 'Pagamento confirmado pelo Mercado Pago.', $paidAt);
    }

    private function createOverdue(CustomerCharge $charge, CarbonImmutable $generated, CarbonImmutable $due): void
    {
        $slip = $this->createSlip($charge, $generated, $due, 'expired');
        $slip->update(['updated_at' => $due->addDay()]);
        $charge->update(['reminder_sent_at' => $due->addDays(1)]);
        $this->log($charge, 'marked_overdue', 'Vencimento passou sem pagamento.', $due->addDay());
    }

    // ─── Clientes do DemoDataSeeder: completa o histórico até o mês atual ──

    private function extendExistingClients(): void
    {
        $clients = ClientProfile::query()
            ->where('is_active_client', true)
            ->whereNull('deleted_at')
            ->where(fn ($q) => $q->whereNull('contacts_id')->orWhereHas('contacts', fn ($c) => $c->where('email', 'not like', '%@'.self::DOMAIN)))
            ->get();

        foreach ($clients as $profile) {
            $last = CustomerCharge::where('client_profile_id', $profile->id)
                ->orderByDesc('reference_year')->orderByDesc('reference_month')->first();
            if (! $last) {
                continue;
            }

            // Cobranças antigas que ficaram em aberto passam a pagas (o mês atual assume a fila).
            CustomerCharge::where('client_profile_id', $profile->id)
                ->whereIn('status', ['open', 'waiting_payment'])
                ->get()
                ->each(function (CustomerCharge $charge) {
                    $paidAt = CarbonImmutable::parse($charge->getRawOriginal('due_date'))->subDays(2)->setTime(10, 15)
                        ->min($this->today->subDay()->setTime(10, 15));
                    $charge->update(['status' => 'paid', 'paid_at' => $paidAt]);
                    $slip = PaymentSlip::where('customer_charge_id', $charge->id)->whereIn('status', ['pending', 'generated'])->first();
                    $slip
                        ? $slip->update(['status' => 'paid', 'provider_status' => 'processed', 'paid_at' => $paidAt])
                        : $this->createPaidSlip($charge, $paidAt->subDays(10), $paidAt->addDays(2), $paidAt);
                });

            $discount = (float) ($last->discount_percent ?? 20);
            $usina = UsinaSolar::find($last->usina_id) ?? UsinaSolar::first();
            $unit = ConsumerUnit::where('client_profile_id', $profile->id)->first()
                ?? ConsumerUnit::create([
                    'client_profile_id' => $profile->id,
                    'uc_code' => (string) (++$this->ucSequence),
                    'label' => 'Residência',
                    'consumo_previsto_kwh_mes' => round((float) ConcessionaireBill::where('client_profile_id', $profile->id)->avg('consumo_kwh')),
                    'concessionaria_id' => $usina->concessionaria_id,
                    'status' => 'active',
                ]);
            $base = (float) (ConcessionaireBill::where('client_profile_id', $profile->id)->avg('consumo_kwh') ?: 350);

            $start = CarbonImmutable::create($last->reference_year, $last->reference_month, 1)->addMonth();
            for ($ref = $start; $ref->lte($this->lastRef); $ref = $ref->addMonth()) {
                $bill = $this->createBill($profile, $unit, $usina, $ref, $base, 'approved');
                $status = $ref->equalTo($this->lastRef) ? 'waiting_payment' : 'paid';
                $this->createCharge($profile, $bill, $usina, $discount, $status, 0);
            }
        }
    }

    // ─── Geração das usinas ──────────────────────────────────────────────

    private function createGenerationHistory($usinas): void
    {
        foreach ($usinas as $usina) {
            if (in_array($usina->operational_status?->value ?? $usina->operational_status, ['pending_documentation'], true)) {
                continue;
            }

            $start = $usina->operation_started_at
                ? CarbonImmutable::parse($usina->operation_started_at)->startOfMonth()
                : $this->today->subMonths(12)->startOfMonth();
            $start = $start->max($this->today->subMonths(18)->startOfMonth());

            for ($ref = $start; $ref->lte($this->lastRef); $ref = $ref->addMonth()) {
                $exists = UsinaGenerationRecord::where('usina_id', $usina->id)
                    ->where('reference_year', $ref->year)->where('reference_month', $ref->month)->exists();
                if ($exists) {
                    continue;
                }

                $season = match ((int) $ref->month) {
                    11, 12, 1, 2 => 1.15,
                    5, 6, 7 => 0.80,
                    default => 1.0,
                };
                // Usina em manutenção gera menos no mês atual.
                $maintenance = ($usina->operational_status?->value ?? null) === 'maintenance' && $ref->equalTo($this->lastRef) ? 0.55 : 1.0;
                $generated = round((float) $usina->media_geracao * $season * $maintenance * (0.92 + mt_rand(0, 14) / 100), 3);
                $compensated = round(min($generated, (float) $usina->energia_alocada_kwh), 3);

                UsinaGenerationRecord::create([
                    'usina_id' => $usina->id,
                    'reference_year' => $ref->year,
                    'reference_month' => $ref->month,
                    'generated_energy_kwh' => $generated,
                    'injected_energy_kwh' => round($generated * 0.97, 3),
                    'compensated_energy_kwh' => $compensated,
                    'available_energy_kwh' => round($generated - $compensated, 3),
                    'notes' => $maintenance < 1 ? 'Geração reduzida por manutenção do inversor.' : null,
                    'created_by_user_id' => $this->adminId,
                    'created_at' => $ref->addMonth()->addDays(3),
                ]);
                $this->count('Registros de geração');
            }
        }
    }

    // ─── Funil comercial ─────────────────────────────────────────────────

    private function createCommercialPipeline(array $consultores): void
    {
        $prospects = [
            ['Roberta Galvão Pinheiro', 'recusada', 'Cliente optou por instalar painéis próprios.'],
            ['Sérgio Augusto Matos', 'expirada', 'Sem retorno do cliente dentro da validade.'],
            ['Lanchonete Ponto Certo', 'rascunho', 'Aguardando conta de luz para simular.'],
            ['Eliane Torres Bastos', 'emitida', 'Cliente pediu prazo para avaliar com a família.'],
            ['Oficina Pneus Rodovia', 'enviada', 'Proposta enviada por WhatsApp.'],
            ['Paulo Roberto Quintana', 'enviada', 'Reunião de fechamento agendada.'],
        ];

        foreach ($prospects as $i => [$name, $status, $note]) {
            $consultor = $consultores[$i % count($consultores)];
            $isCompany = str_contains($name, 'Lanchonete') || str_contains($name, 'Oficina');
            $contact = UserContact::create(['email' => $this->slug($name).'@'.self::DOMAIN, 'celular' => '419'.mt_rand(80000000, 99999999)]);
            $created = $this->today->subDays(mt_rand(3, 75));

            $profile = ClientProfile::create([
                'tipo_pessoa' => $isCompany ? 'pj' : 'pf',
                $isCompany ? 'razao_social' : 'nome' => $isCompany ? $name.' LTDA' : $name,
                'nome_fantasia' => $isCompany ? $name : null,
                $isCompany ? 'cnpj' : 'cpf' => $isCompany
                    ? (string) mt_rand(10000000, 99999999).'000199'
                    : (string) mt_rand(100000000, 999999999).'77',
                'contacts_id' => $contact->id,
                'consultor_user_id' => $consultor->id,
                'status' => $status === 'rascunho' ? 'prospect' : 'proposta_emitida',
                'is_active_client' => false,
                'created_at' => $created,
            ]);

            $kwh = mt_rand(250, 1400);
            $region = array_values($this->regions)[$i % count($this->regions)];
            CommercialProposal::create([
                'client_profile_id' => $profile->id,
                'consultor_user_id' => $consultor->id,
                'concessionaria_id' => $region['id'] ?? $this->copelId,
                'status' => $status,
                'issued_at' => $created->toDateString(),
                'valid_until' => $created->addDays(30)->toDateString(),
                'media_consumo' => $kwh,
                'valor_medio' => round($kwh * $region['tariff'], 2),
                'discount_percent' => [15.0, 20.0, 18.0][$i % 3],
                'prazo_locacao' => 24,
                'unidade_consumidora' => (string) (++$this->ucSequence),
                'notes' => $note,
                'created_at' => $created,
            ]);
            $this->count('Prospectos no funil');
            $this->count('Propostas comerciais');
        }
    }

    private function createProducerPipeline(array $consultores): void
    {
        $leads = [
            ['novo', 75, 'Proprietário rural interessado em arrendar área para usina.', 'Osvaldo Pereira Lima', 'pf'],
            ['novo', 120, 'Indicação de produtor parceiro.', 'Rosângela Batista Costa', 'pf'],
            ['em_atendimento', 200, 'Aguardando laudo de viabilidade de conexão.', 'Sítio Boa Esperança LTDA', 'pj'],
            ['proposta', 90, 'Visita técnica feita; proposta enviada.', 'Valdir Antônio Kowalski', 'pf'],
            ['aprovado', 300, 'Viabilidade aprovada; proposta em elaboração.', 'Granja Santa Clara LTDA', 'pj'],
            ['aprovado', 150, 'Documentação do terreno conferida.', 'Edson Luiz Schneider', 'pf'],
            ['reprovado', 40, 'Área insuficiente para a potência pretendida.', 'Neusa Maria Ferraz', 'pf'],
            ['novo', 500, 'Cooperativa avaliando entrada na operação.', 'Cooperativa Agroindustrial Oeste', 'pj'],
        ];

        foreach ($leads as $i => [$status, $kwp, $notes, $name, $tipo]) {
            $consultor = $consultores[$i % count($consultores)];
            $created = $this->today->subDays(mt_rand(2, 90));
            $this->createLead($consultor, $status, $kwp, $notes, $name, $tipo, $i, $created);
        }

        // Proposta de produtor ainda em negociação.
        $producer = ProducerProfile::orderByDesc('id')->first();
        if ($producer) {
            ProducerProposal::create([
                'producer_profile_id' => $producer->id,
                'consultor_user_id' => $consultores[0]->id,
                'concessionaria_id' => $this->copelId,
                'status' => 'enviada',
                'issued_at' => $this->today->subDays(12)->toDateString(),
                'valid_until' => $this->today->addDays(18)->toDateString(),
                'fill_percent' => 88,
                'prazo_contrato' => 180, // meses
                'media_geracao' => 18000,
                'potencia_usina' => 150,
                'valor_investimento' => 585000,
                'notes' => 'Expansão da usina existente em negociação.',
                'created_at' => $this->today->subDays(12),
            ]);
        }
    }

    private function createLead(User $consultor, string $status, float $kwp, string $notes, string $name, string $tipo, int $i, CarbonImmutable $created): void
    {
        $contact = UserContact::create(['email' => $this->slug($name).'@'.self::DOMAIN, 'celular' => '4299'.mt_rand(1000000, 9999999)]);

        // Prospecto de produtor: ainda em integração, sem acesso à plataforma.
        $profile = ProducerProfile::create([
            'tipo_pessoa' => $tipo,
            $tipo === 'pf' ? 'nome' : 'razao_social' => $name,
            $tipo === 'pf' ? 'cpf' : 'cnpj' => $tipo === 'pf'
                ? (string) mt_rand(100000000, 999999999).'55'
                : (string) mt_rand(10000000, 99999999).'000144',
            'contacts_id' => $contact->id,
            'consultor_user_id' => $consultor->id,
            'status' => 'em_integracao',
            'is_active_producer' => false,
            'created_at' => $created,
        ]);

        ProducerLead::create([
            'consultor_user_id' => $consultor->id,
            'producer_profile_id' => $profile->id,
            'concessionaria_id' => array_values($this->regions)[($i + 3) % count($this->regions)]['id'],
            'taxa_reducao' => [15, 18, 20][$i % 3],
            'prazo_locacao' => [15, 20, 25][$i % 3],
            'potencia' => $kwp,
            'status' => $status,
            'notes' => $notes,
            'created_at' => $created,
        ]);
        $this->count('Leads de produtores');
    }

    // ─── Suporte ─────────────────────────────────────────────────────────

    private function createSupportTickets(array $consultores): void
    {
        // Cliente com mais histórico primeiro: é ele que aparece nos prints do portal.
        $clients = ClientProfile::whereNotNull('platform_user_id')->where('is_active_client', true)
            ->orderByDesc(CustomerCharge::selectRaw('count(*)')->whereColumn('client_profile_id', 'client_profiles.id'))
            ->orderBy('id')
            ->limit(14)
            ->get();

        $tickets = [
            ['Dúvida sobre o valor da cobrança de agosto', 'financeiro', 'normal', 'resolvido', 'O valor veio diferente do mês anterior, gostaria de entender o cálculo.', 'O consumo de agosto foi maior por causa do inverno; o desconto contratual foi aplicado normalmente.'],
            ['Não recebi o boleto por e-mail', 'financeiro', 'alta', 'resolvido', 'A cobrança aparece no portal, mas o e-mail não chegou.', 'O e-mail estava indo para o spam. O boleto também fica disponível no portal, em Cobranças.'],
            ['Como alterar meu e-mail de contato?', 'acesso', 'baixa', 'fechado', 'Mudei de e-mail e quero receber as cobranças no novo endereço.', 'Atualizamos o e-mail de contato no cadastro.'],
            ['Fatura do mês não apareceu no portal', 'fatura', 'normal', 'em_atendimento', 'Minha conta de setembro ainda não está no portal.', 'Estamos verificando com a concessionária: o envio das faturas da sua região atrasou.'],
            ['Quero incluir mais uma unidade consumidora', 'comercial', 'normal', 'aguardando_cliente', 'Abri uma filial e quero que ela também receba energia da usina.', 'Ótimo! Envie a última conta de luz da filial para prepararmos a proposta.'],
            ['Segunda via do contrato', 'contrato', 'baixa', 'resolvido', 'Preciso da segunda via do contrato assinado.', 'O contrato está disponível no portal, em Contratos.'],
            ['Economia menor que o esperado', 'financeiro', 'alta', 'em_atendimento', 'No relatório de economia o valor ficou abaixo do que foi apresentado na proposta.', null],
            ['Erro ao acessar o portal pelo celular', 'tecnico', 'urgente', 'novo', 'A página fica em branco ao abrir pelo celular.', null],
            ['Pix não foi reconhecido', 'financeiro', 'urgente', 'resolvido', 'Paguei pelo Pix ontem e a cobrança ainda aparece em aberto.', 'O pagamento foi confirmado pelo banco hoje cedo e a cobrança já consta como paga.'],
            ['Mudança de titularidade da conta', 'contrato', 'normal', 'novo', 'Vendi o imóvel e o novo proprietário quer continuar com a Casa Verde.', null],
            ['Informações sobre a usina', 'usina', 'baixa', 'fechado', 'Gostaria de saber onde fica a usina que gera minha energia.', 'Sua energia vem da Usina Solar Bela Vista, em Castro (PR).'],
            ['Desconto não aplicado na cobrança', 'financeiro', 'alta', 'resolvido', 'Acho que o desconto de 20% não entrou na última cobrança.', 'Conferimos: o desconto foi aplicado sobre o consumo compensado. Enviamos o detalhamento.'],
        ];

        foreach ($tickets as $i => [$title, $category, $priority, $status, $description, $answer]) {
            $client = in_array($i, [0, 3], true) ? $clients->first() : ($clients[($i % max($clients->count() - 1, 1)) + 1] ?? null);
            if (! $client) {
                break;
            }
            $opened = $this->today->subDays(mt_rand(1, 60))->setTime(mt_rand(8, 19), mt_rand(0, 59));

            // Resposta sobre a usina cita a usina e a cidade que atendem este cliente.
            if ($category === 'usina') {
                $usina = ClientUsinaLink::with('usina.address')->where('client_profile_id', $client->id)->first()?->usina;
                $answer = $usina
                    ? sprintf('Sua energia vem da %s, em %s (%s).', $usina->usina_nome, $usina->address?->cidade, $usina->address?->estado)
                    : $answer;
            }
            $agent = $client->consultor_user_id ?? $consultores[0]->id;
            $closed = in_array($status, ['resolvido', 'fechado'], true);

            $ticket = SupportTicket::create([
                'title' => $title,
                'description' => $description,
                'category' => $category,
                'status' => $status,
                'priority' => $priority,
                'opened_by_user_id' => $client->platform_user_id,
                'client_profile_id' => $client->id,
                'consultor_user_id' => $client->consultor_user_id,
                'assigned_to_user_id' => $status === 'novo' ? null : $agent,
                'first_response_at' => $answer ? $opened->addHours(mt_rand(1, 20)) : null,
                'resolved_at' => $closed ? $opened->addDays(mt_rand(1, 3)) : null,
                'closed_at' => $status === 'fechado' ? $opened->addDays(4) : null,
                'rating' => $closed ? [5, 5, 4, 5][$i % 4] : null,
                'rating_comment' => $closed && $i % 2 === 0 ? 'Atendimento rápido, obrigado!' : null,
                'created_at' => $opened,
                'updated_at' => $opened->addDays($closed ? 3 : 0),
            ]);

            SupportTicketMessage::create(['ticket_id' => $ticket->id, 'user_id' => $client->platform_user_id, 'message' => $description, 'is_internal' => false, 'created_at' => $opened]);
            if ($answer) {
                SupportTicketMessage::create(['ticket_id' => $ticket->id, 'user_id' => $agent, 'message' => $answer, 'is_internal' => false, 'created_at' => $opened->addHours(mt_rand(1, 20))]);
            }
            if ($closed) {
                SupportTicketMessage::create(['ticket_id' => $ticket->id, 'user_id' => $client->platform_user_id, 'message' => 'Perfeito, obrigado pela ajuda!', 'is_internal' => false, 'created_at' => $opened->addDays(1)]);
            }
            $this->count('Chamados de suporte');
        }
    }

    // ─── Alertas operacionais ────────────────────────────────────────────

    private function createOperationalAlerts($usinas, array $consultores): void
    {
        $overdue = CustomerCharge::with('clientProfile')->where('status', 'overdue')->get();
        foreach ($overdue as $charge) {
            OperationalAlert::create([
                'module' => 'financeiro',
                'type' => 'charge_overdue_reminder',
                'severity' => 'error',
                'title' => 'Cobrança vencida — lembrete ao cliente',
                'message' => sprintf('Cobrança %s (%s) — envie o lembrete pelo WhatsApp.', $charge->reference_label, $charge->clientProfile?->nome ?? $charge->clientProfile?->razao_social),
                'alertable_type' => CustomerCharge::class,
                'alertable_id' => $charge->id,
                'usina_id' => $charge->usina_id,
                'client_profile_id' => $charge->client_profile_id,
                'assigned_to_user_id' => $charge->clientProfile?->consultor_user_id,
                'reference_year' => $charge->reference_year,
                'reference_month' => $charge->reference_month,
                'status' => 'open',
                'detected_at' => $this->today->subDays(mt_rand(1, 5)),
            ]);
            $this->count('Alertas operacionais');
        }

        $byStatus = fn (string $status) => $usinas->first(fn ($u) => ($u->operational_status?->value ?? $u->operational_status) === $status);
        $alerts = [
            ['usina', 'usina_maintenance', 'warning', 'Usina em manutenção', 'Troca preventiva de inversor: geração reduzida no mês.', $byStatus('maintenance'), 'in_progress'],
            ['usina', 'pending_documentation', 'info', 'Usina aguardando documentação', 'Parecer de acesso da concessionária ainda não enviado.', $byStatus('pending_documentation'), 'open'],
            ['usina', 'low_energy_balance', 'warning', 'Saldo de energia baixo', 'Mais de 85% da energia disponível já está alocada.', $usinas->sortByDesc('energia_alocada_kwh')->first(), 'open'],
            ['fatura', 'pending_bill_review', 'warning', 'Faturas aguardando revisão', 'Faturas importadas do mês aguardam conferência antes de gerar cobrança.', null, 'open'],
            ['sistema', 'import_mailbox_delay', 'info', 'Caixa de importação sem novas faturas há 6 horas', 'Comportamento esperado fora do período de envio da concessionária.', null, 'resolved'],
            ['financeiro', 'payment_sync_failed', 'error', 'Pagamento não sincronizado', 'Consulta ao Mercado Pago falhou temporariamente; nova tentativa bem-sucedida.', null, 'resolved'],
        ];

        foreach ($alerts as [$module, $type, $severity, $title, $message, $usina, $status]) {
            OperationalAlert::create([
                'module' => $module,
                'type' => $type,
                'severity' => $severity,
                'title' => $title,
                'message' => $message,
                'usina_id' => $usina?->id,
                'reference_year' => $this->today->year,
                'reference_month' => $this->today->month,
                'status' => $status,
                'detected_at' => $this->today->subDays(mt_rand(1, 10)),
                'resolved_at' => $status === 'resolved' ? $this->today->subDays(1) : null,
                'resolved_by_user_id' => $status === 'resolved' ? $this->adminId : null,
                'resolution_notes' => $status === 'resolved' ? 'Normalizado automaticamente.' : null,
            ]);
            $this->count('Alertas operacionais');
        }
    }

    // ─── Acessos ─────────────────────────────────────────────────────────

    private function createAccessLogs(): void
    {
        $users = User::whereIn('role_id', [RoleUser::$ADMIN, RoleUser::$CONSULTOR, RoleUser::$CLIENTE])->get();
        $cities = [['Curitiba', '177.92.'], ['Ponta Grossa', '189.45.'], ['Londrina', '201.17.'], ['Maringá', '187.63.'], ['Cascavel', '200.215.']];

        foreach ($users as $user) {
            $logins = $user->role_id === RoleUser::$CLIENTE ? mt_rand(1, 5) : mt_rand(12, 25);
            for ($n = 0; $n < $logins; $n++) {
                [$city, $prefix] = $cities[mt_rand(0, count($cities) - 1)];
                $at = $this->today->subDays(mt_rand(0, 30))->setTime(mt_rand(7, 22), mt_rand(0, 59));
                UserAccessLog::create([
                    'user_id' => $user->id,
                    'event' => 'login',
                    'ip_address' => $prefix.mt_rand(1, 254).'.'.mt_rand(1, 254),
                    'user_agent' => $n % 3 === 0 ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/130.0',
                    'country' => 'Brasil',
                    'city' => $city,
                    'created_at' => $at,
                ]);
                $this->count('Acessos registrados');
            }
        }
    }

    // ─── Apoio ───────────────────────────────────────────────────────────

    private function log(CustomerCharge $charge, string $action, string $description, CarbonImmutable $at): void
    {
        CustomerChargeHistory::create([
            'customer_charge_id' => $charge->id,
            'user_id' => in_array($action, ['paid', 'marked_overdue'], true) ? null : $this->adminId,
            'action' => $action,
            'description' => $description,
            'created_at' => $at,
            'updated_at' => $at,
        ]);
    }

    private function adjust(CustomerCharge $charge, string $type, float $amount, string $description, CarbonImmutable $at): void
    {
        CustomerChargeAdjustment::create([
            'customer_charge_id' => $charge->id,
            'created_by_user_id' => $this->adminId,
            'type' => $type,
            'amount' => $amount,
            'description' => $description,
            'created_at' => $at,
            'updated_at' => $at,
        ]);
        $this->log($charge, 'adjustment_added', $description.' (R$ '.number_format($amount, 2, ',', '.').').', $at);
    }

    /** @return array{id:int, uf:string, cities:array, tariff:float, cep:string} */
    private function regionOf(?int $concessionariaId): array
    {
        foreach ($this->regions as $region) {
            if ($region['id'] === $concessionariaId) {
                return $region;
            }
        }

        return $this->regions['copel'] ?? ['id' => $this->copelId, 'uf' => 'PR', 'cities' => ['Curitiba', 'Curitiba'], 'tariff' => 0.94, 'cep' => '8'];
    }

    private function slug(string $name): string
    {
        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT', $name);
        $words = array_values(array_filter(explode(' ', strtolower(preg_replace('/[^A-Za-z ]/', '', $ascii)))));
        $words = array_values(array_diff($words, ['ltda', 'de', 'da', 'do', 'dos', 'e']));

        return implode('.', array_slice($words, 0, 2));
    }

    private function count(string $label, int $by = 1): void
    {
        $this->stats[$label] = ($this->stats[$label] ?? 0) + $by;
    }
}
