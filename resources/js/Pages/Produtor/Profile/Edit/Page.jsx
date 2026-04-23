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

export default function Page({ producer, users = [], addresses = [] }) {
    const { data, setData, put, processing, errors } = useForm({
        user_id: producer.user_id || "",
        created_by_user_id: producer.created_by_user_id || "",
        admin_nome: producer.admin_nome || "",
        admin_qualificacao: producer.admin_qualificacao || "",
        admin_address_id: producer.admin_address_id || "",
        usina_nome: producer.usina_nome || "",
        usina_address_id: producer.usina_address_id || "",
        usina_cnpj: producer.usina_cnpj || "",
        potencia_kw: producer.potencia_kw || "",
        potencia_kwp: producer.potencia_kwp || "",
        geracao_anual: producer.geracao_anual || "",
        unidade_consumidora: producer.unidade_consumidora || "",
        usina_area: producer.usina_area || "",
        imovel_area: producer.imovel_area || "",
        imovel_matricula: producer.imovel_matricula || "",
        tipo_area: producer.tipo_area || "",
        classificacao: producer.classificacao || "",
        prazo_locacao: producer.prazo_locacao || "",
        modulos: producer.modulos || "",
        inversores: producer.inversores || "",
        descricao: producer.descricao || "",
        parcela_fixa: producer.parcela_fixa || "",
        taxa_administracao: producer.taxa_administracao || "",
        contrato_data: producer.contrato_data || "",
        status: producer.status || "lead",
    });

    const submit = (e) => {
        e.preventDefault();
        put(route("admin.producer-profiles.update", producer.id));
    };

    return (
        <Layout titlePage="Editar Perfil de Produtor" menu="produtores">
            <Head title="Editar Perfil de Produtor" />
            <Card>
                <CardContent>
                    <Typography variant="h6" marginBottom={3}>
                        Editar perfil de produtor
                    </Typography>

                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    select
                                    label="Usuário vinculado"
                                    value={data.user_id}
                                    onChange={(e) => setData("user_id", e.target.value)}
                                    error={!!errors.user_id}
                                    helperText={errors.user_id}
                                    fullWidth
                                >
                                    <MenuItem value="">Nenhum</MenuItem>
                                    {users.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.name} - {item.email}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Nome do administrador" value={data.admin_nome} onChange={(e) => setData("admin_nome", e.target.value)} error={!!errors.admin_nome} helperText={errors.admin_nome} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Qualificação do administrador" value={data.admin_qualificacao} onChange={(e) => setData("admin_qualificacao", e.target.value)} error={!!errors.admin_qualificacao} helperText={errors.admin_qualificacao} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    label="Endereço do administrador"
                                    value={data.admin_address_id}
                                    onChange={(e) => setData("admin_address_id", e.target.value)}
                                    error={!!errors.admin_address_id}
                                    helperText={errors.admin_address_id}
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

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Nome da usina" value={data.usina_nome} onChange={(e) => setData("usina_nome", e.target.value)} error={!!errors.usina_nome} helperText={errors.usina_nome} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    label="Endereço da usina"
                                    value={data.usina_address_id}
                                    onChange={(e) => setData("usina_address_id", e.target.value)}
                                    error={!!errors.usina_address_id}
                                    helperText={errors.usina_address_id}
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

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="CNPJ da usina" value={data.usina_cnpj} onChange={(e) => setData("usina_cnpj", e.target.value)} error={!!errors.usina_cnpj} helperText={errors.usina_cnpj} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Potência kW" value={data.potencia_kw} onChange={(e) => setData("potencia_kw", e.target.value)} error={!!errors.potencia_kw} helperText={errors.potencia_kw} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Potência kWp" value={data.potencia_kwp} onChange={(e) => setData("potencia_kwp", e.target.value)} error={!!errors.potencia_kwp} helperText={errors.potencia_kwp} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Geração anual" value={data.geracao_anual} onChange={(e) => setData("geracao_anual", e.target.value)} error={!!errors.geracao_anual} helperText={errors.geracao_anual} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Unidade consumidora" value={data.unidade_consumidora} onChange={(e) => setData("unidade_consumidora", e.target.value)} error={!!errors.unidade_consumidora} helperText={errors.unidade_consumidora} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Área da usina" value={data.usina_area} onChange={(e) => setData("usina_area", e.target.value)} error={!!errors.usina_area} helperText={errors.usina_area} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Área do imóvel" value={data.imovel_area} onChange={(e) => setData("imovel_area", e.target.value)} error={!!errors.imovel_area} helperText={errors.imovel_area} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Matrícula do imóvel" value={data.imovel_matricula} onChange={(e) => setData("imovel_matricula", e.target.value)} error={!!errors.imovel_matricula} helperText={errors.imovel_matricula} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Tipo de área" value={data.tipo_area} onChange={(e) => setData("tipo_area", e.target.value)} error={!!errors.tipo_area} helperText={errors.tipo_area} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Classificação" value={data.classificacao} onChange={(e) => setData("classificacao", e.target.value)} error={!!errors.classificacao} helperText={errors.classificacao} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Prazo de locação" value={data.prazo_locacao} onChange={(e) => setData("prazo_locacao", e.target.value)} error={!!errors.prazo_locacao} helperText={errors.prazo_locacao} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Parcela fixa" value={data.parcela_fixa} onChange={(e) => setData("parcela_fixa", e.target.value)} error={!!errors.parcela_fixa} helperText={errors.parcela_fixa} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField label="Taxa de administração" value={data.taxa_administracao} onChange={(e) => setData("taxa_administracao", e.target.value)} error={!!errors.taxa_administracao} helperText={errors.taxa_administracao} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Data do contrato"
                                    type="date"
                                    value={data.contrato_data}
                                    onChange={(e) => setData("contrato_data", e.target.value)}
                                    error={!!errors.contrato_data}
                                    helperText={errors.contrato_data}
                                    InputLabelProps={{ shrink: true }}
                                    fullWidth
                                />
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
                                >
                                    <MenuItem value="lead">Lead</MenuItem>
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Módulos" value={data.modulos} onChange={(e) => setData("modulos", e.target.value)} error={!!errors.modulos} helperText={errors.modulos} multiline minRows={3} fullWidth />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Inversores" value={data.inversores} onChange={(e) => setData("inversores", e.target.value)} error={!!errors.inversores} helperText={errors.inversores} multiline minRows={3} fullWidth />
                            </Grid>

                            <Grid size={12}>
                                <TextField label="Descrição" value={data.descricao} onChange={(e) => setData("descricao", e.target.value)} error={!!errors.descricao} helperText={errors.descricao} multiline minRows={4} fullWidth />
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