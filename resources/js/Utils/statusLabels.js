const STATUS_MAP = {
    prospect: {
        label: 'Novo',
        color: '#334155',
        bgColor: '#F1F5F9',
        borderColor: '#E2E8F0',
    },
    proposta_emitida: {
        label: 'Proposta Emitida',
        color: '#1F5F10',
        bgColor: '#E8F6E2',
        borderColor: '#DFF3D8',
    },
    contrato_emitido: {
        label: 'Contrato Emitido',
        color: '#1F5F10',
        bgColor: '#DFF3D8',
        borderColor: '#BFE8B6',
    },
    contrato_assinado: {
        label: 'Contrato Assinado',
        color: '#1F5F10',
        bgColor: '#DFF3D8',
        borderColor: '#BFE8B6',
    },
    pending_review: {
        label: 'Aguardando Revisão',
        color: '#9A6508',
        bgColor: '#FFF4D8',
        borderColor: '#F6D98A',
    },
    reviewed: {
        label: 'Revisada',
        color: '#1E40AF',
        bgColor: '#DBEAFE',
        borderColor: '#BFDBFE',
    },
    corrected: {
        label: 'Corrigida',
        color: '#0F766E',
        bgColor: '#CCFBF1',
        borderColor: '#99F6E4',
    },
    approved: {
        label: 'Aprovado',
        color: '#1F5F10',
        bgColor: '#DFF3D8',
        borderColor: '#BFE8B6',
    },
    rejected: {
        label: 'Rejeitado',
        color: '#8E1D1D',
        bgColor: '#FDE2E2',
        borderColor: '#F8B4B4',
    },
    pending: {
        label: 'Pendente',
        color: '#334155',
        bgColor: '#F1F5F9',
        borderColor: '#E2E8F0',
    },
    success: {
        label: 'Sucesso',
        color: '#1F5F10',
        bgColor: '#DFF3D8',
        borderColor: '#BFE8B6',
    },
    error: {
        label: 'Erro',
        color: '#8E1D1D',
        bgColor: '#FDE2E2',
        borderColor: '#F8B4B4',
    },
    paid: {
        label: 'Pago',
        color: '#1F5F10',
        bgColor: '#DFF3D8',
        borderColor: '#BFE8B6',
    },
    open: {
        label: 'Aberto',
        color: '#9A6508',
        bgColor: '#FFF4D8',
        borderColor: '#F6D98A',
    },
    waiting_payment: {
        label: 'Aguardando Pagamento',
        color: '#9A6508',
        bgColor: '#FFF4D8',
        borderColor: '#F6D98A',
    },
    overdue: {
        label: 'Vencido',
        color: '#8E1D1D',
        bgColor: '#FDE2E2',
        borderColor: '#F8B4B4',
    },
    cancelled: {
        label: 'Cancelado',
        color: '#475569',
        bgColor: '#F1F5F9',
        borderColor: '#E2E8F0',
    },
    failed: {
        label: 'Falhou',
        color: '#8E1D1D',
        bgColor: '#FDE2E2',
        borderColor: '#F8B4B4',
    },
    ativo: {
        label: 'Ativo',
        color: '#1F5F10',
        bgColor: '#DFF3D8',
        borderColor: '#BFE8B6',
    },
    inativo: {
        label: 'Inativo',
        color: '#475569',
        bgColor: '#F1F5F9',
        borderColor: '#E2E8F0',
    },
};

export function getStatusMeta(status) {
    return STATUS_MAP[status] || {
        label: status || 'Não informado',
        color: '#334155',
        bgColor: '#F1F5F9',
        borderColor: '#E2E8F0',
    };
}

export function getStatusLabel(status) {
    return getStatusMeta(status).label;
}

export default STATUS_MAP;
