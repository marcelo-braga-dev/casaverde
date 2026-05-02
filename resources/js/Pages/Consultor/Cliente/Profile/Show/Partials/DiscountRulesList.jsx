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

const DiscountRulesList = ({ profile, discountRules = [] }) => {
    const sortedRules = [...discountRules].sort((a, b) => {
        return new Date(b.starts_on ?? b.created_at ?? 0) - new Date(a.starts_on ?? a.created_at ?? 0);
    });

    return (
        <Card sx={{ marginBottom: 4 }}>
            <CardHeader title="Regras de Desconto" />

            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Desconto</TableCell>
                                <TableCell>Início</TableCell>
                                <TableCell>Fim</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Observações</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {sortedRules.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5}>Nenhuma regra de desconto cadastrada.</TableCell>
                                </TableRow>
                            )}

                            {sortedRules.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell>{rule?.discount_percent ?? 0}%</TableCell>
                                    <TableCell>{formatDate(rule?.starts_on)}</TableCell>
                                    <TableCell>{rule?.ends_on ? formatDate(rule.ends_on) : "Em aberto"}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={rule?.is_active ? "Ativo" : "Inativo"}
                                            color={rule?.is_active ? "success" : "default"}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell>{rule?.notes ?? "Não informado"}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {route().has?.("consultor.user.cliente.discount.history") && (
                    <div className="mt-3">
                        <Link href={route("consultor.user.cliente.discount.history", profile.id)}>
                            <Button variant="outlined">
                                Ver Histórico De Descontos
                            </Button>
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default DiscountRulesList;
