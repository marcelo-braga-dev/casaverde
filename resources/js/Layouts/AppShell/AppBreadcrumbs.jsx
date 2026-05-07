import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';

export default function AppBreadcrumbs({ items = [] }) {
    return (
        <Breadcrumbs
            separator="›"
            sx={{
                '& .MuiBreadcrumbs-separator': {
                    color: 'text.secondary',
                },
            }}
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                if (isLast || !item.href) {
                    return (
                        <Typography
                            key={item.label}
                            variant="caption"
                            color="text.secondary"
                            sx={{ fontWeight: 700 }}
                        >
                            {item.label}
                        </Typography>
                    );
                }

                return (
                    <Typography
                        key={item.label}
                        component={Link}
                        href={item.href}
                        variant="caption"
                        color="text.secondary"
                        sx={{
                            fontWeight: 700,
                            '&:hover': {
                                color: 'primary.main',
                            },
                        }}
                    >
                        {item.label}
                    </Typography>
                );
            })}
        </Breadcrumbs>
    );
}
