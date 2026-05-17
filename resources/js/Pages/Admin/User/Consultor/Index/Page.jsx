import React from "react";

import { Link } from "@inertiajs/react";

import Layout from "@/Layouts/UserLayout/Layout.jsx";

import Grid from "@mui/material/Grid2";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Stack,
    Typography,
} from "@mui/material";

import {
    IconArrowRight,
    IconPlus,
    IconUser,
} from "@tabler/icons-react";

export default function Page({
                                 consultores = [],
                             }) {

    return (
        <Layout
            titlePage="Consultores"
            menu="consultores"
            subMenu="consultores-cadastrados"
        >

            <Stack spacing={3}>

                <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                >

                    <Grid>

                        <Box>

                            <Typography
                                variant="h3"
                                fontWeight={800}
                            >
                                Consultores
                            </Typography>

                        </Box>

                    </Grid>

                    <Grid>

                        <Link
                            href={route('admin.user.consultor.create')}
                        >

                            <Button
                                variant="contained"
                                size="large"
                                startIcon={<IconPlus size={20} />}
                            >
                                Novo Consultor
                            </Button>

                        </Link>

                    </Grid>

                </Grid>

                <Grid
                    container
                    spacing={3}
                >

                    {consultores.map((consultor) => (

                        <Grid
                            size={{
                                xs: 12,
                                md: 6,
                                xl: 4,
                            }}
                            key={consultor.id}
                        >

                            <Card
                                className="cv-card"
                                sx={{
                                    height: '100%',
                                }}
                            >

                                <CardContent>

                                    <Stack spacing={3}>

                                        <Stack
                                            direction="row"
                                            spacing={2}
                                            alignItems="center"
                                        >

                                            <Avatar
                                                sx={{
                                                    width: 64,
                                                    height: 64,
                                                    fontSize: 28,
                                                    fontWeight: 800,
                                                }}
                                            >
                                                <IconUser size={28} />
                                            </Avatar>

                                            <Box flex={1}>

                                                <Typography
                                                    variant="h5"
                                                    fontWeight={800}
                                                >
                                                    {consultor.nome}
                                                </Typography>

                                                <Typography
                                                    color="text.secondary"
                                                    fontSize={14}
                                                >
                                                    {consultor.email}
                                                </Typography>

                                            </Box>

                                        </Stack>

                                        <Grid
                                            container
                                            spacing={2}
                                        >

                                            <Grid size={6}>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Documento
                                                </Typography>

                                                <Typography
                                                    fontWeight={700}
                                                >
                                                    {
                                                        consultor.user_data?.cpf
                                                        || consultor.user_data?.cnpj
                                                        || '-'
                                                    }
                                                </Typography>

                                            </Grid>

                                            <Grid size={6}>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Status
                                                </Typography>

                                                <Box mt={0.5}>

                                                    <Chip
                                                        label={consultor.status_nome}
                                                        color={
                                                            consultor.status == 1
                                                                ? 'success'
                                                                : 'error'
                                                        }
                                                        size="small"
                                                    />

                                                </Box>

                                            </Grid>

                                        </Grid>

                                        <Grid
                                            container
                                            spacing={2}
                                        >

                                            <Grid size={6}>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Clientes
                                                </Typography>

                                                <Typography
                                                    variant="h5"
                                                    fontWeight={800}
                                                >
                                                    {consultor.clientes_count || 0}
                                                </Typography>

                                            </Grid>

                                            <Grid size={6}>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Produtores
                                                </Typography>

                                                <Typography
                                                    variant="h5"
                                                    fontWeight={800}
                                                >
                                                    {consultor.produtores_count || 0}
                                                </Typography>

                                            </Grid>

                                        </Grid>

                                        <Grid
                                            container
                                            spacing={2}
                                        >

                                            <Grid size={12}>

                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Celular
                                                </Typography>

                                                <Typography
                                                    fontWeight={700}
                                                >
                                                    {
                                                        consultor.contatos?.celular
                                                        || '-'
                                                    }
                                                </Typography>

                                            </Grid>

                                        </Grid>

                                        <Link
                                            href={route(
                                                'admin.user.consultor.show',
                                                consultor.id
                                            )}
                                        >

                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                endIcon={<IconArrowRight />}
                                            >
                                                Visualizar Consultor
                                            </Button>

                                        </Link>

                                    </Stack>

                                </CardContent>

                            </Card>

                        </Grid>

                    ))}

                    {consultores.length === 0 && (

                        <Grid size={12}>

                            <Card className="cv-card">

                                <CardContent>

                                    <Box
                                        py={8}
                                        textAlign="center"
                                    >

                                        <Typography
                                            variant="h5"
                                            fontWeight={700}
                                            mb={1}
                                        >
                                            Nenhum consultor encontrado
                                        </Typography>

                                        <Typography
                                            color="text.secondary"
                                        >
                                            Cadastre o primeiro consultor da plataforma.
                                        </Typography>

                                    </Box>

                                </CardContent>

                            </Card>

                        </Grid>

                    )}

                </Grid>

            </Stack>

        </Layout>
    )
}
