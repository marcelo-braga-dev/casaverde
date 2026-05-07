import { Box, Stack, Typography } from '@mui/material';

export default function FormSection({
                                        title,
                                        subtitle,
                                        icon: Icon,
                                        children,
                                    }) {
    return (
        <Box
            sx={{
                py: 2.2,
                '& + &': {
                    borderTop: '1px solid',
                    borderColor: 'divider',
                },
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                gap={3}
                alignItems="flex-start"
            >
                <Box
                    sx={{
                        width: {
                            xs: '100%',
                            md: 280,
                        },
                        flexShrink: 0,
                    }}
                >
                    <Stack direction="row" gap={1} alignItems="center">
                        {Icon && (
                            <Box
                                sx={{
                                    width: 34,
                                    height: 34,
                                    borderRadius: 2.2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'primary.light',
                                    color: 'primary.dark',
                                }}
                            >
                                <Icon size={19} />
                            </Box>
                        )}

                        <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>
                            {title}
                        </Typography>
                    </Stack>

                    {subtitle && (
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mt: 0.7 }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </Box>

                <Box sx={{ flex: 1, width: '100%' }}>
                    {children}
                </Box>
            </Stack>
        </Box>
    );
}
