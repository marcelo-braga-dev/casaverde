import { TextField, Typography } from "@mui/material";

export default function JsonViewer({ value, minRows = 8 }) {
    if (!value) {
        return (
            <Typography color="text.secondary">
                Nenhum dado registrado.
            </Typography>
        );
    }

    return (
        <TextField
            value={JSON.stringify(value, null, 2)}
            multiline
            minRows={minRows}
            fullWidth
            InputProps={{
                readOnly: true,
                sx: {
                    fontFamily: "monospace",
                    fontSize: 13,
                },
            }}
        />
    );
}
