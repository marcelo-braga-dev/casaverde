import { Chip } from '@mui/material';
import { getStatusLabel, getStatusColor } from '@/Utils/statusLabels';

export default function StatusChip({ status, label }) {
    return (
        <Chip
            size="small"
            label={label || getStatusLabel(status)}
            color={getStatusColor(status)}
            variant="filled"
            sx={{
                height: 26,
                px: 0.4,
            }}
        />
    );
}
