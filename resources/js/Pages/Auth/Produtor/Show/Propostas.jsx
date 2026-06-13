import Grid from "@mui/material/Grid2";
import {Button, Divider, Paper, Stack, Typography} from "@mui/material";
import {IconFileTypePdf} from "@tabler/icons-react";
import {Link} from "@inertiajs/react";
import Box from "@mui/material/Box";
import React, {useEffect, useState} from "react";
import formatCurrency from "@/Utils/formatCurrency.js";

const Propostas = () => {
    const [propostas, setPropostas] = useState([])

    useEffect(() => {
        getRegistros()
    }, []);

    const getRegistros = async () => {
        const response = await axios.get(route('auth.produtor.proposta.api.get-produtor', 80))
        setPropostas(response.data)
    }

    return (
        <Box>
            <Grid container marginBottom={4}>
                <Grid>
                    <Link href={route('auth.produtor.proposta.create')}>
                        <Button color="error" startIcon={<IconFileTypePdf/>}>Gerar Proposta</Button>
                    </Link>
                </Grid>
            </Grid>

            <Typography variant="h5">Propostas Geradas</Typography>

            {propostas.length === 0 && <Paper variant="outlined" sx={{padding: 2, marginBottom: 4}}>
                <Typography variant="body2">Não há histórico de propostas geradas.</Typography>
            </Paper>}

            {propostas.map(item => (
                <Link key={item.id} href={route('auth.produtor.proposta.show', item.id)}>
                    <Paper variant="outlined" sx={{padding: 2, marginBottom: 4}}>
                        <Grid container justifyContent="space-between">
                            <Grid size={12}>
                                <Stack marginBottom={1}>
                                    {item.produtor.user_data.nome && <Stack direction="row" spacing={2}>
                                        <Typography fontWeight="bold">Nome:</Typography>
                                        <Typography>{item.produtor.user_data.nome}</Typography>
                                    </Stack>}
                                    {item.produtor.user_data.nome_fantasia && <Stack direction="row" spacing={2}>
                                        <Typography fontWeight="bold">Nome Fantasia:</Typography>
                                        <Typography>{item.produtor.user_data.nome_fantasia}</Typography>
                                    </Stack>}
                                    {item.produtor.user_data.razao_social && <Stack direction="row" spacing={2}>
                                        <Typography fontWeight="bold">Razão Social:</Typography>
                                        <Typography>{item.produtor.user_data.razao_social}</Typography>
                                    </Stack>}
                                </Stack>

                                <Grid container>
                                    <Grid size={{xs: 12, md: 6}}>
                                        {item.produtor.user_data.cnpj && <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold">CNPJ:</Typography>
                                            <Typography>{item.produtor.user_data.cnpj}</Typography>
                                        </Stack>}
                                        {item.produtor.user_data.cpf && <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold">CPF:</Typography>
                                            <Typography>{item.produtor.user_data.cpf}</Typography>
                                        </Stack>}
                                    </Grid>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold">Localização:</Typography>
                                            <Typography>{item?.endereco?.cidade_estado}</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Divider sx={{marginBlock: 1}}/>

                                <Grid container>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold">Média Geração:</Typography>
                                            <Typography>{item.geracao} kWh/mês</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold">Potência da Usina:</Typography>
                                            <Typography>{item.potencia} kWp</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Divider sx={{marginBlock: 1}}/>

                                <Grid container>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold">Valor da Proposta:</Typography>
                                            <Typography>{formatCurrency(item.valor_investimento)}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{xs: 12, md: 6}}>
                                        <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold">Concessionária:</Typography>
                                            <Typography>{item.concessionaria?.nome} / {item.concessionaria.estado}</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>

                                <Divider sx={{marginBlock: 1}}/>

                                <Grid container justifyContent="space-between">
                                    <Grid size={{xs: 12, md: 'auto'}}>
                                        <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold" variant="body2">Id da proposta:</Typography>
                                            <Typography variant="body2">#{item.id}</Typography>
                                        </Stack>
                                    </Grid>
                                    <Grid size={{xs: 12, md: 'auto'}}>
                                        <Stack direction="row" spacing={2}>
                                            <Typography fontWeight="bold" variant="body2">Criado em:</Typography>
                                            <Typography variant="body2">{item.criado_em}</Typography>
                                        </Stack>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                </Link>
            ))}

        </Box>)
}
export default Propostas
