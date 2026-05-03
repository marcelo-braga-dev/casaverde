import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, router, useForm} from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    FormLabel,
    MenuItem,
    Radio,
    RadioGroup,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconDeviceFloppy,
    IconFileText,
    IconUser,
} from "@tabler/icons-react";
import AddressCard from "@/Components/Partials/AddressCard.jsx";

const emptyAddress = {
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    referencia: "",
    latitude: "",
    longitude: "",
};

const Page = ({ proposal, concessionarias = [] }) => {
    const client = proposal?.client_profile;
    const address = proposal?.address;

    const { data, setData, processing, errors } = useForm({
        tipo_pessoa: client?.tipo_pessoa ?? "pf",
        cpf: client?.cpf ?? "",
        cnpj: client?.cnpj ?? "",
        nome: client?.nome ?? "",
        razao_social: client?.razao_social ?? "",
        nome_fantasia: client?.nome_fantasia ?? "",
        email: client?.email ?? "",
        telefone: client?.telefone ?? "",

        address: {
            ...emptyAddress,
            cep: address?.cep ?? "",
            rua: address?.rua ?? "",
            numero: address?.numero ?? "",
            complemento: address?.complemento ?? "",
            bairro: address?.bairro ?? "",
            cidade: address?.cidade ?? "",
            estado: address?.estado ?? "",
            referencia: address?.referencia ?? "",
            latitude: address?.latitude ?? "",
            longitude: address?.longitude ?? "",
        },

        concessionaria_id: proposal?.concessionaria_id ?? "",
        media_consumo: proposal?.media_consumo ?? "",
        taxa_reducao: proposal?.taxa_reducao ?? "",
        prazo_locacao: proposal?.prazo_locacao ?? "",
        valor_medio: proposal?.valor_medio ?? "",
        unidade_consumidora: proposal?.unidade_consumidora ?? "",
        valid_until: proposal?.valid_until ? String(proposal.valid_until).substring(0, 10) : "",
        notes: proposal?.notes ?? "",
    });

    const setAddressData = (field, value) => {
        if (typeof field === "object") {
            setData("address", {
                ...data.address,
                ...field,
            });

            return;
        }

        setData("address", {
            ...data.address,
            [field]: value,
        });
    };

    const submit = (e) => {
        e.preventDefault();

        router.post(route("consultor.propostas.cliente.update", proposal.id), {...data, _method: "PUT"});
    };

    return (
        <Layout titlePage="Editar Proposta Comercial" menu="clientes" subMenu="propostas-cliente-index" backPage>
            <Head title="Editar Proposta Comercial" />

            <form onSubmit={submit}>
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados do Cliente" avatar={<IconUser />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={12}>
                                <FormControl>
                                    <FormLabel>Tipo de Pessoa</FormLabel>
                                    <RadioGroup
                                        row
                                        value={data.tipo_pessoa}
                                        onChange={(e) => setData("tipo_pessoa", e.target.value)}
                                    >
                                        <FormControlLabel value="pf" control={<Radio />} label="Pessoa Física" />
                                        <FormControlLabel value="pj" control={<Radio />} label="Pessoa Jurídica" />
                                    </RadioGroup>
                                </FormControl>
                            </Grid>

                            {data.tipo_pessoa === "pf" && (
                                <>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CPF"
                                            value={data.cpf}
                                            onChange={(e) => setData("cpf", e.target.value)}
                                            error={!!errors.cpf}
                                            helperText={errors.cpf}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 8 }}>
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
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <TextField
                                            label="CNPJ"
                                            value={data.cnpj}
                                            onChange={(e) => setData("cnpj", e.target.value)}
                                            error={!!errors.cnpj}
                                            helperText={errors.cnpj}
                                            required
                                            fullWidth
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 8 }}>
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

                                    <Grid size={{ xs: 12, md: 6 }}>
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

                            <Grid size={{ xs: 12, md: 4 }}>
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

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Telefone"
                                    value={data.telefone}
                                    onChange={(e) => setData("telefone", e.target.value)}
                                    error={!!errors.telefone}
                                    helperText={errors.telefone}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados da Proposta" avatar={<IconFileText />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Concessionária"
                                    value={data.concessionaria_id}
                                    onChange={(e) => setData("concessionaria_id", e.target.value)}
                                    error={!!errors.concessionaria_id}
                                    helperText={errors.concessionaria_id}
                                    select
                                    required
                                    fullWidth
                                >
                                    {concessionarias.map((concessionaria) => (
                                        <MenuItem key={concessionaria.id} value={concessionaria.id}>
                                            {concessionaria.nome}
                                            {concessionaria.estado ? ` - ${concessionaria.estado}` : ""}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Média de Consumo"
                                    value={data.media_consumo}
                                    onChange={(e) => setData("media_consumo", e.target.value)}
                                    error={!!errors.media_consumo}
                                    helperText={errors.media_consumo}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 3 }}>
                                <TextField
                                    label="Taxa de Redução (%)"
                                    value={data.taxa_reducao}
                                    onChange={(e) => setData("taxa_reducao", e.target.value)}
                                    error={!!errors.taxa_reducao}
                                    helperText={errors.taxa_reducao}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Prazo de Locação"
                                    value={data.prazo_locacao}
                                    onChange={(e) => setData("prazo_locacao", e.target.value)}
                                    error={!!errors.prazo_locacao}
                                    helperText={errors.prazo_locacao}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Valor Médio"
                                    value={data.valor_medio}
                                    onChange={(e) => setData("valor_medio", e.target.value)}
                                    error={!!errors.valor_medio}
                                    helperText={errors.valor_medio}
                                    type="number"
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Unidade Consumidora"
                                    value={data.unidade_consumidora}
                                    onChange={(e) => setData("unidade_consumidora", e.target.value)}
                                    error={!!errors.unidade_consumidora}
                                    helperText={errors.unidade_consumidora}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Validade da Proposta"
                                    value={data.valid_until}
                                    onChange={(e) => setData("valid_until", e.target.value)}
                                    error={!!errors.valid_until}
                                    helperText={errors.valid_until}
                                    type="date"
                                    slotProps={{ inputLabel: { shrink: true } }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Observações"
                                    value={data.notes}
                                    onChange={(e) => setData("notes", e.target.value)}
                                    error={!!errors.notes}
                                    helperText={errors.notes}
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <AddressCard
                    address={data.address}
                    setAddressData={setAddressData}
                    errors={errors}
                />

                <div className="text-center">
                    <Button
                        type="submit"
                        color="success"
                        startIcon={<IconDeviceFloppy />}
                        disabled={processing}
                    >
                        Atualizar Proposta
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;
