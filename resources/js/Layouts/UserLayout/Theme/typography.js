export default function Typography(fontFamily) {
    return {
        fontFamily,
        fontSize: 14,

        h1: {
            fontWeight: 900,
            fontSize: '2.25rem',
            lineHeight: 1.18,
            letterSpacing: '-0.045em',
        },

        h2: {
            fontWeight: 850,
            fontSize: '1.875rem',
            lineHeight: 1.22,
            letterSpacing: '-0.04em',
        },

        h3: {
            fontWeight: 850,
            fontSize: '1.5rem',
            lineHeight: 1.26,
            letterSpacing: '-0.03em',
        },

        h4: {
            fontWeight: 800,
            fontSize: '1.25rem',
            lineHeight: 1.3,
            letterSpacing: '-0.025em',
        },

        h5: {
            fontWeight: 800,
            fontSize: '1.1rem',
            lineHeight: 1.35,
            letterSpacing: '-0.02em',
        },

        h6: {
            fontWeight: 750,
            fontSize: '0.95rem',
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
        },

        subtitle1: {
            fontWeight: 650,
            fontSize: '0.9375rem',
            lineHeight: 1.5,
            letterSpacing: '-0.005em',
        },

        subtitle2: {
            fontWeight: 650,
            fontSize: '0.8125rem',
            lineHeight: 1.45,
        },

        body1: {
            fontSize: '0.9375rem',
            lineHeight: 1.65,
        },

        body2: {
            fontSize: '0.8125rem',
            lineHeight: 1.6,
        },

        button: {
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '0.875rem',
            letterSpacing: '-0.008em',
        },

        caption: {
            fontSize: '0.71875rem',
            lineHeight: 1.5,
            color: '#64748B',
        },

        overline: {
            fontSize: '0.6875rem',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
        },
    };
}
