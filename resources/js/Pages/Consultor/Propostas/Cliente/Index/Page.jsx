import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
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
import { IconEye, IconFileText, IconPlus } from "@tabler/icons-react";

const Page = ({ proposals }) => {
    const items = proposals?.data ?? [];

    const getClientName = (proposal) => {
        const client = proposal?.client_profile;

        return client?.nome || client?.razao_social || client?.nome_fantasia || "Cliente não informado";
    };

    return (
        <Layout titlePage="Propostas Comerciais" menu="clientes" subMenu="propostas-cliente-index">
            <Head title="Propostas Comerciais" />

            <Card>
                <CardHeader
                    title="Lista de Propostas"
                    avatar={<IconFileText />}
                    action={
                        <Link href={route("consultor.propostas.cliente.create")}>
                            <Button color="success" startIcon={<IconPlus />}>
                                Nova Proposta
                            </Button>
                        </Link>
                    }
                />

                <CardContent>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Consultor</TableCell>
                                    <TableCell>Concessionária</TableCell>
                                    <TableCell>Consumo Médio</TableCell>
                                    <TableCell>Redução</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {items.map((proposal) => (
                                    <TableRow key={proposal.id}>
                                        <TableCell>{proposal?.proposal_code ?? proposal.id}</TableCell>
                                        <TableCell>{getClientName(proposal)}</TableCell>
                                        <TableCell>{proposal?.consultor?.name ?? "Não informado"}</TableCell>
                                        <TableCell>{proposal?.concessionaria?.nome ?? "Não informado"}</TableCell>
                                        <TableCell>{proposal?.media_consumo ?? "Não informado"}</TableCell>
                                        <TableCell>
                                            {proposal?.taxa_reducao ? `${proposal.taxa_reducao}%` : "Não informado"}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={proposal?.status ?? "Sem status"}
                                                color={proposal?.status === "emitida" ? "success" : "default"}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.propostas.cliente.show", proposal.id)}>
                                                <Button size="small" variant="outlined" startIcon={<IconEye />}>
                                                    Ver
                                                </Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}

                                {items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8}>Nenhuma proposta encontrada.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex justify-center gap-2">
                        {proposals?.links?.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url ?? "#"}
                                preserveScroll
                                className={`px-3 py-2 rounded border ${
                                    link.active ? "bg-green-600 text-white" : "bg-white text-gray-700"
                                } ${!link.url ? "opacity-50 pointer-events-none" : ""}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </Layout>
    );
};

export default Page;
