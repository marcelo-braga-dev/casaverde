import { Box, Button, Stack } from '@mui/material';
import { IconFilter, IconX } from '@tabler/icons-react';

export default function FilterBar({
    children,
    onSubmit,
    onClear,
    processing = false,
}) {
    return (
        <Box
            component="form"
            onSubmit={(e) => { e.preventDefault(); onSubmit?.(); }}
            sx={{
                px: 1.5,
                py: 1.2,
                borderRadius: 2.5,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'center' }}
                gap={1}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    gap={1}
                    sx={{ flex: 1, flexWrap: 'wrap' }}
                >
                    {children}
                </Stack>

                <Stack direction="row" gap={1} sx={{ flexShrink: 0 }}>
                    <Button
                        type="submit"
                        size="small"
                        variant="contained"
                        startIcon={<IconFilter size={15} />}
                        disabled={processing}
                    >
                        Filtrar
                    </Button>

                    <Button
                        type="button"
                        size="small"
                        variant="outlined"
                        color="inherit"
                        startIcon={<IconX size={15} />}
                        onClick={onClear}
                        disabled={processing}
                    >
                        Limpar
                    </Button>
                </Stack>
            </Stack>
        </Box>
    );
}
