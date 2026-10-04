import { isHex, mix, rgba } from './sidebarTheme';

// Primária padrão: com ela, valem os tons verdes desenhados à mão no casa-verde-theme.css.
const DEFAULT_PRIMARY = '#2f7d18';

/**
 * Variáveis CSS de marca (--cv-primary*, --cv-gradient-*) derivadas da cor primária da
 * Identidade Visual. Telas e componentes pintam ícones de cabeçalho, banners e botões
 * principais com essas variáveis. Cores semânticas (pago, aprovado, economia) ficam fora.
 */
export function brandThemeVars(primary) {
    if (!isHex(primary) || primary.toLowerCase() === DEFAULT_PRIMARY) {
        return {};
    }

    const dark = mix(primary, 0, 0.25);
    const darker = mix(primary, 0, 0.5);
    const deepest = mix(primary, 0, 0.7);
    const bright = mix(primary, 255, 0.25);

    return {
        '--cv-primary': primary,
        '--cv-primary-rgb': primary.slice(1).match(/../g).map((h) => parseInt(h, 16)).join(', '),
        '--cv-primary-dark': dark,
        '--cv-primary-darker': darker,
        '--cv-primary-light': mix(primary, 255, 0.85),
        '--cv-primary-soft': mix(primary, 255, 0.94),
        '--cv-gradient-primary': `linear-gradient(135deg, ${dark} 0%, ${primary} 50%, ${bright} 100%)`,
        '--cv-gradient-dark': `linear-gradient(180deg, ${darker} 0%, ${deepest} 100%)`,
        '--cv-gradient-hero': `radial-gradient(ellipse at top right, ${rgba(primary, 0.35)}, transparent 42%), radial-gradient(ellipse at bottom left, ${rgba(primary, 0.25)}, transparent 44%), linear-gradient(135deg, ${darker} 0%, ${deepest} 100%)`,
    };
}

export const BRAND_VARIABLES = [
    '--cv-primary', '--cv-primary-rgb', '--cv-primary-dark', '--cv-primary-darker',
    '--cv-primary-light', '--cv-primary-soft', '--cv-gradient-primary', '--cv-gradient-dark',
    '--cv-gradient-hero',
];
