export default function Button(theme) {
    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
                variant: 'contained',
            },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '8px 18px',
                    fontWeight: 700,
                    fontSize: '0.8125rem',
                    textTransform: 'none',
                    letterSpacing: '-0.005em',
                    boxShadow: 'none',
                    transition: 'var(--cv-transition-fast)',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(15, 23, 42, 0.12)',
                    },
                    '&:active': {
                        transform: 'translateY(0)',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: theme.palette.grey[100],
                        color: theme.palette.grey[400],
                        boxShadow: 'none',
                    },
                },

                containedPrimary: {
                    background: 'linear-gradient(135deg, #166534 0%, #15803D 100%)',
                    color: '#FFFFFF',
                    '&:hover': {
                        background: 'linear-gradient(135deg, #14532D 0%, #166534 100%)',
                    },
                },

                containedSecondary: {
                    backgroundColor: theme.palette.secondary.main,
                    '&:hover': { backgroundColor: theme.palette.secondary.dark },
                },

                containedSuccess: {
                    backgroundColor: theme.palette.success.main,
                    '&:hover': { backgroundColor: theme.palette.success.dark },
                },

                containedWarning: {
                    backgroundColor: theme.palette.warning.main,
                    color: '#FFFFFF',
                    '&:hover': { backgroundColor: theme.palette.warning.dark },
                },

                containedError: {
                    backgroundColor: theme.palette.error.main,
                    '&:hover': { backgroundColor: theme.palette.error.dark },
                },

                outlined: {
                    borderWidth: '1.5px',
                    backgroundColor: 'transparent',
                    '&:hover': {
                        borderWidth: '1.5px',
                        backgroundColor: theme.palette.grey[50],
                    },
                },

                outlinedPrimary: {
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': { backgroundColor: 'rgba(22,101,52,0.05)' },
                },

                text: {
                    '&:hover': { backgroundColor: theme.palette.grey[50] },
                },

                textPrimary: {
                    color: theme.palette.primary.main,
                    '&:hover': { backgroundColor: 'rgba(22,101,52,0.05)' },
                },

                sizeSmall: {
                    padding: '5px 12px',
                    borderRadius: 8,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                },

                sizeMedium: {
                    fontSize: '0.8125rem',
                },

                sizeLarge: {
                    padding: '10px 24px',
                    borderRadius: 12,
                    fontSize: '0.9375rem',
                },
            },
        },

        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    transition: 'var(--cv-transition-fast)',
                    '&:hover': { backgroundColor: theme.palette.grey[100] },
                },
                sizeSmall: { padding: 5 },
            },
        },
    };
}
