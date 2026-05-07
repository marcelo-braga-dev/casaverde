import { createTheme } from '@mui/material/styles';

const base = {
    green: {
        50: '#ECFDF5',
        100: '#D1FAE5',
        200: '#A7F3D0',
        300: '#6EE7B7',
        400: '#34D399',
        500: '#10B981',
        600: '#0B7A53',
        700: '#047857',
        800: '#065F46',
        900: '#064E3B',
    },
    blue: {
        50: '#EFF6FF',
        100: '#DBEAFE',
        200: '#BFDBFE',
        300: '#93C5FD',
        400: '#60A5FA',
        500: '#3B82F6',
        600: '#0284C7',
        700: '#0369A1',
        800: '#075985',
        900: '#0C4A6E',
    },
    slate: {
        50: '#F8FAFC',
        100: '#F1F5F9',
        200: '#E2E8F0',
        300: '#CBD5E1',
        400: '#94A3B8',
        500: '#64748B',
        600: '#475569',
        700: '#334155',
        800: '#1E293B',
        900: '#0F172A',
        950: '#020617',
    },
    amber: {
        50: '#FFFBEB',
        100: '#FEF3C7',
        300: '#FCD34D',
        500: '#F59E0B',
        600: '#D97706',
        700: '#B45309',
    },
    red: {
        50: '#FEF2F2',
        100: '#FEE2E2',
        500: '#EF4444',
        600: '#DC2626',
        700: '#B91C1C',
    },
};

const Palette = (mode = 'light') => {
    const isDark = mode === 'dark';

    return createTheme({
        palette: {
            mode,

            primary: {
                main: base.green[600],
                light: base.green[100],
                dark: base.green[900],
                contrastText: '#FFFFFF',
            },

            secondary: {
                main: base.blue[600],
                light: base.blue[100],
                dark: base.blue[800],
                contrastText: '#FFFFFF',
            },

            success: {
                main: base.green[500],
                light: base.green[100],
                dark: base.green[800],
                contrastText: '#FFFFFF',
            },

            warning: {
                main: base.amber[500],
                light: base.amber[100],
                dark: base.amber[700],
                contrastText: base.slate[950],
            },

            error: {
                main: base.red[600],
                light: base.red[100],
                dark: base.red[700],
                contrastText: '#FFFFFF',
            },

            info: {
                main: base.blue[600],
                light: base.blue[100],
                dark: base.blue[800],
                contrastText: '#FFFFFF',
            },

            background: {
                default: isDark ? base.slate[950] : '#F5F7FA',
                paper: isDark ? base.slate[900] : '#FFFFFF',
                sidebar: isDark ? base.slate[950] : base.slate[950],
                header: isDark
                    ? 'rgba(15, 23, 42, 0.82)'
                    : 'rgba(255, 255, 255, 0.82)',
                elevated: isDark ? base.slate[900] : '#FFFFFF',
                soft: isDark ? base.slate[900] : base.slate[50],
            },

            text: {
                primary: isDark ? base.slate[50] : base.slate[900],
                secondary: isDark ? base.slate[300] : base.slate[500],
                disabled: isDark ? base.slate[600] : base.slate[400],
            },

            divider: isDark
                ? 'rgba(255,255,255,0.08)'
                : 'rgba(15,23,42,0.08)',

            grey: {
                50: base.slate[50],
                100: base.slate[100],
                200: base.slate[200],
                300: base.slate[300],
                400: base.slate[400],
                500: base.slate[500],
                600: base.slate[600],
                700: base.slate[700],
                800: base.slate[800],
                900: base.slate[900],
            },

            casaVerde: {
                green: base.green,
                blue: base.blue,
                slate: base.slate,
                amber: base.amber,
                red: base.red,
                gradientPrimary: 'linear-gradient(135deg, #064E3B 0%, #0B7A53 45%, #10B981 100%)',
                gradientTech: 'linear-gradient(135deg, #0F172A 0%, #0369A1 52%, #10B981 100%)',
                gradientDark: 'linear-gradient(180deg, #0F172A 0%, #020617 100%)',
                gradientHero: 'radial-gradient(circle at top right, rgba(14,165,233,0.32), transparent 34%), radial-gradient(circle at bottom left, rgba(16,185,129,0.28), transparent 36%), linear-gradient(135deg, #064E3B 0%, #0F172A 72%)',
            },

            common: {
                black: '#000000',
                white: '#FFFFFF',
            },
        },
    });
};

export default Palette;
