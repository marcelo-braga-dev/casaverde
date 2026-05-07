import { Card, CardContent, Stack, Typography, Box } from '@mui/material';
import { IconArrowUpRight, IconArrowDownRight } from '@tabler/icons-react';
import GradientIconBox from '@/Components/UI/GradientIconBox';

export default function MetricCard({
                                       title,
                                       value,
                                       description,
                                       icon,
                                       color = 'primary',
                                       trend,
                                       trendType = 'up',
                                   }) {
    const TrendIcon = trendType === 'down' ? IconArrowDownRight : IconArrowUpRight;

    return (
        <Card
            sx={{
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 180ms ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 'customShadows.cardHover',
                },
                '&:before': {
                    content: '""',
                    position: 'absolute',
                    width: 160,
                    height: 160,
                    right: -70,
                    top: -70,
                    borderRadius: '50%',
                    background: 'rgba(11, 122, 83, 0.08)',
                },
            }}
        >
            <CardContent>
                <Stack direction="row" justifyContent="space-between" gap={2}>
                    <Box>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontWeight: 700 }}
                        >
                            {title}
                        </Typography>

                        <Typography
                            variant="h4"
                            sx={{
                                mt: 1,
                                fontWeight: 900,
                                letterSpacing: '-0.045em',
                            }}
                        >
                            {value}
                        </Typography>

                        {description && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.75 }}
                            >
                                {description}
                            </Typography>
                        )}

                        {trend && (
                            <Stack
                                direction="row"
                                alignItems="center"
                                gap={0.5}
                                sx={{
                                    mt: 1.3,
                                    color: trendType === 'down' ? 'error.main' : 'success.main',
                                    fontWeight: 800,
                                }}
                            >
                                <TrendIcon size={17} />
                                <Typography variant="caption" sx={{ fontWeight: 800 }}>
                                    {trend}
                                </Typography>
                            </Stack>
                        )}
                    </Box>

                    <GradientIconBox icon={icon} color={color} />
                </Stack>
            </CardContent>
        </Card>
    );
}
