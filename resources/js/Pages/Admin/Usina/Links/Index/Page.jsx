import { Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import ClientUsinaLinkStatusChip from '../../Components/ClientUsinaLinkStatusChip';
import useAuthUser from '@/Hooks/useAuthUser.js';
import { isAdmin } from '@/Utils/permissions.js';

function getClientName(client) {
    if (!client) {
        return 'Cliente não informado';
    }

    if (client.tipo_pessoa === 'pj') {
        return client.razao_social || client.nome_fantasia || client.email || `Cliente #${client.id}`;
    }

    return client.nome || client.email || `Cliente #${client.id}`;
}

export default function ClientUsinaLinksIndexPage() {
    const { props } = usePage();
    const { links, filters, statusOptions } = props;
    const admin = isAdmin(useAuthUser());

    const handleFilterChange = (field, value) => {
        router.get(
            route('admin.usinas.links.index'),
            {
                ...filters,
                [field]: value,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleCancel = (linkId) => {
        if (!window.confirm('Deseja realmente cancelar este vínculo?')) {
            return;
        }

        router.delete(route('admin.usinas.links.destroy', linkId), {
            preserveScroll: true,
        });
    };

    return (
        <Layout titlePage="Alocação Cliente/Usina" menu="usinas-solar" subMenu="usinas-vinculos">
            <Box sx={{ p: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={900}>
                            Alocações Cliente/Usina
                        </Typography>

                        <Typography color="text.secondary">
                            Gerencie os vínculos ativos entre clientes consumidores e usinas.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href={route('admin.usinas.links.create')}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Nova Alocação
                    </Button>
                </Stack>

                <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                            <TextField
                                label="Buscar cliente, código, e-mail ou produtor"
                                value={filters.search || ''}
                                onChange={(event) => handleFilterChange('search', event.target.value)}
                                fullWidth
                            />

                            <TextField
                                label="Status"
                                value={filters.status || ''}
                                onChange={(event) => handleFilterChange('status', event.target.value)}
                                select
                                sx={{ minWidth: 240 }}
                            >
                                <MenuItem value="">Todos</MenuItem>
                                {statusOptions.map((status) => (
                                    <MenuItem key={status.value} value={status.value}>
                                        {status.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Stack>
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Usina</TableCell>
                                    <TableCell>Energia</TableCell>
                                    {admin && <TableCell>Desconto</TableCell>}
                                    <TableCell>Status</TableCell>
                                    <TableCell>Período</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {links.data.map((link) => (
                                    <TableRow key={link.id}>
                                        <TableCell>
                                            <Typography fontWeight={800}>
                                                {getClientName(link.client_profile)}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                {link.client_profile?.client_code || '-'}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight={800}>
                                                UC {link.usina?.uc || link.usina?.id || '-'}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                {link.usina?.produtor?.name || 'Produtor não informado'}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {Number(link.allocated_energy_kwh || 0).toLocaleString('pt-BR')} kWh
                                        </TableCell>

                                        {admin && (
                                            <TableCell>
                                                {Number(link.discount_percentage || 0).toLocaleString('pt-BR')}%
                                            </TableCell>
                                        )}

                                        <TableCell>
                                            <ClientUsinaLinkStatusChip status={link.status} />
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="body2">
                                                {link.started_at ? new Date(link.started_at).toLocaleDateString('pt-BR') : '-'}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                até {link.ended_at ? new Date(link.ended_at).toLocaleDateString('pt-BR') : 'indeterminado'}
                                            </Typography>
                                        </TableCell>

                                        <TableCell align="right">
                                            <Button
                                                size="small"
                                                color="error"
                                                variant="outlined"
                                                onClick={() => handleCancel(link.id)}
                                                disabled={!link.is_active}
                                            >
                                                Cancelar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {links.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={admin ? 7 : 6}>
                                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                                Nenhuma alocação encontrada.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}
