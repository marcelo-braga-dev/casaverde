export default function IconButton(theme) {
    return {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    transition: 'all 160ms ease',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
            },
        },
    };
}
