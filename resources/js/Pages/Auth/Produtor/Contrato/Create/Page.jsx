import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Button, Card, CardContent, CardHeader, InputAdornment, MenuItem, TextField} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconArrowRight, IconSolarPanel, IconUser} from "@tabler/icons-react";
import {useEffect, useState} from "react";
import useInputMask from "@/Utils/Masks/InputsMask.js";
import Endereco from "@/Components/UserData/Endereco.jsx";
import {router, useForm} from "@inertiajs/react";
import formatarMoneyReal from "@/Utils/Formatters/formatarMoney.js";

const Page = ({contratante}) => {
    const {data, setData} = useForm({
        produtorId: contratante.id,
        parcela_fixa: "",
        taxa_administracao: "",
    })

    const [enderecoUsina, setEnderecoUsina] = useState({});
    const [enderecoAdmin, setEnderecoAdmin] = useState({});

    useEffect(() => {
        useInputMask()
    }, []);

    const submit = (e) => {
        e.preventDefault()
        try {
            router.post(route('auth.produtor-contratos.store', {...data, enderecoUsina, enderecoAdmin}))
        } catch (e) {
            console.error(e)
        }
    }

    return (
        <Layout titlePage="Gerar Contrato de Usina" menu="produtores-solar" subMenu="produtores-solar-cadastrados" backPage>

            <form onSubmit={submit}>
                <Card marginBottom={4} sx={{marginBottom: 4}}>
                    <CardHeader title="Administrador/Responsável da Usina" avatar={<IconUser/>} disableTypography/>
                    <CardContent marginBottom={4}>
                        <Grid container spacing={4} marginBottom={4}>
                            <Grid size={{xs: 12}}>
                                <TextField
                                    label="Nome do Administrador"
                                    onChange={e => setData('admin_nome', e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                            <Grid size={{xs: 12}}>
                                <TextField
                                    label="Qualificação do Administrador"
                                    onChange={e => setData('admin_qualificacao', e.target.value)}
                                    required
                                    fullWidth
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>

                    </CardContent>
                </Card>

                <Endereco title="Endereço do Responsável/Proprietário da Usina" endereco={enderecoAdmin} setEndereco={setEnderecoAdmin} required/>

                <Card marginBottom={4} sx={{marginBottom: 4}}>
                    <CardHeader title="Informações da Usina" avatar={<IconSolarPanel/>} disableTypography/>
                    <CardContent marginBottom={4}>
                        <Grid container spacing={4} marginBottom={4}>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextField
                                    label="Nome da Usina"
                                    onChange={e => setData('usina_nome', e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="CNPJ da Usina"
                                    className="cnpj"
                                    onChange={e => setData('usina_cnpj', e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={4}>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Potência da Usina"
                                    onChange={e => setData('potencia_kw', e.target.value)}
                                    required
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="center">kW</InputAdornment>,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Potência Instalada"
                                    onChange={e => setData('potencia_kwp', e.target.value)}
                                    required
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="center">kWp</InputAdornment>,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Geração Anual"
                                    onChange={e => setData('geracao_anual', e.target.value)}
                                    required
                                    fullWidth
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="center">kWh/ano</InputAdornment>,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Unidade Consumidora"
                                    onChange={e => setData('unidade_consumidora', e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Área da Usina Fotovoltaica"
                                    onChange={e => setData('usina_area', e.target.value)}
                                    required
                                    fullWidth
                                    slotProps={{input: {endAdornment: <InputAdornment position="center">hectares/m²</InputAdornment>}}}
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Área Total do Imóvel"
                                    onChange={e => setData('imovel_area', e.target.value)}
                                    required
                                    fullWidth
                                    slotProps={{input: {endAdornment: <InputAdornment position="center">hectares/m²</InputAdornment>}}}
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Matrícula do Imóvel"
                                    onChange={e => setData('imovel_matricula', e.target.value)}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Tipo de Área"
                                    onChange={e => setData('tipo_area', e.target.value)}
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem value="Área Urbana">Área Urbana</MenuItem>
                                    <MenuItem value="Área Rural">Área Rural</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Classificação da Usina"
                                    onChange={e => setData('classificacao', e.target.value)}
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem value="GD-I">GD-I</MenuItem>
                                    <MenuItem value="GD-II">GD-II</MenuItem>
                                    <MenuItem value="GD-III">GD-III</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Prazo de Locação"
                                    onChange={e => setData('prazo_locacao', e.target.value)}
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
                            <Grid size={{xs: 12}}>
                                <TextField
                                    label="Modelo dos Módulos"
                                    onChange={e => setData('modulos', e.target.value)}
                                    required
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <TextField
                                    label="Modelo dos Inversores"
                                    onChange={e => setData('inversores', e.target.value)}
                                    required
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                            </Grid>
                            <Grid size={{xs: 12}}>
                                <TextField
                                    label="Descrição da Usina"
                                    onChange={e => setData('descricao', e.target.value)}
                                    required
                                    multiline
                                    rows={3}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Endereco title="Endereço da Usina" endereco={enderecoUsina} setEndereco={setEnderecoUsina} required/>

                <Card marginBottom={4} sx={{marginBottom: 4}}>
                    <CardHeader title="Informações do Contrato" avatar={<IconSolarPanel/>} disableTypography/>
                    <CardContent marginBottom={4}>
                        <Grid container spacing={4} marginBottom={4}>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Parcela Fixa"
                                    value={data.parcela_fixa}
                                    onChange={e => setData('parcela_fixa', formatarMoneyReal(e.target.value))}
                                    required
                                    fullWidth
                                    slotProps={{input: {startAdornment: <InputAdornment position="center">R$</InputAdornment>}}}
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Taxa Administração"
                                    type="number"
                                    value={data.taxa_administracao}
                                    onChange={e => setData('taxa_administracao', e.target.value)}
                                    required
                                    fullWidth
                                    inputProps={{ min: 0, max: 100, step: 0.01 }}
                                    slotProps={{
                                        input: {
                                            endAdornment: <InputAdornment position="center">%</InputAdornment>,
                                        },
                                    }}
                                />
                            </Grid>
                            <Grid size={{xs: 12, md: 3}}>
                                <TextField
                                    label="Data do Contrato"
                                    type="date"
                                    onChange={e => setData('contrato_data', e.target.value)}
                                    required
                                    fullWidth
                                    slotProps={{inputLabel: {shrink: true}}}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                <Card marginBottom={4} sx={{marginBottom: 4}}>
                    <CardContent marginBottom={4}>
                        <Button type="submit" startIcon={<IconArrowRight/>} color="success">Gerar Contrato</Button>
                    </CardContent>
                </Card>
            </form>
        </Layout>
    )
}
export default Page
