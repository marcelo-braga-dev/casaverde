import { Chip } from '@mui/material';

const STATUS = {
    active: { label: 'Ativo', color: 'success' },
    scheduled: { label: 'Agendado', color: 'info' },
    inactive: { label: 'Inativo', color: 'default' },
    finished: { label: 'Finalizado', color: 'secondary' },
    cancelled: { label: 'Cancelado', color: 'error' },
};

export default function ClientUsinaLinkStatusChip({ status }) {
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
