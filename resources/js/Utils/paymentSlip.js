// Espelha PaymentSlip::effectiveDueDate(): o backend envia `effective_due_date` (Y-m-d,
// lida do código de barras quando há boleto), que é a data que o banco aceita.
export function effectiveDueDate(payment) {
    return payment?.effective_due_date || null;
}

export function formatDueDate(payment) {
    const value = effectiveDueDate(payment);

    if (!value) {
        return payment?.due_date || "—";
    }

    const [year, month, day] = value.split("-");

    return `${day}/${month}/${year}`;
}

function todayIso() {
    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");

    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// Pagável = ainda ativo no sistema e dentro da data do banco. Um slip "generated" com
// data já passada (antes da rotina diária marcá-lo) também não pode ser enviado.
export function isSlipPayable(payment) {
    if (!payment || !["pending", "generated"].includes(payment.status)) {
        return false;
    }

    const due = effectiveDueDate(payment);

    return !due || due >= todayIso();
}

export function isSlipExpired(payment) {
    if (!payment) {
        return false;
    }

    if (payment.status === "expired") {
        return true;
    }

    return ["pending", "generated"].includes(payment.status) && !isSlipPayable(payment);
}

export function buildPaymentData(payment, { replacesExpired = false } = {}) {
    const lines = [];

    if (payment?.digitable_line) {
        lines.push(`Linha digitável:\n${payment.digitable_line}`);
    }

    if (payment?.pix_copy_paste) {
        lines.push(`Pix copia e cola:\n${payment.pix_copy_paste}`);
    }

    if (payment?.pdf_url) {
        lines.push(`Boleto em PDF: ${payment.pdf_url}`);
    }

    if (replacesExpired) {
        lines.push("Este boleto substitui o anterior, que venceu e não pode mais ser pago.");
    }

    return lines.join("\n\n");
}
