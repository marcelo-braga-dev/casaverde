import {
    Box,
    Collapse,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import {
    IconChevronDown,
    IconChevronRight,
} from '@tabler/icons-react';
import { cloneElement, useMemo, useState } from 'react';
import { useMenuDrawer } from '@/Contexts/Drawer/DrawerContext';
import AppSidebarSubItem from './AppSidebarSubItem';

function normalizeIcon(icon, size = 45) {
    if (!icon) return null;

    return cloneElement(icon, {
        size,
        stroke: 1.8,
    });
}

export default function AppSidebarMenuGroup({ item, collapsed }) {
    const { activeMenu } = useMenuDrawer();

    const hasSubItems = Array.isArray(item.subItems) && item.subItems.length > 0;
    const isActiveGroup = activeMenu === item.id;

    const [manualOpen, setManualOpen] = useState(isActiveGroup);

    const open = useMemo(() => {
        if (isActiveGroup) return true;
        return manualOpen;
    }, [isActiveGroup, manualOpen]);

    const icon = normalizeIcon(item.icon, 20);

    const content = (
        <Box sx={{ mb: 0.5 }}>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent={collapsed ? 'center' : 'space-between'}
                onClick={() => {
                    if (hasSubItems) {
                        setManualOpen((current) => !current);
                    }
                }}
                sx={{
                    minHeight: 46,
                    px: collapsed ? 1 : 1.25,
                    borderRadius: 3,
                    cursor: hasSubItems ? 'pointer' : 'default',
                    color: 'var(--cv-sidebar-fg)',
                    bgcolor: isActiveGroup ? 'var(--cv-sidebar-group-active-bg)' : 'transparent',
                    border: isActiveGroup
                        ? '1px solid var(--cv-sidebar-group-active-border)'
                        : '1px solid transparent',
                    transition: 'all 160ms ease',
                    '&:hover': {
                        bgcolor: 'rgba(var(--cv-sidebar-fg-rgb), 0.07)',
                    },
                }}
            >
                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.2}
                    sx={{ minWidth: 0 }}
                >
                    <Box
                        sx={{
                            width: 42,
                            height: 42,
                            minWidth: 42,
                            borderRadius: 2.3,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: isActiveGroup ? 'var(--cv-sidebar-active-fg)' : 'var(--cv-sidebar-fg)',
                            background: isActiveGroup
                                ? 'var(--cv-sidebar-icon-active-bg)'
                                : 'rgba(var(--cv-sidebar-fg-rgb), 0.06)',
                        }}
                    >
                        {icon}
                    </Box>

                    {!collapsed && (
                        <Typography
                            variant="body2"
                            noWrap
                            sx={{
                                fontSize: 14,
                                fontWeight: isActiveGroup ? 900 : 750,
                                color: 'var(--cv-sidebar-fg)',
                            }}
                        >
                            {item.title}
                        </Typography>
                    )}
                </Stack>

                {!collapsed && hasSubItems && (
                    <Box
                        sx={{
                            color: 'rgba(var(--cv-sidebar-fg-rgb), 0.52)',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        {open ? (
                            <IconChevronDown size={17} />
                        ) : (
                            <IconChevronRight size={17} />
                        )}
                    </Box>
                )}
            </Stack>

            {!collapsed && hasSubItems && (
                <Collapse in={open} timeout="auto" unmountOnExit>
                    <Box
                        sx={{
                            mt: 0.5,
                            ml: 1,
                            pl: 1.7,
                            borderLeft: '1px solid rgba(var(--cv-sidebar-fg-rgb), 0.08)',
                        }}
                    >
                        {item.subItems.map((subItem) => (
                            <AppSidebarSubItem
                                key={subItem.id}
                                item={subItem}
                                parentId={item.id}
                            />
                        ))}
                    </Box>
                </Collapse>
            )}
        </Box>
    );

    if (collapsed) {
        return (
            <Tooltip title={item.title} placement="right">
                {content}
            </Tooltip>
        );
    }

    return content;
}
