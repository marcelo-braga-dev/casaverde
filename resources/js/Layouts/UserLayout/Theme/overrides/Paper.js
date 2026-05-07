export default function Paper(theme) {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 18,
                },
                elevation1: {
                    boxShadow: theme.customShadows.sm,
                },
                elevation2: {
                    boxShadow: theme.customShadows.md,
                },
                elevation3: {
                    boxShadow: theme.customShadows.lg,
                },
            },
        },
    };
}
