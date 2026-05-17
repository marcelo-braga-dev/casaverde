import {Card, CardContent, CardHeader, FormGroup, Switch, TextField} from "@mui/material";
import {IconKey} from "@tabler/icons-react";
import Grid from "@mui/material/Grid2";
import FormControlLabel from "@mui/material/FormControlLabel";
import {useState} from "react";

const DadosAcesso = ({data, setData}) => {

    return (
        <Card sx={{marginBottom: 4}}>
            <CardHeader title="Dados de Acesso" avatar={<IconKey/>} disableTypography/>
            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            label="Email:"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            slotProps={{inputLabel: {shrink: !!data?.email}}}
                            required
                            fullWidth
                        />
                    </Grid>
                    <Grid size={{xs: 12, md: 6}}>
                        <TextField
                            label="Senha:"
                            value={data.senha}
                            onChange={e => setData('senha', e.target.value)}
                            slotProps={{inputLabel: {shrink: !!data?.senha}}}
                            type="password"
                            required
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
export default DadosAcesso
