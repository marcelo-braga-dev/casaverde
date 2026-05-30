import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {IconPhone, IconUserBolt} from "@tabler/icons-react";

const ProducerInfoCard = ({profile}) => {

    return (<>
        <Card sx={{marginBottom: 4}}>
            <CardHeader
                title="Informações do Produtor"
                subheader={`Consultor: ${profile?.consultor?.nome ?? 'Não Informado'}`}
                avatar={<IconUserBolt/>}
                action={
                    <Chip
                        label={profile?.status ?? "Sem status"}
                        color={profile?.status === "ativo" ? "success" : "default"}
                    />
                }
            />

            <Divider/>

            <CardContent>
                <Grid container spacing={3}>

                    {profile?.tipo_pessoa === 'pf' && (<>
                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">Nome</Typography>
                            <Typography>{profile?.nome ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">CPF</Typography>
                            <Typography>{profile?.cpf ?? "Não informado"}</Typography>
                        </Grid>
                    </>)}

                    {profile?.tipo_pessoa === 'pj' && (<>
                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">CNPJ</Typography>
                            <Typography>{profile?.cnpj ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">Nome Fantasia</Typography>
                            <Typography>{profile?.nome_fantasia ?? "Não informado"}</Typography>
                        </Grid>

                        <Grid size={{xs: 12, md: 6}}>
                            <Typography variant="subtitle2">Razão Social</Typography>
                            <Typography>{profile?.razao_social ?? "Não informado"}</Typography>
                        </Grid>
                    </>)}
                </Grid>
            </CardContent>
        </Card>

        <Card sx={{marginBottom: 4}}>
            <CardHeader
                title="Contatos"
                avatar={<IconPhone/>}
            />

            <Divider/>

            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{xs: 12, md: 4}}>
                        <Typography variant="subtitle2">Celular</Typography>
                        <Typography>{profile?.contacts?.celular ?? "Não informado"}</Typography>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Typography variant="subtitle2">Telefone</Typography>
                        <Typography>{profile?.contacts?.telefone ?? "Não informado"}</Typography>
                    </Grid>

                    <Grid size={{xs: 12, md: 4}}>
                        <Typography variant="subtitle2">E-mail</Typography>
                        <Typography>{profile?.contacts?.email ?? "Não informado"}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
</>);
};

export default ProducerInfoCard;
