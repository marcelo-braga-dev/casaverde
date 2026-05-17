import { Chip } from '@mui/material';
import { getAlertStatus } from '@/Utils/operationalAlerts';

export default function AlertStatusChip({ status }) {
    const item = getAlertStatus(status);

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
