import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Button, Card, CardContent, CardHeader, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconDeviceFloppy, IconSolarElectricity } from "@tabler/icons-react";
import { Head, useForm } from "@inertiajs/react";

const Page = ({ usina, produtores = [], consultores = [], concessionarias = [], blocks = [], addresses = [] }) => {
    const { data, setData, put, processing, errors } = useForm({
        user_id: usina?.user_id ?? "",
        consultor_user_id: usina?.consultor_user_id ?? "",
        concessionaria_id: usina?.concessionaria_id ?? "",
        usina_block_id: usina?.usina_block_id ?? "",
        address_id: usina?.address_id ?? "",
        status: usina?.status ?? "ativo",
        uc: usina?.uc ?? "",
        media_geracao: usina?.media_geracao ?? "",
        prazo_locacao: usina?.prazo_locacao ?? "",
        potencia_usina: usina?.potencia_usina ?? "",
        taxa_comissao: usina?.taxa_comissao ?? "",
        inversores: usina?.inversores ?? "",
        modulos: usina?.modulos ?? "",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("consultor.producer.usinas.update", usina.id));
    };

    const addressLabel = (address) => {
        return `${address?.rua ?? ""}, ${address?.numero ?? ""} - ${address?.bairro ?? ""}, ${address?.cidade ?? ""}/${address?.estado ?? ""}`;
    };

    return (
        <Layout titlePage="Editar Usina" menu="usinas" subMenu="usinas-listar" backPage>
            <Head title="Editar Usina" />

            <form onSubmit={submit}>
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados da Usina" avatar={<IconSolarElectricity />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Produtor Proprietário"
                                    value={data.user_id}
                                    onChange={(e) => setData("user_id", e.target.value)}
                                    error={!!errors.user_id}
                                    helperText={errors.user_id}
                                    select
                                    required
                                    fullWidth
                                >
                                    {produtores.map((produtor) => (
                                        <MenuItem key={produtor.id} value={produtor.id}>
                                            {produtor.name} - {produtor.email}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Consultor Responsável"
                                    value={data.consultor_user_id}
                                    onChange={(e) => setData("consultor_user_id", e.target.value)}
                                    error={!!errors.consultor_user_id}
                                    helperText={errors.consultor_user_id}
                                    select
                                    required
                                    fullWidth
                                >
                                    {consultores.map((consultor) => (
                                        <MenuItem key={consultor.id} value={consultor.id}>
                                            {consultor.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Concessionária"
                                    value={data.concessionaria_id}
                                    onChange={(e) => setData("concessionaria_id", e.target.value)}
                                    error={!!errors.concessionaria_id}
                                    helperText={errors.concessionaria_id}
                                    select
                                    required
                                    fullWidth
                                >
                                    {concessionarias.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Grupo de Usina"
                                    value={data.usina_block_id}
                                    onChange={(e) => setData("usina_block_id", e.target.value)}
                                    error={!!errors.usina_block_id}
                                    helperText={errors.usina_block_id}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Sem grupo</MenuItem>
                                    {blocks.map((block) => (
                                        <MenuItem key={block.id} value={block.id}>
                                            {block.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Endereço da Usina"
                                    value={data.address_id}
                                    onChange={(e) => setData("address_id", e.target.value)}
                                    error={!!errors.address_id}
                                    helperText={errors.address_id}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Não informar</MenuItem>
                                    {addresses.map((address) => (
                                        <MenuItem key={address.id} value={address.id}>
                                            {addressLabel(address)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="UC" value={data.uc} onChange={(e) => setData("uc", e.target.value)} error={!!errors.uc} helperText={errors.uc} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Média de Geração" value={data.media_geracao} onChange={(e) => setData("media_geracao", e.target.value)} error={!!errors.media_geracao} helperText={errors.media_geracao} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Potência da Usina" value={data.potencia_usina} onChange={(e) => setData("potencia_usina", e.target.value)} error={!!errors.potencia_usina} helperText={errors.potencia_usina} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Prazo de Locação" value={data.prazo_locacao} onChange={(e) => setData("prazo_locacao", e.target.value)} error={!!errors.prazo_locacao} helperText={errors.prazo_locacao} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Taxa de Comissão" value={data.taxa_comissao} onChange={(e) => setData("taxa_comissao", e.target.value)} error={!!errors.taxa_comissao} helperText={errors.taxa_comissao} type="number" fullWidth />
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
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                    <MenuItem value="pendente">Pendente</MenuItem>
                                    <MenuItem value="manutencao">Manutenção</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <TextField label="Inversores" value={data.inversores} onChange={(e) => setData("inversores", e.target.value)} error={!!errors.inversores} helperText={errors.inversores} multiline rows={3} fullWidth />
                            </Grid>

                            <Grid size={12}>
                                <TextField label="Módulos" value={data.modulos} onChange={(e) => setData("modulos", e.target.value)} error={!!errors.modulos} helperText={errors.modulos} multiline rows={3} fullWidth />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button
                        type="submit"
                        color="success"
                        startIcon={<IconDeviceFloppy />}
                        disabled={processing}
                    >
                        Atualizar Usina
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;
