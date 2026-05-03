import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconEdit,
    IconFileCertificate,
    IconFileText,
    IconHome,
    IconUser,
} from "@tabler/icons-react";

const show = (value) => value || "Não informado";

const formatStatus = (status) => {
    const labels = {
        issued: "Emitido",
        signed: "Assinado",
        active: "Ativo",
        cancelled: "Cancelado",
    };

    return labels[status] ?? status ?? "Sem status";
};

const formatDate = (value) => {
    if (!value) return "Não informado";

    if (String(value).includes("/")) {
        return value;
    }

    return String(value).substring(0, 10);
};

const formatAddress = (address) => {
    if (!address) return "Não informado";

    const parts = [
        address?.rua,
        address?.numero,
        address?.bairro,
        address?.cidade,
        address?.estado,
    ].filter(Boolean);

    return parts.length ? parts.join(", ") : "Não informado";
};

const Page = ({ contract }) => {
    const flashPassword = usePage().props?.flash?.temporary_password;

    const client =
        contract?.client_profile ??
        contract?.clientProfile ??
        null;

    const proposal =
        contract?.proposal ??
        null;

    const user =
        contract?.user ??
        null;

    const userData =
        user?.user_data ??
        user?.userData ??
        null;

    const proposalAddress =
        proposal?.address ??
        null;

    const contractAddress =
        userData?.address ??
        proposalAddress ??
        null;

    const isPessoaFisica = userData?.tipo_pessoa === "pf";

    return (
        <Layout titlePage="Contrato Emitido" menu="clientes" subMenu="contratos-index" backPage>
            <Head title="Contrato Emitido" />

            {flashPassword && (
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Senha temporária do cliente" />

                    <CardContent>
                        <Typography>
                            Senha temporária: <strong>{flashPassword}</strong>
                        </Typography>
                    </CardContent>
                </Card>
            )}

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={contract?.contract_code ?? `Contrato #${contract?.id}`}
                    avatar={<IconFileCertificate />}
                    action={<Chip label={formatStatus(contract?.status)} />}
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Cliente</Typography>
                            <Typography>{show(client?.display_name ?? client?.nome ?? client?.razao_social)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Documento</Typography>
                            <Typography>{show(client?.documento ?? userData?.cpf ?? userData?.cnpj)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Login</Typography>
                            <Typography>{show(user?.email)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Proposta</Typography>
                            <Typography>{show(proposal?.proposal_code ?? `#${proposal?.id}`)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Emitido em</Typography>
                            <Typography>{formatDate(contract?.issued_at)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Assinado em</Typography>
                            <Typography>{formatDate(contract?.signed_at)}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Observações</Typography>
                            <Typography>{show(contract?.notes)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Informações da Proposta" avatar={<IconFileText />} />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Concessionária</Typography>
                            <Typography>{show(proposal?.concessionaria?.nome)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Unidade Consumidora</Typography>
                            <Typography>{show(proposal?.unidade_consumidora)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Média de Consumo</Typography>
                            <Typography>{show(proposal?.media_consumo)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Taxa de Redução</Typography>
                            <Typography>
                                {proposal?.taxa_reducao ? `${proposal.taxa_reducao}%` : "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Prazo de Locação</Typography>
                            <Typography>{show(proposal?.prazo_locacao)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Valor Médio</Typography>
                            <Typography>{show(proposal?.valor_medio)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Validade</Typography>
                            <Typography>{formatDate(proposal?.valid_until)}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Dados Contratuais do Cliente" avatar={<IconUser />} />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Tipo de Pessoa</Typography>
                            <Typography>{isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica"}</Typography>
                        </Grid>

                        {isPessoaFisica && (
                            <>
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Typography variant="subtitle2">Nome Completo</Typography>
                                    <Typography>{show(userData?.nome)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2">CPF</Typography>
                                    <Typography>{show(userData?.cpf)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Typography variant="subtitle2">Data de Nascimento</Typography>
                                    <Typography>{show(userData?.data_nascimento)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Typography variant="subtitle2">RG</Typography>
                                    <Typography>{show(userData?.rg)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Typography variant="subtitle2">Gênero</Typography>
                                    <Typography>{show(userData?.genero)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Typography variant="subtitle2">Estado Civil</Typography>
                                    <Typography>{show(userData?.estado_civil)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">Profissão</Typography>
                                    <Typography>{show(userData?.profissao)}</Typography>
                                </Grid>
                            </>
                        )}

                        {!isPessoaFisica && (
                            <>
                                <Grid size={{ xs: 12, md: 5 }}>
                                    <Typography variant="subtitle2">Razão Social</Typography>
                                    <Typography>{show(userData?.razao_social)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2">CNPJ</Typography>
                                    <Typography>{show(userData?.cnpj)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <Typography variant="subtitle2">Data de Fundação</Typography>
                                    <Typography>{show(userData?.data_fundacao)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2">Nome Fantasia</Typography>
                                    <Typography>{show(userData?.nome_fantasia)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2">Tipo de Empresa</Typography>
                                    <Typography>{show(userData?.tipo_empresa)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Typography variant="subtitle2">Ramo de Atividade</Typography>
                                    <Typography>{show(userData?.ramo_atividade)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">Inscrição Estadual</Typography>
                                    <Typography>{show(userData?.ie)}</Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="subtitle2">Inscrição Municipal</Typography>
                                    <Typography>{show(userData?.im)}</Typography>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Endereço da Unidade Consumidora" avatar={<IconHome />} />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Typography variant="subtitle2">Endereço</Typography>
                            <Typography>{formatAddress(contractAddress)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">CEP</Typography>
                            <Typography>{show(contractAddress?.cep)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Complemento</Typography>
                            <Typography>{show(contractAddress?.complemento)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Referência</Typography>
                            <Typography>{show(contractAddress?.referencia)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <Typography variant="subtitle2">Coordenadas</Typography>
                            <Typography>
                                {contractAddress?.latitude && contractAddress?.longitude
                                    ? `${contractAddress.latitude}, ${contractAddress.longitude}`
                                    : "Não informado"}
                            </Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Link href={route("consultor.cliente.contratos.edit", contract.id)}>
                <Button variant="outlined" color="warning" startIcon={<IconEdit />}>
                    Editar Contrato
                </Button>
            </Link>
        </Layout>
    );
};

export default Page;
