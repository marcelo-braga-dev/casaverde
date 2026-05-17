import { Chip } from '@mui/material';
import { getAlertSeverity } from '@/Utils/operationalAlerts';

export default function AlertSeverityChip({ severity }) {
    const item = getAlertSeverity(severity);

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
