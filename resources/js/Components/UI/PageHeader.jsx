import { Box, Stack, Typography } from '@mui/material';

export default function PageHeader({
                                       eyebrow,
                                       title,
                                       subtitle,
                                       actions,
                                       children,
                                   }) {
    return (
        <Box sx={{ mb: 3 }}>
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', md: 'center' }}
                gap={2}
            >
                <Box>
                    {eyebrow && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'primary.main',
                                fontWeight: 900,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                            }}
                        >
                            {eyebrow}
                        </Typography>
                    )}

                    <Typography
                        variant="h4"
                        sx={{
                            mt: eyebrow ? 0.4 : 0,
                            fontWeight: 950,
                            letterSpacing: '-0.05em',
                        }}
                    >
                        {title}
                    </Typography>

                    {subtitle && (
                        <Typography
                            variant="body1"
                            color="text.secondary"
                            sx={{ mt: 0.7, maxWidth: 780 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                {actions && (
                    <Stack direction="row" gap={1} flexWrap="wrap">
                        {actions}
                    </Stack>
                )}
            </Stack>

            {children}
        </Box>
    );
}
