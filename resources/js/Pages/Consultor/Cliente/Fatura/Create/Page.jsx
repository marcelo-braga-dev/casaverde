import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Grid,
    TextField,
} from "@mui/material";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";
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
                                <SearchableSelect
                                    fullWidth
                                    label="Concessionária"
                                    value={data.concessionaria_id}
                                    onChange={(value) => setData("concessionaria_id", value)}
                                    options={concessionarias.map((item) => ({ value: item.id, label: item.nome }))}
                                    error={Boolean(errors.concessionaria_id)}
                                    helperText={errors.concessionaria_id}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <SearchableSelect
                                    fullWidth
                                    label="Usina"
                                    value={data.usina_id}
                                    onChange={(value) => setData("usina_id", value)}
                                    options={usinas.map((usina) => ({ value: usina.id, label: `UC ${usina.uc || usina.id}` }))}
                                    error={Boolean(errors.usina_id)}
                                    helperText={errors.usina_id}
                                />
                            </Grid>

                            <Grid item xs={12} md={8}>
                                <SearchableSelect
                                    fullWidth
                                    label="Cliente"
                                    value={data.client_profile_id}
                                    onChange={handleClientChange}
                                    options={clients.map((client) => ({
                                        value: client.id,
                                        label: `${client.client_code ? `${client.client_code} - ` : ""}${
                                            client.nome ||
                                            client.razao_social ||
                                            client.cpf ||
                                            client.cnpj ||
                                            `Cliente #${client.id}`
                                        }`,
                                    }))}
                                    error={Boolean(errors.client_profile_id)}
                                    helperText={errors.client_profile_id}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <SearchableSelect
                                    fullWidth
                                    disabled={!data.client_profile_id}
                                    label="Unidade Consumidora"
                                    value={data.consumer_unit_id}
                                    onChange={(value) => setData("consumer_unit_id", value)}
                                    options={[
                                        { value: "", label: "A identificar pelo PDF" },
                                        ...clientConsumerUnits.map((uc) => ({ value: uc.id, label: uc.display_label || uc.uc_code })),
                                    ]}
                                    error={Boolean(errors.consumer_unit_id)}
                                    helperText={errors.consumer_unit_id}
                                />
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <SearchableSelect
                                    fullWidth
                                    disableClearable
                                    label="Origem"
                                    value={data.import_source}
                                    onChange={(value) => setData("import_source", value)}
                                    options={[
                                        { value: "manual", label: "Manual" },
                                        { value: "email", label: "E-mail" },
                                    ]}
                                    error={Boolean(errors.import_source)}
                                    helperText={errors.import_source}
                                />
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
