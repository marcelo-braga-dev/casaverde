import { Link } from "@inertiajs/react";
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
import { IconFileCertificate, IconFileText } from "@tabler/icons-react";

const ClientProposalsList = ({ proposals = [] }) => {
    const items = [...proposals].sort((a, b) => b.id - a.id);

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Propostas do Cliente" avatar={<IconFileText />} />

            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Código</TableCell>
                                <TableCell>Concessionária</TableCell>
                                <TableCell>UC</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Contrato</TableCell>
                                <TableCell align="right">Ações</TableCell>
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
                                    <TableCell>{proposal.proposal_code ?? `#${proposal.id}`}</TableCell>
                                    <TableCell>{proposal?.concessionaria?.nome ?? "Não informado"}</TableCell>
                                    <TableCell>{proposal?.unidade_consumidora ?? "Não informado"}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={proposal?.status ?? "Sem status"}
                                            color={proposal?.status === "emitida" ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {proposal?.contract ? (
                                            <Chip label="Emitido" color="success" size="small" />
                                        ) : (
                                            <Chip label="Não emitido" color="warning" size="small" />
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
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
                                                    variant="outlined"
                                                    startIcon={<IconFileCertificate />}
                                                >
                                                    Emitir Contrato
                                                </Button>
                                            </Link>
                                        )}
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
