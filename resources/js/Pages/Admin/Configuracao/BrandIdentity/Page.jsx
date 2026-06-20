import { Head, router, useForm, usePage } from '@inertiajs/react';
import Layout from '@/Layouts/UserLayout/Layout.jsx';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
    IconCheck,
    IconPalette,
    IconPhoto,
    IconRefresh,
    IconUpload,
} from '@tabler/icons-react';
import { useRef, useState } from 'react';

function safeRoute(n) { try { return route(n); } catch { return '#'; } }

function SectionCard({ icon: Icon, color, title, description, children }) {
    return (
        <Card>
            <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid', borderColor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', background: color, flexShrink: 0 }}>
                    <Icon size={18} />
                </Box>
                <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>{title}</Typography>
                    <Typography variant="caption" color="text.secondary">{description}</Typography>
                </Box>
            </Box>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function ColorField({ label, value, onChange, error, helperText }) {
    return (
        <Stack direction="row" gap={1.5} alignItems="flex-start">
            <Box
                component="input"
                type="color"
                value={value || '#000000'}
                onChange={e => onChange(e.target.value)}
                sx={{ width: 48, height: 48, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, p: 0.5, cursor: 'pointer', mt: 0.25 }}
            />
            <TextField
                fullWidth size="small" label={label}
                value={value}
                onChange={e => onChange(e.target.value)}
                error={error}
                helperText={helperText}
                placeholder="#2F7D18"
            />
        </Stack>
    );
}

