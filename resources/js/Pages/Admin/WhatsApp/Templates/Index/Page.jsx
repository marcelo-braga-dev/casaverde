import { useState } from 'react';
import { Head, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/UserLayout/Layout.jsx';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
} from '@mui/material';
import {
    IconBrandWhatsapp,
    IconClipboardText,
    IconContract,
    IconEdit,
    IconReceipt2,
    IconUserHeart,
    IconUserPlus,
} from '@tabler/icons-react';
import TemplateEditDialog from './Partials/TemplateEditDialog';

const CATEGORY_META = {
    Cliente: { icon: IconUserHeart, color: 'linear-gradient(135deg,#166534,#15803D)' },
    Cadastro: { icon: IconUserPlus, color: 'linear-gradient(135deg,#1e3a5f,#1e40af)' },
    Proposta: { icon: IconClipboardText, color: 'linear-gradient(135deg,#7c3aed,#5b21b6)' },
    Financeiro: { icon: IconReceipt2, color: 'linear-gradient(135deg,#b45309,#92400e)' },
    Contrato: { icon: IconContract, color: 'linear-gradient(135deg,#0f766e,#115e59)' },
};

function CategorySection({ category, items, onEdit }) {
    const meta = CATEGORY_META[category] ?? { icon: IconClipboardText, color: 'linear-gradient(135deg,#374151,#1f2937)' };
    const Icon = meta.icon;

    return (
        <Card>
            <Box
                sx={{
                    px: 2.5,
                    py: 2,
                    borderBottom: '1px solid',
                    borderColor: 'grey.100',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                }}
            >
                <Box
                    sx={{
                        width: 36,
                        height: 36,
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        background: meta.color,
                        flexShrink: 0,
                    }}
                >
                    <Icon size={18} />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                    {category}
                </Typography>
            </Box>

            <CardContent>
                <Stack spacing={2} divider={<Divider />}>
                    {items.map((template) => (
                        <Stack
                            key={template.id}
                            direction={{ xs: 'column', sm: 'row' }}
                            justifyContent="space-between"
                            alignItems={{ xs: 'flex-start', sm: 'flex-start' }}
                            gap={2}
                        >
                            <Box sx={{ minWidth: 0, flex: 1 }}>
                                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                                    <Typography sx={{ fontWeight: 700 }}>{template.name}</Typography>
                                    <Chip
                                        label={template.is_active ? 'Ativo' : 'Inativo'}
                                        color={template.is_active ? 'success' : 'default'}
                                        size="small"
                                    />
                                </Stack>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        mt: 0.75,
                                        whiteSpace: 'pre-line',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 3,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {template.message}
                                </Typography>

                                {!!template.available_variables?.length && (
                                    <Stack direction="row" gap={0.5} flexWrap="wrap" sx={{ mt: 1 }}>
                                        {template.available_variables.map((variable) => (
                                            <Chip
                                                key={variable}
                                                label={`{{${variable}}}`}
                                                size="small"
                                                variant="outlined"
                                                sx={{ fontSize: '0.7rem' }}
                                            />
                                        ))}
                                    </Stack>
                                )}
                            </Box>

                            <Button
                                size="small"
                                variant="outlined"
                                startIcon={<IconEdit size={16} />}
                                onClick={() => onEdit(template)}
                                sx={{ flexShrink: 0 }}
                            >
                                Editar
                            </Button>
                        </Stack>
                    ))}
                </Stack>
            </CardContent>
        </Card>
    );
}

export default function Page({ templates }) {
    const { flash } = usePage().props;
    const [editing, setEditing] = useState(null);

    const grouped = (templates ?? []).reduce((acc, template) => {
        (acc[template.category] ??= []).push(template);
        return acc;
    }, {});

    return (
        <Layout
            titlePage="Templates de WhatsApp"
            menu="whatsapp"
            subMenu="whatsapp-templates"
            subtitle="Mensagens pré-formatadas usadas nos botões de WhatsApp em todo o sistema."
            breadcrumbs={[{ label: 'Admin' }, { label: 'Whatsapp' }, { label: 'Templates de Mensagens' }]}
        >
            <Head title="Templates de WhatsApp" />

            <Stack spacing={3}>
                {flash?.success && <Alert severity="success">{flash.success}</Alert>}

                <Card sx={{ background: 'var(--cv-gradient-hero)', color: '#fff', borderRadius: 'var(--cv-radius-xl)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={2}>
                            <Box
                                sx={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 3,
                                    bgcolor: 'rgba(255,255,255,0.15)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <IconBrandWhatsapp size={24} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                    Templates de Mensagens
                                </Typography>
                                <Typography sx={{ color: 'rgba(255,255,255,0.72)', fontSize: 13, mt: 0.3 }}>
                                    Edite o texto, ative ou desative cada template. Use {`{{variavel}}`} para inserir dados
                                    do sistema — eles são substituídos automaticamente pelos valores reais nos botões de
                                    WhatsApp espalhados pela plataforma (dashboard do cliente, propostas, cobranças, convites e mais).
                                </Typography>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {Object.entries(grouped).map(([category, items]) => (
                    <CategorySection key={category} category={category} items={items} onEdit={setEditing} />
                ))}
            </Stack>

            <TemplateEditDialog open={!!editing} template={editing} onClose={() => setEditing(null)} />
        </Layout>
    );
}
