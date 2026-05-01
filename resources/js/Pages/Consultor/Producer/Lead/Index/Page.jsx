import Layout from "@/Layouts/UserLayout/Layout.jsx";
import {Head, Link} from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {IconEye, IconPlus, IconUsers} from "@tabler/icons-react";

const Page = ({leads}) => {
    const items = leads?.data ?? [];

    const getProducerName = (lead) => {
        return (
            lead?.producer_profile?.usina_nome ||
            lead?.producer_profile?.admin_nome ||
            lead?.producer_profile?.user?.name ||
            "Não informado"
        );
    };

    return (
        <Layout titlePage="Leads de Produtores" menu="produtores-solar" subMenu="producer-leads-index">
            <Head title="Leads de Produtores"/>

            <Card>
                <CardHeader
                    title="Lista de Leads de Produtores"
                    avatar={<IconUsers/>}
                    action={
                        <Link href={route("consultor.producer.leads.create")}>
                            <Button startIcon={<IconPlus/>} color="success">
                                Cadastrar Lead
                            </Button>
                        </Link>
                    }
                />

                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Produtor</TableCell>
                                    <TableCell>Consultor</TableCell>
                                    <TableCell>Concessionária</TableCell>
                                    <TableCell>Taxa Redução</TableCell>
                                    <TableCell>Potência</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((lead) => (
                                    <TableRow key={lead.id}>
                                        <TableCell>{lead.id}</TableCell>
                                        <TableCell>{getProducerName(lead)}</TableCell>
                                        <TableCell>{lead?.consultor?.name ?? "Não informado"}</TableCell>
                                        <TableCell>{lead?.concessionaria?.nome ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            {lead?.taxa_reducao ? `${lead.taxa_reducao}%` : "Não informado"}
                                        </TableCell>
                                        <TableCell>{lead?.potencia ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={lead?.status ?? "Sem status"}
                                                color={lead?.status === "aprovado" ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.producer.leads.show", lead.id)}>
                                                <Button size="small" variant="outlined" startIcon={<IconEye/>}>
                                                    Ver
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex justify-center gap-2">
                        {leads?.links?.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? "#"}
                                preserveScroll
                                className={`px-3 py-2 rounded border ${
                                    link.active ? "bg-green-600 text-white" : "bg-white text-gray-700"
                                } ${!link.url ? "opacity-50 pointer-events-none" : ""}`}
                                dangerouslySetInnerHTML={{__html: link.label}}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Page;
