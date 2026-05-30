import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head} from "@inertiajs/react";

import ClientInfoCard from "./Partials/ClientInfoCard.jsx";
import AttachUsinaForm from "./Partials/AttachUsinaForm.jsx";
import UsinaList from "./Partials/UsinaList.jsx";
import DiscountRuleForm from "./Partials/DiscountRuleForm.jsx";
import DiscountRulesList from "./Partials/DiscountRulesList.jsx";
import ClientEmailImportSettingForm from "./Partials/ClientEmailImportSettingForm.jsx";
import ClientProposalsList from "./Partials/ClientProposalsList.jsx";
import {Paper} from "@mui/material";
import {
    IconDiscount2,
    IconFileText,
    IconMailCog,
    IconSolarPanel2,
} from "@tabler/icons-react";

import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

const Page = ({clientProfile, client, usinas = [], concessionarias = []}) => {

    const profile = clientProfile ?? client;

    const usinaLinks =
        profile?.usina_links ??
        profile?.usinaLinks ??
        [];

    const discountRules =
        profile?.discount_rules ??
        profile?.discountRules ??
        [];

    const emailImportSetting =
        profile?.email_import_setting ??
        profile?.emailImportSetting ??
        null;

    const proposals =
        profile?.proposals ??
        [];

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Layout titlePage="Detalhes do Cliente" menu="clientes" subMenu="cliente-index" backPage>
            <Head title="Detalhes do Cliente"/>

            <ClientInfoCard profile={profile}/>

            <Paper sx={{pt: 1, mb: 4}}>
                <Box sx={{width: '100%', typography: 'body1'}}>
                    <TabContext value={value}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleChange} aria-label="lab API tabs example">
                                <Tab icon={<IconFileText />} label="Propostas" value="1"/>
                                <Tab icon={<IconSolarPanel2 />} label="Usinas" value="2"/>
                                <Tab icon={<IconDiscount2 />} label="Margens" value="3"/>
                                <Tab icon={<IconMailCog />} label="Integração" value="4"/>
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <ClientProposalsList profile={profile} proposals={proposals}/>
                        </TabPanel>
                        <TabPanel value="2">
                            <AttachUsinaForm profile={profile} usinas={usinas} usinaLinks={usinaLinks}/>

                            <UsinaList profile={profile} usinaLinks={usinaLinks}/>
                        </TabPanel>
                        <TabPanel value="3">
                            <DiscountRuleForm profile={profile}/>

                            <DiscountRulesList discountRules={discountRules}/>
                        </TabPanel>
                        <TabPanel value="4">
                            <ClientEmailImportSettingForm
                                profile={profile}
                                concessionarias={concessionarias}
                                setting={emailImportSetting}
                            />
                        </TabPanel>
                    </TabContext>
                </Box>
            </Paper>

            {/*<ClientActionsCard profile={profile} />*/}


        </Layout>
    );
};

export default Page;
