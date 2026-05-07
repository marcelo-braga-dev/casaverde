import { Box, Button, Stack } from '@mui/material';
import { IconFilter, IconRefresh } from '@tabler/icons-react';

export default function FilterBar({
                                      children,
                                      onSubmit,
                                      onClear,
                                      processing = false,
                                  }) {
    return (
        <Box
            component="form"
            onSubmit={(event) => {
                event.preventDefault();
                onSubmit?.();
            }}
            sx={{
                p: 1.4,
                borderRadius: 4,
                bgcolor: 'grey.50',
                border: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Stack
                direction={{ xs: 'column', md: 'row' }}
                alignItems={{ xs: 'stretch', md: 'center' }}
                gap={1.2}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    gap={1.2}
                    sx={{ flex: 1 }}
                >
                    {children}
                </Stack>

                <Stack direction="row" gap={1}>
                    <Button
                        type="submit"
                        variant="contained"
                        startIcon={<IconFilter size={18} />}
                        disabled={processing}
                    >
                        Filtrar
                    </Button>

                    <Button
                        type="button"
                        variant="outlined"
                        startIcon={<IconRefresh size={18} />}
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
