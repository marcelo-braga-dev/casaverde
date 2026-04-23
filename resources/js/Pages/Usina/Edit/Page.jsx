import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

export default function Page({
    usina,
    produtores = [],
    consultores = [],
    concessionarias = [],
    blocks = [],
    addresses = [],
}) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: usina.user_id || "",
        consultor_user_id: usina.consultor_user_id || "",
        concessionaria_id: usina.concessionaria_id || "",
        usina_block_id: usina.usina_block_id || "",
        address_id: usina.address_id || "",
        status: usina.status || "ativo",
        uc: usina.uc || "",
        media_geracao: usina.media_geracao || "",
        prazo_locacao: usina.prazo_locacao || "",
        potencia_usina: usina.potencia_usina || "",
        taxa_comissao: usina.taxa_comissao || "",
        inversores: usina.inversores || "",
        modulos: usina.modulos || "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.usinas.update", usina.id));
    };

    return (
        <Layout titlePage="Editar Usina" menu="config">
            <Head title="Editar Usina" />

            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Editar usina
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Produtor proprietário"
                                    value={data.user_id}
                                    onChange={(e) => setData("user_id", e.target.value)}
                                    error={!!errors.user_id}
                                    helperText={errors.user_id}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value="">Selecione</MenuItem>
                                    {produtores.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name} {item.email ? `- ${item.email}` : ""}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Consultor"
                                    value={data.consultor_user_id}
                                    onChange={(e) => setData("consultor_user_id", e.target.value)}
                                    error={!!errors.consultor_user_id}
                                    helperText={errors.consultor_user_id}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value="">Selecione</MenuItem>
                                    {consultores.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
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
                                    required
                                >
                                    <MenuItem value="">Selecione</MenuItem>
                                    {concessionarias.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Bloco"
                                    value={data.usina_block_id}
                                    onChange={(e) => setData("usina_block_id", e.target.value)}
                                    error={!!errors.usina_block_id}
                                    helperText={errors.usina_block_id}
                                    fullWidth
                                >
                                    <MenuItem value="">Nenhum</MenuItem>
                                    {blocks.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Endereço"
                                    value={data.address_id}
                                    onChange={(e) => setData("address_id", e.target.value)}
                                    error={!!errors.address_id}
                                    helperText={errors.address_id}
                                    fullWidth
                                >
                                    <MenuItem value="">Nenhum</MenuItem>
                                    {addresses.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.rua}, {item.numero} - {item.bairro} - {item.cidade}/{item.estado}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    error={!!errors.status}
                                    helperText={errors.status}
                                    fullWidth
                                    required
                                >
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                    <MenuItem value="lead">Lead</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="UC"
                                    value={data.uc}
                                    onChange={(e) => setData("uc", e.target.value)}
                                    error={!!errors.uc}
                                    helperText={errors.uc}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Média de geração"
                                    type="number"
                                    value={data.media_geracao}
                                    onChange={(e) => setData("media_geracao", e.target.value)}
                                    error={!!errors.media_geracao}
                                    helperText={errors.media_geracao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Prazo de locação"
                                    type="number"
                                    value={data.prazo_locacao}
                                    onChange={(e) => setData("prazo_locacao", e.target.value)}
                                    error={!!errors.prazo_locacao}
                                    helperText={errors.prazo_locacao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Potência da usina"
                                    type="number"
                                    value={data.potencia_usina}
                                    onChange={(e) => setData("potencia_usina", e.target.value)}
                                    error={!!errors.potencia_usina}
                                    helperText={errors.potencia_usina}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Taxa de comissão"
                                    type="number"
                                    value={data.taxa_comissao}
                                    onChange={(e) => setData("taxa_comissao", e.target.value)}
                                    error={!!errors.taxa_comissao}
                                    helperText={errors.taxa_comissao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Inversores"
                                    value={data.inversores}
                                    onChange={(e) => setData("inversores", e.target.value)}
                                    error={!!errors.inversores}
                                    helperText={errors.inversores}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Módulos"
                                    value={data.modulos}
                                    onChange={(e) => setData("modulos", e.target.value)}
                                    error={!!errors.modulos}
                                    helperText={errors.modulos}
                                    multiline
                                    minRows={3}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <Button type="submit" variant="contained" disabled={processing}>
                                    Salvar alterações
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}