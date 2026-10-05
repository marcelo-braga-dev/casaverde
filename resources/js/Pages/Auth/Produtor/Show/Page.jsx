import {useState} from "react";
import Layout from "@/Layouts/UserLayout/Layout.jsx";

import {Box, Card, CardContent, Tab} from "@mui/material";
import {TabPanel, TabList, TabContext} from '@mui/lab';

import {IconFileLike, IconFileTypePdf, IconHistory, IconKey, IconSolarPanel, IconUserBolt} from "@tabler/icons-react";

import Usina from "./Usina.jsx";
import Contratos from "./Contratos.jsx";
import Historico from "./Historico.jsx";
import InfoDadosAcesso from "./InfoDadosAcesso.jsx";
import DataUser from "@/Components/DataUser/DataUser.jsx";
import Propostas from "@/Pages/Auth/Produtor/Show/Propostas.jsx";

const Page = ({usuario, tab}) => {

    const [tabSelected, setTabSelected] = useState(tab ?? 'info')

    const handleChangeTab = (event, newValue) => {
        setTabSelected(newValue);
    };

    return (
        <Layout titlePage="Informações do Produtor" menu="produtores-solar" subMenu="produtores-solar-cadastrados" backPage>
            <Card sx={{marginBottom: 3}}>
                <CardContent>
                    <TabContext value={tabSelected}>
                        <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                            <TabList onChange={handleChangeTab} variant="scrollable" scrollButtons="auto"
                                     textColor="primary"
                                     indicatorColor="primary">
                                <Tab label="Informações do Produtor" value="info" icon={<IconUserBolt size={20}/>} iconPosition="start"/>
                                <Tab label="Usinas Solar" value="usinas" icon={<IconSolarPanel size={20}/>} iconPosition="start"/>
                                <Tab label="Propostas Comerciais" value="propostas" icon={<IconFileLike size={20}/>} iconPosition="start"/>
                                <Tab label="Contratos" value="contratos" icon={<IconFileTypePdf size={20}/>} iconPosition="start"/>
                                <Tab label="Histórico" value="historico" icon={<IconHistory size={20}/>} iconPosition="start"/>
                                <Tab label="Dados de Acesso" value="acesso" icon={<IconKey size={20}/>} iconPosition="start"/>
                            </TabList>
                        </Box>
                        <TabPanel value="info">
                            <DataUser dataUser={usuario}/>
                        </TabPanel>
                        <TabPanel value="usinas">
                            <Usina produtorId={usuario?.id}/>
                        </TabPanel>
                        <TabPanel value="propostas">
                            <Propostas dataUser={usuario}/>
                        </TabPanel>
                        <TabPanel value="contratos">
                            <Contratos produtorId={usuario.id}/>
                        </TabPanel>
                        <TabPanel value="historico">
                            <Historico historico={usuario.historico}/>
                        </TabPanel>
                        <TabPanel value="acesso">
                            <InfoDadosAcesso dados={usuario.dados_acesso}/>
                        </TabPanel>
                    </TabContext>
                </CardContent>
            </Card>
        </Layout>
    )
}
export default Page
