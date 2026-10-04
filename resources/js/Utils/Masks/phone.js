// Telefone brasileiro para campos controlados do React (as máscaras jQuery do projeto
// alteram o input por fora e dessincronizam o estado do formulário).
// Celular: (85) 9 8888-1234 · Fixo: (41) 3333-4444

function phoneDigits(value) {
    let digits = String(value ?? '').replace(/\D/g, '');
    // Número colado com o código do país (+55).
    if (digits.length > 11 && digits.startsWith('55')) digits = digits.slice(2);
    return digits.slice(0, 11);
}

export function formatPhoneBR(value) {
    const digits = phoneDigits(value);

    if (digits.length === 0) return '';
    if (digits.length <= 2) return `(${digits}`;

    const ddd = digits.slice(0, 2);
    const rest = digits.slice(2);

    if (digits.length <= 10) {
        return rest.length <= 4 ? `(${ddd}) ${rest}` : `(${ddd}) ${rest.slice(0, 4)}-${rest.slice(4)}`;
    }

    return `(${ddd}) ${rest.slice(0, 1)} ${rest.slice(1, 5)}-${rest.slice(5)}`;
}

// Para o onChange: se o usuário apagou só um separador ("-", ")" ou espaço), apaga também
// o dígito anterior; senão a máscara recolocaria o separador e o campo pareceria travado.
export function nextPhoneValue(previous, raw) {
    const before = phoneDigits(previous);
    let digits = phoneDigits(raw);

    if (String(raw).length < String(previous ?? '').length && digits === before) {
        digits = digits.slice(0, -1);
    }

    return formatPhoneBR(digits);
}
