import {Paper, Stack} from "@mui/material";
import TextInfo from "@/Components/DataDisplay/TextInfo.jsx";
import Grid from "@mui/material/Grid2";
import {convertMesesParaAnos} from "@/Utils/Datas/convertMesesParaAnos.js";
import {formatarEndereco} from "@/Utils/Datas/formatarEndereco.js";
import {useEffect, useState} from "react";

const Usina = ({produtorId}) => {
    const [usinas, setUsinas] = useState([])

    useEffect(() => {
        getUsinasProdutor()
    }, [produtorId]);
    const getUsinasProdutor = async () => {
        const response = await axios.get(route('auth.usinas.api.get-produtor', produtorId))
        setUsinas(response.data)
    }

    return (
        <Paper variant="outlined">
            <Stack spacing={2}>
                {usinas.map(usina => {
                    return (
                        <Grid container>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextInfo title="Prazo de Locação"
                                          text={`${usina?.prazo_locacao} meses (${convertMesesParaAnos(usina?.prazo_locacao)} anos)`}/>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextInfo title="Potência Total da Usina" text={`${usina?.potencia_usina} kWp`}/>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextInfo title="Média de Geração" text={`${usina?.media_geracao} kWh/mês`}/>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextInfo title="Unidade Consumidora" text={usina?.uc}/>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextInfo title="Concessionária" text={usina?.concessionaria?.nome}/>
                            </Grid>
                            <TextInfo title="Endereço da Usina" text={formatarEndereco(usina?.endereco)}/>

                            <Grid size={{xs: 12, md: 6}}>
                                <TextInfo title="Informaçõe sobre os Inversores" text={usina?.inversores}/>
                            </Grid>
                            <Grid size={{xs: 12, md: 6}}>
                                <TextInfo title="Informaçõe sobre os Módulos" text={usina?.modulos}/>
                            </Grid>
                        </Grid>
                    )
                })}
            </Stack>
        </Paper>
    )
}
export default Usina
