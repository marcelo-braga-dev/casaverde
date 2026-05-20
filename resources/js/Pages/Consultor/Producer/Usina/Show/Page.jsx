import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import Grid from "@mui/material/Grid2";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Typography,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import {
    IconArrowLeft,
    IconEdit,
    IconSolarElectricity,
    IconUsers,
} from "@tabler/icons-react";

const Page = ({ usina }) => {
    const addressLabel = (address) => {
        if (!address) return "Não informado";

        return `${address?.rua ?? ""}, ${address?.numero ?? ""} - ${address?.bairro ?? ""}, ${address?.cidade ?? ""}/${address?.estado ?? ""}`;
    };

    return (
        <Layout titlePage="Detalhes da Usina" menu="usinas-solar" subMenu="usinas-index" >
            <Head title="Detalhes da Usina" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader
                    title={usina?.uc ? `UC ${usina.uc}` : `Usina #${usina?.id}`}
                    subheader={usina?.produtor?.name ?? "Produtor não informado"}
                    avatar={<IconSolarElectricity />}
                    action={
                        <Chip
                            label={usina?.status ?? "Sem status"}
                            color={usina?.status === "ativo" ? "success" : "default"}
                        />
                    }
                />

                <Divider />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Produtor</Typography>
                            <Typography>{usina?.produtor?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Consultor</Typography>
                            <Typography>{usina?.consultor?.name ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Concessionária</Typography>
                            <Typography>{usina?.concessionaria?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Typography variant="subtitle2">Grupo de Usina</Typography>
                            <Typography>{usina?.block?.nome ?? "Sem grupo"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Endereço</Typography>
                            <Typography>{addressLabel(usina?.address)}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">UC</Typography>
                            <Typography>{usina?.uc ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Média de Geração</Typography>
                            <Typography>{usina?.media_geracao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Potência da Usina</Typography>
                            <Typography>{usina?.potencia_usina ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Prazo de Locação</Typography>
                            <Typography>{usina?.prazo_locacao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Taxa de Comissão</Typography>
                            <Typography>{usina?.taxa_comissao ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Inversores</Typography>
                            <Typography>{usina?.inversores ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={12}>
                            <Typography variant="subtitle2">Módulos</Typography>
                            <Typography>{usina?.modulos ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <Card
                className="cv-card"
                sx={{
                    mb: 4,
                }}
            >

                <CardHeader
                    avatar={
                        <Avatar
                            sx={{
                                bgcolor: 'primary.main',
                            }}
                        >
                            <IconUsers size={22} />
                        </Avatar>
                    }
                    title="Clientes Relacionados"
                    subheader={`${usina?.active_client_links?.length || 0} clientes vinculados`}
                />

                <Divider />

                <CardContent>

                    {usina?.active_client_links?.length === 0 && (
                        <Typography color="text.secondary">
                            Nenhum cliente relacionado a esta usina.
                        </Typography>
                    )}

                    {usina?.active_client_links?.length > 0 && (

                        <TableContainer>

                            <Table>

                                <TableHead>

                                    <TableRow>

                                        <TableCell>
                                            Cliente
                                        </TableCell>

                                        <TableCell>
                                            Documento
                                        </TableCell>

                                        <TableCell>
                                            Energia Alocada
                                        </TableCell>

                                        <TableCell>
                                            Desconto
                                        </TableCell>

                                        <TableCell>
                                            Status
                                        </TableCell>

                                        <TableCell align="right">
                                            Ações
                                        </TableCell>

                                    </TableRow>

                                </TableHead>

                                <TableBody>

                                    {usina.active_client_links.map((link) => {

                                        const client = link.client_profile;

                                        return (
                                            <TableRow
                                                key={link.id}
                                                hover
                                            >

                                                <TableCell>

                                                    <Stack spacing={0.5}>

                                                        <Typography fontWeight={700}>
                                                            {
                                                                client?.nome
                                                                || client?.razao_social
                                                                || '-'
                                                            }
                                                        </Typography>

                                                        <Typography
                                                            variant="caption"
                                                            color="text.secondary"
                                                        >
                                                            {client?.email || '-'}
                                                        </Typography>

                                                    </Stack>

                                                </TableCell>

                                                <TableCell>

                                                    {
                                                        client?.cpf
                                                        || client?.cnpj
                                                        || '-'
                                                    }

                                                </TableCell>

                                                <TableCell>

                                                    {link?.allocated_energy_kwh || 0} kWh

                                                </TableCell>

                                                <TableCell>

                                                    {link?.discount_percentage || 0}%

                                                </TableCell>

                                                <TableCell>

                                                    <Chip
                                                        label={
                                                            link?.status || 'Sem status'
                                                        }
                                                        color={
                                                            link?.is_active
                                                                ? 'success'
                                                                : 'default'
                                                        }
                                                        size="small"
                                                    />

                                                </TableCell>

                                                <TableCell align="right">

                                                    <Link
                                                        href={route(
                                                            'consultor.user.cliente.show',
                                                            client?.id
                                                        )}
                                                    >

                                                        <Button
                                                            size="small"
                                                            variant="outlined"
                                                        >
                                                            Visualizar
                                                        </Button>

                                                    </Link>

                                                </TableCell>

                                            </TableRow>
                                        );
                                    })}

                                </TableBody>

                            </Table>

                        </TableContainer>

                    )}

                </CardContent>

            </Card>

            <div className="flex gap-2">
                <Link href={route("consultor.producer.usinas.index")}>
                    <Button startIcon={<IconArrowLeft />} variant="outlined">
                        Voltar
                    </Button>
                </Link>

                <Link href={route("consultor.producer.usinas.edit", usina.id)}>
                    <Button startIcon={<IconEdit />} color="warning" variant="outlined">
                        Editar
                    </Button>
                </Link>
            </div>
        </Layout>
    );
};

export default Page;
