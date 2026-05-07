import {
    Box,
    Card,
    CardContent,
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
        <Card
            sx={{
                borderRadius: 5,
                overflow: 'hidden',
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'customShadows.card',
            }}
        >
            <Box
                sx={{
                    px: {
                        xs: 2,
                        md: 2.5,
                    },
                    py: 2.2,
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    background:
                        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,250,252,0.96))',
                }}
            >
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    alignItems={{ xs: 'flex-start', md: 'center' }}
                    justifyContent="space-between"
                    gap={2}
                >
                    <Stack direction="row" alignItems="center" gap={1.4}>
                        {Icon && (
                            <Box
                                sx={{
                                    width: 44,
                                    height: 44,
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#FFFFFF',
                                    background:
                                        'linear-gradient(135deg, #0B7A53 0%, #10B981 100%)',
                                    boxShadow: 'customShadows.primary',
                                }}
                            >
                                <Icon size={23} />
                            </Box>
                        )}

                        <Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 950,
                                    letterSpacing: '-0.04em',
                                }}
                            >
                                {title}
                            </Typography>

                            {subtitle && (
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 0.2 }}
                                >
                                    {subtitle}
                                </Typography>
                            )}
                        </Box>
                    </Stack>

                    {actions && (
                        <Stack direction="row" gap={1} flexWrap="wrap">
                            {actions}
                        </Stack>
                    )}
                </Stack>

                {filters && (
                    <Box sx={{ mt: 2 }}>
                        {filters}
                    </Box>
                )}
            </Box>

            <CardContent sx={{ p: 0 }}>
                {isEmpty ? (
                    empty
                ) : (
                    <TableContainer
                        sx={{
                            width: '100%',
                            overflowX: 'auto',
                        }}
                    >
                        <Table sx={{ minWidth: 960 }}>
                            <TableHead>
                                {head}
                            </TableHead>

                            <TableBody>
                                {children}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}

                {pagination && (
                    <Box
                        sx={{
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            px: 2,
                            py: 1.6,
                        }}
                    >
                        {pagination}
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}
