export const chartColors = {
    primary: '#2F7D18',
    primaryDark: '#1F5F10',
    primaryDarker: '#123D0B',
    primaryLight: '#DFF3D8',

    secondary: '#4F9A2A',
    accent: '#7BAA2F',

    black: '#050505',
    graphite: '#111827',

    success: '#2F7D18',
    warning: '#D89614',
    error: '#C62828',
    info: '#3F8F24',

    grey: '#64748B',
    lightGrey: '#E2E8F0',

    palette: [
        '#2F7D18',
        '#4F9A2A',
        '#7BAA2F',
        '#1F5F10',
        '#D89614',
        '#C62828',
        '#64748B',
        '#111827',
    ],
};

export function statusColor(status) {
    const map = {
        paid: chartColors.success,
        open: chartColors.warning,
        waiting_payment: chartColors.warning,
        overdue: chartColors.error,
        cancelled: chartColors.grey,
        failed: chartColors.error,
        approved: chartColors.success,
        pending_review: chartColors.warning,
        rejected: chartColors.error,
        active: chartColors.success,
        inactive: chartColors.grey,
        issued: chartColors.info,
        signed: chartColors.success,
        prospect: chartColors.grey,
        proposta_emitida: chartColors.info,
        contrato_fechado: chartColors.success,
    };

    return map[status] || chartColors.primary;
}
