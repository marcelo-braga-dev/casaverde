import { Button, Stack, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';

function cleanLabel(label) {
    return String(label)
        .replace('&laquo;', '‹')
        .replace('&raquo;', '›')
        .replace('Previous', 'Anterior')
        .replace('Next', 'Próxima');
}

export default function DataTablePagination({ links = [], meta }) {
    if (!links?.length) {
        return null;
    }

    return (
        <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            gap={1.5}
        >
            <Typography variant="body2" color="text.secondary">
                {meta?.from && meta?.to && meta?.total
                    ? `Mostrando ${meta.from} até ${meta.to} de ${meta.total} registros`
                    : 'Paginação'}
            </Typography>

            <Stack direction="row" gap={0.7} flexWrap="wrap">
                {links.map((link, index) => (
                    <Button
                        key={`${link.label}-${index}`}
                        component={link.url ? Link : 'button'}
                        href={link.url || undefined}
                        preserveScroll
                        disabled={!link.url}
                        size="small"
                        variant={link.active ? 'contained' : 'outlined'}
                        sx={{
                            minWidth: 38,
                            height: 36,
                            px: 1.2,
                            borderRadius: 2,
                            fontWeight: 800,
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: cleanLabel(link.label) }} />
                    </Button>
                ))}
            </Stack>
        </Stack>
    );
}
