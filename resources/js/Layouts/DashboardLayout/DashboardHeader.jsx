import {
    Badge,
    Box,
    IconButton,
    Stack,
    Typography,
} from '@mui/material';
import {
    IconBell,
    IconMenu2,
    IconSearch,
    IconSettings,
} from '@tabler/icons-react';
import { usePage } from '@inertiajs/react';
import SearchInput from '@/Components/UI/SearchInput';
import UserMenu from './UserMenu';

export default function DashboardHeader({ title, subtitle, actions }) {
    const { auth } = usePage().props;

    return (
        <Box
            component="header"
            sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(18px)',
                backgroundColor: 'background.header',
                borderBottom: '1px solid',
                borderColor: 'divider',
                px: {
                    xs: 2,
                    sm: 3,
                    lg: 4,
                },
                py: 1.7,
            }}
        >
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                gap={2}
            >
                <Stack direction="row" alignItems="center" gap={2} sx={{ minWidth: 0 }}>
                    <IconButton
                        sx={{
                            display: { xs: 'inline-flex', lg: 'none' },
                            bgcolor: 'grey.100',
                        }}
                    >
                        <IconMenu2 size={22} />
                    </IconButton>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: 850,
                                color: 'text.primary',
                                letterSpacing: '-0.04em',
                            }}
                        >
                            {title || 'Dashboard'}
                        </Typography>

                        {subtitle && (
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mt: 0.25 }}
                            >
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Stack>

                <Stack
                    direction="row"
                    alignItems="center"
                    gap={1.2}
                    sx={{ display: { xs: 'none', md: 'flex' } }}
                >
                    <SearchInput />

                    {actions}

                    <IconButton
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: 'grey.100',
                        }}
                    >
                        <IconSearch size={20} />
                    </IconButton>

                    <IconButton
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: 'grey.100',
                        }}
                    >
                        <Badge color="error" variant="dot">
                            <IconBell size={20} />
                        </Badge>
                    </IconButton>

                    <IconButton
                        sx={{
                            width: 42,
                            height: 42,
                            bgcolor: 'grey.100',
                        }}
                    >
                        <IconSettings size={20} />
                    </IconButton>

                    <UserMenu user={auth?.user} />
                </Stack>
            </Stack>
        </Box>
    );
}
