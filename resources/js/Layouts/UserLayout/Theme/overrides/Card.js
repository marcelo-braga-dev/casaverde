export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 22,
                    border: `1px solid ${theme.palette.divider}`,
                    backgroundImage: 'linear-gradient(180deg, rgba(255,255,255,0.96), rgba(255,255,255,0.90))',
                    boxShadow: theme.customShadows.card,
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
