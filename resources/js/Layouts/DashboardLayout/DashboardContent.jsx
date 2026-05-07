import { Box } from '@mui/material';

export default function DashboardContent({ children }) {
    return (
        <Box
            component="main"
            sx={{
                flex: 1,
                px: {
                    xs: 2,
                    sm: 3,
                    lg: 4,
                },
                py: {
                    xs: 2,
                    lg: 3,
                },
                maxWidth: '1680px',
                width: '100%',
                mx: 'auto',
            }}
        >
            {children}
        </Box>
    );
}
