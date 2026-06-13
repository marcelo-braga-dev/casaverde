import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, useForm} from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    InputAdornment,
    MenuItem,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconDeviceFloppy, IconSettings } from "@tabler/icons-react";
import formatarMoneyReal from "@/Utils/Formatters/formatarMoney.js";

export default function Page() {
    const { data, setData, post, processing, errors } = useForm({
        nome: "",
        tarifa_gd2: "",
        estado: "",
        status: "ativo",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.concessionaria.store"));
    };

    return (
        <Layout titlePage="Nova Concessionária" menu="concessionarias" subMenu="concessionarias-index" backPage>
            <Head title="Nova Concessionária" />

            <Card>
                <CardHeader title="Cadastrar Concessionária" avatar={<IconSettings />} />

                <CardContent>
                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Nome"
                                    value={data.nome}
                                    onChange={(e) => setData("nome", e.target.value)}
                                    error={!!errors.nome}
                                    helperText={errors.nome}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    label="Tarifa GD2"
                                    value={data.tarifa_gd2}
                                    onChange={(e) => setData("tarifa_gd2", formatarMoneyReal(e.target.value))}
                                    error={!!errors.tarifa_gd2}
                                    helperText={errors.tarifa_gd2}
                                    slotProps={{
                                        input: {
                                            startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                                        },
                                    }}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    label="Estado"
                                    value={data.estado}
                                    onChange={(e) => setData("estado", e.target.value.toUpperCase())}
                                    error={!!errors.estado}
                                    helperText={errors.estado}
                                    inputProps={{ maxLength: 2 }}
                                    required
                                    fullWidth
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 2 }}>
                                <TextField
                                    select
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    error={!!errors.status}
                                    helperText={errors.status}
                                    required
                                    fullWidth
                                >
                                    <MenuItem value="ativo">Ativo</MenuItem>
                                    <MenuItem value="inativo">Inativo</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={12}>
                                <Button
                                    type="submit"
                                    color="success"
                                    variant="contained"
                                    startIcon={<IconDeviceFloppy />}
                                    disabled={processing}
                                >
                                    Cadastrar
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
}
