export const alertSeverityMap = {
    info: {
        label: 'Informativo',
        color: 'info',
    },
    warning: {
        label: 'Atenção',
        color: 'warning',
    },
    error: {
        label: 'Erro',
        color: 'error',
    },
    critical: {
        label: 'Crítico',
        color: 'error',
    },
};

export const alertStatusMap = {
    open: {
        label: 'Aberto',
        color: 'error',
    },
    in_progress: {
        label: 'Em Tratamento',
        color: 'warning',
    },
    resolved: {
        label: 'Resolvido',
        color: 'success',
    },
    ignored: {
        label: 'Ignorado',
        color: 'default',
    },
};

export function getAlertSeverity(severity) {
    const key = typeof severity === 'object' && severity !== null ? severity.value : severity;

    return alertSeverityMap[key] || {
        label: key || 'Não informado',
        color: 'default',
    };
}

export function getAlertStatus(status) {
    const key = typeof status === 'object' && status !== null ? status.value : status;

    return alertStatusMap[key] || {
        label: key || 'Não informado',
        color: 'default',
    };
}
