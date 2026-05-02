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

const formatDate = (value) => {
    if (!value) return "Em aberto";

    return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    }).format(new Date(value.replace("Z", "")));
};

const UsinaList = ({ profile, usinaLinks = [] }) => {
    const sortedLinks = [...usinaLinks].sort((a, b) => {
        return new Date(b.started_at ?? b.created_at ?? 0) - new Date(a.started_at ?? a.created_at ?? 0);
    });

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Usinas Vinculadas" />

            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Usina</TableCell>
                                <TableCell>Início</TableCell>
                                <TableCell>Fim</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Observações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedLinks.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>Nenhuma usina vinculada.</TableCell>
                                </TableRow>
                            )}

                            {sortedLinks.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item?.usina?.uc ?? `Usina #${item?.usina_id}`}</TableCell>
                                    <TableCell>{formatDate(item?.started_at)}</TableCell>
                                    <TableCell>{item?.ended_at ? formatDate(item.ended_at) : "Em aberto"}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={item?.is_active ? "Ativo" : "Encerrado"}
                                            color={item?.is_active ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{item?.notes ?? "Não informado"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {route().has?.("consultor.user.cliente.usina.history") && (
                    <div className="mt-3">
                        <Link href={route("consultor.user.cliente.usina.history", profile.id)}>
                            <Button variant="outlined">
                                Ver Histórico De Usinas
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default UsinaList;
