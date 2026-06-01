import { Avatar, Box, Stack, Typography } from '@mui/material';

export default function InfoCell({
    title,
    subtitle,
    avatar,
    icon: Icon,
    color = 'primary.main',
}) {
    const initials = title
        ? String(title).split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
        : '—';

    return (
        <Stack direction="row" alignItems="center" gap={1.2}>
            {/* Avatar */}
            {avatar ? (
                <Avatar
                    src={avatar}
                    sx={{ width: 34, height: 34, borderRadius: 2 }}
                    variant="rounded"
                />
            ) : (
                <Avatar
                    variant="rounded"
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        bgcolor: color,
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.71875rem',
                        flexShrink: 0,
                    }}
                >
                    {Icon ? <Icon size={17} /> : initials}
                </Avatar>
            )}

            {/* Texto */}
            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="body2"
                    noWrap
                    sx={{ fontWeight: 700, lineHeight: 1.3, color: 'text.primary' }}
                >
                    {title || '—'}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ display: 'block', lineHeight: 1.3, mt: 0.2 }}
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
}
