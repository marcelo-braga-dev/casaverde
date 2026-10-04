import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {router, useForm} from "@inertiajs/react";

import {Button, Paper} from "@mui/material";
import {IconPlus} from "@tabler/icons-react";

import DadosPessoais from "@/Components/UserData/DadosPessoais.jsx";
import Endereco from "@/Components/UserData/Endereco.jsx";
import Contato from "@/Components/UserData/Contato.jsx";
import DadosAcesso from "@/Components/UserData/DadosAcesso.jsx";
import Box from "@mui/material/Box";
import {useState} from "react";
import Grid from "@mui/material/Grid2";

const Page = () => {
    const [enderecoCliente, setEnderecoCliente] = useState({});

    const {data, setData} = useForm({
        tipo_pessoa: 'pj'
    })

    const submit = (e) => {
        e.preventDefault()
        router.post(route('auth.cliente.store'),
            {...data, endereco: enderecoCliente})
    }

    return (
        <Layout titlePage="Cadastro de Cliente Consumidor" menu="clientes" subMenu="clientes-cadastrados" backPage>

            <form onSubmit={submit}>
                <Box>
                    <DadosPessoais data={data} setData={setData}/>
                    <Endereco title="Endereço do Cliente" endereco={enderecoCliente} setEndereco={setEnderecoCliente}/>
                    <Contato data={data} setData={setData}/>
                    <DadosAcesso data={data} setData={setData}/>

                    <Paper sx={{padding: 2}}>
                        <Grid container justifyContent="center">
                            <Grid/>
                            <Grid>
                                <Button type="submit" startIcon={<IconPlus/>}>
                                    Cadastrar Cliente
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Box>
            </form>
        </Layout>
    )
}
export default Page
