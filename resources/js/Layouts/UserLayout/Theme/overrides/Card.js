export default function Card(theme) {
    return {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--cv-radius-xl)',
                    border: `1px solid ${theme.palette.grey[100]}`,
                    background: '#FFFFFF',
                    boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
                    overflow: 'hidden',
                    transition: 'box-shadow 200ms ease, border-color 200ms ease',
                },
            },
        },

        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '20px',
                    '&:last-child': {
                        paddingBottom: '20px',
                    },
                },
            },
        },

        MuiCardHeader: {
            styleOverrides: {
                root: {
                    padding: '14px 20px',
                    background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, rgba(248,250,252,0) 100%)`,
                    borderBottom: `1px solid ${theme.palette.grey[100]}`,
                },
                title: {
                    fontSize: '0.9375rem',
                    fontWeight: 800,
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    color: theme.palette.text.primary,
                },
                subheader: {
                    fontSize: '0.75rem',
                    marginTop: '2px',
                    color: theme.palette.text.secondary,
                },
                avatar: {
                    marginRight: '12px',
                },
                action: {
                    margin: 0,
                    alignSelf: 'center',
                },
            },
        },

        MuiCardActions: {
            styleOverrides: {
                root: {
                    padding: '10px 20px',
                    borderTop: `1px solid ${theme.palette.grey[100]}`,
                    backgroundColor: theme.palette.grey[50],
                },
            },
        },
    };
}
