export default function Table(theme) {
    return {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 18,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.customShadows.z4,
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.grey[50],
                    '.MuiTableCell-root': {
                        color: theme.palette.text.secondary,
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                    },
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: '14px 16px',
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background-color 160ms ease',
                    '&:hover': {
                        backgroundColor: theme.palette.grey[50],
                    },
                },
            },
        },
    };
}
