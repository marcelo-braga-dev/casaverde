export default function OutlinedInput(theme) {
    return {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 'var(--cv-radius-md)',
                    backgroundColor: 'var(--cv-white)',
                    transition: 'all 160ms ease',
                    '& fieldset': {
                        borderColor: 'var(--cv-border)',
                    },
                    '&:hover fieldset': {
                        borderColor: 'var(--cv-primary)',
                    },
                    '&.Mui-focused': {
                        boxShadow: '0 0 0 4px rgba(47, 125, 24, 0.12)',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'var(--cv-primary)',
                        borderWidth: 1,
                    },
                },
                input: {
                    fontWeight: 600,
                },
            },
        },
    };
}
