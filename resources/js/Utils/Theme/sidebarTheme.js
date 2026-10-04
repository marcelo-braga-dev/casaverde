const HEX = /^#[0-9A-Fa-f]{6}$/;

export const isHex = (value) => HEX.test(value || '');

export function channels(hex) {
    const value = parseInt(hex.slice(1), 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

export function mix(hex, target, amount) {
    return `rgb(${channels(hex).map((c) => Math.round(c + (target - c) * amount)).join(', ')})`;
}

export function rgba(hex, alpha) {
    return `rgba(${channels(hex).join(', ')}, ${alpha})`;
}

function luminance(hex) {
    const [r, g, b] = channels(hex).map((c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Razão de contraste WCAG entre duas cores (1 a 21). Abaixo de 4,5 o texto fica difícil de ler.
export function contrastRatio(a, b) {
    if (!isHex(a) || !isHex(b)) {
        return null;
    }

    const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);

    return (light + 0.05) / (dark + 0.05);
}

// Acima de ~0,45 de luminância relativa (WCAG) o fundo é claro e pede texto escuro.
function isLight(hex) {
    return luminance(hex) > 0.45;
}

const DARK_TEXT = '#1F2937';
const LIGHT_TEXT = '#FFFFFF';

export function contrastText(hex) {
    return isHex(hex) && isLight(hex) ? DARK_TEXT : LIGHT_TEXT;
}

// Cor escolhida em Identidade Visual: fundo sólido, sem degradê.
export function sidebarBackground(hex) {
    return isHex(hex) ? hex : null;
}

/**
 * Variáveis CSS do menu lateral a partir da Identidade Visual. Sem nada configurado,
 * devolve {} e vale o padrão verde do casa-verde-theme.css.
 * - texto vazio: automático pelo contraste com o fundo;
 * - destaque vazio: cor secundária (só quando o fundo foi personalizado); a primária
 *   costuma ser a própria cor do menu e sumiria sobre o fundo.
 */
export function sidebarThemeVars({ background, text, accent, secondary } = {}) {
    const vars = {};

    if (isHex(background)) {
        vars['--cv-gradient-sidebar'] = sidebarBackground(background);
        vars['--cv-shadow-sidebar'] = `4px 0 24px ${rgba(background, 0.25)}, 2px 0 8px ${rgba(background, 0.12)}`;
    }

    const fg = isHex(text) ? text : isHex(background) ? contrastText(background) : null;

    if (fg) {
        vars['--cv-sidebar-fg'] = fg;
        vars['--cv-sidebar-fg-rgb'] = channels(fg).join(', ');
    }

    const highlight = isHex(accent) ? accent : isHex(background) && isHex(secondary) ? secondary : null;

    if (highlight) {
        const deeper = mix(highlight, 0, 0.25);
        vars['--cv-sidebar-active-bg'] = `linear-gradient(135deg, ${highlight}, ${deeper})`;
        vars['--cv-sidebar-active-bg-hover'] = `linear-gradient(135deg, ${mix(highlight, 255, 0.08)}, ${highlight})`;
        vars['--cv-sidebar-active-shadow'] = `0 14px 34px ${rgba(highlight, 0.22)}`;
        vars['--cv-sidebar-active-fg'] = contrastText(highlight);
        vars['--cv-sidebar-icon-active-bg'] = `linear-gradient(135deg, ${highlight} 0%, ${deeper} 100%)`;
        vars['--cv-sidebar-group-active-bg'] = rgba(highlight, 0.18);
        vars['--cv-sidebar-group-active-border'] = rgba(highlight, 0.35);
        vars['--cv-sidebar-sub-active-bg'] = rgba(highlight, 0.16);
        vars['--cv-sidebar-sub-active-hover'] = rgba(highlight, 0.22);
        vars['--cv-sidebar-sub-active-border'] = highlight;
        vars['--cv-sidebar-sub-dot'] = highlight;
    }

    return vars;
}

export const SIDEBAR_VARIABLES = [
    '--cv-gradient-sidebar', '--cv-shadow-sidebar', '--cv-sidebar-fg', '--cv-sidebar-fg-rgb',
    '--cv-sidebar-active-bg', '--cv-sidebar-active-bg-hover', '--cv-sidebar-active-shadow',
    '--cv-sidebar-active-fg', '--cv-sidebar-icon-active-bg', '--cv-sidebar-group-active-bg',
    '--cv-sidebar-group-active-border', '--cv-sidebar-sub-active-bg', '--cv-sidebar-sub-active-hover',
    '--cv-sidebar-sub-active-border', '--cv-sidebar-sub-dot',
];

// Espelho dos valores padrão do casa-verde-theme.css, para a prévia da Identidade
// Visual mostrar o padrão mesmo quando a página já carregou com cores personalizadas.
export const DEFAULT_SIDEBAR_VARS = {
    '--cv-gradient-sidebar': 'radial-gradient(ellipse at 15% 0%, rgba(74,222,128,0.18), transparent 40%), linear-gradient(175deg, #052e16 0%, #14532D 40%, #065f46 100%)',
    '--cv-shadow-sidebar': '4px 0 24px rgba(5,46,22,0.25), 2px 0 8px rgba(5,46,22,0.12)',
    '--cv-sidebar-fg': '#FFFFFF',
    '--cv-sidebar-fg-rgb': '255, 255, 255',
    '--cv-sidebar-active-bg': 'linear-gradient(135deg, rgba(16,185,129,0.98), rgba(2,132,199,0.86))',
    '--cv-sidebar-active-bg-hover': 'linear-gradient(135deg, rgba(16,185,129,1), rgba(2,132,199,0.92))',
    '--cv-sidebar-active-shadow': '0 14px 34px rgba(16,185,129,0.18)',
    '--cv-sidebar-active-fg': '#FFFFFF',
    '--cv-sidebar-icon-active-bg': 'linear-gradient(135deg, #10B981 0%, #0B7A53 100%)',
    '--cv-sidebar-group-active-bg': 'rgba(47, 125, 24, 0.22)',
    '--cv-sidebar-group-active-border': 'rgba(79, 154, 42, 0.30)',
    '--cv-sidebar-sub-active-bg': 'rgba(74,222,128,0.14)',
    '--cv-sidebar-sub-active-hover': 'rgba(74,222,128,0.18)',
    '--cv-sidebar-sub-active-border': 'rgba(74,222,128,0.80)',
    '--cv-sidebar-sub-dot': '#4ade80',
};
