import { Box, Dialog, DialogContent, DialogTitle, IconButton, Stack, Typography } from "@mui/material";
import DateText from "@/Components/Admin/DateText.jsx";
import EmptyState from "@/Components/Admin/EmptyState.jsx";
import { IconX } from "@tabler/icons-react";

export default function ChangeHistoryDialog({ open, histories, onClose }) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800, pr: 6 }}>
                Histórico de Alterações
                <IconButton onClick={onClose} sx={{ position: "absolute", right: 12, top: 12 }} size="small">
                    <IconX size={18} />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                {histories?.length > 0 ? (
                    <Stack spacing={0}>
                        {histories.map((entry, index) => (
                            <Stack
                                key={entry.id}
                                direction="row"
                                spacing={2}
                                py={1.2}
                                sx={{
                                    borderBottom: index < histories.length - 1 ? "1px solid var(--cv-border-soft)" : "none",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 8,
                                        height: 8,
                                        borderRadius: "50%",
                                        background: "#6366f1",
                                        mt: 0.9,
                                        flexShrink: 0,
                                    }}
                                />
                                <Box flex={1}>
                                    <Typography variant="body2" fontWeight={600}>
                                        {entry.description}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {entry.user?.name || "Sistema"} · <DateText value={entry.created_at} />
                                    </Typography>
                                </Box>
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <EmptyState title="Nenhuma alteração registrada ainda." />
                )}
            </DialogContent>
        </Dialog>
    );
}
