import { Card, CardContent, Stack, Typography, Box } from '@mui/material';

export default function SectionCard({ title, subtitle, action, children, sx }) {
    return (
        <Card sx={sx}>
            <CardContent>
                {(title || subtitle || action) && (
                    <Stack
                        direction="row"
                        alignItems="flex-start"
                        justifyContent="space-between"
                        gap={2}
                        sx={{ mb: 2.5 }}
                    >
                        <Box>
                            {title && (
                                <Typography variant="h6" sx={{ fontWeight: 850 }}>
                                    {title}
                                </Typography>
                            )}

                            {subtitle && (
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>

                        {action}
                    </Stack>
                )}

                {children}
            </CardContent>
        </Card>
    );
}
