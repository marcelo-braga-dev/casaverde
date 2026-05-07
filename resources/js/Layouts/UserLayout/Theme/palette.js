import { createTheme } from '@mui/material/styles';

const brand = {
    primary: '#2F7D18',
    primaryDark: '#1F5F10',
    primaryDarker: '#123D0B',
    primaryLight: '#DFF3D8',
    primarySoft: '#F3FAF0',

    secondary: '#4F9A2A',
    secondaryDark: '#2F7D18',
    secondaryLight: '#E8F6E2',

    accent: '#7BAA2F',
    black: '#050505',
    graphite: '#111827',
    white: '#FFFFFF',

    background: '#F7FAF5',
    surface: '#FFFFFF',
    surfaceSoft: '#F3FAF0',

    textPrimary: '#111827',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',

    border: '#E2E8F0',

    success: '#2F7D18',
    warning: '#D89614',
    error: '#C62828',
    info: '#3F8F24',

    gradientPrimary: 'linear-gradient(135deg, #1F5F10 0%, #2F7D18 48%, #4F9A2A 100%)',
    gradientDark: 'linear-gradient(180deg, #123D0B 0%, #050505 100%)',
    gradientSidebar: 'radial-gradient(circle at 20% 0%, rgba(79, 154, 42, 0.28), transparent 30%), linear-gradient(180deg, #123D0B 0%, #050505 100%)',
    gradientHero: 'radial-gradient(circle at top right, rgba(79,154,42,0.32), transparent 34%), radial-gradient(circle at bottom left, rgba(47,125,24,0.28), transparent 36%), linear-gradient(135deg, #123D0B 0%, #050505 76%)',
};

const Palette = (mode = 'light') => {
    const isDark = mode === 'dark';

    return createTheme({
        palette: {
            mode,

            primary: {
                main: brand.primary,
                light: brand.primaryLight,
                dark: brand.primaryDark,
                contrastText: brand.white,
            },

            secondary: {
                main: brand.secondary,
                light: brand.secondaryLight,
                dark: brand.secondaryDark,
                contrastText: brand.white,
            },

            success: {
                main: brand.success,
                light: brand.primaryLight,
                dark: brand.primaryDark,
                contrastText: brand.white,
            },

            warning: {
                main: brand.warning,
                light: '#FFF4D8',
                dark: '#9A6508',
                contrastText: brand.black,
            },

            error: {
                main: brand.error,
                light: '#FDE2E2',
                dark: '#8E1D1D',
                contrastText: brand.white,
            },

            info: {
                main: brand.info,
                light: brand.secondaryLight,
                dark: brand.primaryDark,
                contrastText: brand.white,
            },

            background: {
                default: isDark ? brand.black : brand.background,
                paper: isDark ? brand.graphite : brand.surface,
                sidebar: brand.black,
                header: isDark
                    ? 'rgba(5, 5, 5, 0.82)'
                    : 'rgba(255, 255, 255, 0.86)',
                elevated: isDark ? brand.graphite : brand.surface,
                soft: isDark ? '#1F2937' : brand.surfaceSoft,
            },

            text: {
                primary: isDark ? brand.white : brand.textPrimary,
                secondary: brand.textSecondary,
                disabled: brand.textMuted,
            },

            divider: 'rgba(17, 24, 39, 0.08)',

            grey: {
                50: '#F8FAFC',
                100: '#F1F5F9',
                200: '#E2E8F0',
                300: '#CBD5E1',
                400: '#94A3B8',
                500: '#64748B',
                600: '#475569',
                700: '#334155',
                800: '#1F2937',
                900: '#111827',
            },

            casaVerde: {
                ...brand,
            },

            common: {
                black: brand.black,
                white: brand.white,
            },
        },
    });
};

export default Palette;
