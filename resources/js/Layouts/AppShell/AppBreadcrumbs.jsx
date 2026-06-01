import { Breadcrumbs, Typography } from '@mui/material';
import { Link } from '@inertiajs/react';

export default function AppBreadcrumbs({ items = [] }) {
    return (
        <Breadcrumbs
            separator="·"
            sx={{
                '& .MuiBreadcrumbs-separator': {
                    color: 'text.disabled',
                    fontSize: '0.6rem',
                    mx: 0.6,
                },
                '& .MuiBreadcrumbs-ol': {
                    flexWrap: 'nowrap',
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
                            sx={{
                                fontWeight: 700,
                                color: isLast ? 'text.secondary' : 'text.disabled',
                                whiteSpace: 'nowrap',
                                lineHeight: 1,
                            }}
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
                        sx={{
                            fontWeight: 700,
                            color: 'text.disabled',
                            whiteSpace: 'nowrap',
                            lineHeight: 1,
                            transition: 'color 140ms ease',
                            '&:hover': { color: 'primary.main' },
                        }}
                    >
                        {item.label}
                    </Typography>
                );
            })}
        </Breadcrumbs>
    );
}
