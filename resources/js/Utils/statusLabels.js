const statusMap = {
    pending_review: {
        label: 'Aguardando Revisão',
        color: 'warning',
    },
    approved: {
        label: 'Aprovado',
        color: 'success',
    },
    rejected: {
        label: 'Rejeitado',
        color: 'error',
    },
    issued: {
        label: 'Emitido',
        color: 'info',
    },
    signed: {
        label: 'Assinado',
        color: 'success',
    },
    active: {
        label: 'Ativo',
        color: 'success',
    },
    inactive: {
        label: 'Inativo',
        color: 'default',
    },
    cancelled: {
        label: 'Cancelado',
        color: 'error',
    },
    ativo: {
        label: 'Ativo',
        color: 'success',
    },
    inativo: {
        label: 'Inativo',
        color: 'default',
    },
    contrato_fechado: {
        label: 'Contrato Fechado',
        color: 'success',
    },
};

export function getStatusInfo(status) {
    return statusMap[status] || {
        label: status || 'Não informado',
        color: 'default',
    };
}

export function getStatusLabel(status) {
    return getStatusInfo(status).label;
}

export function getStatusColor(status) {
    return getStatusInfo(status).color;
}
