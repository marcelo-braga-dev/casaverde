import Layout from '@/Layouts/UserLayout/Layout.jsx';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { IconArrowLeft, IconHeadset, IconSend } from '@tabler/icons-react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

const PRIORITY_LABELS = {
    baixa:   '🟢 Baixa — não urgente',
    normal:  '🔵 Normal — padrão',
    alta:    '🟡 Alta — precisa de atenção',
    urgente: '🔴 Urgente — impacto crítico',
};

export default function Page({ categories = [], priorities = [] }) {
    const { data, setData, post, processing, errors } = useForm({
        title:       '',
        description: '',
        category:    '',
        priority:    'normal',
    });

    function submit(e) {
        e.preventDefault();
        post(safeRoute('support.tickets.store'));
    }

    return (
        <Layout
            titlePage="Abrir Chamado"
            menu="suporte"
            subMenu="suporte-produtores"
            subtitle="Descreva sua solicitação com o máximo de detalhes."
            breadcrumbs={[
                { label: 'Suporte' },
                { label: 'Chamados', href: safeRoute('support.tickets.index') },
                { label: 'Novo Chamado' },
            ]}
        >
            <Head title="Abrir Chamado" />

            <Stack spacing={3} sx={{ maxWidth: 760, mx: 'auto' }}>
                <Button
                    component={Link}
                    href={safeRoute('support.tickets.index')}
                    startIcon={<IconArrowLeft size={16} />}
                    variant="text"
                    size="small"
                    sx={{ alignSelf: 'flex-start' }}
                >
                    Voltar aos chamados
                </Button>

                <Card sx={{ borderRadius: 'var(--cv-radius-xl)', border: '1px solid var(--cv-border-soft)', boxShadow: 'var(--cv-shadow-md)' }}>
                    <CardContent>
                        <Stack direction="row" alignItems="center" gap={1.5} sx={{ mb: 2.5 }}>
                            <Box sx={{ width: 40, height: 40, borderRadius: 2, background: 'var(--cv-gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                                <IconHeadset size={20} />
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 950, letterSpacing: '-0.04em' }}>
                                    Novo Chamado de Suporte
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Preencha os campos abaixo para registrar sua solicitação.
                                </Typography>
                            </Box>
                        </Stack>

                        <Divider sx={{ mb: 3 }} />

                        <Box component="form" onSubmit={submit}>
                            <Stack spacing={3}>
                                {Object.keys(errors).length > 0 && (
                                    <Alert severity="error">
                                        {Object.values(errors)[0]}
                                    </Alert>
                                )}

                                {/* Título */}
                                <TextField
                                    fullWidth
                                    label="Título do chamado *"
                                    placeholder="Ex.: Não consigo acessar minha conta"
                                    value={data.title}
                                    onChange={e => setData('title', e.target.value)}
                                    error={!!errors.title}
                                    helperText={errors.title ?? 'Resuma o problema em uma frase clara.'}
                                    inputProps={{ maxLength: 200 }}
                                />

                                {/* Categoria + Prioridade */}
                                <Stack direction={{ xs: 'column', sm: 'row' }} gap={2}>
                                    <TextField
                                        fullWidth
                                        select
                                        label="Categoria *"
                                        value={data.category}
                                        onChange={e => setData('category', e.target.value)}
                                        error={!!errors.category}
                                        helperText={errors.category ?? 'Classifique o tipo de problema.'}
                                    >
                                        {categories.map(c => (
                                            <MenuItem key={c.value} value={c.value}>{c.label}</MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        select
                                        label="Prioridade"
                                        value={data.priority}
                                        onChange={e => setData('priority', e.target.value)}
                                        helperText="Selecione conforme o impacto."
                                    >
                                        {priorities.map(p => (
                                            <MenuItem key={p.value} value={p.value}>
                                                {PRIORITY_LABELS[p.value] ?? p.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Stack>

                                {/* Descrição */}
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={7}
                                    label="Descrição detalhada *"
                                    placeholder="Descreva o problema com o máximo de detalhes possíveis. Inclua o que você esperava que acontecesse e o que realmente aconteceu."
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    error={!!errors.description}
                                    helperText={errors.description ?? `${data.description.length} caracteres — quanto mais detalhes, melhor o atendimento.`}
                                />

                                {/* Dicas */}
                                <Box sx={{ bgcolor: 'info.50', borderRadius: 2, p: 2, border: '1px solid', borderColor: 'info.200' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, color: 'info.dark', mb: 0.5 }}>
                                        Dicas para um bom chamado:
                                    </Typography>
                                    <Stack component="ul" spacing={0.3} sx={{ pl: 2, m: 0 }}>
                                        {[
                                            'Inclua o que você estava tentando fazer.',
                                            'Descreva o erro ou comportamento inesperado.',
                                            'Informe se o problema é recorrente ou ocorreu uma única vez.',
                                            'Para problemas financeiros, inclua o número da fatura ou competência.',
                                        ].map(tip => (
                                            <Typography key={tip} component="li" variant="body2" color="text.secondary">
                                                {tip}
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>

                                <Divider />

                                <Stack direction="row" justifyContent="flex-end" gap={1.5}>
                                    <Button
                                        component={Link}
                                        href={safeRoute('support.tickets.index')}
                                        variant="outlined"
                                        color="inherit"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        disabled={processing || !data.title || !data.description || !data.category}
                                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : <IconSend size={17} />}
                                    >
                                        Abrir chamado
                                    </Button>
                                </Stack>
                            </Stack>
                        </Box>
                    </CardContent>
                </Card>
            </Stack>
        </Layout>
    );
}
