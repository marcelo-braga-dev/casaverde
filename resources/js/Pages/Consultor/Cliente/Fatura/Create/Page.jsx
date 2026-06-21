import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    FormHelperText,
    Grid,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from "@mui/material";
import SearchableSelect from "@/Components/Form/SearchableSelect.jsx";
import { IconDeviceFloppy, IconFileInvoice, IconFileTypePdf, IconUpload, IconX } from "@tabler/icons-react";
import { useRef } from "react";

const Page = ({ clients = [] }) => {
    const { data, setData, post, processing, errors } = useForm({
        client_profile_id: "",
        pdfs: [],
    });

    const inputRef = useRef(null);

    const handleFiles = (files) => {
        setData("pdfs", Array.from(files ?? []));
    };

    const removeFile = (index) => {
        setData("pdfs", data.pdfs.filter((_, i) => i !== index));
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("consultor.cliente.faturas.store"), {
            forceFormData: true,
        });
    };

    return (
        <Layout titlePage="Cadastrar Fatura de Concessionária" menu="financeiro" subMenu="financeiro-faturas" backPage>
            <Head title="Cadastrar Fatura de Concessionária" />

            <Card>
                <CardHeader title="Cadastrar Fatura de Concessionária" avatar={<IconFileInvoice />} />

                <CardContent>
                    <form onSubmit={submit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <SearchableSelect
                                    fullWidth
                                    label="Cliente"
                                    value={data.client_profile_id}
                                    onChange={(value) => setData("client_profile_id", value)}
                                    options={clients.map((client) => ({
                                        value: client.id,
                                        label: `${client.client_code ? `${client.client_code} - ` : ""}${
                                            client.nome ||
                                            client.razao_social ||
                                            client.cpf ||
                                            client.cnpj ||
                                            `Cliente #${client.id}`
                                        }`,
                                    }))}
                                    error={Boolean(errors.client_profile_id)}
                                    helperText={errors.client_profile_id || "Usado para identificar a senha de desbloqueio do PDF cadastrada para o cliente."}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box
                                    onClick={() => inputRef.current?.click()}
                                    sx={{
                                        border: "1px dashed",
                                        borderColor: errors.pdfs ? "error.main" : "grey.300",
                                        borderRadius: 2,
                                        p: 3,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        bgcolor: "grey.50",
                                        "&:hover": { bgcolor: "grey.100" },
                                    }}
                                >
                                    <IconUpload size={28} style={{ opacity: 0.5 }} />
                                    <Typography variant="body2" sx={{ mt: 1, fontWeight: 700 }}>
                                        Clique para selecionar um ou mais PDFs
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Apenas arquivos PDF — até 10MB cada
                                    </Typography>
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        accept="application/pdf"
                                        multiple
                                        hidden
                                        onChange={(e) => handleFiles(e.target.files)}
                                    />
                                </Box>
                                {Boolean(errors.pdfs) && (
                                    <FormHelperText error>{errors.pdfs}</FormHelperText>
                                )}
                            </Grid>

                            {data.pdfs.length > 0 && (
                                <Grid item xs={12}>
                                    <List dense disablePadding>
                                        {data.pdfs.map((file, index) => (
                                            <ListItem
                                                key={`${file.name}-${index}`}
                                                sx={{ border: "1px solid", borderColor: "grey.200", borderRadius: 1.5, mb: 1 }}
                                                secondaryAction={
                                                    <Chip
                                                        size="small"
                                                        icon={<IconX size={14} />}
                                                        label="Remover"
                                                        onClick={() => removeFile(index)}
                                                        sx={{ cursor: "pointer" }}
                                                    />
                                                }
                                            >
                                                <ListItemIcon sx={{ minWidth: 36 }}>
                                                    <IconFileTypePdf size={20} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={file.name}
                                                    secondary={`${(file.size / 1024).toFixed(0)} KB`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Grid>
                            )}

                            <Grid item xs={12} display="flex" justifyContent="center" gap={2}>
                                <Stack direction="row" gap={2}>
                                    <Link href={route("admin.relatorios.faturas")}>
                                        <Button color="inherit" startIcon={<IconX />}>
                                            Cancelar
                                        </Button>
                                    </Link>

                                    <Button
                                        type="submit"
                                        color="success"
                                        variant="contained"
                                        disabled={processing || data.pdfs.length === 0}
                                        startIcon={<IconDeviceFloppy />}
                                    >
                                        {processing ? "Enviando..." : `Importar ${data.pdfs.length || ""} fatura(s)`}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Page;
