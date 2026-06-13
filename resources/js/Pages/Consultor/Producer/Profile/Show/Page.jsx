import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Alert, Box,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle, Paper,
    Stack, Typography,
} from '@mui/material';
import {
    IconArrowLeft,
    IconBolt,
    IconDiscount2,
    IconEdit,
    IconFileText,
    IconMailCog,
    IconShield,
    IconSolarPanel2,
    IconTrash,
    IconTrashX,
    IconX
} from '@tabler/icons-react';
import ProducerProposalsList from '@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerProposalsList.jsx';
import ProducerUsinaList from '@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerUsinaList.jsx';
import ProducerInfoCard from '@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerInfoCard.jsx';
import ProducerFeeRuleCard from '@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerFeeRuleCard.jsx';
import PlataformaAcessoForm from '@/Components/Acesso/PlataformaAcessoForm.jsx';
import AccessHistoryCard from '@/Components/Acesso/AccessHistoryCard.jsx';
import React, { useState } from 'react';
import TabList from "@mui/lab/TabList";
import Tab from "@mui/material/Tab";
import {TabContext, TabPanel} from "@mui/lab";

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const Page = ({ producer, accessHistory = [], defaultFeePercentage = 15 }) => {
    const { flash } = usePage().props;
    const [openModal, setOpenModal] = useState(false);
    const [value, setValue] = React.useState('1');
    const platformUser = producer?.platform_user ?? null;

    return (
        <Layout titlePage="Detalhes do Produtor" menu="produtores" subMenu="produtores-profile" backPage>
            <Head title="Detalhes do Produtor" />

            <Stack spacing={3}>
                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error">{flash.error}</Alert>}

                <ProducerInfoCard profile={producer} />

                <Paper sx={{ pt: 1, mb: 4 }}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={(_, v) => setValue(v)} aria-label="tabs do cliente">
                                    <Tab icon={<IconFileText />}    label="Propostas"   value="1" />
                                    <Tab icon={<IconSolarPanel2 />} label="Usinas"      value="2" />
                                    <Tab icon={<IconDiscount2 />} label="Taxa de Administração"      value="3" />
                                    <Tab icon={<IconShield />}   label="Acesso"     value="4" />
                                </TabList>
                            </Box>

                            <TabPanel value="1">
                                <ProducerProposalsList proposals={producer.proposals} profile={producer} />
                            </TabPanel>

                            <TabPanel value="2">
                                <ProducerUsinaList usinaLinks={producer.usinas} profile={producer} />
                            </TabPanel>

                            <TabPanel value="3">
                                <ProducerFeeRuleCard profile={producer} defaultFeePercentage={defaultFeePercentage} />
                            </TabPanel>

                            <TabPanel value="4">
                                {/* ── Acesso à plataforma ────────────────────── */}
                                <PlataformaAcessoForm
                                    platformUser={platformUser}
                                    storeRoute="admin.acesso.produtor.store"
                                    storeRouteParam={producer?.id}
                                    entityName="Produtor"
                                />

                                {/* ── Histórico de acesso ────────────────────── */}
                                <AccessHistoryCard
                                    history={accessHistory}
                                    title="Histórico de Acesso do Produtor"
                                />
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Paper>

                <div className="flex gap-2">
                    <Link href={safeRoute('consultor.producer.profiles.index')}>
                        <Button startIcon={<IconArrowLeft />} variant="outlined">Voltar</Button>
                    </Link>
                    <Link href={safeRoute('consultor.producer.profiles.edit', producer.id)}>
                        <Button startIcon={<IconEdit />} color="warning" variant="outlined">Editar</Button>
                    </Link>
                    <Button startIcon={<IconTrashX />} color="error" variant="outlined" onClick={() => setOpenModal(true)}>
                        Deletar
                    </Button>
                </div>
            </Stack>

            <Dialog open={openModal} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 800 }}>Deletar Produtor</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <Typography>Deseja realmente deletar este produtor?</Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button variant="outlined" color="inherit" startIcon={<IconX size={18} />} onClick={() => setOpenModal(false)}>
                        Não
                    </Button>
                    <Button variant="contained" color="error" startIcon={<IconTrash size={18} />}
                        onClick={() => router.post(safeRoute('consultor.producer.profiles.destroy', producer.id), { _method: 'DELETE' })}>
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    );
};

export default Page;
