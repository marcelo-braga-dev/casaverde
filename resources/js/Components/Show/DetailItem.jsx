import { Box, Typography } from '@mui/material';

export default function DetailItem({ label, value, children }) {
    return (
        <Box
            sx={{
                p: 1.6,
                borderRadius: 3,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
            }}
        >
            <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                }}
            >
                {label}
            </Typography>

            {children || (
                <Typography
                    variant="body2"
                    sx={{
                        mt: 0.5,
                        fontWeight: 800,
                    }}
                >
                    {value || 'Não informado'}
                </Typography>
            )}
        </Box>
    );
}
