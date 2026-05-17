export function formatMoney(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        maximumFractionDigits: 2,
    }).format(Number(value || 0));
}

export function formatNumber(value) {
    return new Intl.NumberFormat('pt-BR').format(Number(value || 0));
}

export function formatPercent(value) {
    return `${Number(value || 0).toFixed(1)}%`;
}

export function normalizeStatusLabel(status) {
    const labels = {
        paid: 'Pago',
        open: 'Aberto',
        waiting_payment: 'Aguardando Pagamento',
        overdue: 'Vencido',
        cancelled: 'Cancelado',
        failed: 'Falhou',

        approved: 'Aprovado',
        pending_review: 'Aguardando Revisão',
        rejected: 'Rejeitado',

        active: 'Ativo',
        inactive: 'Inativo',
        prospect: 'Prospect',
        proposta_emitida: 'Proposta Emitida',
        contrato_assinado: 'Contrato Fechado',

        issued: 'Emitido',
        signed: 'Assinado',
    };

    return labels[status] || status || 'Não informado';
}
