import { Box, Button, Stack, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';
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
                minHeight: 320,
                px: 3,
                py: 5,
                bgcolor: 'grey.50',
            }}
        >
            <Box
                sx={{
                    width: 68,
                    height: 68,
                    borderRadius: 3.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    mb: 2.5,
                    opacity: 0.85,
                }}
            >
                <Icon size={32} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 800, color: 'text.primary', mb: 0.7 }}>
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ maxWidth: 400, lineHeight: 1.65 }}
            >
                {description}
            </Typography>

            {actionLabel && actionHref && (
                <Button
                    component={Link}
                    href={actionHref}
                    variant="contained"
                    size="small"
                    sx={{ mt: 2.5 }}
                >
                    {actionLabel}
                </Button>
            )}
        </Stack>
    );
}
