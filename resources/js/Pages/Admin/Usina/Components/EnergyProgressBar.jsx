import { Box, LinearProgress, Stack, Typography } from '@mui/material';

export default function EnergyProgressBar({ allocated = 0, available = 0 }) {
    const safeAllocated = Number(allocated || 0);
    const safeAvailable = Number(available || 0);
    const percentage = safeAvailable > 0 ? Math.min((safeAllocated / safeAvailable) * 100, 100) : 0;

    return (
        <Stack spacing={0.75}>
            <Stack direction="row" justifyContent="space-between">
                <Typography variant="caption" color="text.secondary">
                    Utilização energética
                </Typography>

                <Typography variant="caption" fontWeight={800}>
                    {percentage.toFixed(1)}%
                </Typography>
            </Stack>

            <Box>
                <LinearProgress
                    variant="determinate"
                    value={percentage}
                    sx={{
                        height: 9,
                        borderRadius: 999,
                        bgcolor: 'grey.100',
                        '& .MuiLinearProgress-bar': {
                            borderRadius: 999,
                        },
                    }}
                />
            </Box>

            <Typography variant="caption" color="text.secondary">
                {safeAllocated.toLocaleString('pt-BR')} kWh alocados de{' '}
                {safeAvailable.toLocaleString('pt-BR')} kWh disponíveis
            </Typography>
        </Stack>
    );
}
