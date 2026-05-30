import {
    Card,
    CardContent,
    CardHeader,
    Divider,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconUserDollar} from "@tabler/icons-react";

const ClientConsultor = ({profile}) => {

    return (
        <Card sx={{marginBottom: 4}}>
            <CardHeader
                title="Consultor"
                avatar={<IconUserDollar/>}
            />

            <Divider/>

            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 6}}>
                        <Typography variant="subtitle2">Consultor</Typography>
                        <Typography>{profile?.consultor?.nome ?? "Não informado"}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ClientConsultor;
