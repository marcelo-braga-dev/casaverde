import Layout from "@/Layouts/UserLayout/Layout.jsx";
import Endereco from "@/Components/UserData/Endereco.jsx";
import { Head, router, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    InputAdornment,
    MenuItem,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconBolt, IconDeviceFloppy } from "@tabler/icons-react";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";

function clientLabel(client) {
    const name = client.tipo_pessoa === "pj"
        ? (client.razao_social || client.nome_fantasia || client.nome)
        : client.nome;

    const document = client.cnpj || client.cpf;

    return document ? `${name} — ${document}` : name;
}

export default function Page({ consumerUnit, clients = [], concessionarias = [] }) {
    const { data, setData, processing, errors } = useForm({
        client_profile_id: consumerUnit.client_profile_id ?? "",
        uc_code: consumerUnit.uc_code ?? "",
        label: consumerUnit.label ?? "",
        consumo_previsto_kwh_mes: consumerUnit.consumo_previsto_kwh_mes ?? "",
        concessionaria_id: consumerUnit.concessionaria_id ?? "",
        status: consumerUnit.status ?? "active",
        notes: consumerUnit.notes ?? "",
        address: {
            cep: consumerUnit.address?.cep ?? "",
            rua: consumerUnit.address?.rua ?? "",
            numero: consumerUnit.address?.numero ?? "",
            complemento: consumerUnit.address?.complemento ?? "",
            bairro: consumerUnit.address?.bairro ?? "",
            cidade: consumerUnit.address?.cidade ?? "",
            estado: consumerUnit.address?.estado ?? "",
            referencia: consumerUnit.address?.referencia ?? "",
        },
    });

    const submit = (e) => {
        e.preventDefault();

        router.post(route("consultor.cliente.consumer-units.update", consumerUnit.id), {
            ...data,
            _method: "PUT",
        });
    };

    return (
        <Layout titlePage="Editar Unidade Consumidora" menu="clientes" subMenu="consumer-units-index" backPage>
            <Head title="Editar Unidade Consumidora" />

            <form onSubmit={submit}>
                <Card sx={{ mb: 3 }}>
                    <CardHeader title="Editar Unidade Consumidora" avatar={<IconBolt />} />

                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <SearchableSelect
                                    label="Cliente"
                                    value={data.client_profile_id}
                                    onChange={(value) => setData("client_profile_id", value)}
                                    options={[
                                        { value: "", label: "Selecione o cliente..." },
                                        ...clients.map((client) => ({
                                            value: client.id,
                                            label: clientLabel(client),
                                        })),
                                    ]}
                                    error={!!errors.client_profile_id}
                                    helperText={errors.client_profile_id}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Código UC"
                                    value={data.uc_code}
                                    onChange={(e) => setData("uc_code", e.target.value)}
                                    error={!!errors.uc_code}
                                    helperText={errors.uc_code}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Rótulo"
                                    value={data.label}
                                    onChange={(e) => setData("label", e.target.value)}
                                    error={!!errors.label}
                                    helperText={errors.label ?? "Ex: Casa Principal"}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Consumo Previsto kWh/mês"
                                    value={data.consumo_previsto_kwh_mes}
                                    onChange={(e) => setData("consumo_previsto_kwh_mes", e.target.value)}
                                    error={!!errors.consumo_previsto_kwh_mes}
                                    helperText={errors.consumo_previsto_kwh_mes ?? "Usado para calcular a alocação na usina"}
                                    type="number"
                                    inputProps={{ min: 0, step: "0.01" }}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">kWh/mês</InputAdornment>,
                                        },
                                    }}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <SearchableSelect
                                    label="Concessionária"
                                    value={data.concessionaria_id}
                                    onChange={(value) => setData("concessionaria_id", value)}
                                    options={[
                                        { value: "", label: "Selecione..." },
                                        ...concessionarias.map((c) => ({
                                            value: c.id,
                                            label: `${c.nome}${c.estado ? ` (${c.estado})` : ""}`,
                                        })),
                                    ]}
                                    error={!!errors.concessionaria_id}
                                    helperText={errors.concessionaria_id}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    error={!!errors.status}
                                    helperText={errors.status}
                                    select
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="active">Ativa</MenuItem>
                                    <MenuItem value="inactive">Inativa</MenuItem>
                                    <MenuItem value="cancelled">Cancelada</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Observações"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    error={!!errors.notes}
                                    helperText={errors.notes}
                                    multiline
                                    rows={2}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Endereco
                    title="Endereço da UC"
                    endereco={data.address}
                    setEndereco={(value) => setData("address", value)}
                    required
                />

                <Card sx={{ mt: 3 }}>
                    <CardContent>
                        <Button
                            type="submit"
                            color="success"
                            variant="contained"
                            startIcon={<IconDeviceFloppy />}
                            disabled={processing}
                        >
                            Salvar alterações
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </Layout>
    );
}
