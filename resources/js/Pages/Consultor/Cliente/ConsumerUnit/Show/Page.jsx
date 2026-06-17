import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
    IconBolt,
    IconBuildingFactory2,
    IconEdit,
    IconFileInvoice,
    IconFileText,
    IconHistory,
    IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import formatCurrency from "@/Utils/formatCurrency.js";
import { getStatusLabel } from "@/Utils/statusLabels.js";

const UC_STATUS_MAP = {
    active: { label: "Ativa", color: "success" },
    inactive: { label: "Inativa", color: "warning" },
    cancelled: { label: "Cancelada", color: "error" },
};

const LINK_STATUS_MAP = {
    active: { label: "Ativo", color: "success" },
    scheduled: { label: "Agendado", color: "info" },
    inactive: { label: "Inativo", color: "default" },
    finished: { label: "Finalizado", color: "secondary" },
    cancelled: { label: "Cancelado", color: "error" },
};

const CONTRACT_STATUS_MAP = {
    issued: { label: "Emitido", color: "info" },
    signed: { label: "Assinado", color: "primary" },
    active: { label: "Ativo", color: "success" },
    cancelled: { label: "Cancelado", color: "error" },
};

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("pt-BR");
}

function formatKwh(value) {
    if (value === null || value === undefined) return "—";

    return `${Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} kWh`;
}

function producerLabel(producer) {
    if (!producer) return "—";

    if (producer.tipo_pessoa === "pj") {
        return producer.razao_social || producer.nome_fantasia || producer.nome || "—";
    }

    return producer.nome || "—";
}

function InfoRow({ label, children }) {
    return (
        <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="flex-start"
            py={0.8}
            sx={{ borderBottom: "1px solid", borderColor: "divider", "&:last-child": { border: 0 } }}
        >
            <Typography variant="body2" color="text.secondary">{label}</Typography>
            <Box sx={{ textAlign: "right", maxWidth: "60%" }}>
                {typeof children === "string" || typeof children === "number" ? (
                    <Typography variant="body2" fontWeight={700}>{children || "—"}</Typography>
                ) : children}
            </Box>
        </Stack>
    );
}

