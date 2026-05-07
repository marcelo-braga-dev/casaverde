import { Avatar, Box, Stack, Typography } from '@mui/material';

export default function InfoCell({
                                     title,
                                     subtitle,
                                     avatar,
                                     icon: Icon,
                                     color = 'primary.main',
                                 }) {
    const initials = title
        ? String(title)
            .split(' ')
            .map((word) => word[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'CV';

    return (
        <Stack direction="row" alignItems="center" gap={1.2}>
            {avatar ? (
                <Avatar src={avatar} sx={{ width: 40, height: 40 }} />
            ) : (
                <Avatar
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: color,
                        color: '#FFFFFF',
                        fontWeight: 900,
                        fontSize: 13,
                    }}
                >
                    {Icon ? <Icon size={20} /> : initials}
                </Avatar>
            )}

            <Box sx={{ minWidth: 0 }}>
                <Typography
                    variant="subtitle2"
                    noWrap
                    sx={{ fontWeight: 850 }}
                >
                    {title || 'Não informado'}
                </Typography>

                {subtitle && (
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                    >
                        {subtitle}
                    </Typography>
                )}
            </Box>
        </Stack>
    );
}
