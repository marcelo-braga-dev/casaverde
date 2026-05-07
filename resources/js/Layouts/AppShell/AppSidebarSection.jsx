import { Box, Typography } from '@mui/material';
import AppSidebarItem from './AppSidebarItem';

export default function AppSidebarSection({ section, collapsed }) {
    return (
        <Box sx={{ mb: collapsed ? 1 : 2.3 }}>
            {!collapsed && (
                <Typography
                    variant="caption"
                    sx={{
                        display: 'block',
                        px: 1.4,
                        mb: 0.8,
                        color: 'rgba(255,255,255,0.38)',
                        fontWeight: 900,
                        textTransform: 'uppercase',
                        letterSpacing: '0.09em',
                    }}
                >
                    {section.title}
                </Typography>
            )}

            {section.items.map((item) => (
                <AppSidebarItem
                    key={item.title}
                    item={item}
                    collapsed={collapsed}
                />
            ))}
        </Box>
    );
}
