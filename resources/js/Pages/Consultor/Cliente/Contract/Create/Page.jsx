import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    MenuItem,
    TextField,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconDeviceFloppy,
    IconFileCertificate,
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

const toDateInput = (value) => {
    if (!value) return "";

    if (String(value).includes("/")) {
        const [day, month, year] = String(value).split("/");
        return `${year}-${month}-${day}`;
    }

    return String(value).substring(0, 10);
};

const Page = ({ proposal, client }) => {
    const userData =
        client?.platform_user?.user_data ??
        client?.platformUser?.userData ??
        null;

    const address = proposal?.address ?? userData?.address ?? null;

    const { data, setData, post, processing, errors } = useForm({
        commercial_proposal_id: proposal?.id ?? "",
        status: "issued",
        issued_at: new Date().toISOString().substring(0, 10),
        signed_at: "",
        notes: "",

        tipo_pessoa: userData?.tipo_pessoa ?? client?.tipo_pessoa ?? "pf",

        nome: userData?.nome ?? client?.nome ?? "",
        cpf: userData?.cpf ?? client?.cpf ?? "",
        data_nascimento: toDateInput(userData?.data_nascimento),
        rg: userData?.rg ?? "",
        genero: userData?.genero ?? "",
        estado_civil: userData?.estado_civil ?? "",
        profissao: userData?.profissao ?? "",

        data_fundacao: toDateInput(userData?.data_fundacao),
        cnpj: userData?.cnpj ?? client?.cnpj ?? "",
        razao_social: userData?.razao_social ?? client?.razao_social ?? "",
        nome_fantasia: userData?.nome_fantasia ?? client?.nome_fantasia ?? "",
        tipo_empresa: userData?.tipo_empresa ?? "",
        ie: userData?.ie ?? "",
        im: userData?.im ?? "",
        ramo_atividade: userData?.ramo_atividade ?? "",

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

        post(route("consultor.cliente.contratos.store"));
    };

    return (
        <Layout titlePage="Emitir Contrato" menu="clientes" subMenu="contratos-index" backPage>
            <Head title="Emitir Contrato" />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Proposta Base" avatar={<IconFileText />} />
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Proposta</Typography>
                            <Typography>{proposal?.proposal_code ?? `#${proposal?.id}`}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Cliente</Typography>
                            <Typography>{client?.display_name ?? client?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Concessionária</Typography>
                            <Typography>{proposal?.concessionaria?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="subtitle2">Unidade Consumidora</Typography>
                            <Typography>{proposal?.unidade_consumidora ?? "Não informado"}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            <form onSubmit={submit}>
                <ContractFormFields
                    data={data}
                    setData={setData}
                    setAddressData={setAddressData}
                    errors={errors}
                    processing={processing}
                    buttonLabel="Emitir Contrato"
                />
            </form>
        </Layout>
    );
};

const ContractFormFields = ({
                                data,
                                setData,
                                setAddressData,
                                errors,
                                processing,
                                buttonLabel,
                            }) => {
    return (
        <>
            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Dados Contratuais do Cliente" avatar={<IconUser />} />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 3 }}>
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

                        {data.tipo_pessoa === "pf" && (
                            <>
                                <Grid size={{ xs: 12, md: 6 }}>
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

                                <Grid size={{ xs: 12, md: 3 }}>
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

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Data de Nascimento"
                                        type="date"
                                        value={data.data_nascimento}
                                        onChange={(e) => setData("data_nascimento", e.target.value)}
                                        error={!!errors.data_nascimento}
                                        helperText={errors.data_nascimento}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="RG"
                                        value={data.rg}
                                        onChange={(e) => setData("rg", e.target.value)}
                                        error={!!errors.rg}
                                        helperText={errors.rg}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Gênero"
                                        value={data.genero}
                                        onChange={(e) => setData("genero", e.target.value)}
                                        error={!!errors.genero}
                                        helperText={errors.genero}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Estado Civil"
                                        value={data.estado_civil}
                                        onChange={(e) => setData("estado_civil", e.target.value)}
                                        error={!!errors.estado_civil}
                                        helperText={errors.estado_civil}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Profissão"
                                        value={data.profissao}
                                        onChange={(e) => setData("profissao", e.target.value)}
                                        error={!!errors.profissao}
                                        helperText={errors.profissao}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        )}

                        {data.tipo_pessoa === "pj" && (
                            <>
                                <Grid size={{ xs: 12, md: 6 }}>
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

                                <Grid size={{ xs: 12, md: 3 }}>
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

                                <Grid size={{ xs: 12, md: 3 }}>
                                    <TextField
                                        label="Data de Fundação"
                                        type="date"
                                        value={data.data_fundacao}
                                        onChange={(e) => setData("data_fundacao", e.target.value)}
                                        error={!!errors.data_fundacao}
                                        helperText={errors.data_fundacao}
                                        slotProps={{ inputLabel: { shrink: true } }}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Nome Fantasia"
                                        value={data.nome_fantasia}
                                        onChange={(e) => setData("nome_fantasia", e.target.value)}
                                        error={!!errors.nome_fantasia}
                                        helperText={errors.nome_fantasia}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Tipo de Empresa"
                                        value={data.tipo_empresa}
                                        onChange={(e) => setData("tipo_empresa", e.target.value)}
                                        error={!!errors.tipo_empresa}
                                        helperText={errors.tipo_empresa}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <TextField
                                        label="Ramo de Atividade"
                                        value={data.ramo_atividade}
                                        onChange={(e) => setData("ramo_atividade", e.target.value)}
                                        error={!!errors.ramo_atividade}
                                        helperText={errors.ramo_atividade}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Inscrição Estadual"
                                        value={data.ie}
                                        onChange={(e) => setData("ie", e.target.value)}
                                        error={!!errors.ie}
                                        helperText={errors.ie}
                                        required
                                        fullWidth
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Inscrição Municipal"
                                        value={data.im}
                                        onChange={(e) => setData("im", e.target.value)}
                                        error={!!errors.im}
                                        helperText={errors.im}
                                        required
                                        fullWidth
                                    />
                                </Grid>
                            </>
                        )}
                    </Grid>
                </CardContent>
            </Card>

            <AddressCard
                address={data.address}
                setAddressData={setAddressData}
                errors={errors}
            />

            <Card sx={{ marginBottom: 4 }}>
                <CardHeader title="Dados do Contrato" avatar={<IconFileCertificate />} />

                <CardContent>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Status"
                                value={data.status}
                                onChange={(e) => setData("status", e.target.value)}
                                error={!!errors.status}
                                helperText={errors.status}
                                select
                                required
                                fullWidth
                            >
                                <MenuItem value="issued">Emitido</MenuItem>
                                <MenuItem value="signed">Assinado</MenuItem>
                                <MenuItem value="active">Ativo</MenuItem>
                                <MenuItem value="cancelled">Cancelado</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Data de Emissão"
                                type="date"
                                value={data.issued_at}
                                onChange={(e) => setData("issued_at", e.target.value)}
                                error={!!errors.issued_at}
                                helperText={errors.issued_at}
                                slotProps={{ inputLabel: { shrink: true } }}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                label="Data de Assinatura"
                                type="date"
                                value={data.signed_at}
                                onChange={(e) => setData("signed_at", e.target.value)}
                                error={!!errors.signed_at}
                                helperText={errors.signed_at}
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

            <div className="text-center">
                <Button
                    type="submit"
                    color="success"
                    startIcon={<IconDeviceFloppy />}
                    disabled={processing}
                >
                    {buttonLabel}
                </Button>
            </div>
        </>
    );
};

export default Page;
