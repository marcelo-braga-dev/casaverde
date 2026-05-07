export default function OutlinedInput(theme) {
    return {
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    borderRadius: 14,
                    backgroundColor: theme.palette.background.paper,
                    transition: 'all 160ms ease',
                    '& fieldset': {
                        borderColor: theme.palette.divider,
                    },
                    '&:hover fieldset': {
                        borderColor: theme.palette.primary.main,
                    },
                    '&.Mui-focused': {
                        boxShadow: theme.customShadows.focusPrimary,
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main,
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
