import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head} from "@inertiajs/react";

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
    IconBolt,
    IconFileText,
    IconMapPin,
} from "@tabler/icons-react";

import PropostaBaixar from "@/Pages/Auth/Cliente/Proposta/Show/Propostas.jsx";
import PropostaProdutor from "@/Pages/Auth/Produtor/Proposta/Show/PropostaProdutor.jsx";

const statusConfig = {
    pending: {
        label: "Pendente",
        color: "warning",
    },

    approved: {
        label: "Aprovada",
        color: "success",
    },

    rejected: {
        label: "Rejeitada",
        color: "error",
    },

    expired: {
        label: "Expirada",
        color: "default",
    },
};

const Page = ({proposal}) => {

    const producer = proposal?.producer_profile;
    const address = proposal?.address;

    const getProducerName = () => {

        return (
            producer?.nome ||
            producer?.razao_social ||
            producer?.nome_fantasia ||
            "Produtor não informado"
        );
    };

    const dateLabel = (value) => {

        if (!value) {
            return "Não informado";
        }

        return String(value).substring(0, 10);
    };

    const moneyLabel = (value) => {

        if (!value) {
            return "Não informado";
        }

        return Number(value).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    };

    const addressLine = () => {

        if (!address) {
            return "Não informado";
        }

        const parts = [
            address?.rua,
            address?.numero,
            address?.bairro,
            address?.cidade,
            address?.estado,
        ].filter(Boolean);

        return parts.length
            ? parts.join(", ")
            : "Não informado";
    };

    const status =
        statusConfig[proposal?.status] ||
        {
            label: proposal?.status || "Sem status",
            color: "default",
        };

    return (
        <Layout
            titlePage="Detalhes da Proposta"
            menu="produtores"
            subMenu="produtores-propostas"
            backPage
        >
            <Head title="Detalhes da Proposta"/>

            <Card sx={{marginBottom: 4}}>

                <CardHeader
                    title={
                        proposal?.proposal_code ??
                        `Proposta #${proposal?.id}`
                    }
                    subheader={getProducerName()}
                    avatar={<IconFileText/>}
                    action={
                        <Chip
                            label={status.label}
                            color={status.color}
                        />
                    }
                />

                <Divider/>

                <CardContent>

                    <Grid container spacing={3}>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">
                                Produtor
                            </Typography>

                            <Typography>
                                {getProducerName()}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">
                                Consultor
                            </Typography>

                            <Typography>
                                {proposal?.consultor?.name || "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">
                                Concessionária
                            </Typography>

                            <Typography>
                                {proposal?.concessionaria?.nome || "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">
                                Documento
                            </Typography>

                            <Typography>
                                {producer?.cpf || producer?.cnpj || "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Potência da Usina
                            </Typography>

                            <Typography>
                                {proposal?.potencia_usina
                                    ? `${proposal?.potencia_usina} kWp`
                                    : "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Média de Geração
                            </Typography>

                            <Typography>
                                {proposal?.media_geracao
                                    ? `${proposal?.media_geracao} kWh`
                                    : "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Prazo do Contrato
                            </Typography>

                            <Typography>
                                {proposal?.prazo_contrato
                                    ? `${proposal?.prazo_contrato} meses`
                                    : "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Valor Investimento
                            </Typography>

                            <Typography>
                                {moneyLabel(proposal?.valor_investimento)}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Percentual Preenchimento
                            </Typography>

                            <Typography>
                                {proposal?.fill_percent
                                    ? `${proposal?.fill_percent}%`
                                    : "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Emitida em
                            </Typography>

                            <Typography>
                                {dateLabel(proposal?.issued_at)}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Válida até
                            </Typography>

                            <Typography>
                                {dateLabel(proposal?.valid_until)}
                            </Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">
                                Observações
                            </Typography>

                            <Typography>
                                {proposal?.notes || "Não informado"}
                            </Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            <Card sx={{marginBottom: 4}}>

                <CardHeader
                    title="Endereço da Usina"
                    avatar={<IconMapPin/>}
                />

                <CardContent>

                    <Grid container spacing={3}>

                        <Grid size={12}>
                            <Typography variant="subtitle2">
                                Endereço
                            </Typography>

                            <Typography>
                                {addressLine()}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 3}}>
                            <Typography variant="subtitle2">
                                CEP
                            </Typography>

                            <Typography>
                                {address?.cep || "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 3}}>
                            <Typography variant="subtitle2">
                                Complemento
                            </Typography>

                            <Typography>
                                {address?.complemento || "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 3}}>
                            <Typography variant="subtitle2">
                                Referência
                            </Typography>

                            <Typography>
                                {address?.referencia || "Não informado"}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 3}}>
                            <Typography variant="subtitle2">
                                Coordenadas
                            </Typography>

                            <Typography>
                                {address?.latitude && address?.longitude
                                    ? `${address.latitude}, ${address.longitude}`
                                    : "Não informado"}
                            </Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            <Card sx={{marginBottom: 4}}>

                <CardHeader
                    title="Dados Técnicos"
                    avatar={<IconBolt/>}
                />

                <CardContent>

                    <Grid container spacing={3}>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Status
                            </Typography>

                            <Typography>
                                {status.label}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                Código da Proposta
                            </Typography>

                            <Typography>
                                {proposal?.proposal_code}
                            </Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 4}}>
                            <Typography variant="subtitle2">
                                ID da Proposta
                            </Typography>

                            <Typography>
                                #{proposal?.id}
                            </Typography>
                        </Grid>

                    </Grid>

                </CardContent>

            </Card>

            {/*<PropostaBaixar idProposta={proposal.id}/>*/}
            <PropostaProdutor proposal={proposal} idProposta={proposal.id}/>
        </Layout>
    );
};

export default Page;
