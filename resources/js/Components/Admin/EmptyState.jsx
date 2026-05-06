import { Box, Typography } from "@mui/material";

export default function EmptyState({
                                       title = "Nenhum registro encontrado.",
                                       description,
                                   }) {
    return (
        <Box
            sx={{
                width: "100%",
                py: 4,
                px: 2,
                textAlign: "center",
            }}
        >
            <Typography variant="subtitle1" color="text.secondary">
                {title}
            </Typography>

            {description && (
                <Typography variant="body2" color="text.secondary" mt={1}>
                    {description}
                </Typography>
            )}
        </Box>
    );
}
