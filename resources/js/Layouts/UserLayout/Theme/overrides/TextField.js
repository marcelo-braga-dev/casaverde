export default function TextField(theme) {
    return {
        MuiTextField: {
            defaultProps: { variant: 'outlined', size: 'small' },
        },

        MuiInputLabel: {
            styleOverrides: {
                root: {
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    color: theme.palette.text.secondary,
                    '&.Mui-focused': { color: theme.palette.primary.main },
                },
            },
        },

        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    backgroundColor: '#FFFFFF',
                    fontSize: '0.8125rem',
                    transition: 'var(--cv-transition-fast)',
                    '& fieldset': {
                        borderColor: theme.palette.divider,
                        borderWidth: '1.5px',
                        transition: 'border-color 140ms ease',
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.grey[400],
                    },
                    '&.Mui-focused': {
                        boxShadow: '0 0 0 3px rgba(22,101,52,0.10)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
                        borderWidth: '1.5px',
                    },
                    '&.Mui-error fieldset': {
                        borderColor: theme.palette.error.main,
                    },
                },
                input: {
                    padding: '8px 12px',
                    '&::placeholder': {
                        color: theme.palette.text.disabled,
                        opacity: 1,
                    },
                },
                multiline: { padding: 0 },
            },
        },

        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: '0.71875rem',
                    marginTop: 4,
                    marginLeft: 2,
                },
            },
        },
    };
}
