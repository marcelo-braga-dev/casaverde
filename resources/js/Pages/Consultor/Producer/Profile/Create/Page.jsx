import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, router, useForm, usePage} from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader, Dialog, DialogActions, DialogContent, DialogTitle,
    MenuItem, Stack,
    TextField, Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconFileInvoice, IconPhone, IconUserBolt, IconUserPlus, IconX} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";

const Page = () => {
    const {data, setData, post, processing, errors} = useForm({
        tipo_pessoa: "pf",
        cpf: "",
        cnpj: "",
        nome: "",
        razao_social: "",
        nome_fantasia: "",
        cidade: "",
        email: "",
        telefone: "",
        consultor_user_id: "",
        status: "prospect",
    });

    const {props} = usePage();
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {

        if (props.flash?.producer_created) {
            setOpenModal(true);
        }

    }, [props.flash]);

    const goToProposal = () => {

        router.visit(
            route(
                'consultor.propostas.produtor.create',
                {
                    producer_profile_id: props.flash.producer_id,
                }
            )
        );
    };

    const goToClient = () => {
        router.visit(
            route('consultor.producer.profiles.show', props.flash.producer_id)
        );
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("consultor.producer.profiles.store"));
    };

    return (
        <Layout titlePage="Cadastrar Produtor" menu="produtores" subMenu="produtores-profile" backPage>
            <Head title="Cadastrar Produtor"/>

            <form onSubmit={submit}>
                <Card sx={{marginBottom: 4}}>
                    <CardHeader title="Dados do Produtor" avatar={<IconUserBolt/>}/>

                    <CardContent>
                        <Grid container spacing={3} marginBottom={3}>
                            <Grid size={{xs: 12, md: 4}}>
                                <TextField
                                    label="Tipo de Pessoa"
                                    value={data.tipo_pessoa}
                                    onChange={(e) => setData("tipo_pessoa", e.target.value)}
                                    error={!!errors.tipo_pessoa}
                                    helperText={errors.tipo_pessoa}
                                    select
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="pf">Pessoa Física</MenuItem>
                                    <MenuItem value="pj">Pessoa Jurídica</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            {data.tipo_pessoa === "pf" && (
                                <>
                                    <Grid size={{xs: 12, md: 4}}>
                                        <TextField
                                            label="CPF"
                                            className="mask-cpf"
                                            value={data.cpf}
                                            onChange={(e) => setData("cpf", e.target.value)}
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
                                            onChange={(e) => setData("nome", e.target.value)}
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
                                            onChange={(e) => setData("cnpj", e.target.value)}
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
                                            onChange={(e) => setData("razao_social", e.target.value)}
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
                                            onChange={(e) => setData("nome_fantasia", e.target.value)}
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

                <div className="text-center">
                    <Button
                        type="submit"
                        color="success"
                        startIcon={<IconUserPlus/>}
                        disabled={processing}
                    >
                        Cadastrar Produtor
                    </Button>
                </div>
            </form>

            <Dialog
                open={openModal}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{fontWeight: 800}}>
                    Produtor cadastrado com sucesso
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <Typography>
                            Deseja criar uma proposta comercial agora?
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{p: 3}}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<IconX size={18}/>}
                        onClick={goToClient}
                    >
                        Não
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<IconFileInvoice size={18}/>}
                        onClick={goToProposal}
                    >
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default Page;
