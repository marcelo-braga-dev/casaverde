import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Alert,
    Button,
    Dialog, DialogActions, DialogContent, DialogTitle,
    Stack, Typography,
} from '@mui/material';
import { IconArrowLeft, IconEdit, IconTrash, IconTrashX, IconX } from '@tabler/icons-react';
import ProducerProposalsList from '@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerProposalsList.jsx';
import ProducerUsinaList from '@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerUsinaList.jsx';
import ProducerInfoCard from '@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerInfoCard.jsx';
import PlataformaAcessoForm from '@/Components/Acesso/PlataformaAcessoForm.jsx';
import AccessHistoryCard from '@/Components/Acesso/AccessHistoryCard.jsx';
import React, { useState } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const Page = ({ producer, accessHistory = [] }) => {
    const { flash } = usePage().props;
    const [openModal, setOpenModal] = useState(false);
    const platformUser = producer?.platform_user ?? null;

    return (
        <Layout titlePage="Detalhes do Produtor" menu="produtores" subMenu="produtores-profile" backPage>
            <Head title="Detalhes do Produtor" />

            <Stack spacing={3}>
                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error">{flash.error}</Alert>}

                <ProducerInfoCard profile={producer} />

                <ProducerProposalsList proposals={producer.proposals} profile={producer} />

                <ProducerUsinaList usinaLinks={producer.usinas} profile={producer} />

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
