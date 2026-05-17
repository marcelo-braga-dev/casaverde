import { Chip } from '@mui/material';

const STATUS = {
    active: { label: 'Ativa', color: 'success' },
    inactive: { label: 'Inativa', color: 'default' },
    maintenance: { label: 'Em Manutenção', color: 'warning' },
    pending_documentation: { label: 'Documentação Pendente', color: 'info' },
    blocked: { label: 'Bloqueada', color: 'error' },
};

export default function UsinaStatusChip({ status }) {
    const key = typeof status === 'object' && status !== null ? status.value : status;
    const item = STATUS[key] || { label: key || 'Não informado', color: 'default' };

    return (
        <Chip
            label={item.label}
            color={item.color}
            size="small"
            sx={{
                fontWeight: 800,
                borderRadius: 999,
            }}
        />
    );
}
