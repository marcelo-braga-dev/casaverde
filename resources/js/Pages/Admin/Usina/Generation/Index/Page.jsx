import { Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

import Layout from "@/Layouts/UserLayout/Layout.jsx";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";

export default function UsinaGenerationIndexPage() {
    const { props } = usePage();
    const { records, filters, usinas } = props;

    const handleFilterChange = (field, value) => {
        router.get(
            route('admin.usinas.generation.index'),
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

    return (
        <Layout titlePage="Geração Mensal" menu="usinas-solar" subMenu="usinas-geracao" backPage>
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
                            Geração Mensal das Usinas
                        </Typography>

                        <Typography color="text.secondary">
                            Histórico administrativo de geração, energia injetada e saldo disponível.
                        </Typography>
                    </Box>

                    <Button
                        component={Link}
                        href={route('admin.usinas.generation.create')}
                        variant="contained"
                        startIcon={<AddIcon />}
                    >
                        Registrar Geração
                    </Button>
                </Stack>

                <Card sx={{ borderRadius: 3, mb: 3 }}>
                    <CardContent>
                        <SearchableSelect
                            label="Filtrar por usina"
                            value={filters.usina_id || ''}
                            onChange={(value) => handleFilterChange('usina_id', value)}
                            options={[
                                { value: '', label: 'Todas' },
                                ...usinas.map((usina) => ({
                                    value: usina.id,
                                    label: `UC ${usina.uc || usina.id} - ${usina.produtor?.name || 'Produtor não informado'}`,
                                })),
                            ]}
                            sx={{ minWidth: 420 }}
                        />
                    </CardContent>
                </Card>

                <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Referência</TableCell>
                                    <TableCell>Usina</TableCell>
                                    <TableCell>Gerada</TableCell>
                                    <TableCell>Injetada</TableCell>
                                    <TableCell>Compensada</TableCell>
                                    <TableCell>Disponível</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {records.data.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell>
                                            {String(record.reference_month).padStart(2, '0')}/{record.reference_year}
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight={800}>
                                                UC {record.usina?.uc || record.usina?.id || '-'}
                                            </Typography>

                                            <Typography variant="caption" color="text.secondary">
                                                {record.usina?.produtor?.name || 'Produtor não informado'}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            {Number(record.generated_energy_kwh || 0).toLocaleString('pt-BR')} kWh
                                        </TableCell>

                                        <TableCell>
                                            {Number(record.injected_energy_kwh || 0).toLocaleString('pt-BR')} kWh
                                        </TableCell>

                                        <TableCell>
                                            {Number(record.compensated_energy_kwh || 0).toLocaleString('pt-BR')} kWh
                                        </TableCell>

                                        <TableCell>
                                            <Typography fontWeight={900}>
                                                {Number(record.available_energy_kwh || 0).toLocaleString('pt-BR')} kWh
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {records.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                                Nenhum registro de geração encontrado.
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
