import { Box, Button, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { IconClipboard } from "@tabler/icons-react";

export default function CopyField({ label, value, icon, multiline = false }) {
    if (!value) return null;

    const handleCopy = () => {
        if (navigator.clipboard) navigator.clipboard.writeText(value);
    };

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={0.5} mb={0.5}>
                {icon && <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>}
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    {label}
                </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="flex-start">
                <TextField
                    value={value}
                    multiline={multiline}
                    minRows={multiline ? 3 : undefined}
                    fullWidth
                    size="small"
                    InputProps={{
                        readOnly: true,
                        sx: { fontFamily: "monospace", fontSize: 12 },
                    }}
                    sx={{ flex: 1 }}
                />
                <Tooltip title="Copiar">
                    <Button
                        variant="outlined"
                        size="small"
                        onClick={handleCopy}
                        sx={{ minWidth: 36, px: 1, mt: 0.2, height: 40 }}
                    >
                        <IconClipboard size={16} />
                    </Button>
                </Tooltip>
            </Stack>
        </Box>
    );
}
