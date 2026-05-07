export default function Drawer(theme) {
    return {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRight: 0,
                    backgroundColor: theme.palette.background.sidebar,
                    boxShadow: theme.customShadows.sidebar,
                },
            },
        },
    };
}
