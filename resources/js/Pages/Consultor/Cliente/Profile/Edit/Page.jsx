import React from "react";

import Layout from "@/Layouts/UserLayout/Layout.jsx";

import {Head, router, useForm} from "@inertiajs/react";

import {
    Button,
    Card,
    CardContent,
    CardHeader,
    MenuItem,
    Stack,
    TextField,
} from "@mui/material";

import Grid from "@mui/material/Grid2";

import {
    IconPhone,
    IconUserPlus,
} from "@tabler/icons-react";

const Page = ({client}) => {

    const {
        data, setData, processing, errors,
    } = useForm({
        tipo_pessoa: client?.tipo_pessoa,
        cpf: client?.cpf,
        cnpj: client?.cnpj,
        nome: client?.nome,
        razao_social: client?.razao_social,
        nome_fantasia: client?.nome_fantasia,
        celular: client?.contacts?.celular,
        telefone: client?.contacts?.telefone,
        email: client?.contacts?.email,
        client_profile: client?.id,
        id: client?.id,
    });

    const submit = (e) => {
        e.preventDefault();

        router.post(route("consultor.user.cliente.update", client.id), {_method: "PUT", ...data});
    };

    return (
        <Layout
            titlePage="Atualizar Cliente"
            menu="clientes"
            subMenu="cliente-index"
            backPage
        >
            <Head title="Atualizar Cliente"/>

            <form onSubmit={submit}>

                <Card
                    className="cv-card"
                    sx={{
                        marginBottom: 4,
                    }}
                >

                    <CardHeader
                        title="Dados do Cliente"
                        avatar={<IconUserPlus/>}
                    />

                    <CardContent>

                        <Grid
                            container
                            spacing={3}
                            marginBottom={3}
                        >

                            <Grid size={{xs: 12, md: 4}}>

                                <TextField
                                    label="Tipo de Pessoa"
                                    value={data.tipo_pessoa}
                                    onChange={(e) =>
                                        setData(
                                            "tipo_pessoa",
                                            e.target.value
                                        )
                                    }
                                    error={!!errors.tipo_pessoa}
                                    helperText={errors.tipo_pessoa}
                                    select
                                    required
                                    fullWidth
                                >

                                    <MenuItem value="pf">
                                        Pessoa Física
                                    </MenuItem>

                                    <MenuItem value="pj">
                                        Pessoa Jurídica
                                    </MenuItem>

                                </TextField>

                            </Grid>

                        </Grid>

                        <Grid
                            container
                            spacing={3}
                        >

                            {data.tipo_pessoa === "pf" && (
                                <>

                                    <Grid size={{xs: 12, md: 4}}>

                                        <TextField
                                            label="CPF"
                                            className="mask-cpf"
                                            value={data.cpf}
                                            onChange={(e) =>
                                                setData(
                                                    "cpf",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.cpf}
                                            helperText={errors.cpf}
                                            required
                                            fullWidth
                                        />

                                    </Grid>

                                    <Grid size={{xs: 12, md: 8}}>

                                        <TextField
                                            label="Nome Completo"
                                            value={data.nome}
                                            onChange={(e) =>
                                                setData(
                                                    "nome",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.nome}
                                            helperText={errors.nome}
                                            required
                                            fullWidth
                                        />

                                    </Grid>

                                </>
                            )}

                            {data.tipo_pessoa === "pj" && (
                                <>

                                    <Grid size={{xs: 12, md: 4}}>

                                        <TextField
                                            label="CNPJ"
                                            className="mask-cnpj"
                                            value={data.cnpj}
                                            onChange={(e) =>
                                                setData(
                                                    "cnpj",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.cnpj}
                                            helperText={errors.cnpj}
                                            required
                                            fullWidth
                                        />

                                    </Grid>

                                    <Grid size={{xs: 12, md: 8}}>

                                        <TextField
                                            label="Razão Social"
                                            value={data.razao_social}
                                            onChange={(e) =>
                                                setData(
                                                    "razao_social",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.razao_social}
                                            helperText={errors.razao_social}
                                            required
                                            fullWidth
                                        />

                                    </Grid>

                                    <Grid size={{xs: 12, md: 6}}>

                                        <TextField
                                            label="Nome Fantasia"
                                            value={data.nome_fantasia}
                                            onChange={(e) =>
                                                setData(
                                                    "nome_fantasia",
                                                    e.target.value
                                                )
                                            }
                                            error={!!errors.nome_fantasia}
                                            helperText={errors.nome_fantasia}
                                            fullWidth
                                        />

                                    </Grid>

                                </>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{marginBottom: 4}}>
                    <CardHeader title="Contatos" avatar={<IconPhone/>}/>

                    <CardContent>
                        <Grid container spacing={3} marginBottom={3}>
                            <Grid size={{xs: 12, md: 4}}>
                                <TextField
                                    label="Celular"
                                    value={data.celular}
                                    onChange={(e) => setData("celular", e.target.value)}
                                    className="mask-mobile"
                                    error={!!errors.celular}
                                    helperText={errors.celular}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <TextField
                                    label="Telefone"
                                    value={data.telefone}
                                    onChange={(e) => setData("telefone", e.target.value)}
                                    className="mask-phone"
                                    error={!!errors.telefone}
                                    helperText={errors.telefone}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <TextField
                                    label="Email"
                                    value={data.email}
                                    onChange={(e) => setData("email", e.target.value)}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    type="email"
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Stack
                    direction="row"
                    justifyContent="center"
                >

                    <Button
                        type="submit"
                        variant="contained"
                        size="large"
                        startIcon={<IconUserPlus/>}
                        disabled={processing}
                    >
                        Atualizar Cliente
                    </Button>

                </Stack>

            </form>
        </Layout>
    );
};

export default Page;
