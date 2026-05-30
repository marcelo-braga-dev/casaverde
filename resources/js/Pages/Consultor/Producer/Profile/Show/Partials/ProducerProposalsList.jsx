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
import {IconEye,  IconFileText} from "@tabler/icons-react";

const ProducerProposalsList = ({ profile, proposals = [] }) => {
    const items = [...proposals].sort((a, b) => b.id - a.id);

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Propostas do Produtor" avatar={<IconFileText />}
                        action={<Button
                            component={Link}
                            href={route('consultor.propostas.produtor.create', {producer_profile_id: profile.id})}
                            size="small"
                            variant="outlined"
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
                                <TableCell>Status</TableCell>
                                <TableCell>Contrato</TableCell>
                                <TableCell align="center"></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6}>Nenhuma proposta emitida para este produtor.</TableCell>
                                </TableRow>
                            )}

                            {items.map((proposal) => (
                                <TableRow key={proposal.id}>
                                    <TableCell>{proposal.created_at}</TableCell>
                                    <TableCell>{proposal.proposal_code ?? `#${proposal.id}`}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={proposal?.status ?? "Sem status"}
                                            color={proposal?.status === "emitida" ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {/*{proposal?.contract ? (*/}
                                        {/*    <Link href={route("consultor.cliente.contratos.show", proposal.contract.id)}>*/}
                                        {/*        <Button size="small" variant="outlined">*/}
                                        {/*            Ver Contrato*/}
                                        {/*        </Button>*/}
                                        {/*    </Link>*/}
                                        {/*) : (*/}
                                        {/*    <Link href={route("consultor.cliente.contratos.create", proposal.id)}>*/}
                                        {/*        <Button*/}
                                        {/*            size="small"*/}
                                        {/*            color="success"*/}
                                        {/*            startIcon={<IconFileCertificate />}*/}
                                        {/*        >*/}
                                        {/*            Emitir Contrato*/}
                                        {/*        </Button>*/}
                                        {/*    </Link>*/}
                                        {/*)}*/}
                                    </TableCell>
                                    <TableCell align="right">
                                            <Link href={route("consultor.propostas.produtor.show", proposal.id)}>
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

export default ProducerProposalsList;
