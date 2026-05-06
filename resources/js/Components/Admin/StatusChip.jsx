import { Chip } from "@mui/material";

const statusMap = {
    draft: { label: "Rascunho", color: "default" },
    open: { label: "Aberta", color: "primary" },
    waiting_payment: { label: "Aguardando pagamento", color: "warning" },
    paid: { label: "Paga", color: "success" },
    overdue: { label: "Atrasada", color: "error" },
    cancelled: { label: "Cancelada", color: "default" },

    pending: { label: "Pendente", color: "default" },
    generated: { label: "Gerado", color: "primary" },
    failed: { label: "Falhou", color: "error" },
    expired: { label: "Expirado", color: "warning" },

    received: { label: "Recebido", color: "default" },
    processed: { label: "Processado", color: "success" },
    ignored: { label: "Ignorado", color: "warning" },

    pending_review: { label: "Aguardando revisão", color: "warning" },
    reviewed: { label: "Revisada", color: "primary" },
    corrected: { label: "Corrigida", color: "info" },
    approved: { label: "Aprovada", color: "success" },

    issued: { label: "Emitido", color: "primary" },
    signed: { label: "Assinado", color: "success" },
    active: { label: "Ativo", color: "success" },
    inactive: { label: "Inativo", color: "default" },

    ativo: { label: "Ativo", color: "success" },
    inativo: { label: "Inativo", color: "default" },
};

export default function StatusChip({ status, label, size = "small", variant = "filled" }) {
    const item = statusMap[status] || {
        label: label || status || "-",
        color: "default",
    };

    return (
        <Chip
            label={label || item.label}
            color={item.color}
            size={size}
            variant={variant}
        />
    );
}
