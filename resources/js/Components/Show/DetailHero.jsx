import { Box, Stack, Typography } from '@mui/material';

export default function DetailHero({
                                       title,
                                       subtitle,
                                       status,
                                       icon: Icon,
                                       actions,
                                   }) {
    return (
        <Box
            sx={{
                mb: 3,
                p: {
                    xs: 2.5,
                    md: 3,
                },
                borderRadius: 5,
                color: '#FFFFFF',
                background: (theme) => theme.palette.casaVerde.gradientHero,
                boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'flex-start', md: 'center' }}
                justifyContent="space-between"
                gap={2}
            >
                <Stack direction="row" gap={1.5} alignItems="center">
                    {Icon && (
                        <Box
                            sx={{
                                width: 58,
                                height: 58,
                                borderRadius: 4,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: 'rgba(255,255,255,0.14)',
                                border: '1px solid rgba(255,255,255,0.16)',
                            }}
                        >
                            <Icon size={30} />
                        </Box>
                    )}

                    <Box>
                        <Stack direction="row" gap={1} alignItems="center" flexWrap="wrap">
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 950,
                                    letterSpacing: '-0.05em',
                                }}
                            >
                                {title}
                            </Typography>

                            {status}
                        </Stack>

                        {subtitle && (
                            <Typography
                                variant="body2"
                                sx={{
                                    mt: 0.5,
                                    color: 'rgba(255,255,255,0.72)',
                                }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Stack>

                {actions && (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                        {actions}
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
