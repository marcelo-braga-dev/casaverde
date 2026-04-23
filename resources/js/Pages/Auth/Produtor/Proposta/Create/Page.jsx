import Layout from "@/Layouts/UserLayout/Layout.jsx";
import Grid from "@mui/material/Grid2";
import { Button, Card, CardContent, CardHeader, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import Endereco from "@/Components/UserData/Endereco.jsx";
import ConsumoDados from "./ConsumoDados.jsx";
import { router, useForm } from "@inertiajs/react";
import DadosPessoais from "@/Components/UserData/DadosPessoais.jsx";
import Contato from "@/Components/UserData/Contato.jsx";
import { IconClipboardText, IconUser, IconUserPlus } from "@tabler/icons-react";
import PropostaCard from "./PropostaCard.jsx";
import { AlertError } from "@/Components/Snackbar/AlertError.jsx";

const Page = () => {
    const [produtores, setProdutores] = useState([]);
    const [endereco, setEndereco] = useState({});
    const [cadastrarUsuario, setCadastrarUsuario] = useState(false);
    const [error, setError] = useState(false);

    const { data, setData } = useForm({
        produtor_id: "",
        tipo_pessoa: "pj",
        nome: "",
        razao_social: "",
        nome_fantasia: "",
        email: "",
        cpf: "",
        cnpj: "",
        rg: "",
        data_nascimento: "",
        data_fundacao: "",
        genero: "",
        estado_civil: "",
        profissao: "",
        tipo_empresa: "",
        ie: "",
        im: "",
        ramo_atividade: "",
        taxa_reducao: "",
        dados: {
            potencia: "",
            geracao_media: "",
            valor_investimento: "",
            prazo_locacao: "",
        },
    });

    useEffect(() => {
        getProdutores();
    }, []);

    const getProdutores = async () => {
        const response = await axios.get(route("auth.produtor.api.get-all"));
        setProdutores(response.data);
    };

    const verificarUsuarioExistente = (valor) => {
        const resultado = produtores.find(
            (produtor) =>
                produtor.user_data?.cnpj === valor ||
                produtor.user_data?.cpf === valor
        );

        if (resultado) {
            setData("produtor_id", resultado.id);
            setCadastrarUsuario(false);
            setError(true);
        }
    };

    const toggleModoCadastro = () => {
        if (!cadastrarUsuario) {
            setData("produtor_id", "");
        } else {
            setData("tipo_pessoa", "pj");
            setData("nome", "");
            setData("razao_social", "");
            setData("nome_fantasia", "");
            setData("email", "");
            setData("cpf", "");
            setData("cnpj", "");
            setData("rg", "");
            setData("data_nascimento", "");
            setData("data_fundacao", "");
            setData("genero", "");
            setData("estado_civil", "");
            setData("profissao", "");
            setData("tipo_empresa", "");
            setData("ie", "");
            setData("im", "");
            setData("ramo_atividade", "");
        }

        setCadastrarUsuario((prev) => !prev);
    };

    const submit = (e) => {
        e.preventDefault();

        router.post(route("auth.produtor.proposta.store"), {
            ...data,
            endereco,
        });
    };

    return (
        <Layout
            titlePage="Gerar Proposta de Investimento - Produtor Solar"
            menu="produtores-solar"
            subMenu="produtores-propostas"
            backPage
        >
            {error && (
                <AlertError
                    message="Usuário com o mesmo documento já cadastrado!"
                    close={setError}
                />
            )}

            <form onSubmit={submit}>
                {cadastrarUsuario && (
                    <Card sx={{ marginBottom: 4 }}>
                        <CardContent>
                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 12 }}>
                                    <Button
                                        color="warning"
                                        startIcon={<IconUser />}
                                        onClick={toggleModoCadastro}
                                        variant="outlined"
                                    >
                                        Selecionar Produtor Já Cadastrado
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {!cadastrarUsuario && (
                    <Card sx={{ marginBottom: 4 }}>
                        <CardHeader
                            title="Dados do Produtor"
                            avatar={<IconClipboardText />}
                        />
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <TextField
                                        label="Selecione o Produtor..."
                                        value={data.produtor_id}
                                        select
                                        required={!cadastrarUsuario}
                                        onChange={(e) => setData("produtor_id", e.target.value)}
                                        fullWidth
                                    >
                                        {produtores.map((item) => (
                                            <MenuItem value={item.id} key={item.id}>
                                                {item.nome} ({item?.user_data?.cpf}{item?.user_data?.cnpj})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid size={{ xs: 12, md: 4 }}>
                                    <Button
                                        color="warning"
                                        startIcon={<IconUserPlus />}
                                        onClick={toggleModoCadastro}
                                        variant="outlined"
                                    >
                                        Cadastrar Novo Produtor
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {cadastrarUsuario && (
                    <DadosPessoais
                        data={data}
                        setData={setData}
                        verificarUsuarioExistente={verificarUsuarioExistente}
                    />
                )}

                {cadastrarUsuario && <Contato data={data} setData={setData} />}

                <ConsumoDados data={data} setData={setData} />

                <PropostaCard data={data} setData={setData} />

                <Endereco
                    title="Endereço do Local da Usina"
                    endereco={endereco}
                    setEndereco={setEndereco}
                    required
                />

                <Button type="submit" color="success">
                    Cadastrar Proposta
                </Button>
            </form>
        </Layout>
    );
};

export default Page;