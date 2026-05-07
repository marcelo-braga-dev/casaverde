import { Box, Typography } from '@mui/material';
import SidebarItem from './SidebarItem';

export default function SidebarSection({ section }) {
    return (
        <Box sx={{ mb: 2.2 }}>
            <Typography
                variant="caption"
                sx={{
                    display: 'block',
                    px: 1.5,
                    mb: 0.8,
                    color: 'rgba(255,255,255,0.42)',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                }}
            >
                {section.title}
            </Typography>

            {section.items.map((item) => (
                <SidebarItem key={item.title} item={item} />
            ))}
        </Box>
    );
}
