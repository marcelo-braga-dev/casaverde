import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

export default function ReportChartCard({
                                            title,
                                            subtitle,
                                            action,
                                            children,
                                            height,
                                        }) {
    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 'var(--cv-radius-xl)',
                border: '1px solid var(--cv-border-soft)',
                boxShadow: 'var(--cv-shadow-md)',
            }}
        >
            <CardContent>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="flex-start"
                    gap={2}
                    sx={{ mb: 2 }}
                >
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
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.4 }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>

                    {action}
                </Stack>

                <Box sx={{ height: height || 320 }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
}
