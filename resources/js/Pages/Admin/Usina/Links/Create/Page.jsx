import { Link, useForm, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    MenuItem,
    Stack,
    Switch,
    TextField,
    Typography,
    FormControlLabel,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import Layout from "@/Layouts/UserLayout/Layout.jsx";

function getClientName(client) {
    if (client.tipo_pessoa === 'pj') {
        return client.razao_social || client.nome_fantasia || client.email || `Cliente #${client.id}`;
    }

    return client.nome || client.email || `Cliente #${client.id}`;
}

export default function CreateClientUsinaLinkPage() {
    const { props } = usePage();
    const { clients, usinas, statusOptions } = props;

    const { data, setData, post, processing, errors } = useForm({
        client_profile_id: '',
        usina_id: '',
        allocated_energy_kwh: '',
        discount_percentage: '',
        started_at: '',
        ended_at: '',
        is_active: true,
        status: 'active',
        notes: '',
    });

    const selectedUsina = usinas.find((usina) => Number(usina.id) === Number(data.usina_id));

    const remainingEnergy = selectedUsina
        ? Number(selectedUsina.energia_disponivel_kwh || 0) -
        Number(selectedUsina.energia_alocada_kwh || 0)
        : 0;

    const handleSubmit = (event) => {
        event.preventDefault();

        post(route('admin.usinas.links.store'), {
            preserveScroll: true,
        });
    };

    return (
        <Layout titlePage="Alocação Cliente/Usina" menu="usinas-solar" subMenu="usinas-vinculos" backPage>
            <Box sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Button
                        component={Link}
                        href={route('admin.usinas.links.index')}
                        startIcon={<ArrowBackIcon />}
                        variant="outlined"
                    >
                        Voltar
                    </Button>

                    <Box>
                        <Typography variant="h4" fontWeight={900}>
                            Nova Alocação Cliente/Usina
                        </Typography>

                        <Typography color="text.secondary">
                            Vincule um cliente a uma usina e defina o volume energético alocado.
                        </Typography>
                    </Box>
                </Stack>

                <Card sx={{ borderRadius: 3, maxWidth: 1000 }}>
                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Cliente"
                                        value={data.client_profile_id}
                                        onChange={(event) =>
                                            setData('client_profile_id', event.target.value)
                                        }
                                        error={Boolean(errors.client_profile_id)}
                                        helperText={errors.client_profile_id}
                                        select
                                        fullWidth
                                    >
                                        {clients.map((client) => (
                                            <MenuItem key={client.id} value={client.id}>
                                                {client.client_code} - {getClientName(client)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Usina"
                                        value={data.usina_id}
                                        onChange={(event) => setData('usina_id', event.target.value)}
                                        error={Boolean(errors.usina_id)}
                                        helperText={errors.usina_id}
                                        select
                                        fullWidth
                                    >
                                        {usinas.map((usina) => (
                                            <MenuItem key={usina.id} value={usina.id}>
                                                {usina?.usina_nome}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                {selectedUsina && (
                                    <Grid item xs={12}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                bgcolor: 'success.lighter',
                                                border: '1px solid',
                                                borderColor: 'success.light',
                                            }}
                                        >
                                            <Typography fontWeight={900}>
                                                Saldo disponível:{' '}
                                                {remainingEnergy.toLocaleString('pt-BR')} kWh
                                            </Typography>

                                            <Typography variant="body2" color="text.secondary">
                                                Disponível:{' '}
                                                {Number(selectedUsina.energia_disponivel_kwh || 0).toLocaleString('pt-BR')} kWh
                                                {' '}| Alocado:{' '}
                                                {Number(selectedUsina.energia_alocada_kwh || 0).toLocaleString('pt-BR')} kWh
                                            </Typography>
                                        </Box>
                                    </Grid>
                                )}

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Energia alocada"
                                        value={data.allocated_energy_kwh}
                                        onChange={(event) =>
                                            setData('allocated_energy_kwh', event.target.value)
                                        }
                                        error={Boolean(errors.allocated_energy_kwh)}
                                        helperText={errors.allocated_energy_kwh}
                                        type="number"
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">kWh</InputAdornment>,
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Desconto"
                                        value={data.discount_percentage}
                                        onChange={(event) =>
                                            setData('discount_percentage', event.target.value)
                                        }
                                        error={Boolean(errors.discount_percentage)}
                                        helperText={errors.discount_percentage}
                                        type="number"
                                        fullWidth
                                        slotProps={{
                                            input: {
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            },
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <TextField
                                        label="Status"
                                        value={data.status}
                                        onChange={(event) => setData('status', event.target.value)}
                                        error={Boolean(errors.status)}
                                        helperText={errors.status}
                                        select
                                        fullWidth
                                    >
                                        {statusOptions.map((status) => (
                                            <MenuItem key={status.value} value={status.value}>
                                                {status.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Data de início"
                                        value={data.started_at}
                                        onChange={(event) => setData('started_at', event.target.value)}
                                        error={Boolean(errors.started_at)}
                                        helperText={errors.started_at}
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <TextField
                                        label="Data de fim"
                                        value={data.ended_at}
                                        onChange={(event) => setData('ended_at', event.target.value)}
                                        error={Boolean(errors.ended_at)}
                                        helperText={errors.ended_at || 'Opcional'}
                                        type="date"
                                        InputLabelProps={{ shrink: true }}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={data.is_active}
                                                onChange={(event) =>
                                                    setData('is_active', event.target.checked)
                                                }
                                            />
                                        }
                                        label="Vínculo ativo"
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        label="Observações"
                                        value={data.notes}
                                        onChange={(event) => setData('notes', event.target.value)}
                                        error={Boolean(errors.notes)}
                                        helperText={errors.notes}
                                        multiline
                                        minRows={4}
                                        fullWidth
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                                        <Button
                                            component={Link}
                                            href={route('admin.usinas.links.index')}
                                            variant="outlined"
                                        >
                                            Cancelar
                                        </Button>

                                        <Button
                                            type="submit"
                                            variant="contained"
                                            disabled={processing}
                                        >
                                            Salvar Alocação
                                        </Button>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}
