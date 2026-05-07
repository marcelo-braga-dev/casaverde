export default function Typography(fontFamily) {
    return {
        fontFamily,

        h1: {
            fontWeight: 800,
            fontSize: '2.4rem',
            lineHeight: 1.18,
            letterSpacing: '-0.04em',
        },

        h2: {
            fontWeight: 800,
            fontSize: '2rem',
            lineHeight: 1.2,
            letterSpacing: '-0.035em',
        },

        h3: {
            fontWeight: 800,
            fontSize: '1.65rem',
            lineHeight: 1.25,
            letterSpacing: '-0.03em',
        },

        h4: {
            fontWeight: 750,
            fontSize: '1.35rem',
            lineHeight: 1.3,
            letterSpacing: '-0.025em',
        },

        h5: {
            fontWeight: 750,
            fontSize: '1.15rem',
            lineHeight: 1.35,
        },

        h6: {
            fontWeight: 700,
            fontSize: '1rem',
            lineHeight: 1.4,
        },

        subtitle1: {
            fontWeight: 600,
            fontSize: '0.95rem',
            lineHeight: 1.5,
        },

        subtitle2: {
            fontWeight: 600,
            fontSize: '0.85rem',
            lineHeight: 1.45,
        },

        body1: {
            fontSize: '0.95rem',
            lineHeight: 1.65,
        },

        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.6,
        },

        button: {
            textTransform: 'none',
            fontWeight: 700,
            letterSpacing: '-0.01em',
        },

        caption: {
            fontSize: '0.75rem',
            lineHeight: 1.45,
            color: '#64748B',
        },
    };
}
