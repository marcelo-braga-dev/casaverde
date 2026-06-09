import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconArrowLeft, IconBuildingFactory, IconEdit, IconFolder, IconSolarPanel2 } from "@tabler/icons-react";

const Page = ({ block }) => {
    const usinas = block?.usinas ?? [];

    return (
        <Layout titlePage="Detalhes do Grupo de Usinas" menu="usinas-solar" subMenu="usinas-block" backPage>
            <Head title="Detalhes do Grupo de Usinas" />

            {/* Card de informações do bloco */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                        <Stack direction="row" alignItems="center" gap={1.5}>
                            <Box sx={{
                                width: 40, height: 40, borderRadius: 2,
                                background: 'var(--cv-gradient-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                            }}>
                                <IconFolder size={20} />
                            </Box>
                            <Typography variant="h5" sx={{ fontWeight: 900 }}>
                                {block?.nome ?? "Grupo de Usinas"}
                            </Typography>
                        </Stack>
                        <Chip
                            label={block?.status === 'ativo' ? 'Ativo' : (block?.status ?? 'Inativo')}
                            color={block?.status === "ativo" ? "success" : "default"}
                        />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Nome
                            </Typography>
                            <Typography sx={{ fontWeight: 700 }}>{block?.nome ?? "—"}</Typography>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Status
                            </Typography>
                            <Typography>{block?.status ?? "—"}</Typography>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Descrição
                            </Typography>
                            <Typography>{block?.descricao ?? "Sem descrição."}</Typography>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Tabela de usinas */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Stack direction="row" alignItems="center" gap={1.5} mb={2}>
                        <Box sx={{
                            width: 36, height: 36, borderRadius: 2,
                            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                        }}>
                            <IconSolarPanel2 size={18} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 950 }}>
                            Usinas Vinculadas
                        </Typography>
                        <Chip label={`${usinas.length}`} size="small" variant="outlined" />
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 800 }}>Usina</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Produtor</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>UC</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Potência (kWp)</TableCell>
                                    <TableCell sx={{ fontWeight: 800 }}>Média Geração (kWh)</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {usinas.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            <Box py={3} textAlign="center">
                                                <Typography color="text.secondary">Nenhuma usina vinculada a este grupo.</Typography>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                )}

                                {usinas.map((usina) => {
                                    const produtor = usina.produtor ?? null;
                                    return (
                                        <TableRow key={usina.id} hover>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    {usina.usina_nome ?? `Usina #${usina.id}`}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {produtor ? (
                                                    <Stack direction="row" alignItems="center" gap={0.5}>
                                                        <IconBuildingFactory size={14} style={{ opacity: 0.5 }} />
                                                        <Typography variant="body2">
                                                            {produtor.nome_fantasia ?? produtor.nome ?? '—'}
                                                        </Typography>
                                                    </Stack>
                                                ) : (
                                                    <Typography variant="body2" color="text.secondary">—</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                                    {usina.uc ?? "—"}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={usina.status ?? "—"}
                                                    color={usina.status === 'ativo' ? 'success' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{usina.potencia_usina ?? "—"}</TableCell>
                                            <TableCell>{usina.media_geracao ?? "—"}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Stack direction="row" gap={1}>
                <Button
                    component={Link}
                    href={route("consultor.producer.usina-blocks.index")}
                    startIcon={<IconArrowLeft size={16} />}
                    variant="outlined"
                >
                    Voltar
                </Button>
                <Button
                    component={Link}
                    href={route("consultor.producer.usina-blocks.edit", block.id)}
                    startIcon={<IconEdit size={16} />}
                    color="warning"
                    variant="outlined"
                >
                    Editar
                </Button>
            </Stack>
        </Layout>
    );
};

export default Page;
