import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {useState} from "react";
import {Head, useForm} from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControl,
    FormControlLabel,
    FormLabel, InputAdornment,
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
    IconUserPlus,
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

const Page = ({concessionarias = [], producers = [], selectedProducer = null}) => {
    const hasInitialSelectedProducers = !!selectedProducer?.id;
    const [showProducersForm, setShowProducersForm] = useState(hasInitialSelectedProducers);

    const {data, setData, post, processing, errors} = useForm({
        producer_profile_id: selectedProducer?.id ?? "",

        tipo_pessoa: selectedProducer?.tipo_pessoa ?? "pf",
        cpf: selectedProducer?.cpf ?? "",
        cnpj: selectedProducer?.cnpj ?? "",
        nome: selectedProducer?.nome ?? "",
        razao_social: selectedProducer?.razao_social ?? "",
        nome_fantasia: selectedProducer?.nome_fantasia ?? "",
        email: selectedProducer?.email ?? "",
        telefone: selectedProducer?.telefone ?? "",

        address: {...emptyAddress},

        concessionaria_id: "",
        potencia_usina: "",
        media_geracao: "",
        prazo_contrato: "",
        valor_investimento: "",
        unidade_consumidora: "",
        valid_until: "",
        notes: "",
    });

    const hasSelectedProducers = !!data.producer_profile_id;

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

    const resetProducersFields = () => {
        setData({
            ...data,
            producer_profile_id: "",
            tipo_pessoa: "pf",
            cpf: "",
            cnpj: "",
            nome: "",
            razao_social: "",
            nome_fantasia: "",
            email: "",
            telefone: "",
        });
    };

    const fillProducersData = (producersId) => {
        if (!producersId) {
            resetProducersFields();
            setShowProducersForm(true);
            return;
        }

        const producer = producers.find((item) => String(item.id) === String(producersId));

        setData({
            ...data,
            producer_profile_id: producersId,
            tipo_pessoa: producer?.tipo_pessoa ?? "pf",
            cpf: producer?.cpf ?? "",
            cnpj: producer?.cnpj ?? "",
            nome: producer?.nome ?? "",
            razao_social: producer?.razao_social ?? "",
            nome_fantasia: producer?.nome_fantasia ?? "",
            email: producer?.email ?? "",
            telefone: producer?.telefone ?? "",
        });

        setShowProducersForm(false);
    };

    const openProducersForm = () => {
        resetProducersFields();
        setShowProducersForm(true);
    };

    const getProducersLabel = (producers) => {
        const nome = producers?.nome || producers?.razao_social || producers?.nome_fantasia || "Produtor";
        const documento = producers?.cpf || producers?.cnpj || producers?.producer_code || "";

        return documento ? `${nome} - ${documento}` : nome;
    };

    const selectedProducersLabel = () => {

        const producer = selectedProducer ??
            producers.find(
                (item) => String(item.id) === String(data.producer_profile_id)
            );

        return producer
            ? getProducersLabel(producer)
            : "Produtor selecionado";
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("consultor.propostas.produtor.store"));
    };

    return (
        <Layout titlePage="Emitir Proposta Comercial" menu="produtores" subMenu="produtores-propostas" backPage>
            <Head title="Emitir Proposta Comercial"/>

            <form onSubmit={submit}>
                <Card sx={{marginBottom: 4}}>
                    <CardHeader title="Dados do Produtor" avatar={<IconUser/>}/>

                    <CardContent>
                        <Grid container spacing={3}>
                            {!hasInitialSelectedProducers && !showProducersForm && (
                                <Grid size={12}>
                                    <TextField
                                        label="Selecionar Produtor"
                                        value={data.producer_profile_id}
                                        onChange={(e) => fillProducersData(e.target.value)}
                                        error={!!errors.producer_profile_id}
                                        helperText={errors.producer_profile_id}
                                        select
                                        fullWidth
                                    >
                                        <MenuItem value="">Nenhum produtor selecionado</MenuItem>

                                        {producers.map((producer) => (
                                            <MenuItem key={producer.id} value={producer.id}>
                                                {getProducersLabel(producer)}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            )}

                            {!hasInitialSelectedProducers && !hasSelectedProducers && !showProducersForm && (
                                <Grid size={12}>
                                    <Button
                                        type="button"
                                        variant="outlined"
                                        startIcon={<IconUserPlus/>}
                                        onClick={openProducersForm}
                                    >
                                        Cadastrar novo produtor
                                    </Button>
                                </Grid>
                            )}

                            {showProducersForm && !hasSelectedProducers && (
                                <>
                                    <Grid size={12}>
                                        <FormControl>
                                            <FormLabel>Tipo de Pessoa</FormLabel>
                                            <RadioGroup
                                                row
                                                value={data.tipo_pessoa}
                                                onChange={(e) => setData("tipo_pessoa", e.target.value)}
                                            >
                                                <FormControlLabel value="pf" control={<Radio/>} label="Pessoa Física"/>
                                                <FormControlLabel value="pj" control={<Radio/>} label="Pessoa Jurídica"/>
                                            </RadioGroup>
                                        </FormControl>
                                    </Grid>

                                    {data.tipo_pessoa === "pf" && (
                                        <>
                                            <Grid size={{xs: 12, md: 4}}>
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

                                    <Grid size={{xs: 12, md: 6}}>
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

                                    <Grid size={{xs: 12, md: 4}}>
                                        <TextField
                                            label="Telefone"
                                            value={data.telefone}
                                            onChange={(e) => setData("telefone", e.target.value)}
                                            error={!!errors.telefone}
                                            helperText={errors.telefone}
                                            fullWidth
                                        />
                                    </Grid>

                                    {!hasInitialSelectedProducers && (
                                        <Grid size={12}>
                                            <Button
                                                type="button"
                                                variant="outlined"
                                                color="inherit"
                                                onClick={() => {
                                                    resetProducersFields();
                                                    setShowProducersForm(false);
                                                }}
                                            >
                                                Cancelar cadastro de produtor
                                            </Button>
                                        </Grid>
                                    )}
                                </>
                            )}

                            {hasSelectedProducers && (
                                <Grid size={12}>
                                    <TextField
                                        label="Produtor selecionado"
                                        value={selectedProducersLabel()}
                                        disabled
                                        fullWidth
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </CardContent>
                </Card>

                <Card sx={{marginBottom: 4}}>
                    <CardHeader title="Dados da Proposta" avatar={<IconFileText/>}/>

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 6}}>
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

                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Potência da Usina"
                                    value={data.potencia_usina}
                                    onChange={(e) => setData("potencia_usina", e.target.value)}
                                    error={!!errors.potencia_usina}
                                    helperText={errors.potencia_usina}
                                    type="number"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">kWp</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Média Geração Mensal"
                                    value={data.media_geracao}
                                    onChange={(e) => setData("media_geracao", e.target.value)}
                                    error={!!errors.media_geracao}
                                    helperText={errors.media_geracao}
                                    type="number"
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="start">kWh/mês</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{xs: 12, md: 4}}>
                                <TextField
                                    label="Prazo do Contrato"
                                    value={data.prazo_contrato}
                                    onChange={(e) => setData("prazo_contrato", e.target.value)}
                                    error={!!errors.prazo_contrato}
                                    helperText={errors.prazo_contrato}
                                    required
                                    select
                                    fullWidth
                                >
                                    <MenuItem value={12}>12 meses (1 ano)</MenuItem>
                                    <MenuItem value={24}>24 meses (2 anos)</MenuItem>
                                    <MenuItem value={36}>36 meses (3 anos)</MenuItem>
                                    <MenuItem value={48}>48 meses (4 anos)</MenuItem>
                                    <MenuItem value={60}>60 meses (5 anos)</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{xs: 12, md: 4}}>
                                <TextField
                                    label="Valor Investimento"
                                    value={data.valor_investimento}
                                    onChange={(e) => setData("valor_investimento", e.target.value)}
                                    error={!!errors.valor_investimento}
                                    helperText={errors.valor_investimento}
                                    type="number"
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        },
                                    }}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{xs: 12, md: 4}}>
                                <TextField
                                    label="Validade da Proposta"
                                    value={data.valid_until}
                                    onChange={(e) => setData("valid_until", e.target.value)}
                                    error={!!errors.valid_until}
                                    helperText={errors.valid_until}
                                    type="date"
                                    slotProps={{inputLabel: {shrink: true}}}
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
                    title="Endereço da Usina"
                    address={data.address}
                    setAddressData={setAddressData}
                    errors={errors}
                />

                <div className="text-center">
                    <Button
                        type="submit"
                        color="success"
                        startIcon={<IconDeviceFloppy/>}
                        disabled={processing}
                    >
                        Emitir Proposta
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;
