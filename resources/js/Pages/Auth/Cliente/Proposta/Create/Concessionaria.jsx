import {Card, CardContent, CardHeader} from "@mui/material";
import {IconFileInvoice} from "@tabler/icons-react";
import Grid from "@mui/material/Grid2";
import {useEffect, useState} from "react";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";

const ConcessionariaSelect = ({data, setData}) => {
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
            <CardHeader title="Concessionária" avatar={<IconFileInvoice/>} disableTypography/>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 6}}>
                        <SearchableSelect
                            label="Concessionária de Energia"
                            value={data?.usina?.concessionaria_id}
                            onChange={value => setData('concessionaria_id', value)}
                            options={concessionarias.map(item => ({value: item.id, label: `${item.nome} / ${item.estado}`}))}
                            fullWidth
                            required
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default ConcessionariaSelect
