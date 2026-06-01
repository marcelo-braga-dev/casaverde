import { Box, Stack, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';

function cleanLabel(label) {
    return String(label)
        .replace('&laquo;', '‹')
        .replace('&raquo;', '›')
        .replace('Previous', '‹')
        .replace('Next', '›');
}

function PageButton({ link }) {
    const isActive   = link.active;
    const isDisabled = !link.url;
    const isNav      = link.label.includes('laquo') || link.label.includes('raquo') ||
                       link.label === 'Previous' || link.label === 'Next' ||
                       link.label === '...' || link.label.length > 3;

    return (
        <Box
            component={isDisabled ? 'span' : Link}
            href={isDisabled ? undefined : link.url}
            preserveScroll={isDisabled ? undefined : true}
            sx={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: isNav ? 32 : 34,
                height: 32,
                px: isNav ? 1 : 0,
                borderRadius: '8px',
                fontSize: '0.8125rem',
                fontWeight: isActive ? 800 : 600,
                lineHeight: 1,
                cursor: isDisabled ? 'not-allowed' : 'pointer',
                textDecoration: 'none',
                transition: 'all 120ms ease',
                border: '1.5px solid',
                userSelect: 'none',

                // Estados
                ...(isActive ? {
                    bgcolor: 'primary.main',
                    color: '#FFFFFF',
                    borderColor: 'primary.main',
                    boxShadow: '0 2px 8px rgba(47,125,24,0.25)',
                } : isDisabled ? {
                    bgcolor: 'transparent',
                    color: 'text.disabled',
                    borderColor: 'grey.200',
                    pointerEvents: 'none',
                } : {
                    bgcolor: '#FFFFFF',
                    color: 'text.secondary',
                    borderColor: 'grey.200',
                    '&:hover': {
                        bgcolor: 'grey.50',
                        borderColor: 'grey.300',
                        color: 'text.primary',
                    },
                }),
            }}
        >
            <span dangerouslySetInnerHTML={{ __html: cleanLabel(link.label) }} />
        </Box>
    );
}

export default function DataTablePagination({ links = [], meta }) {
    if (!links?.length) return null;

    return (
        <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            gap={1.5}
        >
            {/* Contagem */}
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                {meta?.from && meta?.to && meta?.total
                    ? `${meta.from}–${meta.to} de ${meta.total} registros`
                    : meta?.total
                    ? `${meta.total} registros`
                    : ''}
            </Typography>

            {/* Botões de página */}
            <Stack direction="row" gap={0.5} flexWrap="wrap" alignItems="center">
                {links.map((link, i) => (
                    <PageButton key={`page-${i}`} link={link} />
                ))}
            </Stack>
        </Stack>
    );
}
