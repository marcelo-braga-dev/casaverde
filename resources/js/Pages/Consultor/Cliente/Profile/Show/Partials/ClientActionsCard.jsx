import { Link, router } from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import { IconFileText, IconMail, IconSend } from "@tabler/icons-react";

const ClientActionsCard = ({ profile }) => {
    const sendInvite = () => {
        router.post(route("consultor.user.cliente.invite", profile.id));
    };

    const convertClient = () => {
        router.post(route("consultor.user.cliente.convert", profile.id));
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Ações do Cliente" avatar={<IconSend />} />

            <CardContent>
                <div className="flex flex-wrap gap-2">
                    <Button
                        variant="outlined"
                        startIcon={<IconMail />}
                        onClick={sendInvite}
                    >
                        Enviar Convite
                    </Button>

                    <Button
                        variant="outlined"
                        color="warning"
                        onClick={convertClient}
                    >
                        Converter Cliente
                    </Button>

                    {profile?.platform_user?.id && (
                        <>
                            <Link href={route("consultor.user.cliente.contract-data.edit", profile.platform_user.id)}>
                                <Button variant="outlined" startIcon={<IconFileText />}>
                                    Dados Contratuais
                                </Button>
                            </Link>

                            <Link href={route("consultor.user.cliente.contact.edit", profile.platform_user.id)}>
                                <Button variant="outlined">
                                    Contato
                                </Button>
                            </Link>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ClientActionsCard;
