import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, usePage } from '@inertiajs/react';
import PlataformaAcessoForm from '@/Components/Acesso/PlataformaAcessoForm.jsx';
import AccessHistoryCard from '@/Components/Acesso/AccessHistoryCard.jsx';
import ClientInfoCard from './Partials/ClientInfoCard.jsx';
import AttachUsinaForm from './Partials/AttachUsinaForm.jsx';
import UsinaList from './Partials/UsinaList.jsx';
import UnidadesConsumidorasCard from './Partials/UnidadesConsumidorasCard.jsx';
import DiscountRuleForm from './Partials/DiscountRuleForm.jsx';
import DiscountRulesList from './Partials/DiscountRulesList.jsx';
import ClientEmailImportSettingForm from './Partials/ClientEmailImportSettingForm.jsx';
import ClientProposalsList from './Partials/ClientProposalsList.jsx';
import { Alert, Box, Paper, Stack } from '@mui/material';
import {
    IconBolt,
    IconDiscount2,
    IconFileText,
    IconMailCog,
    IconShield,
    IconSolarPanel2,
} from '@tabler/icons-react';
import * as React from 'react';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const Page = ({
    clientProfile,
    client,
    usinas        = [],
    concessionarias = [],
    availableEmails = [],
    accessHistory   = [],
}) => {
    const { flash } = usePage().props;
    const profile = clientProfile ?? client;

    const usinaLinks         = profile?.usina_links ?? profile?.usinaLinks ?? [];
    const discountRules      = profile?.discount_rules ?? profile?.discountRules ?? [];
    const emailImportSetting = profile?.email_import_setting ?? profile?.emailImportSetting ?? null;
    const proposals          = profile?.proposals ?? [];
    const platformUser       = profile?.platform_user ?? null;

    const [value, setValue] = React.useState('1');

    return (
        <Layout titlePage="Detalhes do Cliente" menu="clientes" subMenu="cliente-index" backPage>
            <Head title="Detalhes do Cliente" />

            <Stack spacing={2}>
                {flash?.success && <Alert severity="success">{flash.success}</Alert>}
                {flash?.error   && <Alert severity="error">{flash.error}</Alert>}

                <ClientInfoCard profile={profile} />

                <Paper sx={{ pt: 1, mb: 4 }}>
                    <Box sx={{ width: '100%', typography: 'body1' }}>
                        <TabContext value={value}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <TabList onChange={(_, v) => setValue(v)} aria-label="tabs do cliente">
                                    <Tab icon={<IconFileText />}    label="Propostas"   value="1" />
                                    <Tab icon={<IconBolt />}        label="UCs"         value="2" />
                                    <Tab icon={<IconSolarPanel2 />} label="Usinas"      value="3" />
                                    <Tab icon={<IconDiscount2 />}   label="Margens"     value="4" />
                                    <Tab icon={<IconMailCog />}     label="Integração"  value="5" />
                                    <Tab icon={<IconShield />}      label="Acesso"      value="6" />
                                </TabList>
                            </Box>

                            <TabPanel value="1">
                                <ClientProposalsList profile={profile} proposals={proposals} />
                            </TabPanel>

                            <TabPanel value="2">
                                <UnidadesConsumidorasCard
                                    profile={profile}
                                    concessionarias={concessionarias}
                                />
                            </TabPanel>

                            <TabPanel value="3">
                                <AttachUsinaForm profile={profile} usinas={usinas} usinaLinks={usinaLinks} />
                                <UsinaList profile={profile} usinaLinks={usinaLinks} />
                            </TabPanel>

                            <TabPanel value="4">
                                <DiscountRuleForm profile={profile} />
                                <DiscountRulesList discountRules={discountRules} />
                            </TabPanel>

                            <TabPanel value="5">
                                <ClientEmailImportSettingForm
                                    profile={profile}
                                    concessionarias={concessionarias}
                                    setting={emailImportSetting}
                                    availableEmails={availableEmails}
                                />
                            </TabPanel>

                            <TabPanel value="6">
                                <Stack spacing={3}>
                                    <PlataformaAcessoForm
                                        platformUser={platformUser}
                                        storeRoute="admin.acesso.cliente.store"
                                        storeRouteParam={profile?.id}
                                        entityName="Cliente"
                                    />
                                    <AccessHistoryCard
                                        history={accessHistory}
                                        title="Histórico de Acesso do Cliente"
                                    />
                                </Stack>
                            </TabPanel>
                        </TabContext>
                    </Box>
                </Paper>
            </Stack>
        </Layout>
    );
};

export default Page;
