import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconBolt, IconBuilding, IconDeviceFloppy, IconUser } from "@tabler/icons-react";

const Page = ({ users = [], responsaveisCadastro = [], addresses = [] }) => {
    const { data, setData, post, processing, errors } = useForm({
        user_id: "",
        created_by_user_id: "",
        admin_nome: "",
        admin_qualificacao: "",
        admin_address_id: "",
        usina_nome: "",
        usina_address_id: "",
        usina_cnpj: "",
        potencia_kw: "",
        potencia_kwp: "",
        geracao_anual: "",
        unidade_consumidora: "",
        usina_area: "",
        imovel_area: "",
        imovel_matricula: "",
        tipo_area: "",
        classificacao: "",
        prazo_locacao: "",
        modulos: "",
        inversores: "",
        descricao: "",
        parcela_fixa: "",
        taxa_administracao: "",
        contrato_data: "",
        status: "lead",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("consultor.producer.profiles.store"));
    };

    const addressLabel = (address) => {
        return `${address?.rua ?? ""}, ${address?.numero ?? ""} - ${address?.bairro ?? ""}, ${address?.cidade ?? ""}/${address?.estado ?? ""}`;
    };

    return (
        <Layout titlePage="Cadastrar Produtor" menu="produtores" subMenu="produtores-cadastrar" backPage>
            <Head title="Cadastrar Produtor" />

            <form onSubmit={submit}>
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados do Produtor" avatar={<IconUser />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Usuário Produtor"
                                    value={data.user_id}
                                    onChange={(e) => setData("user_id", e.target.value)}
                                    error={!!errors.user_id}
                                    helperText={errors.user_id}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Não vincular</MenuItem>
                                    {users.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name} - {user.email}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Responsável pelo Cadastro"
                                    value={data.created_by_user_id}
                                    onChange={(e) => setData("created_by_user_id", e.target.value)}
                                    error={!!errors.created_by_user_id}
                                    helperText={errors.created_by_user_id}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Usuário logado</MenuItem>
                                    {responsaveisCadastro.map((user) => (
                                        <MenuItem key={user.id} value={user.id}>
                                            {user.name} - {user.email}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Nome do Administrador"
                                    value={data.admin_nome}
                                    onChange={(e) => setData("admin_nome", e.target.value)}
                                    error={!!errors.admin_nome}
                                    helperText={errors.admin_nome}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Qualificação do Administrador"
                                    value={data.admin_qualificacao}
                                    onChange={(e) => setData("admin_qualificacao", e.target.value)}
                                    error={!!errors.admin_qualificacao}
                                    helperText={errors.admin_qualificacao}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Endereço do Administrador"
                                    value={data.admin_address_id}
                                    onChange={(e) => setData("admin_address_id", e.target.value)}
                                    error={!!errors.admin_address_id}
                                    helperText={errors.admin_address_id}
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
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados da Usina" avatar={<IconBolt />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="Nome da Usina" value={data.usina_nome} onChange={(e) => setData("usina_nome", e.target.value)} error={!!errors.usina_nome} helperText={errors.usina_nome} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField label="CNPJ da Usina" value={data.usina_cnpj} onChange={(e) => setData("usina_cnpj", e.target.value)} error={!!errors.usina_cnpj} helperText={errors.usina_cnpj} fullWidth />
                            </Grid>

                            <Grid size={12}>
                                <TextField label="Endereço da Usina" value={data.usina_address_id} onChange={(e) => setData("usina_address_id", e.target.value)} error={!!errors.usina_address_id} helperText={errors.usina_address_id} select fullWidth>
                                    <MenuItem value="">Não informar</MenuItem>
                                    {addresses.map((address) => (
                                        <MenuItem key={address.id} value={address.id}>
                                            {addressLabel(address)}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Potência kW" value={data.potencia_kw} onChange={(e) => setData("potencia_kw", e.target.value)} error={!!errors.potencia_kw} helperText={errors.potencia_kw} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Potência kWp" value={data.potencia_kwp} onChange={(e) => setData("potencia_kwp", e.target.value)} error={!!errors.potencia_kwp} helperText={errors.potencia_kwp} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Geração Anual" value={data.geracao_anual} onChange={(e) => setData("geracao_anual", e.target.value)} error={!!errors.geracao_anual} helperText={errors.geracao_anual} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Unidade Consumidora" value={data.unidade_consumidora} onChange={(e) => setData("unidade_consumidora", e.target.value)} error={!!errors.unidade_consumidora} helperText={errors.unidade_consumidora} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Área da Usina" value={data.usina_area} onChange={(e) => setData("usina_area", e.target.value)} error={!!errors.usina_area} helperText={errors.usina_area} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Área do Imóvel" value={data.imovel_area} onChange={(e) => setData("imovel_area", e.target.value)} error={!!errors.imovel_area} helperText={errors.imovel_area} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Matrícula do Imóvel" value={data.imovel_matricula} onChange={(e) => setData("imovel_matricula", e.target.value)} error={!!errors.imovel_matricula} helperText={errors.imovel_matricula} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Tipo de Área" value={data.tipo_area} onChange={(e) => setData("tipo_area", e.target.value)} error={!!errors.tipo_area} helperText={errors.tipo_area} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Classificação" value={data.classificacao} onChange={(e) => setData("classificacao", e.target.value)} error={!!errors.classificacao} helperText={errors.classificacao} fullWidth />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Contrato e Condições" avatar={<IconBuilding />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Prazo de Locação" value={data.prazo_locacao} onChange={(e) => setData("prazo_locacao", e.target.value)} error={!!errors.prazo_locacao} helperText={errors.prazo_locacao} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Parcela Fixa" value={data.parcela_fixa} onChange={(e) => setData("parcela_fixa", e.target.value)} error={!!errors.parcela_fixa} helperText={errors.parcela_fixa} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Taxa de Administração" value={data.taxa_administracao} onChange={(e) => setData("taxa_administracao", e.target.value)} error={!!errors.taxa_administracao} helperText={errors.taxa_administracao} type="number" fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Data do Contrato" value={data.contrato_data} onChange={(e) => setData("contrato_data", e.target.value)} error={!!errors.contrato_data} helperText={errors.contrato_data} type="date" slotProps={{ inputLabel: { shrink: true } }} fullWidth />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField label="Status" value={data.status} onChange={(e) => setData("status", e.target.value)} error={!!errors.status} helperText={errors.status} select required fullWidth>
                                    <MenuItem value="lead">Lead</MenuItem>
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                    <MenuItem value="pendente">Pendente</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <TextField label="Módulos" value={data.modulos} onChange={(e) => setData("modulos", e.target.value)} error={!!errors.modulos} helperText={errors.modulos} multiline rows={3} fullWidth />
                            </Grid>

                            <Grid size={12}>
                                <TextField label="Inversores" value={data.inversores} onChange={(e) => setData("inversores", e.target.value)} error={!!errors.inversores} helperText={errors.inversores} multiline rows={3} fullWidth />
                            </Grid>

                            <Grid size={12}>
                                <TextField label="Descrição" value={data.descricao} onChange={(e) => setData("descricao", e.target.value)} error={!!errors.descricao} helperText={errors.descricao} multiline rows={4} fullWidth />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <Button type="submit" color="success" startIcon={<IconDeviceFloppy />} disabled={processing}>
                        Cadastrar Produtor
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;
