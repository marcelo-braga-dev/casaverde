import { useEffect, useRef } from 'react';
import { useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import { IconBrandWhatsapp, IconDeviceFloppy } from '@tabler/icons-react';
import { buildWhatsAppLink, renderWhatsAppTemplate } from '@/Utils/whatsapp';

/** Valores de exemplo usados apenas para a pré-visualização do template */
const SAMPLE_VALUES = {
    consultor_nome: 'Ana Souza',
    cliente_nome: 'João da Silva',
    nome: 'João da Silva',
    usina_nome: 'Usina Solar Matriz',
    mes_referencia: 'Maio/2026',
    valor_fatura: 'R$ 350,00',
    data_vencimento: '20/06/2026',
    link_ativacao: 'https://app.casaverde.com.br/cliente/ativacao/abc123',
    link_proposta: 'https://app.casaverde.com.br/proposta/123/pdf',
    numero_contrato: 'CT-2026-0042',
    status_contrato: 'Ativo',
    lista_documentos: '• RG ou CNH\n• Comprovante de residência\n• Comprovante de renda',
};

export default function TemplateEditDialog({ open, template, onClose }) {
    const textareaRef = useRef(null);

    const { data, setData, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        message: '',
        is_active: true,
    });

    useEffect(() => {
        if (template) {
            setData({
                name: template.name ?? '',
                message: template.message ?? '',
                is_active: !!template.is_active,
            });
            clearErrors();
        }
    }, [template]);

    if (!template) {
        return null;
    }

    const insertVariable = (variable) => {
        const placeholder = `{{${variable}}}`;
        const textarea = textareaRef.current;

        if (!textarea) {
            setData('message', `${data.message}${placeholder}`);
            return;
        }

        const start = textarea.selectionStart ?? data.message.length;
        const end = textarea.selectionEnd ?? data.message.length;
        const newValue = data.message.slice(0, start) + placeholder + data.message.slice(end);

        setData('message', newValue);

        requestAnimationFrame(() => {
            const cursor = start + placeholder.length;
            textarea.focus();
            textarea.setSelectionRange(cursor, cursor);
        });
    };

    const preview = renderWhatsAppTemplate(data.message, SAMPLE_VALUES);

    const submit = (event) => {
        event.preventDefault();

        put(route('admin.whatsapp.templates.update', template.id), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Editar template de mensagem</DialogTitle>

            <Box component="form" onSubmit={submit}>
                <DialogContent>
                    <Stack spacing={2.5}>
                        <TextField
                            label="Nome do template"
                            fullWidth
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={!!errors.name}
                            helperText={errors.name}
                        />

                        {!!template.available_variables?.length && (
                            <Box>
                                <Typography
                                    variant="caption"
                                    sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.05em' }}
                                >
                                    Variáveis disponíveis — clique para inserir no texto
                                </Typography>
                                <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1 }}>
                                    {template.available_variables.map((variable) => (
                                        <Chip
                                            key={variable}
                                            label={`{{${variable}}}`}
                                            size="small"
                                            clickable
                                            color="success"
                                            variant="outlined"
                                            onClick={() => insertVariable(variable)}
                                        />
                                    ))}
                                </Stack>
                            </Box>
                        )}

                        <TextField
                            label="Mensagem"
                            fullWidth
                            multiline
                            minRows={6}
                            maxRows={14}
                            value={data.message}
                            onChange={(e) => setData('message', e.target.value)}
                            inputRef={textareaRef}
                            error={!!errors.message}
                            helperText={errors.message}
                        />

                        <FormControlLabel
                            control={
                                <Switch
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                />
                            }
                            label={data.is_active ? 'Template ativo (disponível nos botões do sistema)' : 'Template inativo (oculto dos botões do sistema)'}
                        />

                        <Divider />

                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1 }}>
                                Pré-visualização (com dados de exemplo)
                            </Typography>

                            <Box
                                sx={{
                                    bgcolor: '#e7fce3',
                                    border: '1px solid',
                                    borderColor: 'success.light',
                                    borderRadius: 2,
                                    p: 2,
                                    maxWidth: 420,
                                }}
                            >
                                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                                    {preview || 'Digite a mensagem para ver a pré-visualização.'}
                                </Typography>
                            </Box>

                            <Alert severity="info" sx={{ mt: 1.5, py: 0.5 }}>
                                Os valores acima (nomes, datas, links) são apenas exemplos. No sistema, cada {`{{variavel}}`} é substituído automaticamente pelos dados reais.
                            </Alert>
                        </Box>
                    </Stack>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 2.5 }}>
                    <Button onClick={onClose}>Cancelar</Button>

                    <Button
                        component="a"
                        href={buildWhatsAppLink(preview)}
                        target="_blank"
                        rel="noopener"
                        variant="outlined"
                        color="success"
                        startIcon={<IconBrandWhatsapp size={18} />}
                    >
                        Testar no WhatsApp
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={processing}
                        startIcon={<IconDeviceFloppy size={18} />}
                    >
                        Salvar
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
