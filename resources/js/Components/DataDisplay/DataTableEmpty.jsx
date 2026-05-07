import { Box, Button, Stack, Typography } from '@mui/material';
import { IconInbox } from '@tabler/icons-react';

export default function DataTableEmpty({
                                           title = 'Nenhum registro encontrado',
                                           description = 'Quando novos dados forem cadastrados, eles aparecerão nesta listagem.',
                                           actionLabel,
                                           actionHref,
                                           icon: Icon = IconInbox,
                                       }) {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            sx={{
                minHeight: 360,
                px: 3,
                py: 6,
                bgcolor: 'grey.50',
            }}
        >
            <Box
                sx={{
                    width: 78,
                    height: 78,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    mb: 2,
                }}
            >
                <Icon size={38} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 950 }}>
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                    mt: 0.7,
                    maxWidth: 460,
                }}
            >
                {description}
            </Typography>

            {actionLabel && actionHref && (
                <Button
                    href={actionHref}
                    variant="contained"
                    sx={{ mt: 2.4 }}
                >
                    {actionLabel}
                </Button>
            )}
        </Stack>
    );
}
