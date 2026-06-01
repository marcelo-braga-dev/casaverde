import { Box } from '@mui/material';

export default function AppMain({ children, maxWidth = '1680px' }) {
    return (
        <Box
            component="main"
            sx={{
                flex: 1,
                width: '100%',
                maxWidth,
                mx: 'auto',
                px: { xs: 2, sm: 2.5, lg: 3, xl: 4 },
                py: { xs: 2.5, lg: 3.5 },
                minHeight: 0,
            }}
        >
            {children}
        </Box>
    );
}
