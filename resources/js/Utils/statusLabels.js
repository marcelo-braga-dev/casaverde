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
    contrato_fechado: {
        label: 'Contrato Fechado',
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
