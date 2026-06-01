export default function Paper(theme) {
    return {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 12,
                    transition: 'box-shadow 200ms ease',
                },
                rounded: {
                    borderRadius: 12,
                },
                elevation0: {
                    boxShadow: 'none',
                    border: `1px solid ${theme.palette.grey[100]}`,
                },
                elevation1: {
                    boxShadow: '0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)',
                },
                elevation2: {
                    boxShadow: '0 2px 8px rgba(15,23,42,0.07), 0 1px 3px rgba(15,23,42,0.04)',
                },
                elevation3: {
                    boxShadow: '0 4px 16px rgba(15,23,42,0.09), 0 2px 6px rgba(15,23,42,0.05)',
                },
                elevation4: {
                    boxShadow: '0 8px 24px rgba(15,23,42,0.10), 0 3px 9px rgba(15,23,42,0.05)',
                },
                elevation8: {
                    boxShadow: '0 12px 36px rgba(15,23,42,0.12), 0 4px 14px rgba(15,23,42,0.06)',
                },
            },
        },

        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 16,
                    boxShadow: '0 24px 60px rgba(15,23,42,0.18), 0 8px 24px rgba(15,23,42,0.10)',
                },
            },
        },

        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    border: `1px solid ${theme.palette.grey[100]}`,
                    boxShadow: '0 8px 24px rgba(15,23,42,0.12), 0 3px 9px rgba(15,23,42,0.06)',
                },
                list: {
                    padding: '4px',
                },
            },
        },

        MuiMenuItem: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    margin: '1px 0',
                    padding: '7px 10px',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    gap: '8px',
                    transition: 'background-color 120ms ease',
                    '&:hover': {
                        backgroundColor: theme.palette.grey[50],
                    },
                    '&.Mui-selected': {
                        backgroundColor: 'rgba(47,125,24,0.08)',
                        '&:hover': { backgroundColor: 'rgba(47,125,24,0.12)' },
                    },
                },
            },
        },

        MuiPopover: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    border: `1px solid ${theme.palette.grey[100]}`,
                    boxShadow: '0 8px 24px rgba(15,23,42,0.12)',
                },
            },
        },
    };
}
