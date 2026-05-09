import {
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconBuilding, IconUser } from "@tabler/icons-react";
import StatusChip from "@/Components/UI/StatusChip.jsx";

const ClientInfoCard = ({ profile }) => {
    const isPessoaFisica = profile?.tipo_pessoa === "pf";

    const clientName =
        profile?.nome ||
        profile?.razao_social ||
        profile?.nome_fantasia ||
        "Cliente";

    const documentValue = isPessoaFisica ? profile?.cpf : profile?.cnpj;

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader
                title={clientName}
                subheader={isPessoaFisica ? "Pessoa Física" : "Pessoa Jurídica"}
                avatar={isPessoaFisica ? <IconUser /> : <IconBuilding />}
                action={<StatusChip status={profile?.status} />
                }
            />

            <Divider />

            <CardContent>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Código</Typography>
                        <Typography>{profile?.client_code ?? "Não informado"}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">{isPessoaFisica ? "CPF" : "CNPJ"}</Typography>
                        <Typography className={isPessoaFisica ? "mask-cpf" : "mask-cnpj"}>{documentValue ?? "Não informado"}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Cidade</Typography>
                        <Typography>{profile?.cidade ?? "Não informado"}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Email</Typography>
                        <Typography>{profile?.email ?? "Não informado"}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Telefone</Typography>
                        <Typography>{profile?.telefone ?? "Não informado"}</Typography>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Typography variant="subtitle2">Consultor</Typography>
                        <Typography>{profile?.consultor?.name ?? "Não informado"}</Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default ClientInfoCard;
