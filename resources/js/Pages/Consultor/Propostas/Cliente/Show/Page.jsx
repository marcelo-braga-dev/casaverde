import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head } from "@inertiajs/react";
import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconFileText,
    IconMapPin,
} from "@tabler/icons-react";
import PropostaBaixar from "@/Pages/Auth/Cliente/Proposta/Show/Propostas.jsx";
import convertFloatToMoney from "@/Utils/Datas/convertFloatToMoney.js";

const Page = ({ proposal }) => {
    const client = proposal?.client_profile;

    const getClientName = () => {
        return client?.nome || client?.razao_social || client?.nome_fantasia || "Cliente não informado";
    };

    const dateLabel = (value) => {
        if (!value) return "Não informado";

        return String(value).substring(0, 10);
    };
console.log(proposal)
    return (
        <Layout titlePage="Detalhes da Proposta" menu="clientes" subMenu="propostas-cliente-index" backPage>
            <Head title="Detalhes da Proposta" />

        {/*<ClientePropostaPDF proposal={proposal} dados={dados}/>*/}

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={proposal?.proposal_code ?? `Proposta #${proposal?.id}`}
                    subheader={getClientName()}
                    avatar={<IconFileText />}
                    action={
                        <Chip
                            label={proposal?.status ?? "Sem status"}
                            color={proposal?.status === "emitida" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Cliente</Typography>
                            <Typography>{getClientName()}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Consultor</Typography>
                            <Typography>{proposal?.consultor?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Concessionária</Typography>
                            <Typography>{proposal?.concessionaria?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Unidade Consumidora</Typography>
                            <Typography>{proposal?.unidade_consumidora ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Média de Consumo</Typography>
                            <Typography>{proposal?.media_consumo ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Taxa de Redução</Typography>
                            <Typography>
                                {proposal?.discount_percent ? `${proposal.discount_percent}%` : "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Prazo de Locação</Typography>
                            <Typography>{proposal?.prazo_locacao ? `${proposal?.prazo_locacao} meses` : "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Valor Médio</Typography>
                            <Typography>R$ {convertFloatToMoney(proposal?.valor_medio )?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Emitida em</Typography>
                            <Typography>{proposal?.created_at}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Válida até</Typography>
                            <Typography>{dateLabel(proposal?.valid_until)}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Observações</Typography>
                            <Typography>{proposal?.notes ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Endereço da Unidade Consumidora" avatar={<IconMapPin />} />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={12}>
                            <Typography variant="subtitle2">Endereço</Typography>
                            <Typography>{proposal?.address?.full_address ?? 'Não informado'}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <PropostaBaixar idProposta={proposal.id} dadosProposta={proposal} />
        </Layout>
    );
};

export default Page;
