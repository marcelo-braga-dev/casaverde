import { Box, Button, Stack, Typography } from '@mui/material';
import { IconInbox } from '@tabler/icons-react';

export default function EmptyState({
                                       title = 'Nenhum registro encontrado',
                                       description = 'Quando houver dados disponíveis, eles aparecerão aqui.',
                                       actionLabel,
                                       onAction,
                                       icon: Icon = IconInbox,
                                   }) {
    return (
        <Stack
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            sx={{
                py: 8,
                px: 3,
                borderRadius: 5,
                bgcolor: 'background.paper',
                border: '1px dashed',
                borderColor: 'divider',
            }}
        >
            <Box
                sx={{
                    width: 72,
                    height: 72,
                    borderRadius: 5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'primary.light',
                    color: 'primary.dark',
                    mb: 2,
                }}
            >
                <Icon size={34} />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 900 }}>
                {title}
            </Typography>

            <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.7, maxWidth: 460 }}
            >
                {description}
            </Typography>

            {actionLabel && (
                <Button
                    variant="contained"
                    onClick={onAction}
                    sx={{ mt: 2.4 }}
                >
                    {actionLabel}
                </Button>
            )}
        </Stack>
    );
}
