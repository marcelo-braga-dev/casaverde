import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({ concessionarias = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        tipo_pessoa: "pf",
        cpf: "",
        cnpj: "",
        nome: "",
        razao_social: "",
        nome_fantasia: "",
        cidade: "",
        email: "",
        telefone: "",
        concessionaria_id: "",
        media_consumo: "",
        taxa_reducao: "",
        prazo_locacao: "",
        valor_medio: "",
        unidade_consumidora: "",
        valid_until: "",
        notes: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("admin.propostas.store"));
    };

    return (
        <Layout titlePage="Nova Proposta Comercial" menu="propostas">
            <Head title="Nova Proposta Comercial" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Emitir proposta comercial
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    select
                                    label="Tipo de pessoa"
                                    value={data.tipo_pessoa}
                                    onChange={(e) => setData("tipo_pessoa", e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="pf">Pessoa Física</MenuItem>
                                    <MenuItem value="pj">Pessoa Jurídica</MenuItem>
                                </TextField>
                            </Grid>

                            {data.tipo_pessoa === "pf" ? (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CPF"
                                            value={data.cpf}
                                            onChange={(e) => setData("cpf", e.target.value)}
                                            error={!!errors.cpf}
                                            helperText={errors.cpf}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 5 }}>
                                        <TextField
                                            label="Nome"
                                            value={data.nome}
                                            onChange={(e) => setData("nome", e.target.value)}
                                            error={!!errors.nome}
                                            helperText={errors.nome}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CNPJ"
                                            value={data.cnpj}
                                            onChange={(e) => setData("cnpj", e.target.value)}
                                            error={!!errors.cnpj}
                                            helperText={errors.cnpj}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Razão Social"
                                            value={data.razao_social}
                                            onChange={(e) => setData("razao_social", e.target.value)}
                                            error={!!errors.razao_social}
                                            helperText={errors.razao_social}
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="Nome Fantasia"
                                            value={data.nome_fantasia}
                                            onChange={(e) => setData("nome_fantasia", e.target.value)}
                                            error={!!errors.nome_fantasia}
                                            helperText={errors.nome_fantasia}
                                            fullWidth
                                        />
                                    </Grid>
                                </>
                            )}

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Cidade"
                                    value={data.cidade}
                                    onChange={(e) => setData("cidade", e.target.value)}
                                    error={!!errors.cidade}
                                    helperText={errors.cidade}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Telefone"
                                    value={data.telefone}
                                    onChange={(e) => setData("telefone", e.target.value)}
                                    error={!!errors.telefone}
                                    helperText={errors.telefone}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Concessionária"
                                    value={data.concessionaria_id}
                                    onChange={(e) => setData("concessionaria_id", e.target.value)}
                                    error={!!errors.concessionaria_id}
                                    helperText={errors.concessionaria_id}
                                    fullWidth
                                >
                                    {concessionarias.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nome} - {item.estado}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Média de consumo (kWh)"
                                    value={data.media_consumo}
                                    onChange={(e) => setData("media_consumo", e.target.value)}
                                    error={!!errors.media_consumo}
                                    helperText={errors.media_consumo}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Taxa de redução (%)"
                                    value={data.taxa_reducao}
                                    onChange={(e) => setData("taxa_reducao", e.target.value)}
                                    error={!!errors.taxa_reducao}
                                    helperText={errors.taxa_reducao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Prazo de locação (meses)"
                                    value={data.prazo_locacao}
                                    onChange={(e) => setData("prazo_locacao", e.target.value)}
                                    error={!!errors.prazo_locacao}
                                    helperText={errors.prazo_locacao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Valor médio"
                                    value={data.valor_medio}
                                    onChange={(e) => setData("valor_medio", e.target.value)}
                                    error={!!errors.valor_medio}
                                    helperText={errors.valor_medio}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Unidade consumidora"
                                    value={data.unidade_consumidora}
                                    onChange={(e) => setData("unidade_consumidora", e.target.value)}
                                    error={!!errors.unidade_consumidora}
                                    helperText={errors.unidade_consumidora}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Validade"
                                    type="date"
                                    value={data.valid_until}
                                    onChange={(e) => setData("valid_until", e.target.value)}
                                    error={!!errors.valid_until}
                                    helperText={errors.valid_until}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Observações"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    error={!!errors.notes}
                                    helperText={errors.notes}
                                    multiline
                                    minRows={4}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing}
                                    >
                                        Emitir proposta
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}