import { router } from '@inertiajs/react';

/*
 * Modo demonstração (DEMO_MODE): a garantia de somente leitura está no servidor
 * (middleware DemoMode). Aqui o objetivo é a experiência: esmaecer os botões que
 * alteram dados e avisar o visitante antes de qualquer tentativa.
 */

export const DEMO_BLOCKED_EVENT = 'demo:blocked';

// Rótulos de ações que alteram dados. "Cancelar" sozinho fica de fora: fecha diálogos.
const ACTION_LABEL = new RegExp(
    '^\\+?\\s*(nov[oa]s?|cadastrar|criar|adicionar|incluir|editar|edição|alterar|excluir|remover|deletar|apagar|'
    + 'salvar|cancelar (a )?cobran|aprovar|rejeitar|reprovar|gerar|emitir|reemitir|enviar|importar|registrar|marcar|'
    + 'resolver|ignorar|escanear|sincronizar|reprocessar|vincular|desvincular|converter|ativar|desativar|bloquear|'
    + 'desbloquear|redefinir|restaurar|selecionar arquivo|abrir chamado|responder|convidar|conectar|alterar status|'
    + 'usar o|usar cor|confirmar)',
    'i',
);

const WRITE_PATH = /\/(create|edit|novo|nova|editar|cadastrar)(\/|$|\?)/i;

export function notifyBlocked() {
    window.dispatchEvent(new CustomEvent(DEMO_BLOCKED_EVENT));
}

function isAllowedWrite(url, allowedPaths) {
    const path = new URL(url, window.location.origin).pathname;
    return allowedPaths.some((allowed) => path === allowed || (allowed.endsWith('/') && path.startsWith(allowed)));
}

function labelOf(el) {
    return [el.textContent, el.getAttribute('aria-label'), el.getAttribute('title')]
        .filter(Boolean)
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
}

function shouldMute(el) {
    if (el.closest('[data-demo-allow]')) return false;

    const href = el.getAttribute('href');
    if (href && WRITE_PATH.test(href)) return true;

    return ACTION_LABEL.test(labelOf(el));
}

// Reavalia sempre: o React reaproveita botões entre telas (um "Editar" pode virar "Ver").
function muteActions(root) {
    root.querySelectorAll('button, a[href], [role="button"]').forEach((el) => {
        const muted = el.hasAttribute('data-demo-muted');
        if (shouldMute(el)) {
            if (!muted) el.setAttribute('data-demo-muted', '');
        } else if (muted) {
            el.removeAttribute('data-demo-muted');
        }
    });
}

export function installDemoGuard(demo) {
    const allowedPaths = demo?.allowed_paths ?? [];

    const style = document.createElement('style');
    style.textContent = `
        [data-demo-muted] { opacity: .42 !important; filter: grayscale(.35); cursor: not-allowed !important; }
    `;
    document.head.appendChild(style);

    // Navegações do Inertia: qualquer envio que não seja leitura, e telas de cadastro/edição.
    router.on('before', (event) => {
        const { method, url } = event.detail.visit;
        const writing = method !== 'get' && !isAllowedWrite(url, allowedPaths);
        const formScreen = method === 'get' && WRITE_PATH.test(new URL(url, window.location.origin).pathname);

        if (writing || formScreen) {
            event.preventDefault();
            notifyBlocked();
        }
    });

    // Chamadas axios fora do Inertia (uploads, ações em tabelas).
    window.axios?.interceptors.request.use((config) => {
        const method = (config.method || 'get').toLowerCase();
        if (method !== 'get' && method !== 'head' && !isAllowedWrite(config.url, allowedPaths)) {
            notifyBlocked();
            return Promise.reject(new Error('demo-readonly'));
        }
        return config;
    });

    // Clique em botão esmaecido: avisa em vez de abrir formulário ou diálogo.
    document.addEventListener('click', (event) => {
        if (event.target.closest?.('[data-demo-muted]')) {
            event.preventDefault();
            event.stopPropagation();
            notifyBlocked();
        }
    }, true);

    let scheduled = false;
    const refresh = () => {
        if (scheduled) return;
        scheduled = true;
        requestAnimationFrame(() => {
            scheduled = false;
            muteActions(document.body);
        });
    };

    muteActions(document.body);
    new MutationObserver(refresh).observe(document.body, { childList: true, subtree: true, characterData: true });
}
