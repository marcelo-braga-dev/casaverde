import { Stack, Typography } from '@mui/material';
import { IconChartBarOff } from '@tabler/icons-react';

export default function ReportEmptyChart({
                                             title = 'Nenhum dado para exibir',
                                             description = 'Ajuste o período ou os filtros para visualizar informações.',
                                         }) {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            sx={{ height: '100%', color: 'text.secondary' }}
        >
            <IconChartBarOff size={42} />

            <Typography variant="subtitle1" sx={{ mt: 1, fontWeight: 900 }}>
                {title}
            </Typography>

            <Typography variant="body2" sx={{ mt: 0.4, maxWidth: 360 }}>
                {description}
            </Typography>
        </Stack>
    );
}
