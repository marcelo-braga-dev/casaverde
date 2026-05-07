import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

export default function FormCard({
                                     title,
                                     subtitle,
                                     icon: Icon,
                                     children,
                                     actions,
                                 }) {
    return (
        <Card
            sx={{
                borderRadius: 5,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'customShadows.card',
            }}
        >
            <Box
                sx={{
                    px: 2.5,
                    py: 2.2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    background:
                        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))',
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    gap={2}
                >
                    <Stack direction="row" alignItems="center" gap={1.4}>
                        {Icon && (
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    background:
                                        'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                                    boxShadow: 'customShadows.secondary',
                                }}
                            >
                                <Icon size={23} />
                            </Box>
                        )}

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 950,
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                {title}
                            </Typography>

                            {subtitle && (
                                <Typography variant="body2" color="text.secondary">
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {actions}
                </Stack>
            </Box>

            <CardContent sx={{ p: 2.5 }}>
                {children}
            </CardContent>
        </Card>
    );
}
