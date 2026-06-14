import { useState } from 'react';
import { usePage } from '@inertiajs/react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from '@mui/material';
import { IconBrandWhatsapp } from '@tabler/icons-react';
import { buildWhatsAppLink, buildWhatsAppMessage, renderWhatsAppTemplate } from '@/Utils/whatsapp';

/**
 * Botão padrão para abrir o WhatsApp com uma mensagem pré-formatada.
 *
 * Pode ser usado de duas formas:
 * - `templateKey` + `variables`: busca o template ativo (compartilhado via Inertia) e substitui as variáveis.
 * - `message`: usa o texto informado diretamente (já pronto ou com {{variaveis}} + `variables`).
 *
 * Por padrão abre um diálogo de confirmação/edição antes de abrir o WhatsApp (`showPreview`).
 */
export default function WhatsAppButton({
    templateKey,
    variables = {},
    message,
    phone = null,
    label = 'WhatsApp',
    variant = 'outlined',
    size = 'medium',
    color = 'success',
    fullWidth = false,
    showIcon = true,
    showPreview = true,
    startIcon,
    sx,
    ...buttonProps
}) {
    const { whatsappTemplates = [] } = usePage().props;
    const [open, setOpen] = useState(false);
    const [text, setText] = useState('');

    const resolveMessage = () => {
        if (message) {
            return renderWhatsAppTemplate(message, variables);
        }

        return buildWhatsAppMessage(whatsappTemplates, templateKey, variables);
    };

    const handleClick = () => {
        const resolved = resolveMessage();

        if (!showPreview) {
            window.open(buildWhatsAppLink(resolved, phone), '_blank', 'noopener');
            return;
        }

        setText(resolved);
        setOpen(true);
    };

    const handleSend = () => {
        window.open(buildWhatsAppLink(text, phone), '_blank', 'noopener');
        setOpen(false);
    };

    return (
        <>
            <Button
                variant={variant}
                size={size}
                color={color}
                fullWidth={fullWidth}
                startIcon={showIcon ? (startIcon ?? <IconBrandWhatsapp size={18} />) : startIcon}
                onClick={handleClick}
                sx={sx}
                {...buttonProps}
            >
                {label}
            </Button>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Enviar mensagem pelo WhatsApp</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        multiline
                        minRows={5}
                        maxRows={12}
                        fullWidth
                        value={text}
                        onChange={(event) => setText(event.target.value)}
                        sx={{ mt: 1 }}
                        helperText="Revise a mensagem antes de enviar. Você pode editar livremente o texto."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancelar</Button>
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<IconBrandWhatsapp size={18} />}
                        onClick={handleSend}
                    >
                        Abrir WhatsApp
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
