export default function Chip(theme) {
    return {
        MuiChip: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: '0.71875rem',
                    letterSpacing: '-0.005em',
                    height: 26,
                    transition: 'var(--cv-transition-fast)',
                },
                sizeSmall: {
                    height: 22,
                    fontSize: '0.6875rem',
                    padding: '0 6px',
                    '& .MuiChip-label': {
                        padding: '0 6px',
                    },
                },
                label: {
                    padding: '0 10px',
                },
                filledSuccess: {
                    backgroundColor: '#DCFCE7',
                    color: '#15803D',
                },
                filledWarning: {
                    backgroundColor: '#FEF9C3',
                    color: '#A16207',
                },
                filledError: {
                    backgroundColor: '#FEE2E2',
                    color: '#B91C1C',
                },
                filledInfo: {
                    backgroundColor: '#DBEAFE',
                    color: '#1D4ED8',
                },
                filledDefault: {
                    backgroundColor: theme.palette.grey[100],
                    color: theme.palette.grey[700],
                },
                outlinedDefault: {
                    borderColor: theme.palette.grey[300],
                    color: theme.palette.grey[700],
                },
            },
        },
    };
}
