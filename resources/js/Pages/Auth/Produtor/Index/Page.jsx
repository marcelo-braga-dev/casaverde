import {Link} from "@inertiajs/react";
import {Button, Card, CardContent, Divider, LinearProgress, Pagination, Stack, Typography} from "@mui/material";
import Layout from "@/Layouts/UserLayout/Layout.jsx";
import Grid from "@mui/material/Grid2";
import {IconPlus} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import TextInfo from "@/Components/DataDisplay/TextInfo.jsx";

const Page = () => {
    const [produtores, setProdutores] = useState([])
    const [carregando, setCarregando] = useState(true)

    useEffect(() => {
        fetchProdutores()
    }, []);

    const fetchProdutores = async () => {
        const response = await axios.get(route('auth.produtor.api.get-all'))
            .finally(() => setCarregando(false))
        setProdutores(response.data)
    }

    return (
        <Layout titlePage="Produtores Solar" menu="produtores-solar" subMenu="produtores-solar-cadastrados">

            <Card sx={{marginBottom: 3}}>
                <CardContent>
                    <Link href={route('auth.produtor.proposta.create')}>
                        <Button color="warning" startIcon={<IconPlus/>}>Cadastrar Produtor e Emitir Proposta</Button>
                    </Link>
                </CardContent>
            </Card>

            <Grid container spacing={2} justifyContent="space-between" alignItems="center">
                <Grid>
                    <Typography variant="h5" marginBottom={3}>Todos os Produtores Solar Cadastrados</Typography>
                </Grid>
            </Grid>

            {carregando && <LinearProgress color="inherit"/>}

            {produtores.length === 0 && !carregando && <Typography>Nenhum Produtor Cadastrado.</Typography>}

            {produtores.map(item => (
                <Card key={item.id} sx={{marginBottom: 3}}>
                    <CardContent>
                        <Link href={route('auth.produtor.show', item.id)}>
                            <Grid container justifyContent="space-between" marginBottom={2}>
                                <Grid size={{xs: 12, md: 6}}>
                                    <Stack spacing={2}>
                                        {item?.user_data?.nome && <TextInfo title="Nome" text={item.user_data.nome}/>}
                                        {item?.user_data?.razao_social && <TextInfo title="Razão Social" text={item.user_data.razao_social}/>}
                                        {item?.user_data?.nome_fantasia && <TextInfo title="Nome Fantasia" text={item?.user_data?.nome_fantasia}/>}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent="space-between">
                                <Grid size={{xs: 12, md: 6}}>
                                    <Stack spacing={2}>
                                        {item?.user_data?.cnpj && <TextInfo title="CNPJ" text={item?.user_data?.cnpj}/>}
                                        {item?.endereco?.cidade_estado && <TextInfo title="Localização" text={item?.endereco?.cidade_estado}/>}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Grid container justifyContent="space-between">
                                <Grid size={{xs: 12, md: 6}}>
                                    <Stack spacing={2}>
                                        {item.status_nome && <TextInfo title="Status" text={item.status_nome}/>}
                                        {item.id && <TextInfo title="Matrícula" text={item.id}/>}
                                    </Stack>
                                </Grid>
                            </Grid>

                            <Divider sx={{marginBlock: 1}}/>
                            <Grid container>
                                <Grid size={{xs: 12, md: 6}}>
                                    {item?.consultor?.nome && <TextInfo title="Consultor" text={item?.consultor?.nome}/>}
                                </Grid>
                            </Grid>

                        </Link>
                    </CardContent>
                </Card>
            ))}

            <Grid container marginBottom={2} justifyContent="center">
                <Grid size="auto">
                    <Pagination count={1}/>
                </Grid>
            </Grid>
        </Layout>
    )
}
export default Page
