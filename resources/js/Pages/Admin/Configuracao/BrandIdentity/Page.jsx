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
    IconArrowRight,
    IconCheck,
    IconFileText,
    IconLayoutSidebar,
    IconPalette,
    IconPhoto,
    IconRefresh,
    IconUpload,
} from '@tabler/icons-react';
import { useRef, useState } from 'react';
import { DEFAULT_SIDEBAR_VARS, contrastRatio, contrastText, sidebarThemeVars } from '@/Utils/Theme/sidebarTheme';

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

function ColorField({ label, value, onChange, error, helperText, fallback }) {
    return (
        <Stack direction="row" gap={1.5} alignItems="flex-start">
            <Box
                component="input"
                type="color"
                value={value || fallback || '#000000'}
                onChange={e => onChange(e.target.value)}
                sx={{ width: 48, height: 48, border: '1px solid', borderColor: 'grey.300', borderRadius: 2, p: 0.5, cursor: 'pointer', mt: 0.25 }}
            />
            <TextField
                fullWidth size="small" label={label}
                value={value}
                onChange={e => onChange(e.target.value)}
                error={error}
                helperText={helperText}
                placeholder={fallback ? `Automática (${fallback})` : '#2F7D18'}
                InputLabelProps={fallback ? { shrink: true } : undefined}
            />
        </Stack>
    );
}

function SidebarPreview({ colors }) {
    const vars = { ...DEFAULT_SIDEBAR_VARS, ...sidebarThemeVars(colors) };
    const fg = (alpha) => `rgba(var(--cv-sidebar-fg-rgb), ${alpha})`;

    return (
        <Box
            aria-label="Prévia do menu lateral"
            style={vars}
            sx={{
                width: 220, flexShrink: 0, borderRadius: 3, p: 1.5,
                background: 'var(--cv-gradient-sidebar)',
                boxShadow: 'var(--cv-shadow-sidebar)',
                color: 'var(--cv-sidebar-fg)',
                display: 'flex', flexDirection: 'column', gap: 0.75,
            }}
        >
            <Typography sx={{ fontSize: 13, fontWeight: 900, px: 0.5, mb: 0.5, color: 'var(--cv-sidebar-fg)' }}>
                Prévia do menu
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.9, borderRadius: 2, background: 'var(--cv-sidebar-active-bg)', boxShadow: 'var(--cv-sidebar-active-shadow)', color: 'var(--cv-sidebar-active-fg)' }}>
                <IconLayoutSidebar size={16} />
                <Typography sx={{ fontSize: 12, fontWeight: 900, color: 'inherit' }}>Item ativo</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.9, borderRadius: 2, border: '1px solid var(--cv-sidebar-group-active-border)', bgcolor: 'var(--cv-sidebar-group-active-bg)' }}>
                <Box sx={{ width: 22, height: 22, borderRadius: 1.5, background: 'var(--cv-sidebar-icon-active-bg)', color: 'var(--cv-sidebar-active-fg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconPalette size={13} />
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 800, color: 'var(--cv-sidebar-fg)' }}>Grupo aberto</Typography>
            </Box>

            <Box sx={{ ml: 1.25, pl: 1, borderLeft: `1px solid ${fg(0.12)}`, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.75, py: 0.4, borderRadius: 1, bgcolor: 'var(--cv-sidebar-sub-active-bg)', borderLeft: '2px solid var(--cv-sidebar-sub-active-border)' }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: 'var(--cv-sidebar-sub-dot)' }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 800, color: 'var(--cv-sidebar-fg)' }}>Subitem ativo</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, px: 0.75, py: 0.4 }}>
                    <Box sx={{ width: 5, height: 5, borderRadius: '50%', bgcolor: fg(0.3) }} />
                    <Typography sx={{ fontSize: 11, fontWeight: 600, color: fg(0.78) }}>Subitem</Typography>
                </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.9, borderRadius: 2 }}>
                <Box sx={{ width: 22, height: 22, borderRadius: 1.5, bgcolor: fg(0.06), color: fg(0.72), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconFileText size={13} />
                </Box>
                <Typography sx={{ fontSize: 12, fontWeight: 700, color: fg(0.74) }}>Item comum</Typography>
            </Box>
        </Box>
    );
}

