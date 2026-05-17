import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {router, useForm} from "@inertiajs/react";

import {Button} from "@mui/material";
import {IconPlus} from "@tabler/icons-react";

import DadosPessoais from "@/Components/UserData/DadosPessoais.jsx";
import Endereco from "@/Components/UserData/Endereco.jsx";
import Contato from "@/Components/UserData/Contato.jsx";
import DadosAcesso from "@/Components/UserData/DadosAcesso.jsx";
import {useState} from "react";

const Page = () => {

    const {data, setData} = useForm({
        tipo_pessoa: 'pj'
    })

    const [endereco, setEndereco] = useState({});

    const submit = (e) => {
        e.preventDefault()
        router.post(route('admin.user.vendedor.store'), {...data, endereco})
    }

    return (
        <Layout titlePage="Cadastro de Consultor" menu="vendedores" subMenu="vendedores-cadastrar" backPage>
            <form onSubmit={submit}>

                <DadosPessoais data={data} setData={setData}/>
                <Endereco title="Endereço do Cliente" endereco={endereco} setEndereco={setEndereco}/>
                <Contato data={data} setData={setData}/>
                <DadosAcesso data={data} setData={setData}/>

                <div className="text-center">
                    <Button type="submit" startIcon={<IconPlus/>} color="success">Cadastrar Consultor</Button>
                </div>
            </form>
        </Layout>
    )
}
export default Page
