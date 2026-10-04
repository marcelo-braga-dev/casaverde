import {Box, Button, Paper, Typography} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {Link} from "@inertiajs/react";
import {useEffect, useState} from "react";
import TextInfo from "@/Components/DataDisplay/TextInfo.jsx";

const Contratos = ({produtorId}) => {
    const [contratos, setContratos] = useState([])

    useEffect(() => {
        getContratos()
    }, []);

    const getContratos = async () => {
        const response = await axios.get(route('auth.produtor-contratos-api.get-all', produtorId))

        setContratos(response.data)
    }

    return (
        <Box>
            <Grid container>
                <Grid marginBottom={4} size={12}>
                    <Link href={route('auth.produtor-contratos.create', {userId: produtorId})}>
                        <Button>Emitir Contrato</Button>
                    </Link>
                </Grid>
                <Grid marginBottom={2} size={12}>
                    <Typography variant="h5">Histórico de Contratos Emitidos</Typography>
                </Grid>
                {contratos.length === 0 && (
                    <Grid marginBottom={2} size={12}>
                        <Typography variant="caption">Não há Registros de Contratos Emitidos.</Typography>
                    </Grid>
                )}

                {contratos.map(item => (
                    <Grid marginBottom={2} size={12}>
                        <Link href={route('auth.produtor-contratos.show', 1)}>
                            <Paper variant="outlined">
                                <TextInfo text={item.usina_nome} title="Usina"/>
                                <Button>Abrir</Button>
                            </Paper>
                        </Link>
                    </Grid>
                ))}

            </Grid>
        </Box>)

}
export default Contratos
