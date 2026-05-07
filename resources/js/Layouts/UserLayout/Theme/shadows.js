export default function CustomShadows(theme) {
    return {
        none: 'none',

        xs: 'var(--cv-shadow-sm)',
        sm: 'var(--cv-shadow-sm)',
        md: 'var(--cv-shadow-md)',
        lg: 'var(--cv-shadow-lg)',
        xl: 'var(--cv-shadow-xl)',

        card: 'var(--cv-shadow-md)',
        cardHover: 'var(--cv-shadow-lg)',

        sidebar: 'var(--cv-shadow-sidebar)',
        header: '0 10px 35px rgba(17, 24, 39, 0.08)',

        primary: 'var(--cv-shadow-primary)',
        secondary: '0 16px 38px rgba(79, 154, 42, 0.22)',
        success: '0 16px 38px rgba(47, 125, 24, 0.24)',
        warning: '0 16px 38px rgba(216, 150, 20, 0.24)',
        error: '0 16px 38px rgba(198, 40, 40, 0.24)',

        focusPrimary: '0 0 0 4px rgba(47, 125, 24, 0.12)',
        focusSecondary: '0 0 0 4px rgba(79, 154, 42, 0.12)',
    };
}
