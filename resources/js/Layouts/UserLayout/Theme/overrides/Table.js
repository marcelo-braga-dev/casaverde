export default function Table(theme) {
    return {
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    border: 'none',
                    boxShadow: 'none',
                    overflowX: 'auto',
                    WebkitOverflowScrolling: 'touch',
                },
            },
        },

        MuiTableHead: {
            styleOverrides: {
                root: {
                    background: `linear-gradient(180deg, ${theme.palette.grey[50]} 0%, ${theme.palette.grey[100]} 100%)`,
                    '.MuiTableCell-root': {
                        color: theme.palette.text.secondary,
                        fontWeight: 700,
                        fontSize: '0.6875rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.07em',
                        borderBottom: `2px solid ${theme.palette.grey[200]}`,
                        padding: '9px 16px',
                        whiteSpace: 'nowrap',
                        lineHeight: 1.4,
                    },
                },
            },
        },

        MuiTableCell: {
            styleOverrides: {
                root: {
                    borderBottom: `1px solid ${theme.palette.grey[100]}`,
                    padding: '10px 16px',
                    fontSize: '0.8125rem',
                    color: theme.palette.text.primary,
                    verticalAlign: 'middle',
                    lineHeight: 1.5,
                },
            },
        },

        MuiTableRow: {
            styleOverrides: {
                root: {
                    transition: 'background-color 100ms ease',
                    '&.MuiTableRow-hover:hover, &:hover': {
                        backgroundColor: 'rgba(47,125,24,0.035)',
                    },
                    '&:last-child .MuiTableCell-root': {
                        borderBottom: 'none',
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(47,125,24,0.06)',
                        '&:hover': { backgroundColor: 'rgba(47,125,24,0.09)' },
                    },
                },
                head: {
                    '&:hover': { backgroundColor: 'transparent !important' },
                },
            },
        },
    };
}
