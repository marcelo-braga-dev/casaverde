import { Card, CardContent, Stack, Typography } from '@mui/material';

export default function EnergyMetricCard({ title, value, subtitle, icon }) {
    return (
        <Card
            sx={{
                height: '100%',
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: '0 12px 30px rgba(15, 23, 42, 0.08)',
            }}
        >
            <CardContent>
                <Stack spacing={1.5}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" color="text.secondary">
                            {title}
                        </Typography>

                        {icon}
                    </Stack>

                    <Typography variant="h4" fontWeight={900}>
                        {value}
                    </Typography>

                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
