export const statusLabels = {
    pending_review: "Aguardando Revisão",
    reviewed: "Revisada",
    corrected: "Corrigida",
    approved: "Aprovada",

    pending: "Pendente",
    success: "Sucesso",
    error: "Erro",

    manual: "Manual",
    email: "E-mail",
};

export const statusColors = {
    pending_review: "warning",
    reviewed: "info",
    corrected: "primary",
    approved: "success",

    pending: "warning",
    success: "success",
    error: "error",

    manual: "default",
    email: "info",
};

export const getStatusLabel = (status) => {
    if (!status) return "Sem status";

    return statusLabels[status] || status;
};

export const getStatusColor = (status) => {
    return statusColors[status] || "default";
};
