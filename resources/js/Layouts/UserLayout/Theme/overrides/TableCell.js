export default function TableCell(theme) {
    return {
        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    padding: '14px 16px',
                },
                head: {
                    backgroundColor: theme.palette.grey[50],
                    color: theme.palette.text.secondary,
                    fontSize: '0.76rem',
                    fontWeight: 900,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
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
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 18,
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: theme.customShadows.sm,
                },
            },
        },
    };
}
