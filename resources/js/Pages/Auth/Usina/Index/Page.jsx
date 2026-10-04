import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {useEffect, useState} from "react";

import * as React from 'react';
import {Button, Card, CardContent, LinearProgress, Paper} from "@mui/material";
import Grid from "@mui/material/Grid2";
import TextInfo from "@/Components/DataDisplay/TextInfo.jsx";
import {Link} from "@inertiajs/react";
import {IconEye} from "@tabler/icons-react";

const Page = () => {

    const [usinas, setUsinas] = useState([])
    const [carregando, setCarregando] = useState(false)

    const fetchGet = async () => {
        setCarregando(true)

        try {
            const {data} = await axios.get(route('auth.usinas.api.get-all'))

            setUsinas(data)
        } finally {
            setCarregando(false)
        }
    }

    useEffect(() => {
        fetchGet()
    }, []);

    return (
        <Layout titlePage="Usinas Solares" menu="usinas" subMenu="usinas-cadastrados">
            <Card>
                <CardContent>

                    {carregando && <LinearProgress sx={{marginBlockEnd: 2}}/>}

                    {usinas.map(usina => (
                        <Link key={usina.id} href={route('auth.usinas.show', usina.id)}>
                            <Paper variant="outlined">
                                <Grid container>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <TextInfo title="Proprietário" text={usina.proprietario.nome}/>
                                    </Grid>
                                    {usina.proprietario?.user_data?.cnpj && <Grid size={{xs: 12, md: 3}}>
                                        <TextInfo title="CNPJ" text={usina.proprietario?.user_data?.cnpj}/>
                                    </Grid>}
                                    {usina.proprietario?.user_data?.cpf && <Grid size={{xs: 12, md: 3}}>
                                        <TextInfo title="CPF" text={usina.proprietario?.user_data?.cpf}/>
                                    </Grid>}
                                </Grid>

                                <TextInfo title="Consultor(a)" text={usina.consultor.nome}/>

                                <Grid container>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <TextInfo title="Concessionária" text={`${usina.concessionaria?.nome}/${usina.concessionaria.estado}`}/>
                                    </Grid>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <TextInfo title="Unidade Consumidora" text={usina.uc}/>
                                    </Grid>
                                </Grid>

                                <Grid container justifyContent="space-between">
                                    <Grid size={{xs: 12, md: 4}}>
                                        <TextInfo title="Potência da Usina" text={`${usina.potencia_usina} kWh`}/>
                                    </Grid>
                                    <Grid size={{xs: 12, md: 3}}>
                                        <TextInfo title="Média Geração" text={`${usina.media_geracao} kWh/mês`}/>
                                    </Grid>
                                    <Grid size={{xs: 12, md: 3}}>
                                        <TextInfo title="ID da Usina Solar" text={`#${usina.id}`}/>
                                    </Grid>
                                    <Grid size="auto" textAlign="end" alignItems="center">
                                        <Button size="small" startIcon={<IconEye/>}>Ver</Button>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Link>
                    ))}
                </CardContent>
            </Card>
        </Layout>
    )
}
export default Page
