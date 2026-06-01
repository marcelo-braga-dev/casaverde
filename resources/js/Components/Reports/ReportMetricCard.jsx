import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default function ReportMetricCard({
    title,
    value,
    helper,
    icon: Icon,
    color = 'primary.main',
}) {
    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'var(--cv-transition-base)',
                '&:hover': { transform: 'translateY(-1px)', boxShadow: 'var(--cv-shadow-hover)' },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 120,
                    height: 120,
                    right: -40,
                    top: -40,
                    borderRadius: '50%',
                    background: 'rgba(47,125,24,0.06)',
                    pointerEvents: 'none',
                },
            }}
        >
            <CardContent sx={{ position: 'relative', zIndex: 1, p: '16px 18px !important' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
                    <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                mt: 0.6,
                                fontWeight: 900,
                                letterSpacing: '-0.04em',
                                lineHeight: 1.2,
                                color,
                            }}
                        >
                            {value}
                        </Typography>

                        {helper && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.5, display: 'block', lineHeight: 1.45 }}
                            >
                                {helper}
                            </Typography>
                        )}
                    </Box>

                    {Icon && (
                        <Box
                            sx={{
                                width: 42,
                                height: 42,
                                minWidth: 42,
                                borderRadius: 2.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                background: 'var(--cv-gradient-primary)',
                                boxShadow: 'var(--cv-shadow-primary)',
                                flexShrink: 0,
                            }}
                        >
                            <Icon size={20} />
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