function OptionalColorField({ label, value, onChange, error, emptyHint, filledHint, resetLabel, fallback }) {
    return (
        <Box>
            <ColorField
                label={label}
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error || (value ? filledHint : emptyHint)}
                fallback={fallback}
            />
            {value && (
                <Button
                    size="small" variant="text" color="inherit"
                    startIcon={<IconRefresh size={15} />}
                    onClick={() => onChange('')}
                    sx={{ mt: 0.5, ml: 7 }}
                >
                    {resetLabel}
                </Button>
            )}
        </Box>
    );
}

function ImagePreviewBox({ src, alt, shape }) {
    return (
        <Box
            sx={{
                width: 72, height: 72,
                borderRadius: shape === 'circle' ? '50%' : 2,
                border: '1px dashed', borderColor: 'grey.300',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', bgcolor: 'grey.50', flexShrink: 0,
            }}
        >
            {src ? (
                <Box component="img" src={src} alt={alt} sx={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            ) : (
                <IconPhoto size={28} style={{ opacity: 0.35 }} />
            )}
        </Box>
    );
}

function ImageUploadField({ label, helperText, currentUrl, newPreview, onSelect, onRestoreDefault, error, accept = 'image/*', shape = 'square' }) {
    const inputRef = useRef(null);

    return (
        <Stack spacing={1.5}>
            <Typography variant="body2" sx={{ fontWeight: 700 }}>{label}</Typography>
            <Stack direction="row" gap={2} alignItems="center" flexWrap="wrap">
                <Stack direction="row" gap={2} alignItems="center">
                    <Stack alignItems="center" spacing={0.5}>
                        <ImagePreviewBox src={currentUrl} alt={label} shape={shape} />
                        <Typography variant="caption" color="text.secondary">Em uso</Typography>
                    </Stack>

                    {newPreview && (
                        <>
                            <IconArrowRight size={18} style={{ opacity: 0.4, flexShrink: 0 }} />
                            <Stack alignItems="center" spacing={0.5}>
                                <ImagePreviewBox src={newPreview} alt={`${label} (novo)`} shape={shape} />
                                <Typography variant="caption" color="success.main" sx={{ fontWeight: 700 }}>Novo (não salvo)</Typography>
                            </Stack>
                        </>
                    )}
                </Stack>

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
        color_sidebar: brand?.color_sidebar ?? '',
        color_sidebar_text: brand?.color_sidebar_text ?? '',
        color_sidebar_accent: brand?.color_sidebar_accent ?? '',
        logo: null,
        favicon: null,
        boleto_logo: null,
    });

    const [logoPreview, setLogoPreview] = useState(null);
    const [faviconPreview, setFaviconPreview] = useState(null);
    const [boletoLogoPreview, setBoletoLogoPreview] = useState(null);

    function pickLogo(file) {
        setData('logo', file);
        setLogoPreview(file ? URL.createObjectURL(file) : null);
    }

    function pickFavicon(file) {
        setData('favicon', file);
        setFaviconPreview(file ? URL.createObjectURL(file) : null);
    }

    function pickBoletoLogo(file) {
        setData('boleto_logo', file);
        setBoletoLogoPreview(file ? URL.createObjectURL(file) : null);
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

    function restoreBoletoLogo() {
        if (!window.confirm('Remover a logo do boleto?')) return;
        router.delete(safeRoute('admin.brand-identity.boleto-logo.destroy'), {
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
                            icon={IconLayoutSidebar}
                            color="var(--cv-gradient-primary)"
                            title="Menu lateral"
                            description="Cores do menu de navegação, no computador e no celular."
                        >
                            <Stack direction={{ xs: 'column', md: 'row' }} gap={3} alignItems={{ xs: 'stretch', md: 'flex-start' }}>
                                <Stack spacing={2.5} sx={{ flex: 1, minWidth: 0 }}>
                                    <OptionalColorField
                                        label="Cor de fundo"
                                        value={data.color_sidebar}
                                        onChange={v => setData('color_sidebar', v)}
                                        error={errors.color_sidebar}
                                        emptyHint="Sem cor definida: o menu usa o verde padrão."
                                        filledHint="Fundo claro ou escuro: o texto se ajusta sozinho se a cor do texto ficar vazia."
                                        resetLabel="Usar o fundo padrão"
                                        fallback="#14532D"
                                    />
                                    <OptionalColorField
                                        label="Cor do texto e ícones"
                                        value={data.color_sidebar_text}
                                        onChange={v => setData('color_sidebar_text', v)}
                                        error={errors.color_sidebar_text}
                                        emptyHint={data.color_sidebar
                                            ? `Automática: ${contrastText(data.color_sidebar) === '#FFFFFF' ? 'branca, porque o fundo é escuro' : 'escura, porque o fundo é claro'}.`
                                            : 'Automática: branca sobre o fundo padrão.'}
                                        filledHint={(contrastRatio(data.color_sidebar_text, data.color_sidebar || '#14532D') ?? 21) < 4.5
                                            ? 'Contraste baixo com o fundo: o texto pode ficar difícil de ler. Deixe vazio para a cor automática.'
                                            : 'Confira na prévia se o texto está legível sobre o fundo.'}
                                        resetLabel="Usar cor automática"
                                        fallback={data.color_sidebar ? contrastText(data.color_sidebar) : '#FFFFFF'}
                                    />
                                    <OptionalColorField
                                        label="Cor de destaque"
                                        value={data.color_sidebar_accent}
                                        onChange={v => setData('color_sidebar_accent', v)}
                                        error={errors.color_sidebar_accent}
                                        emptyHint={data.color_sidebar
                                            ? 'Item ativo, ícone e marcador do submenu. Sem cor definida: usa a cor secundária.'
                                            : 'Item ativo, ícone e marcador do submenu. Sem cor definida: verde padrão.'}
                                        filledHint="Usada no item ativo, no ícone do grupo aberto e no marcador do submenu."
                                        resetLabel="Usar o destaque padrão"
                                        fallback={data.color_sidebar ? data.color_secondary : '#10B981'}
                                    />
                                </Stack>
                                <SidebarPreview
                                    colors={{
                                        background: data.color_sidebar,
                                        text: data.color_sidebar_text,
                                        accent: data.color_sidebar_accent,
                                        secondary: data.color_secondary,
                                    }}
                                />
                            </Stack>
                        </SectionCard>

                        <SectionCard
                            icon={IconPhoto}
                            color="var(--cv-gradient-primary)"
                            title="Logo e Favicon"
                            description="Imagens exibidas no menu lateral e na aba do navegador."
                        >
                            <Stack spacing={3}>
                                <ImageUploadField
                                    label="Logo da plataforma"
                                    helperText="PNG, JPG, SVG ou WEBP — até 2MB. Exibido no menu lateral."
                                    currentUrl={brand?.logo_url}
                                    newPreview={logoPreview}
                                    onSelect={pickLogo}
                                    onRestoreDefault={brand?.logo_url ? restoreLogo : null}
                                    error={errors.logo}
                                    shape="circle"
                                />

                                <ImageUploadField
                                    label="Favicon"
                                    helperText="PNG, ICO, JPG, SVG ou WEBP — até 512KB. Exibido na aba do navegador."
                                    currentUrl={brand?.favicon_url}
                                    newPreview={faviconPreview}
                                    onSelect={pickFavicon}
                                    onRestoreDefault={brand?.favicon_url ? restoreFavicon : null}
                                    error={errors.favicon}
                                />
                            </Stack>
                        </SectionCard>

                        <SectionCard
                            icon={IconFileText}
                            color="var(--cv-gradient-primary)"
                            title="Logo do Boleto"
                            description="Imagem exibida no cabeçalho do PDF de boleto de cobrança enviado ao cliente."
                        >
                            <ImageUploadField
                                label="Logo para o boleto (PDF)"
                                helperText="PNG, JPG ou WEBP — até 2MB. Se não for enviada, o boleto exibe apenas o nome da plataforma em texto."
                                currentUrl={brand?.boleto_logo_url}
                                newPreview={boletoLogoPreview}
                                onSelect={pickBoletoLogo}
                                onRestoreDefault={brand?.boleto_logo_url ? restoreBoletoLogo : null}
                                error={errors.boleto_logo}
                                accept="image/png,image/jpeg,image/webp"
                            />
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
