import { Box, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import DashboardHeader from './DashboardHeader';
import DashboardSidebar from './DashboardSidebar';
import DashboardContent from './DashboardContent';

const DRAWER_WIDTH = 292;
const COLLAPSED_WIDTH = 84;

export default function DashboardLayout({ children, title, subtitle, actions }) {
    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));

    return (
        <Box
            sx={{
                minHeight: '100vh',
                bgcolor: 'background.default',
                display: 'flex',
            }}
        >
            <DashboardSidebar
                drawerWidth={DRAWER_WIDTH}
                collapsedWidth={COLLAPSED_WIDTH}
            />

            <Box
                sx={{
                    flex: 1,
                    minWidth: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    ml: {
                        xs: 0,
                        lg: `${DRAWER_WIDTH}px`,
                    },
                }}
            >
                <DashboardHeader
                    title={title}
                    subtitle={subtitle}
                    actions={actions}
                    drawerWidth={DRAWER_WIDTH}
                    collapsedWidth={COLLAPSED_WIDTH}
                />

                <DashboardContent>
                    {children}
                </DashboardContent>
            </Box>
        </Box>
    );
}
