export default function Button(theme) {
    return {
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    padding: '9px 18px',
                    fontWeight: 750,
                    boxShadow: 'none',
                    transition: 'all 180ms ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                    '&.Mui-disabled': {
                        backgroundColor: theme.palette.grey[200],
                        color: theme.palette.grey[500],
                    },
                },
                containedPrimary: {
                    background: 'linear-gradient(135deg, #0B7A53 0%, #16A34A 100%)',
                    color: '#FFFFFF',
                    boxShadow: theme.customShadows.primary,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #064E3B 0%, #0B7A53 100%)',
                        boxShadow: '0 16px 32px rgba(11, 122, 83, 0.32)',
                    },
                },
                containedSecondary: {
                    background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                    color: '#FFFFFF',
                    boxShadow: theme.customShadows.secondary,
                    '&:hover': {
                        background: 'linear-gradient(135deg, #0369A1 0%, #0284C7 100%)',
                    },
                },
                outlined: {
                    borderColor: theme.palette.divider,
                    backgroundColor: '#FFFFFF',
                    '&:hover': {
                        borderColor: theme.palette.primary.main,
                        backgroundColor: theme.palette.primary.light,
                    },
                },
                text: {
                    '&:hover': {
                        backgroundColor: theme.palette.grey[100],
                    },
                },
                sizeSmall: {
                    padding: '7px 13px',
                    borderRadius: 10,
                },
                sizeLarge: {
                    padding: '12px 24px',
                    borderRadius: 14,
                },
            },
        },
    };
}
