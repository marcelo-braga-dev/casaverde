import { Stack, Typography } from '@mui/material';

const TextInfo = ({ title, text }) => {
    return (
        <Stack direction="column" spacing={0.3} mb={1.5}>
            {title && (
                <Typography
                    variant="caption"
                    sx={{
                        color: 'text.secondary',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                        lineHeight: 1.4,
                    }}
                >
                    {title}
                </Typography>
            )}
            {text && (
                <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: 'text.primary', lineHeight: 1.5 }}
                >
                    {text}
                </Typography>
            )}
        </Stack>
    );
};

export default TextInfo;
