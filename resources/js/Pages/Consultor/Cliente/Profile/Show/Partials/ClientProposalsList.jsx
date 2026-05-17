import { Link } from "@inertiajs/react";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip, Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
import {IconEye, IconFileCertificate, IconFileText, IconPlus} from "@tabler/icons-react";

const ClientProposalsList = ({ profile, proposals = [] }) => {
    const items = [...proposals].sort((a, b) => b.id - a.id);

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Propostas do Cliente" avatar={<IconFileText />}
                        action={<Button
                            component={Link}
                            href={route('consultor.propostas.cliente.create', {client_profile_id: profile.id})}
                            size="small"
                            startIcon={<IconPlus />}
                        >
                            Emitir Proposta
                        </Button>}/>

            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Data</TableCell>
                                <TableCell>Código</TableCell>
                                <TableCell>Concessionária</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Contrato</TableCell>
                                <TableCell align="center">Ações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>Nenhuma proposta emitida para este cliente.</TableCell>
                                </TableRow>
                            )}

                            {items.map((proposal) => (
                                <TableRow key={proposal.id}>
                                    <TableCell>{proposal.created_at}</TableCell>
                                    <TableCell>{proposal.proposal_code ?? `#${proposal.id}`}</TableCell>
                                    <TableCell>{proposal?.concessionaria?.nome ?? "Não informado"}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={proposal?.status ?? "Sem status"}
                                            color={proposal?.status === "emitida" ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {proposal?.contract ? (
                                            <Link href={route("consultor.cliente.contratos.show", proposal.contract.id)}>
                                                <Button size="small" variant="outlined">
                                                    Ver Contrato
                                                </Button>
                                            </Link>
                                        ) : (
                                            <Link href={route("consultor.cliente.contratos.create", proposal.id)}>
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    startIcon={<IconFileCertificate />}
                                                >
                                                    Emitir Contrato
                                                </Button>
                                            </Link>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                            <Link href={route("consultor.propostas.cliente.show", proposal.id)}>
                                                <Button
                                                    size="small"
                                                    color="success"
                                                    variant="outlined"
                                                    startIcon={<IconEye />}
                                                >
                                                    Ver
                                                </Button>
                                            </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
};

export default ClientProposalsList;
