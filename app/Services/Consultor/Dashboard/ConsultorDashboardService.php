<?php

namespace App\Services\Consultor\Dashboard;

use App\Models\Cliente\ClientProfile;
use App\Models\Fatura\ConcessionaireBill;
use App\Models\Produtor\ProducerLead;
use App\Models\Produtor\ProducerProfile;
use App\Models\Proposta\CommercialProposal;
use App\Models\Proposta\ProducerProposal;
use App\Models\Usina\UsinaSolar;

class ConsultorDashboardService
{
    public function handle(int $consultorId): array
    {
        return [
            'summary' => $this->getSummary($consultorId),
            'recentClients' => $this->getRecentClients($consultorId),
            'recentProposals' => $this->getRecentProposals($consultorId),
            'quickActions' => $this->getQuickActions(),
        ];
    }

    private function getSummary(int $consultorId): array
    {
        $clientsTotal = ClientProfile::query()
            ->where('consultor_user_id', $consultorId)
            ->count();

        $clientsActive = ClientProfile::query()
            ->where('consultor_user_id', $consultorId)
            ->where(function ($q) {
                $q->where('is_active_client', true)
                    ->orWhere('status', 'contrato_assinado');
            })
            ->count();

        $producersTotal = ProducerProfile::query()
            ->where('consultor_user_id', $consultorId)
            ->count();

        $producersActive = ProducerProfile::query()
            ->where('consultor_user_id', $consultorId)
            ->where('is_active_producer', true)
            ->count();

        $usinasTotal = UsinaSolar::query()
            ->where('consultor_user_id', $consultorId)
            ->count();

        $clientProposalsOpen = CommercialProposal::query()
            ->where('consultor_user_id', $consultorId)
            ->whereIn('status', ['emitida', 'enviada', 'em_analise', 'pendente'])
            ->count();

        $producerProposalsOpen = ProducerProposal::query()
            ->where('consultor_user_id', $consultorId)
            ->whereIn('status', ['emitida', 'enviada', 'em_analise', 'pendente'])
            ->count();

        $billsPendingReview = ConcessionaireBill::query()
            ->whereHas('clientProfile', fn ($q) => $q->where('consultor_user_id', $consultorId))
            ->where('review_status', 'pending_review')
            ->count();

        $leadsTotal = ProducerLead::query()
            ->where('consultor_user_id', $consultorId)
            ->count();

        $leadsOpenThisMonth = ProducerLead::query()
            ->where('consultor_user_id', $consultorId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        $clientsThisMonth = ClientProfile::query()
            ->where('consultor_user_id', $consultorId)
            ->whereMonth('created_at', now()->month)
            ->whereYear('created_at', now()->year)
            ->count();

        return [
            'clients_total' => $clientsTotal,
            'clients_active' => $clientsActive,
            'clients_this_month' => $clientsThisMonth,
            'producers_total' => $producersTotal,
            'producers_active' => $producersActive,
            'usinas_total' => $usinasTotal,
            'client_proposals_open' => $clientProposalsOpen,
            'producer_proposals_open' => $producerProposalsOpen,
            'bills_pending_review' => $billsPendingReview,
            'leads_total' => $leadsTotal,
            'leads_this_month' => $leadsOpenThisMonth,
        ];
    }

    private function getRecentClients(int $consultorId): array
    {
        return ClientProfile::query()
            ->where('consultor_user_id', $consultorId)
            ->latest()
            ->limit(6)
            ->get(['id', 'nome', 'razao_social', 'nome_fantasia', 'tipo_pessoa', 'cpf', 'cnpj', 'status', 'created_at'])
            ->toArray();
    }

    private function getRecentProposals(int $consultorId): array
    {
        return CommercialProposal::query()
            ->where('consultor_user_id', $consultorId)
            ->with(['clientProfile:id,nome,razao_social,tipo_pessoa'])
            ->latest()
            ->limit(6)
            ->get()
            ->toArray();
    }

    private function getQuickActions(): array
    {
        return [
            [
                'title' => 'Novo Cliente',
                'description' => 'Cadastre um novo cliente na sua carteira.',
                'route' => 'consultor.user.cliente.create',
                'color' => 'primary',
                'icon' => 'users',
            ],
            [
                'title' => 'Proposta para Cliente',
                'description' => 'Emita uma nova proposta comercial.',
                'route' => 'consultor.propostas.cliente.create',
                'color' => 'success',
                'icon' => 'file-text',
            ],
            [
                'title' => 'Proposta para Produtor',
                'description' => 'Emita uma proposta para produtor solar.',
                'route' => 'consultor.propostas.produtor.create',
                'color' => 'info',
                'icon' => 'bolt',
            ],
            [
                'title' => 'Novo Produtor',
                'description' => 'Cadastre um produtor solar na carteira.',
                'route' => 'consultor.producer.profiles.create',
                'color' => 'warning',
                'icon' => 'solar',
            ],
        ];
    }
}
