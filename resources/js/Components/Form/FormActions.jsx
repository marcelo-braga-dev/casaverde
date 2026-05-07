import { Box, Button, Stack } from '@mui/material';
import { Link } from '@inertiajs/react';
import { IconArrowLeft, IconDeviceFloppy } from '@tabler/icons-react';

export default function FormActions({
                                        backHref,
                                        submitLabel = 'Salvar',
                                        processing = false,
                                        onSubmit,
                                    }) {
    return (
        <Box
            sx={{
                mt: 3,
                pt: 2.5,
                borderTop: '1px solid',
                borderColor: 'divider',
            }}
        >
            <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="flex-end"
                gap={1}
            >
                {backHref && (
                    <Button
                        component={Link}
                        href={backHref}
                        variant="outlined"
                        startIcon={<IconArrowLeft size={18} />}
                        disabled={processing}
                    >
                        Voltar
                    </Button>
                )}

                <Button
                    type="submit"
                    variant="contained"
                    startIcon={<IconDeviceFloppy size={18} />}
                    disabled={processing}
                    onClick={onSubmit}
                >
                    {processing ? 'Salvando...' : submitLabel}
                </Button>
            </Stack>
        </Box>
    );
}
