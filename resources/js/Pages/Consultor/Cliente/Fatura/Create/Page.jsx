import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { IconDeviceFloppy, IconFileInvoice, IconX } from "@tabler/icons-react";
import { useMemo } from "react";

const Page = ({ concessionarias = [], usinas = [], clients = [], consumerUnits = [] }) => {
    const { data, setData, post, processing, errors } = useForm({
        concessionaria_id: "",
        usina_id: "",
        client_profile_id: "",
        consumer_unit_id: "",
        import_source: "manual",
        pdf: null,
    });

    const clientConsumerUnits = useMemo(
        () =>
            consumerUnits.filter(
                (uc) => String(uc.client_profile_id) === String(data.client_profile_id)
            ),
        [consumerUnits, data.client_profile_id]
    );

    const handleClientChange = (clientProfileId) => {
        setData((current) => ({
            ...current,
            client_profile_id: clientProfileId,
            consumer_unit_id: "",
        }));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("consultor.cliente.faturas.store"), {
            forceFormData: true,
        });
    };

    return (
        <Layout titlePage="Cadastrar Fatura de Concessionária" menu="financeiro" subMenu="financeiro-faturas" backPage>
            <Head title="Cadastrar Fatura de Concessionária" />

            <Card>
                <CardHeader title="Dados da Fatura de Concessionária" avatar={<IconFileInvoice />} />

                <CardContent>
                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(errors.concessionaria_id)}>
                                    <InputLabel>Concessionária</InputLabel>
                                    <Select
                                        label="Concessionária"
                                        value={data.concessionaria_id}
                                        onChange={(e) => setData("concessionaria_id", e.target.value)}
                                    >
                                        <MenuItem value="">Selecione</MenuItem>
                                        {concessionarias.map((item) => (
                                            <MenuItem key={item.id} value={item.id}>
                                                {item.nome}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth error={Boolean(errors.usina_id)}>
                                    <InputLabel>Usina</InputLabel>
                                    <Select
                                        label="Usina"
                                        value={data.usina_id}
                                        onChange={(e) => setData("usina_id", e.target.value)}
                                    >
                                        <MenuItem value="">Selecione</MenuItem>
                                        {usinas.map((usina) => (
                                            <MenuItem key={usina.id} value={usina.id}>
                                                UC {usina.uc || usina.id}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <FormControl fullWidth error={Boolean(errors.client_profile_id)}>
                                    <InputLabel>Cliente</InputLabel>
                                    <Select
                                        label="Cliente"
                                        value={data.client_profile_id}
                                        onChange={(e) => handleClientChange(e.target.value)}
                                    >
                                        <MenuItem value="">Selecione</MenuItem>
                                        {clients.map((client) => (
                                            <MenuItem key={client.id} value={client.id}>
                                                {client.client_code ? `${client.client_code} - ` : ""}
                                                {client.nome ||
                                                    client.razao_social ||
                                                    client.cpf ||
                                                    client.cnpj ||
                                                    `Cliente #${client.id}`}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth error={Boolean(errors.consumer_unit_id)} disabled={!data.client_profile_id}>
                                    <InputLabel>Unidade Consumidora</InputLabel>
                                    <Select
                                        label="Unidade Consumidora"
                                        value={data.consumer_unit_id}
                                        onChange={(e) => setData("consumer_unit_id", e.target.value)}
                                    >
                                        <MenuItem value="">A identificar pelo PDF</MenuItem>
                                        {clientConsumerUnits.map((uc) => (
                                            <MenuItem key={uc.id} value={uc.id}>
                                                {uc.display_label || uc.uc_code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <FormControl fullWidth error={Boolean(errors.import_source)}>
                                    <InputLabel>Origem</InputLabel>
                                    <Select
                                        label="Origem"
                                        value={data.import_source}
                                        onChange={(e) => setData("import_source", e.target.value)}
                                    >
                                        <MenuItem value="manual">Manual</MenuItem>
                                        <MenuItem value="email">E-mail</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="file"
                                    label="PDF da fatura de concessionária"
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ accept: "application/pdf" }}
                                    error={Boolean(errors.pdf)}
                                    helperText={errors.pdf}
                                    onChange={(e) => setData("pdf", e.target.files[0])}
                                />
                            </Grid>

                            <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
                                <Link href={route("admin.relatorios.faturas")}>
                                    <Button color="inherit" startIcon={<IconX />}>
                                        Cancelar
                                    </Button>
                                </Link>

                                <Button
                                    type="submit"
                                    color="success"
                                    variant="contained"
                                    disabled={processing}
                                    startIcon={<IconDeviceFloppy />}
                                >
                                    Salvar Fatura de Concessionária
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Page;
