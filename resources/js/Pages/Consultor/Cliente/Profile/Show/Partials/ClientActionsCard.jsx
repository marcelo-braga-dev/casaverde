import { Link, router, usePage } from "@inertiajs/react";
import { Button, Card, CardContent, CardHeader } from "@mui/material";
import { IconBrandWhatsapp, IconFileText, IconMail, IconSend } from "@tabler/icons-react";
import WhatsAppButton from "@/Components/WhatsApp/WhatsAppButton";

const ClientActionsCard = ({ profile }) => {
    const { flash } = usePage().props;

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

                    {flash?.invite_link && (
                        <WhatsAppButton
                            templateKey="convite_ativacao"
                            phone={profile.contacts?.celular}
                            variables={{
                                nome: profile.display_name,
                                link_ativacao: flash.invite_link,
                            }}
                            label="Compartilhar Convite via WhatsApp"
                            variant="outlined"
                            color="success"
                            startIcon={<IconBrandWhatsapp size={17} />}
                        />
                    )}

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
