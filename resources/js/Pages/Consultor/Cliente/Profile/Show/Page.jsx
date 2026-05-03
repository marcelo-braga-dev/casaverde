import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head } from "@inertiajs/react";

import ClientInfoCard from "./Partials/ClientInfoCard.jsx";
import ClientActionsCard from "./Partials/ClientActionsCard.jsx";
import AttachUsinaForm from "./Partials/AttachUsinaForm.jsx";
import UsinaList from "./Partials/UsinaList.jsx";
import DiscountRuleForm from "./Partials/DiscountRuleForm.jsx";
import DiscountRulesList from "./Partials/DiscountRulesList.jsx";
import ClientEmailImportSettingForm from "./Partials/ClientEmailImportSettingForm.jsx";
import ClientProposalsList from "./Partials/ClientProposalsList.jsx";

const Page = ({ clientProfile, client, usinas = [], concessionarias = [] }) => {
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

    return (
        <Layout titlePage="Detalhes do Cliente" menu="clientes" subMenu="cliente-index" backPage>
            <Head title="Detalhes do Cliente" />

            <ClientInfoCard profile={profile} />

            <ClientActionsCard profile={profile} />

            <ClientProposalsList proposals={proposals} />

            <AttachUsinaForm profile={profile} usinas={usinas} />

            <UsinaList profile={profile} usinaLinks={usinaLinks} />

            <DiscountRuleForm profile={profile} />

            <DiscountRulesList profile={profile} discountRules={discountRules} />

            <ClientEmailImportSettingForm
                profile={profile}
                concessionarias={concessionarias}
                setting={emailImportSetting}
            />

        </Layout>
    );
};

export default Page;
