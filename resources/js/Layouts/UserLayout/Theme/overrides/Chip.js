export default function Chip(theme) {
    return {
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 999,
                    fontWeight: 700,
                },
                filledSuccess: {
                    backgroundColor: theme.palette.success.light,
                    color: theme.palette.success.dark,
                },
                filledWarning: {
                    backgroundColor: theme.palette.warning.light,
                    color: theme.palette.warning.dark,
                },
                filledError: {
                    backgroundColor: theme.palette.error.light,
                    color: theme.palette.error.dark,
                },
                filledInfo: {
                    backgroundColor: theme.palette.info.light,
                    color: theme.palette.info.dark,
                },
            },
        },
    };
}
