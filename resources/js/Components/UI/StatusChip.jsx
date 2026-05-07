import { Chip } from '@mui/material';
import { getStatusMeta } from '@/Utils/statusLabels';

export default function StatusChip({ status, size = 'small' }) {
    const meta = getStatusMeta(status);

    return (
        <Chip
            size={size}
            label={meta.label}
            sx={{
                height: size === 'small' ? 24 : 30,
                borderRadius: 999,
                fontWeight: 850,
                bgcolor: meta.bgColor,
                color: meta.color,
                border: `1px solid ${meta.borderColor}`,
                '& .MuiChip-label': {
                    px: 1.1,
                },
            }}
        />
    );
}
