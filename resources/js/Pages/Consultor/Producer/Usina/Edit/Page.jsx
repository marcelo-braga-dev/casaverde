import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, router, useForm, usePage} from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader, InputAdornment, MenuItem, TextField } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconDeviceFloppy, IconSolarElectricity } from "@tabler/icons-react";
import AddressCard from "@/Components/Partials/AddressCard.jsx";

const Page = ({ usina = [], produtores = [], concessionarias = [], blocks = [], }) => {
    const { data, setData, post, processing, errors } = useForm({
        'usina_nome' : usina?.usina_nome,
        'producer_profile_id' : usina?.producer_profile_id,
        'concessionaria_id' : usina?.concessionaria_id,
        'usina_block_id' : usina?.usina_block_id,
        'uc' : usina?.uc,
        'media_geracao' : usina?.media_geracao,
        'potencia_usina' : usina?.potencia_usina,
        'prazo_locacao' : usina?.prazo_locacao,
        'inversores' : usina?.inversores,
        'modulos' : usina?.modulos,

        'address' : {
            cep: usina?.address?.cep,
            rua: usina?.address?.rua,
            numero: usina?.address?.numero,
            complemento: usina?.address?.complemento,
            bairro: usina?.address?.bairro,
            cidade: usina?.address?.cidade,
            estado: usina?.address?.estado,
            referencia: usina?.address?.referencia,
            latitude: usina?.address?.latitude,
            longitude: usina?.address?.longitude,
        },
    });
     const {props} = usePage()
    console.log(props)
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
        router.post(route("consultor.producer.usinas.update", usina.id), {_method: "PUT", ...data});
    };

    const addressLabel = (address) => {
        return `${address?.rua ?? ""}, ${address?.numero ?? ""} - ${address?.bairro ?? ""}, ${address?.cidade ?? ""}/${address?.estado ?? ""}`;
    };

    return (
        <Layout titlePage="Editar Usina" menu="usinas-solar" subMenu="usinas-index" backPage>
            <Head title="Editar Usina" />

            <form onSubmit={submit}>
                <Card sx={{ marginBottom: 4 }}>
                    <CardHeader title="Dados da Usina" avatar={<IconSolarElectricity />} />

                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    label="Nome da Usina"
                                    value={data.usina_nome}
                                    onChange={(e) => setData("usina_nome", e.target.value)}
                                    error={!!errors.usina_nome}
                                    helperText={errors.usina_nome}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Produtor Proprietário"
                                    value={data.producer_profile_id}
                                    onChange={(e) => setData("producer_profile_id", e.target.value)}
                                    error={!!errors.producer_profile_id}
                                    helperText={errors.producer_profile_id}
                                    select
                                    required
                                    fullWidth
                                >
                                    {produtores.map((produtor) => (
                                        <MenuItem key={produtor.id} value={produtor.id}>
                                            {produtor.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            {/*<Grid size={{ xs: 12, md: 6 }}>*/}
                            {/*    <TextField*/}
                            {/*        label="Consultor Responsável"*/}
                            {/*        value={data.consultor_user_id}*/}
                            {/*        onChange={(e) => setData("consultor_user_id", e.target.value)}*/}
                            {/*        error={!!errors.consultor_user_id}*/}
                            {/*        helperText={errors.consultor_user_id}*/}
                            {/*        select*/}
                            {/*        required*/}
                            {/*        fullWidth*/}
                            {/*    >*/}
                            {/*        {consultores.map((consultor) => (*/}
                            {/*            <MenuItem key={consultor.id} value={consultor.id}>*/}
                            {/*                {consultor.name}*/}
                            {/*            </MenuItem>*/}
                            {/*        ))}*/}
                            {/*    </TextField>*/}
                            {/*</Grid>*/}

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
                                    {concessionarias.map((item) => (
                                        <MenuItem key={item.id} value={item.id}>
                                            {item.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    label="Grupo de Usina"
                                    value={data.usina_block_id}
                                    onChange={(e) => setData("usina_block_id", e.target.value)}
                                    error={!!errors.usina_block_id}
                                    helperText={errors.usina_block_id}
                                    select
                                    fullWidth
                                >
                                    <MenuItem value="">Sem grupo</MenuItem>
                                    {blocks.map((block) => (
                                        <MenuItem key={block.id} value={block.id}>
                                            {block.nome}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="UC"
                                    value={data.uc}
                                    onChange={(e) => setData("uc", e.target.value)}
                                    error={!!errors.uc}
                                    helperText={errors.uc}
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Média de Geração"
                                    value={data.media_geracao}
                                    onChange={(e) => setData("media_geracao", e.target.value)}
                                    error={!!errors.media_geracao}
                                    helperText={errors.media_geracao}
                                    type="number"
                                    required
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">kWh/mês</InputAdornment>,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Potência da Usina"
                                    value={data.potencia_usina}
                                    onChange={(e) => setData("potencia_usina", e.target.value)}
                                    error={!!errors.potencia_usina}
                                    helperText={errors.potencia_usina}
                                    type="number"
                                    required
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="end">kWp</InputAdornment>,
                                        },
                                    }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Prazo de Locação"
                                    value={data.prazo_locacao}
                                    onChange={(e) => setData("prazo_locacao", e.target.value)}
                                    error={!!errors.prazo_locacao}
                                    helperText={errors.prazo_locacao}
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

                            <Grid size={12}>
                                <TextField
                                    label="Inversores"
                                    value={data.inversores}
                                    onChange={(e) => setData("inversores", e.target.value)}
                                    error={!!errors.inversores}
                                    helperText={errors.inversores}
                                    multiline
                                    rows={3}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={12}>
                                <TextField
                                    label="Módulos"
                                    value={data.modulos}
                                    onChange={(e) => setData("modulos", e.target.value)}
                                    error={!!errors.modulos}
                                    helperText={errors.modulos}
                                    multiline
                                    rows={3}
                                    required
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
                        startIcon={<IconDeviceFloppy />}
                        disabled={processing}
                    >
                        Atualizar Usina
                    </Button>
                </div>
            </form>
        </Layout>
    );
};

export default Page;
