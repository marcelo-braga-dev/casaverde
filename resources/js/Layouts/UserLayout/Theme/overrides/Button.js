export default function Button(theme) {
    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
                variant: 'contained',
            },
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '9px 18px',
                    fontWeight: 800,
                    textTransform: 'none',
                    boxShadow: 'none',
                    transition: 'all 160ms ease',
                    '&:hover': {
                        boxShadow: '0 8px 18px rgba(15, 23, 42, 0.14)',
                        transform: 'translateY(-1px)',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: theme.palette.grey[200],
                        color: theme.palette.grey[500],
                    },
                },

                containedPrimary: {
                    backgroundColor: theme.palette.primary.main,
                    color: theme.palette.primary.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.primary.dark,
                    },
                },

                containedSecondary: {
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.secondary.dark,
                    },
                },

                containedSuccess: {
                    backgroundColor: theme.palette.success.main,
                    color: theme.palette.success.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.success.dark,
                    },
                },

                containedWarning: {
                    backgroundColor: theme.palette.warning.main,
                    color: theme.palette.warning.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.warning.dark,
                    },
                },

                containedError: {
                    backgroundColor: theme.palette.error.main,
                    color: theme.palette.error.contrastText,
                    '&:hover': {
                        backgroundColor: theme.palette.error.dark,
                    },
                },

                outlined: {
                    borderWidth: 1.5,
                    backgroundColor: theme.palette.background.paper,
                    '&:hover': {
                        borderWidth: 1.5,
                        backgroundColor: theme.palette.action.hover,
                    },
                },

                text: {
                    '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                    },
                },

                sizeSmall: {
                    padding: '7px 13px',
                    borderRadius: 10,
                    fontSize: 13,
                },

                sizeMedium: {
                    fontSize: 14,
                },

                sizeLarge: {
                    padding: '12px 24px',
                    borderRadius: 14,
                    fontSize: 15,
                },
            },
        },
    };
}
