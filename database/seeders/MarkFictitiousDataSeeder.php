<?php

namespace Database\Seeders;

use App\Models\Alert\OperationalAlert;
use App\Models\Cliente\ClientProfile;
use App\Models\Endereco\Address;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Importacao\ImportEmailAccount;
use App\Models\Pagamento\PaymentSlip;
use App\Models\Produtor\ProducerProfile;
use App\Models\Support\SupportTicketMessage;
use App\Models\Users\User;
use App\Models\Users\UserContact;
use App\Models\Usina\UsinaSolar;
use App\src\Roles\RoleUser;
use Database\Seeders\Support\DemoBillPdf;
use Database\Seeders\Support\DemoPix;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Deixa explícito que a base de demonstração é fictícia, para ninguém confundir com
 * dados reais: nomes com "(fictício)/(fictícia)", CPF/CNPJ começando com zeros e
 * telefones com DDD 20 (inexistente no Brasil) e prefixo 0000. Idempotente: pode rodar de novo.
 *
 * Uso: php artisan db:seed --class=MarkFictitiousDataSeeder
 */
class MarkFictitiousDataSeeder extends Seeder
{
    private const MALE = '(fictício)';

    private const FEMALE = '(fictícia)';

    /** @var array<string, string> nome antigo => nome marcado, para textos que copiaram o nome */
    private array $renamed = [];

    private array $stats = [];

    public function run(): void
    {
        Model::unguard();

        DB::transaction(function () {
            $this->markClients();
            $this->markProducers();
            $this->markUsers();
            $this->markContacts();
            $this->markPlants();
            $this->markAddresses();
            $this->markBillsAndTexts();
            $this->markPayments();
        });

        // Com nomes alterados, todos os PDFs mudam; senão, só gera os que faltam.
        $this->regenerateBillPdfs(onlyMissing: $this->renamed === []);

        Model::reguard();

        foreach ($this->stats as $label => $count) {
            $this->command?->line(sprintf('  → %-26s %d', $label, $count));
        }
    }

    private function markClients(): void
    {
        ClientProfile::withTrashed()->each(function (ClientProfile $client) {
            $before = $client->display_name;

            $client->forceFill([
                'nome' => $this->mark($client->nome, self::MALE),
                'razao_social' => $this->mark($client->razao_social, self::FEMALE),
                'nome_fantasia' => $this->mark($client->nome_fantasia, self::FEMALE),
                'cpf' => $client->cpf ? $this->fakeCpf($client->id) : null,
                'cnpj' => $client->cnpj ? $this->fakeCnpj($client->id) : null,
            ])->saveQuietly();

            $this->rename($before, $client->display_name);
            $this->count('Clientes');
        });
    }

    private function markProducers(): void
    {
        ProducerProfile::withTrashed()->each(function (ProducerProfile $producer) {
            $before = $producer->display_name;

            // Faixa diferente dos clientes, para os documentos nunca coincidirem.
            $producer->forceFill([
                'nome' => $this->mark($producer->nome, self::MALE),
                'razao_social' => $this->mark($producer->razao_social, self::FEMALE),
                'nome_fantasia' => $this->mark($producer->nome_fantasia, self::FEMALE),
                'cpf' => $producer->cpf ? $this->fakeCpf(900000 + $producer->id) : null,
                'cnpj' => $producer->cnpj ? $this->fakeCnpj(900000 + $producer->id) : null,
            ])->saveQuietly();

            $this->rename($before, $producer->display_name);
            $this->count('Produtores');
        });
    }

    private function markUsers(): void
    {
        // Contas de empresas (clientes e produtores PJ) recebem o feminino.
        $companies = ClientProfile::withTrashed()->where('tipo_pessoa', 'pj')->pluck('platform_user_id')
            ->merge(ProducerProfile::withTrashed()->where('tipo_pessoa', 'pj')->pluck('platform_user_id'))
            ->filter()
            ->all();

        User::withTrashed()->where('role_id', '!=', RoleUser::$ADMIN)->each(function (User $user) use ($companies) {
            $before = $user->name;
            $user->forceFill(['name' => $this->mark($user->name, in_array($user->id, $companies) ? self::FEMALE : self::MALE)])->saveQuietly();
            $this->rename($before, $user->name);
            $this->count('Usuários');
        });
    }