function ImageUploadField({ label, helperText, preview, onSelect, onRestoreDefault, error, accept = 'image/*', shape = 'square' }) {
    const inputRef = useRef(null);

    return (
        <Stack spacing={1.5}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
            <Stack direction="row" gap={2} alignItems="center">
                <Box
                    sx={{
                        width: 72, height: 72,
                        borderRadius: shape === 'circle' ? '50%' : 2,
                        border: '1px dashed', borderColor: 'grey.300',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden', bgcolor: 'grey.50', flexShrink: 0,
                    }}
                >
                    {preview ? (
                        <Box component="img" src={preview} alt={label} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    ) : (
                        <IconPhoto size={28} style={{ opacity: 0.35 }} />
                    )}
                </Box>
                <Stack spacing={1}>
                    <Stack direction="row" gap={1}>
                        <Button
                            size="small" variant="outlined" startIcon={<IconUpload size={15} />}
                            onClick={() => inputRef.current?.click()}
                        >
                            Selecionar arquivo
                        </Button>
                        {onRestoreDefault && (
                            <Button size="small" variant="text" color="inherit" startIcon={<IconRefresh size={15} />} onClick={onRestoreDefault}>
                                Restaurar padrão
                            </Button>
                        )}
                    </Stack>
                    <input
                        ref={inputRef}
                        type="file"
                        accept={accept}
                        hidden
                        onChange={e => onSelect(e.target.files?.[0] ?? null)}
                    />
                    <Typography variant="caption" color={error ? 'error.main' : 'text.secondary'}>
                        {error || helperText}
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
}

export default function Page({ brand }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: brand?.name ?? 'Casa Verde',
        color_primary: brand?.color_primary ?? '#2F7D18',
        color_secondary: brand?.color_secondary ?? '#4F9A2A',
        logo: null,
        favicon: null,
    });

    const [logoPreview, setLogoPreview] = useState(brand?.logo_url ?? null);
    const [faviconPreview, setFaviconPreview] = useState(brand?.favicon_url ?? null);

    function pickLogo(file) {
        setData('logo', file);
        setLogoPreview(file ? URL.createObjectURL(file) : brand?.logo_url ?? null);
    }

    function pickFavicon(file) {
        setData('favicon', file);
        setFaviconPreview(file ? URL.createObjectURL(file) : brand?.favicon_url ?? null);
    }

    function submit(e) {
        e.preventDefault();
        post(safeRoute('admin.brand-identity.update'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => window.location.reload(),
        });
    }

    function restoreLogo() {
        if (!window.confirm('Restaurar o logo padrão da plataforma?')) return;
        router.delete(safeRoute('admin.brand-identity.logo.destroy'), {
            onSuccess: () => window.location.reload(),
        });
    }

    function restoreFavicon() {
        if (!window.confirm('Restaurar o favicon padrão da plataforma?')) return;
        router.delete(safeRoute('admin.brand-identity.favicon.destroy'), {
            onSuccess: () => window.location.reload(),
        });
    }

    return (
        <Layout
            titlePage="Identidade Visual"
            menu="config"
            subMenu="config-brand-identity"
            subtitle="Personalize o nome, as cores, o logo e o favicon da plataforma."
            breadcrumbs={[{ label: 'Admin' }, { label: 'Configurações' }, { label: 'Identidade Visual' }]}
        >
            <Head title="Identidade Visual" />

            <Stack spacing={3} sx={{ maxWidth: 860 }}>

                {flash?.success && (
                    <Alert severity="success" icon={<IconCheck size={18} />}>
                        {flash.success}
                    </Alert>
                )}

                <Alert severity="info" sx={{ py: 0.5 }}>
                    Alterações de cor, logo e favicon recarregam a página automaticamente após salvar para aplicar o novo tema.
                </Alert>

                <Box component="form" onSubmit={submit}>
                    <Stack spacing={3}>

                        <SectionCard
                            icon={IconPalette}
                            color="var(--cv-gradient-primary)"
                            title="Nome e Paleta de Cores"
                            description="Nome exibido na plataforma e cores principais do tema."
                        >
                            <Stack spacing={2.5}>
                                <TextField
                                    fullWidth size="small" label="Nome da Plataforma"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                />

                                <Grid container spacing={2.5}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <ColorField
                                            label="Cor primária"
                                            value={data.color_primary}
                                            onChange={v => setData('color_primary', v)}
                                            error={!!errors.color_primary}
                                            helperText={errors.color_primary}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <ColorField
                                            label="Cor secundária"
                                            value={data.color_secondary}
                                            onChange={v => setData('color_secondary', v)}
                                            error={!!errors.color_secondary}
                                            helperText={errors.color_secondary}
                                        />
                                    </Grid>
                                </Grid>
                            </Stack>
                        </SectionCard>

                        <SectionCard
                            icon={IconPhoto}
                            color="linear-gradient(135deg,#7c3aed,#a855f7)"
                            title="Logo e Favicon"
                            description="Imagens exibidas no menu lateral e na aba do navegador."
                        >
                            <Stack spacing={3}>
                                <ImageUploadField
                                    label="Logo da plataforma"
                                    helperText="PNG, JPG, SVG ou WEBP — até 2MB. Exibido no menu lateral."
                                    preview={logoPreview}
                                    onSelect={pickLogo}
                                    onRestoreDefault={brand?.logo_url ? restoreLogo : null}
                                    error={errors.logo}
                                    shape="circle"
                                />

                                <ImageUploadField
                                    label="Favicon"
                                    helperText="PNG, ICO, JPG, SVG ou WEBP — até 512KB. Exibido na aba do navegador."
                                    preview={faviconPreview}
                                    onSelect={pickFavicon}
                                    onRestoreDefault={brand?.favicon_url ? restoreFavicon : null}
                                    error={errors.favicon}
                                />
                            </Stack>
                        </SectionCard>

                        <Stack direction="row" justifyContent="flex-end">
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={processing}
                                startIcon={processing ? <CircularProgress size={15} color="inherit" /> : <IconCheck size={17} />}
                                sx={{ px: 3 }}
                            >
                                Salvar identidade visual
                            </Button>
                        </Stack>

                    </Stack>
                </Box>
            </Stack>
        </Layout>
    );
}
