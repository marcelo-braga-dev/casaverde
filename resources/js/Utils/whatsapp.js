/**
 * Substitui os placeholders {{variavel}} de um template pelos valores informados.
 */
export function renderWhatsAppTemplate(message, variables = {}) {
    if (!message) return '';

    return Object.entries(variables).reduce((text, [key, value]) => {
        const pattern = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
        return text.replace(pattern, value === null || value === undefined ? '' : String(value));
    }, message);
}

/**
 * Normaliza um telefone para o formato aceito pelo wa.me (DDI 55 + DDD + número, somente dígitos).
 */
export function formatPhoneForWhatsapp(phone) {
    if (!phone) return null;

    const digits = String(phone).replace(/\D+/g, '');

    if (!digits) return null;

    return digits.length <= 11 ? `55${digits}` : digits;
}

/**
 * Monta o link do WhatsApp. Sem telefone, usa o link de compartilhamento
 * genérico (api.whatsapp.com/send), que deixa o usuário escolher o contato.
 */
export function buildWhatsAppLink(message, phone = null) {
    const text = encodeURIComponent(message || '');
    const formattedPhone = formatPhoneForWhatsapp(phone);

    return formattedPhone
        ? `https://wa.me/${formattedPhone}?text=${text}`
        : `https://api.whatsapp.com/send?text=${text}`;
}

/**
 * Busca um template pela key dentro da lista compartilhada via Inertia (whatsappTemplates).
 */
export function getWhatsAppTemplate(templates, key) {
    return (templates || []).find((template) => template.key === key) || null;
}

/**
 * Busca o template pela key e já retorna a mensagem com as variáveis substituídas.
 */
export function buildWhatsAppMessage(templates, key, variables = {}, fallback = '') {
    const template = getWhatsAppTemplate(templates, key);
    const message = template ? template.message : fallback;

    return renderWhatsAppTemplate(message, variables);
}
