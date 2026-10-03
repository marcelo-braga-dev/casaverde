import CopyField from '@/Components/Admin/CopyField.jsx';
import { formatMoney } from '@/Components/Reports/utils/chartFormatters';
import { Box, Button, Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import { IconBarcode, IconDownload, IconQrcode, IconWallet } from '@tabler/icons-react';

function formatDate(iso) {
    if (!iso) return '—';
    const [year, month, day] = iso.split('-');
    return `${day}/${month}/${year}`;
}

export default function PagamentoCard({ pagamento }) {
    if (!pagamento) return null;

    return (
        <Card sx={{
            borderRadius: 'var(--cv-radius-xl)',
            border: '2px solid',
            borderColor: 'primary.main',
            boxShadow: 'var(--cv-shadow-md)',
        }}>
            <CardContent>
                <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: 2,
                        background: 'var(--cv-gradient-primary)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
                    }}>
                        <IconWallet size={18} />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.03em' }}>
                        Pagar agora
                    </Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">Valor</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{formatMoney(pagamento.amount)}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="caption" color="text.secondary">Vencimento</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{formatDate(pagamento.due_date)}</Typography>
                    </Box>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Stack spacing={2}>
                    <CopyField
                        label="Pix copia e cola"
                        value={pagamento.pix_copy_paste}
                        icon={<IconQrcode size={14} />}
                        multiline
                    />
                    <CopyField
                        label="Linha digitável do boleto"
                        value={pagamento.digitable_line}
                        icon={<IconBarcode size={14} />}
                    />
                    {pagamento.pdf_url && (
                        <Button
                            fullWidth
                            variant="contained"
                            href={pagamento.pdf_url}
                            target="_blank"
                            rel="noreferrer"
                            startIcon={<IconDownload size={16} />}
                            sx={{ borderRadius: 2 }}
                        >
                            Baixar boleto em PDF
                        </Button>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
}
