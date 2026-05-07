export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--cv-radius-xl)',
                    border: '1px solid var(--cv-border-soft)',
                    backgroundImage:
                        'linear-gradient(180deg, rgba(255,255,255,0.98), rgba(255,255,255,0.94))',
                    boxShadow: 'var(--cv-shadow-md)',
                    overflow: 'hidden',
                },
            },
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: 22,
                    '&:last-child': {
                        paddingBottom: 22,
                    },
                },
            },
        },
    };
}
