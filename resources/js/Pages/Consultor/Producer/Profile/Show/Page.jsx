import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, Link, router} from "@inertiajs/react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle,  Stack, Typography} from "@mui/material";
import {IconArrowLeft, IconEdit, IconTrash, IconTrashX, IconX} from "@tabler/icons-react";
import ProducerProposalsList from "@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerProposalsList.jsx";
import ProducerUsinaList from "@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerUsinaList.jsx";
import ProducerInfoCard from "@/Pages/Consultor/Producer/Profile/Show/Partials/ProducerInfoCard.jsx";
import React, {useState} from "react";

const Page = ({producer}) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <Layout titlePage="Detalhes do Produtor" menu="produtores" subMenu="produtores-profile" backPage>
            <Head title="Detalhes do Produtor"/>

            <ProducerInfoCard profile={producer}/>

            <ProducerProposalsList proposals={producer.proposals} profile={producer}/>

            <ProducerUsinaList usinaLinks={producer.usinas} profile={producer}/>


            <div className="flex gap-2">
                <Link href={route("consultor.producer.profiles.index")}>
                    <Button startIcon={<IconArrowLeft/>} variant="outlined">
                        Voltar
                    </Button>
                </Link>

                <Link href={route("consultor.producer.profiles.edit", producer.id)}>
                    <Button startIcon={<IconEdit/>} color="warning" variant="outlined">
                        Editar
                    </Button>
                </Link>

                <Button startIcon={<IconTrashX/>} color="error" variant="outlined" onClick={() => setOpenModal(true)}>
                    Deletar
                </Button>
            </div>

            <Dialog
                open={openModal}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle sx={{fontWeight: 800}}>
                    Deletar Produtor
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <Typography>
                            Deseja realmente deletar este produtor?
                        </Typography>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{p: 3}}>
                    <Button
                        variant="outlined"
                        color="inherit"
                        startIcon={<IconX size={18}/>}
                        onClick={() => setOpenModal(false)}
                    >
                        Não
                    </Button>
                    <Button
                        variant="contained"
                        color="error"
                        startIcon={<IconTrash size={18}/>}
                        onClick={() => router.post(route('consultor.producer.profiles.destroy', producer.id), {_method: "DELETE"})}
                    >
                        Sim
                    </Button>
                </DialogActions>
            </Dialog>
        </Layout>
    )
        ;
};

export default Page;
