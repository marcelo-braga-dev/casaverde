import {
    Box,
    Card,
    Stack,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    Typography,
} from '@mui/material';

export default function DataTableCard({
    title,
    subtitle,
    icon: Icon,
    actions,
    filters,
    head,
    children,
    pagination,
    empty,
    isEmpty = false,
}) {
    return (
        <Card>
            {/* ── Header ──────────────────────────────────────── */}
            <Box
                sx={{
                    px: { xs: 2, md: 2.5 },
                    pt: 2,
                    pb: filters ? 1.5 : 2,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                }}
            >
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    gap={1.5}
                >
                    <Stack direction="row" alignItems="center" gap={1.5} sx={{ minWidth: 0 }}>
                        {Icon && (
                            <Box
                                sx={{
                                    width: 38,
                                    height: 38,
                                    minWidth: 38,
                                    borderRadius: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    background: 'var(--cv-gradient-primary)',
                                    boxShadow: '0 4px 12px rgba(47,125,24,0.25)',
                                }}
                            >
                                <Icon size={19} />
                            </Box>
                        )}

                        <Box sx={{ minWidth: 0 }}>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 800,
                                    letterSpacing: '-0.03em',
                                    lineHeight: 1.25,
                                    fontSize: { xs: '0.9rem', sm: '0.9375rem' },
                                }}
                                noWrap
                            >
                                {title}
                            </Typography>

                            {subtitle && (
                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                    sx={{ display: 'block', mt: 0.3, lineHeight: 1.4 }}
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {actions && (
                        <Stack direction="row" gap={1} flexWrap="wrap" sx={{ flexShrink: 0 }}>
                            {actions}
                        </Stack>
                    )}
                </Stack>

                {filters && <Box sx={{ mt: 1.5 }}>{filters}</Box>}
            </Box>

            {/* ── Corpo ───────────────────────────────────────── */}
            <Box sx={{ p: 0 }}>
                {isEmpty ? (
                    empty
                ) : (
                    <TableContainer>
                        <Table
                            sx={{
                                minWidth: { xs: 480, sm: 640 },
                                '& tbody .MuiTableRow-root:nth-of-type(even)': {
                                    backgroundColor: 'rgba(248,250,252,0.7)',
                                },
                            }}
                        >
                            <TableHead>{head}</TableHead>
                            <TableBody>{children}</TableBody>
                        </Table>
                    </TableContainer>
                )}

                {pagination && (
                    <Box
                        sx={{
                            borderTop: '1px solid',
                            borderColor: 'grey.100',
                            px: { xs: 2, md: 2.5 },
                            py: 1.25,
                            bgcolor: 'grey.50',
                        }}
                    >
                        {pagination}
                    </Box>
                )}
            </Box>
        </Card>
    );
}
