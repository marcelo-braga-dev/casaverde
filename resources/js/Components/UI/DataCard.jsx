import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

export default function DataCard({
                                     title,
                                     value,
                                     helper,
                                     icon: Icon,
                                     color = 'primary.main',
                                     footer,
                                 }) {
    return (
        <Card
            sx={{
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 180ms ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'customShadows.cardHover',
                },
            }}
        >
            <CardContent>
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
                            variant="h4"
                            sx={{
                                mt: 1,
                                fontWeight: 950,
                                letterSpacing: '-0.05em',
                            }}
                        >
                            {value}
                        </Typography>

                        {helper && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.7 }}
                            >
                                {helper}
                            </Typography>
                        )}
                    </Box>

                    {Icon && (
                        <Box
                            sx={{
                                width: 52,
                                height: 52,
                                borderRadius: 3.5,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#FFFFFF',
                                bgcolor: color,
                                boxShadow: 'customShadows.primary',
                            }}
                        >
                            <Icon size={25} />
                        </Box>
                    )}
                </Stack>

                {footer && (
                    <Box sx={{ mt: 2 }}>
                        {footer}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
