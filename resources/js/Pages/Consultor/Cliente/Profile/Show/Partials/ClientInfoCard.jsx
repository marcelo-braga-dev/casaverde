import {
    Button,
    Card,
    CardContent,
    CardHeader,
     Dialog, DialogActions, DialogContent, DialogTitle,
    Divider,  Stack,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconEdit,
    IconTrash,
    IconTrashX,
    IconX,
    IconPhone,
    IconUserBolt
} from "@tabler/icons-react";
import {Link, router} from "@inertiajs/react";
import * as React from "react";
import {useState} from "react";

const ClientInfoCard = ({profile}) => {
    const [openModal, setOpenModal] = useState(false);

    return (<>
        <Card sx={{marginBottom: 4}}>
            <CardHeader
                title="Informações do Produtor"
                subheader={`Consultor: ${profile?.consultor?.nome ?? 'Não Informado'}`}
                avatar={<IconUserBolt/>}
                action={
                    <div className="flex gap-2">
                        <Link href={route("consultor.user.cliente.edit", profile.id)}>
                            <Button startIcon={<IconEdit/>} color="success" variant="outlined" size="small">
                                Editar
                            </Button>
                        </Link>

                        <Button startIcon={<IconTrashX/>} color="error" size="small" variant="outlined" onClick={() => setOpenModal(true)}>
                            Excluir
                        </Button>
                    </div>
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

        <Dialog
            open={openModal}
            maxWidth="xs"
            fullWidth
        >
            <DialogTitle sx={{fontWeight: 800}}>
                Deletar Cliente
            </DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1}>
                    <Typography>
                        Deseja realmente deletar este cliente?
                    </Typography>
                </Stack>
            </DialogContent>
            <DialogActions sx={{p: 3}}>
                <Button
                    variant="outlined"
                    color="inherit"
                    startIcon={<IconX size={18}/>}
                    onClick={() => setOpenModal(false)}
                >
                    Não
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<IconTrash size={18}/>}
                    onClick={() => router.post(route('consultor.user.cliente.destroy', profile.id), {_method: "DELETE"})}
                >
                    Sim
                </Button>
            </DialogActions>
        </Dialog>
    </>);
};

export default ClientInfoCard;
