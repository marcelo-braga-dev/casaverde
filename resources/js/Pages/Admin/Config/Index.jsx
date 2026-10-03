import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Button, Card, CardContent, CardHeader, InputAdornment, TextField} from "@mui/material";
import {IconCurrencyDollar} from "@tabler/icons-react";
import Grid from "@mui/material/Grid2";
import {router} from "@inertiajs/react";
import {useState} from "react";

const Page = ({taxaReducaoConta}) => {
    const [taxaReducao, setTaxaReducao] = useState(taxaReducaoConta)
    const updateTaxaReducaoConta = (e) => {
        e.preventDefault()
        router.post(route('admin.admin.config.api.update-taxa-reducao-conta', {taxaReducao}))
    }

    return (
        <Layout titlePage="Configurações Gerais" menu="config" subMenu="config-geral">
            <Grid container spacing={2}>
                <Grid size={{xs: 12, md: 4}}>
                    <Card>
                        <CardHeader title="Taxa Redução da Conta" avatar={<IconCurrencyDollar/>} disableTypography/>
                        <CardContent>
                            <form onSubmit={updateTaxaReducaoConta}>
                                <Grid container spacing={2}>
                                    <Grid size={{xs: 8}}>
                                        <TextField
                                            label="Taxa Redução da Conta"
                                            type="number"
                                            required
                                            onChange={e => setTaxaReducao(e.target.value)}
                                            value={taxaReducao}
                                            slotProps={{
                                                input: {
                                                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                                },
                                            }}
                                        />
                                    </Grid>
                                    <Grid size={{xs: 4}}>
                                        <Button type="submit" color="success">Salvar</Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Layout>
    )
}
export default Page