function DeleteConsumerUnitDialog({ consumerUnit, open, onClose }) {
    const { delete: destroy, processing } = useForm({});

    function confirm() {
        destroy(route("consultor.cliente.consumer-units.destroy", consumerUnit.id));
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Remover Unidade Consumidora</DialogTitle>
            <DialogContent>
                <Typography>
                    Deseja remover a UC <strong>{consumerUnit.display_label ?? consumerUnit.uc_code}</strong>?
                    Esta ação não poderá ser desfeita se não houver vínculos ativos com usinas.
                </Typography>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button variant="outlined" color="inherit" onClick={onClose}>Cancelar</Button>
                <Button variant="contained" color="error" onClick={confirm} disabled={processing}>
                    Remover
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function Page({ consumerUnit, bills }) {
    const [openDelete, setOpenDelete] = useState(false);

    const statusInfo = UC_STATUS_MAP[consumerUnit.status] ?? { label: consumerUnit.status, color: "default" };
    const client = consumerUnit.client_profile;
    const activeLinks = consumerUnit.active_usina_links ?? consumerUnit.activeUsinaLinks ?? [];
    const allocatedPercentage = activeLinks.reduce(
        (sum, link) => sum + Number(link.consumption_percentage ?? 0),
        0
    );
    const remainingPercentage = Math.max(0, Math.round((100 - allocatedPercentage) * 100) / 100);
    const linkHistory = consumerUnit.usina_links ?? [];
    const contracts = consumerUnit.contracts ?? [];
    const billItems = bills?.data ?? [];

    return (
        <Layout titlePage={`UC ${consumerUnit.uc_code}`} menu="clientes" subMenu="consumer-units-index" backPage>
            <Head title={`UC ${consumerUnit.uc_code}`} />

            <Card sx={{ mb: 3 }}>
                <CardHeader
                    avatar={<IconBolt />}
                    title={consumerUnit.display_label ?? consumerUnit.uc_code}
                    subheader={`Código UC: ${consumerUnit.uc_code}`}
                    action={
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Chip label={statusInfo.label} color={statusInfo.color} />
                            <Link href={route("consultor.cliente.consumer-units.edit", consumerUnit.id)}>
                                <Button variant="outlined" startIcon={<IconEdit />}>Editar</Button>
                            </Link>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<IconTrash />}
                                onClick={() => setOpenDelete(true)}
                            >
                                Remover
                            </Button>
                        </Stack>
                    }
                />
            </Card>

            <Grid container spacing={3} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardHeader title="Dados da Unidade Consumidora" avatar={<IconFileText />} />
                        <CardContent>
                            <InfoRow label="Cliente">{client?.display_name}</InfoRow>
                            <InfoRow label="Documento">{client?.documento}</InfoRow>
                            <InfoRow label="Código do Cliente">{client?.client_code}</InfoRow>
                            <InfoRow label="Rótulo">{consumerUnit.label}</InfoRow>
                            <InfoRow label="Concessionária">
                                {consumerUnit.concessionaria
                                    ? `${consumerUnit.concessionaria.nome}${consumerUnit.concessionaria.estado ? ` (${consumerUnit.concessionaria.estado})` : ""}`
                                    : "—"}
                            </InfoRow>
                            <InfoRow label="Consumo Previsto">
                                {formatKwh(consumerUnit.consumo_previsto_kwh_mes)}/mês
                            </InfoRow>
                            <InfoRow label="Endereço">{consumerUnit.address?.full_address}</InfoRow>
                            <InfoRow label="Observações">{consumerUnit.notes}</InfoRow>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: "100%" }}>
                        <CardHeader title="Alocação em Usina" avatar={<IconBuildingFactory2 />} />
                        <CardContent>
                            {activeLinks.length > 0 ? (
                                <Stack spacing={1.5} divider={<Divider />}>
                                    <InfoRow label="Alocado do Consumo Previsto">
                                        {`${allocatedPercentage}%`}
                                    </InfoRow>
                                    {remainingPercentage > 0 && (
                                        <InfoRow label="Disponível para nova alocação">
                                            {`${remainingPercentage}%`}
                                        </InfoRow>
                                    )}
                                    {activeLinks.map((link) => {
                                        const usina = link.usina;
                                        const linkStatus = LINK_STATUS_MAP[link.status] ?? { label: link.status, color: "default" };

                                        return (
                                            <Box key={link.id}>
                                                <InfoRow label="Usina">{usina?.usina_nome ?? `Usina #${link.usina_id}`}</InfoRow>
                                                <InfoRow label="% do Consumo Previsto">{`${Number(link.consumption_percentage ?? 0)}%`}</InfoRow>
                                                <InfoRow label="Produtor">{producerLabel(usina?.produtor)}</InfoRow>
                                                <InfoRow label="Status do Vínculo">
                                                    <Chip label={linkStatus.label} color={linkStatus.color} size="small" />
                                                </InfoRow>
                                                <InfoRow label="Energia Alocada">{formatKwh(link.allocated_energy_kwh)}</InfoRow>
                                                <InfoRow label="Início do Vínculo">{formatDate(link.started_at)}</InfoRow>
                                            </Box>
                                        );
                                    })}
                                </Stack>
                            ) : (
                                <Box py={4} textAlign="center">
                                    <IconBuildingFactory2 size={40} style={{ opacity: 0.2, marginBottom: 8 }} />
                                    <Typography color="text.secondary">
                                        Esta UC não está vinculada a nenhuma usina ativa.
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ mb: 3 }}>
                <CardHeader title="Histórico de Vínculos com Usinas" avatar={<IconHistory />} />
                <CardContent>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Usina</TableCell>
                                    <TableCell>Produtor</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>% Consumo Previsto</TableCell>
                                    <TableCell>Energia Alocada</TableCell>
                                    <TableCell>Início</TableCell>
                                    <TableCell>Fim</TableCell>
                                    <TableCell>Ativo</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {linkHistory.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8}>Nenhum vínculo registrado.</TableCell>
                                    </TableRow>
                                )}

                                {linkHistory.map((link) => {
                                    const linkStatus = LINK_STATUS_MAP[link.status] ?? { label: link.status, color: "default" };

                                    return (
                                        <TableRow key={link.id} hover>
                                            <TableCell>{link.usina?.usina_nome ?? "—"}</TableCell>
                                            <TableCell>{producerLabel(link.usina?.produtor)}</TableCell>
                                            <TableCell>
                                                <Chip label={linkStatus.label} color={linkStatus.color} size="small" />
                                            </TableCell>
                                            <TableCell>{`${Number(link.consumption_percentage ?? 0)}%`}</TableCell>
                                            <TableCell>{formatKwh(link.allocated_energy_kwh)}</TableCell>
                                            <TableCell>{formatDate(link.started_at)}</TableCell>
                                            <TableCell>{formatDate(link.ended_at)}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={link.is_active ? "Sim" : "Não"}
                                                    color={link.is_active ? "success" : "default"}
                                                    size="small"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardHeader title="Contratos" avatar={<IconFileText />} />
                <CardContent>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Código</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Emitido em</TableCell>
                                    <TableCell>Assinado em</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {contracts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5}>Nenhum contrato vinculado a esta UC.</TableCell>
                                    </TableRow>
                                )}

                                {contracts.map((contract) => {
                                    const contractStatus = CONTRACT_STATUS_MAP[contract.status] ?? { label: contract.status, color: "default" };

                                    return (
                                        <TableRow key={contract.id} hover>
                                            <TableCell sx={{ fontFamily: "monospace", fontWeight: 700 }}>{contract.contract_code}</TableCell>
                                            <TableCell>
                                                <Chip label={contractStatus.label} color={contractStatus.color} size="small" />
                                            </TableCell>
                                            <TableCell>{formatDate(contract.issued_at)}</TableCell>
                                            <TableCell>{formatDate(contract.signed_at)}</TableCell>
                                            <TableCell align="right">
                                                <Link href={route("consultor.cliente.contratos.show", contract.id)}>
                                                    <Button size="small" variant="outlined">Ver</Button>
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader title="Faturas da Concessionária" avatar={<IconFileInvoice />} />
                <CardContent>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Referência</TableCell>
                                    <TableCell>Concessionária</TableCell>
                                    <TableCell>Usina</TableCell>
                                    <TableCell>Vencimento</TableCell>
                                    <TableCell>Consumo</TableCell>
                                    <TableCell>Valor</TableCell>
                                    <TableCell>Revisão</TableCell>
                                    <TableCell align="right">Ações</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {billItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8}>Nenhuma fatura encontrada para esta UC.</TableCell>
                                    </TableRow>
                                )}

                                {billItems.map((bill) => (
                                    <TableRow key={bill.id} hover>
                                        <TableCell>{bill.reference_label ?? "—"}</TableCell>
                                        <TableCell>{bill.concessionaria?.nome ?? "—"}</TableCell>
                                        <TableCell>{bill.usina?.usina_nome ?? "—"}</TableCell>
                                        <TableCell>{formatDate(bill.vencimento)}</TableCell>
                                        <TableCell>{bill.consumo_kwh != null ? formatKwh(bill.consumo_kwh) : "—"}</TableCell>
                                        <TableCell>{bill.valor_total != null ? formatCurrency(bill.valor_total) : "—"}</TableCell>
                                        <TableCell>
                                            <Chip label={bill.review_status ? getStatusLabel(bill.review_status) : "—"} size="small" />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Link href={route("consultor.cliente.faturas.show", bill.id)}>
                                                <Button size="small" variant="outlined">Ver</Button>
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <div className="mt-4 flex justify-center gap-2">
                        {bills?.links?.map((link, index) => (
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

            <DeleteConsumerUnitDialog
                consumerUnit={consumerUnit}
                open={openDelete}
                onClose={() => setOpenDelete(false)}
            />
        </Layout>
    );
}
