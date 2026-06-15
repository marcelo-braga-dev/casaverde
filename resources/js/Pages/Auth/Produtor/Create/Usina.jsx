import {Card, CardContent, CardHeader, InputAdornment, MenuItem, TextField} from "@mui/material";
import {IconFileInvoice} from "@tabler/icons-react";
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";

const Usina = ({data, setData}) => {
    const [concessionarias, setConcessionarias] = useState([])

    useEffect(() => {
        const fetchGet = async () => {
            const {data} = await axios.get(route('auth.concessionarias.get-all'))
            setConcessionarias(data)
        }
        fetchGet()
    }, []);

    return (
        <Card sx={{marginBottom: 4}}>
            <CardHeader title="Usina Solar" avatar={<IconFileInvoice/>} disableTypography/>
            <CardContent>
                <Grid container spacing={3} marginBottom={4}>
                    <Grid size={{xs: 12, md: 6}}>
                        <SearchableSelect
                            label="Concessionária de Energia"
                            value={data?.usina?.concessionaria_id}
                            onChange={value => setData({...data, usina: {...data.usina, concessionaria_id: value}})}
                            options={concessionarias.map(item => ({value: item.id, label: `${item.nome} / ${item.estado}`}))}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={3} marginBottom={4}>
                    <Grid size={{xs: 12, md: 3}}>
                        <TextField
                            label="Unidade Consumidora"
                            type="number"
                            value={data?.usina?.uc}
                            onChange={e => setData({...data, usina: {...data.usina, uc: e.target.value}})}
                            fullWidth
                            required
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <TextField
                            label="Média Geração Mensal"
                            value={data?.usina?.media_geracao}
                            onChange={e => setData({...data, usina: {...data.usina, media_geracao: e.target.value}})}
                            type="number"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="start">kWh/mês</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <TextField
                            label="Potência Total da Usina"
                            value={data?.usina?.potencia_usina}
                            onChange={e => setData({...data, usina: {...data.usina, potencia_usina: e.target.value}})}
                            type="number"
                            required
                            fullWidth
                            slotProps={{
                                input: {
                                    endAdornment: <InputAdornment position="start">kWp</InputAdornment>,
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 3}}>
                        <TextField
                            label="Prazo Locação"
                            value={data?.usina?.prazo_locacao}
                            onChange={e => setData({...data, usina: {...data.usina, prazo_locacao: e.target.value}})}
                            select
                            required
                            fullWidth
                        >
                            <MenuItem value={12}>12 meses (1 ano)</MenuItem>
                            <MenuItem value={24}>24 meses (2 anos)</MenuItem>
                            <MenuItem value={36}>36 meses (3 anos)</MenuItem>
                            <MenuItem value={48}>48 meses (4 anos)</MenuItem>
                            <MenuItem value={60}>60 meses (5 anos)</MenuItem>
                        </TextField>
                    </Grid>
                </Grid>
                <Grid container spacing={3} marginBottom={4}>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            label="Informações sobre Inversores"
                            value={data?.usina?.inversores}
                            onChange={e => setData({...data, usina: {...data.usina, inversores: e.target.value}})}
                            required
                            fullWidth
                            multiline
                            minRows={3}
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            label="Informações sobre Módulos"
                            value={data?.usina?.modulos}
                            onChange={e => setData({...data, usina: {...data.usina, modulos: e.target.value}})}
                            required
                            fullWidth
                            multiline
                            minRows={3}
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default Usina
