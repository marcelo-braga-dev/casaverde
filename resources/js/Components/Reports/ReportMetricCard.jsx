import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

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
                borderRadius: 'var(--cv-radius-xl)',
                border: '1px solid var(--cv-border-soft)',
                boxShadow: 'var(--cv-shadow-md)',
                position: 'relative',
                overflow: 'hidden',
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: 150,
                    height: 150,
                    right: -70,
                    top: -70,
                    borderRadius: '50%',
                    background: 'rgba(47, 125, 24, 0.08)',
                },
            }}
        >
            <CardContent sx={{ position: 'relative', zIndex: 1 }}>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 800 }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h5"
                            sx={{
                                mt: 0.8,
                                fontWeight: 950,
                                letterSpacing: '-0.04em',
                                color,
                            }}
                        >
                            {value}
                        </Typography>

                        {helper && (
                            <Typography
                                variant="caption"
                                color="text.secondary"
                                sx={{ mt: 0.8, display: 'block' }}
                            >
                                {helper}
                            </Typography>
                        )}
                    </Box>

                    {Icon && (
                        <Box
                            sx={{
                                width: 46,
                                height: 46,
                                minWidth: 46,
                                borderRadius: 3,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                background: 'var(--cv-gradient-primary)',
                                boxShadow: 'var(--cv-shadow-primary)',
                            }}
                        >
                            <Icon size={23} />
                        </Box>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
