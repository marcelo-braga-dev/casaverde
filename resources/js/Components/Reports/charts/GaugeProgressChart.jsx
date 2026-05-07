import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { formatPercent } from '../utils/chartFormatters';

export default function GaugeProgressChart({
                                               value = 0,
                                               label = 'Progresso',
                                               helper,
                                           }) {
    const normalized = Math.min(Math.max(Number(value || 0), 0), 100);

    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}
        >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress
                    variant="determinate"
                    value={100}
                    size={150}
                    thickness={5}
                    sx={{ color: 'grey.200' }}
                />
                <CircularProgress
                    variant="determinate"
                    value={normalized}
                    size={150}
                    thickness={5}
                    sx={{
                        color: 'primary.main',
                        position: 'absolute',
                        left: 0,
                    }}
                />
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Typography variant="h4" sx={{ fontWeight: 950 }}>
                        {formatPercent(normalized)}
                    </Typography>
                </Box>
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 900 }}>
                {label}
            </Typography>

            {helper && (
                <Typography
                    variant="body2"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: 0.4 }}
                >
                    {helper}
                </Typography>
            )}
        </Stack>
    );
}
