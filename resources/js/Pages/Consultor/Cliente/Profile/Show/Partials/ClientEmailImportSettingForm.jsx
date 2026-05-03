import { useForm } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    FormControlLabel,
    MenuItem,
    Switch,
    TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconDeviceFloppy, IconMailCog } from "@tabler/icons-react";

const ClientEmailImportSettingForm = ({ profile, concessionarias = [], setting = null }) => {
    const { data, setData, post, processing, errors } = useForm({
        client_profile_id: profile?.id ?? "",
        concessionaria_id: setting?.concessionaria_id ?? "",
        imap_host: setting?.imap_host ?? "mail.casaverde.com.br",
        imap_port: setting?.imap_port ?? 993,
        imap_encryption: setting?.imap_encryption ?? "ssl",
        imap_email: setting?.imap_email ?? "",
        imap_password: "",
        pdf_password: "",
        sender_filter: setting?.sender_filter ?? "",
        subject_filter: setting?.subject_filter ?? "",
        is_active: setting?.is_active ?? true,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("consultor.user.cliente.email-import-setting.store"), {
            preserveScroll: true,
        });
    };

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader
                title="Configuração de Importação por Email"
                avatar={<IconMailCog />}
            />

            <CardContent>
                <form onSubmit={submit}>
                    <Grid container spacing={3}>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Concessionária"
                                value={data.concessionaria_id}
                                onChange={(e) => setData("concessionaria_id", e.target.value)}
                                error={!!errors.concessionaria_id}
                                helperText={errors.concessionaria_id}
                                select
                                fullWidth
                            >
                                <MenuItem value="">Não informar</MenuItem>

                                {concessionarias.map((concessionaria) => (
                                    <MenuItem value={concessionaria.id} key={concessionaria.id}>
                                        {concessionaria.nome}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Senha do PDF"
                                value={data.pdf_password}
                                onChange={(e) => setData("pdf_password", e.target.value)}
                                error={!!errors.pdf_password}
                                helperText={errors.pdf_password || (setting ? "Preencha apenas se quiser alterar." : "")}
                                type="password"
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Servidor IMAP"
                                value={data.imap_host}
                                onChange={(e) => setData("imap_host", e.target.value)}
                                error={!!errors.imap_host}
                                helperText={errors.imap_host}
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Porta IMAP"
                                value={data.imap_port}
                                onChange={(e) => setData("imap_port", e.target.value)}
                                error={!!errors.imap_port}
                                helperText={errors.imap_port}
                                type="number"
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 3 }}>
                            <TextField
                                label="Criptografia"
                                value={data.imap_encryption}
                                onChange={(e) => setData("imap_encryption", e.target.value)}
                                error={!!errors.imap_encryption}
                                helperText={errors.imap_encryption}
                                select
                                fullWidth
                            >
                                <MenuItem value="ssl">SSL</MenuItem>
                                <MenuItem value="tls">TLS</MenuItem>
                                <MenuItem value="none">Nenhuma</MenuItem>
                            </TextField>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Email IMAP"
                                value={data.imap_email}
                                onChange={(e) => setData("imap_email", e.target.value)}
                                error={!!errors.imap_email}
                                helperText={errors.imap_email}
                                type="email"
                                required
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label={setting ? "Nova senha do Email" : "Senha do Email"}
                                value={data.imap_password}
                                onChange={(e) => setData("imap_password", e.target.value)}
                                error={!!errors.imap_password}
                                helperText={errors.imap_password || (setting ? "Preencha apenas se quiser alterar." : "")}
                                type="password"
                                required={!setting}
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Filtro por Remetente"
                                value={data.sender_filter}
                                onChange={(e) => setData("sender_filter", e.target.value)}
                                error={!!errors.sender_filter}
                                helperText={errors.sender_filter}
                                placeholder="exemplo@concessionaria.com.br"
                                fullWidth
                            />
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                label="Filtro por Assunto"
                                value={data.subject_filter}
                                onChange={(e) => setData("subject_filter", e.target.value)}
                                error={!!errors.subject_filter}
                                helperText={errors.subject_filter}
                                placeholder="Fatura, Conta de Energia..."
                                fullWidth
                            />
                        </Grid>

                        <Grid size={12}>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={data.is_active}
                                        onChange={(e) => setData("is_active", e.target.checked)}
                                    />
                                }
                                label="Importação ativa"
                            />
                        </Grid>

                        <Grid size={12}>
                            <Button
                                type="submit"
                                startIcon={<IconDeviceFloppy />}
                                color="success"
                                disabled={processing}
                            >
                                Salvar Configuração de Email
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    );
};

export default ClientEmailImportSettingForm;