    private function markContacts(): void
    {
        UserContact::query()->each(function (UserContact $contact) {
            $suffix = str_pad((string) ($contact->id % 10000), 4, '0', STR_PAD_LEFT);

            // DDD 20 não existe no Brasil e nenhum número começa com 0000: (20) 9 0000-0012.
            // As colunas são numéricas, por isso não dá para usar DDD 00.
            $contact->forceFill([
                'celular' => $contact->celular ? '2090000'.$suffix : null,
                'celular_2' => $contact->celular_2 ? '2090001'.$suffix : null,
                'telefone' => $contact->telefone ? '200000'.$suffix : null,
            ])->saveQuietly();
            $this->count('Telefones');
        });
    }

    private function markPlants(): void
    {
        UsinaSolar::withTrashed()->each(function (UsinaSolar $usina) {
            $before = $usina->usina_nome;
            $usina->forceFill(['usina_nome' => $this->mark($usina->usina_nome, self::FEMALE)])->saveQuietly();
            $this->rename($before, $usina->usina_nome);
            $this->count('Usinas');
        });
    }

    private function markAddresses(): void
    {
        Address::query()->whereNotNull('rua')->each(function (Address $address) {
            $address->forceFill(['rua' => $this->mark($address->rua, self::FEMALE)])->saveQuietly();
            $this->count('Endereços');
        });
    }

    private function markBillsAndTexts(): void
    {
        $names = ClientProfile::withTrashed()->get()->mapWithKeys(fn ($c) => [$c->id => $c->display_name]);

        ConcessionaireBill::query()->each(function (ConcessionaireBill $bill) use ($names) {
            $holder = mb_strtoupper($names[$bill->client_profile_id] ?? (string) $bill->nome);
            $payload = $bill->extracted_payload;
            if (is_array($payload) && array_key_exists('nome', $payload)) {
                $payload['nome'] = $holder;
            }
            $bill->forceFill(['nome' => $holder, 'extracted_payload' => $payload])->saveQuietly();
        });

        $replace = fn (?string $text) => $text === null ? null : strtr($text, $this->renamed);

        OperationalAlert::query()->each(fn (OperationalAlert $alert) => $alert->forceFill([
            'title' => $replace($alert->title),
            'message' => $replace($alert->message),
        ])->saveQuietly());

        SupportTicketMessage::query()->each(fn (SupportTicketMessage $message) => $message->forceFill([
            'message' => $replace($message->message),
        ])->saveQuietly());

        ImportEmailAccount::query()->whereNotNull('client_profile_id')->each(fn (ImportEmailAccount $account) => $account->forceFill([
            'label' => 'Faturas · '.($names[$account->client_profile_id] ?? ''),
        ])->saveQuietly());
    }

    private function markPayments(): void
    {
        PaymentSlip::query()->whereNotNull('pix_copy_paste')->each(function (PaymentSlip $slip) {
            $slip->forceFill(['pix_copy_paste' => DemoPix::copyPaste($slip->id, (float) $slip->amount)])->saveQuietly();
            $this->count('Pix copia e cola');
        });
    }

    private function regenerateBillPdfs(bool $onlyMissing): void
    {
        ConcessionaireBill::with('concessionaria')->orderBy('id')->chunkById(100, function ($bills) use ($onlyMissing) {
            foreach ($bills as $bill) {
                if ($onlyMissing && $bill->pdf_path && Storage::disk($bill->pdf_disk ?: 'local')->exists($bill->pdf_path)) {
                    continue;
                }
                $path = DemoBillPdf::write($bill);
                if ($bill->pdf_path !== $path || ! $bill->pdf_disk) {
                    $bill->forceFill(['pdf_disk' => $bill->pdf_disk ?: 'local', 'pdf_path' => $path])->saveQuietly();
                }
                $this->count('PDFs de fatura');
            }
        });
    }

    private function mark(?string $value, string $marker): ?string
    {
        if ($value === null || trim($value) === '' || str_contains(mb_strtolower($value), 'fictíci')) {
            return $value;
        }

        return trim($value).' '.$marker;
    }

    private function rename(?string $before, ?string $after): void
    {
        // Só nomes completos: trechos curtos trocariam palavras dentro de outros textos.
        if ($before && $after && $before !== $after && mb_strlen($before) >= 6 && ! str_contains($before, 'fictíci')) {
            $this->renamed[$before] = $after;
        }
    }

    // 000.000.012-00: prefixo 000 não pertence a ninguém.
    private function fakeCpf(int $id): string
    {
        return '000'.str_pad((string) ($id % 1000000), 6, '0', STR_PAD_LEFT).'00';
    }

    // 00.000.012/0001-00
    private function fakeCnpj(int $id): string
    {
        return '00'.str_pad((string) ($id % 1000000), 6, '0', STR_PAD_LEFT).'000100';
    }

    private function count(string $label): void
    {
        $this->stats[$label] = ($this->stats[$label] ?? 0) + 1;
    }
}
