import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {useEffect, useState} from "react";
import Endereco from "@/Components/UserData/Endereco.jsx";
import ConsumoDados from "./ConsumoDados.jsx";
import {router, useForm} from "@inertiajs/react";
import PropostaCard from "@/Pages/Auth/Cliente/Proposta/Create/PropostaCard.jsx";
import DadosPessoais from "@/Components/UserData/DadosPessoais.jsx";
import Contato from "@/Components/UserData/Contato.jsx";
import {Button, Card, CardContent, CardHeader, MenuItem, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconClipboardText, IconUserPlus} from "@tabler/icons-react";

const Page = () => {
    const [endereco, setEndereco] = useState({})
    const [clientes, setClientes] = useState([])
    const [cadastrarCliente, setCadastrarCliente] = useState(false)
    const [error, setError] = useState(false)

    const {data, setData} = useForm({
        tipo_pessoa: 'pj'
    })

    useEffect(() => {
        getClientes()
    }, []);

    const getClientes = async () => {
        const response = await axios.get(route('auth.cliente.api.get'))
        setClientes(response.data.data)
    }

    const submit = (e) => {
        e.preventDefault()
        router.post(route('auth.cliente.proposta.store'), {...data, endereco})
    }

    const verificarUsuarioExistente = (valor) => {
        const resultado = clientes.find(cliente => cliente.user_data?.cnpj === valor || cliente.user_data?.cpf === valor);

        if (resultado) {
            setData('cliente_id', resultado.id)
            setCadastrarCliente(false)
            setError(true)
        }
    }

    return (
        <Layout titlePage="Gerar Proposta - Cliente Consumidor" menu="clientes" subMenu="clientes-propostas" backPage>
            <form onSubmit={submit}>

                {cadastrarCliente && <Card sx={{marginBottom: 4}}>
                    <CardContent>
                        <Grid container spacing={2}>
                            <Grid size={{xs: 12, md: 12}}>
                                <Button
                                    color="warning"
                                    startIcon={<IconUserPlus/>}
                                    onClick={() => setCadastrarCliente(e => !e)}
                                    variant="outlined"
                                >
                                    Selecionar Cliente Já Cadastrado
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>}

                {!cadastrarCliente && <Card sx={{marginBottom: 4}}>
                    <CardHeader title="Dados do Cliente" avatar={<IconClipboardText/>}/>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextField
                                    label="Selecione o Cliente Consumidor..."
                                    value={data.cliente_id}
                                    select
                                    required
                                    onChange={e => setData('cliente_id', e.target.value)}
                                    fullWidth
                                >
                                    {clientes.map(item => {
                                        const doc = item?.user_data?.cnpj ?? item?.user_data?.cpf;
                                        return <MenuItem value={item.id} key={item.id}>{item.nome} ({doc})</MenuItem>
                                    })}
                                </TextField>
                            </Grid>
                            <Grid size={{xs: 12, md: 4}}>
                                <Button
                                    color="warning"
                                    startIcon={<IconUserPlus/>}
                                    onClick={() => setCadastrarCliente(prev => !prev)}
                                    variant={cadastrarCliente ? "contained" : "outlined"}
                                >
                                    Cadastrar Novo Cliente
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>}

                {cadastrarCliente && <DadosPessoais data={data} setData={setData} title="Dados do Cliente" verificarUsuarioExistente={verificarUsuarioExistente}/>}

                {cadastrarCliente && <Contato data={data} setData={setData}/>}

                <ConsumoDados data={data} setData={setData}/>

                <PropostaCard data={data} setData={setData}/>

                <Endereco title="Endereço da Unidade Consumidora" endereco={endereco} setEndereco={setEndereco} required/>

                <Button type="submit" color="success">Cadastrar Proposta</Button>
            </form>
        </Layout>
    )
}
export default Page
