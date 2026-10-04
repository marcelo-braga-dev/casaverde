import { Head, useForm, usePage } from '@inertiajs/react';
import {
    Alert,
    Box,
    Button,
    Card,
    Checkbox,
    CircularProgress,
    FormControlLabel,
    FormHelperText,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { IconChartBar, IconEye, IconLock, IconUsers } from '@tabler/icons-react';
import { nextPhoneValue } from '@/Utils/Masks/phone';

const HIGHLIGHTS = [
    { icon: IconUsers, text: 'Navegue como administrador, consultor, cliente ou produtor, trocando de perfil com um clique.' },
    { icon: IconChartBar, text: 'Base com meses de operação: usinas, faturas, cobranças, pagamentos e relatórios.' },
    { icon: IconEye, text: 'Acesso de teste: você vê tudo, mas nada é criado, alterado ou excluído.' },
];

export default function Access({ utm = {} }) {
    const { brand } = usePage().props;
    const brandName = brand?.name || 'Plataforma';

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        consent: false,
        ...utm,
    });

    const submit = (event) => {
        event.preventDefault();
        post(route('demo.access'));
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'var(--cv-background, #F4F7F4)', display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: 4 }}>
            <Head title="Demonstração" />

            <Card sx={{ width: '100%', maxWidth: 980, borderRadius: 4, overflow: 'hidden', display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1.05fr 1fr' }, boxShadow: 'var(--cv-shadow-lg)' }}>
                <Box sx={{ background: 'var(--cv-gradient-hero)', color: '#fff', p: { xs: 3.5, md: 5 }, display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Stack direction="row" alignItems="center" gap={1.5}>
                        {brand?.logo_url && (
                            <Box component="img" src={brand.logo_url} alt="" sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#fff', objectFit: 'cover' }} />
                        )}
                        <Typography variant="h6" sx={{ fontWeight: 900, color: '#fff' }}>{brandName}</Typography>
                    </Stack>

                    <Box>
                        <Typography variant="overline" sx={{ color: 'rgba(255,255,255,0.7)', letterSpacing: '0.14em', fontWeight: 800 }}>
                            Demonstração gratuita
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 900, color: '#fff', lineHeight: 1.15, mt: 0.5, textWrap: 'balance' }}>
                            Conheça a plataforma por dentro
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.8)', mt: 1.5 }}>
                            Gestão completa de energia solar compartilhada: comercial, usinas, faturas, cobrança e pagamento.
                        </Typography>
                    </Box>

                    <Stack spacing={2}>
                        {HIGHLIGHTS.map(({ icon: Icon, text }) => (
                            <Stack key={text} direction="row" gap={1.5} alignItems="flex-start">
                                <Box sx={{ width: 34, height: 34, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.14)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Icon size={18} />
                                </Box>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.88)', pt: 0.6 }}>{text}</Typography>
                            </Stack>
                        ))}
                    </Stack>
                </Box>

                <Box component="form" onSubmit={submit} sx={{ p: { xs: 3.5, md: 5 }, display: 'flex', flexDirection: 'column', gap: 2.2, bgcolor: 'background.paper' }}>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 900 }}>Acesse a demonstração</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Sem senha. Informe seu nome e um e-mail ou telefone.
                        </Typography>
                    </Box>

                    <TextField
                        id="demo-name" label="Nome" required autoFocus fullWidth
                        value={data.name} onChange={(e) => setData('name', e.target.value)}
                        error={!!errors.name} helperText={errors.name}
                    />
                    <TextField
                        id="demo-email" label="E-mail" type="email" fullWidth
                        value={data.email} onChange={(e) => setData('email', e.target.value)}
                        error={!!errors.email} helperText={errors.email}
                    />
                    <TextField
                        id="demo-phone" label="Telefone / WhatsApp" fullWidth type="tel" placeholder="(41) 9 9999-0000"
                        inputProps={{ inputMode: 'numeric', autoComplete: 'tel-national', maxLength: 16 }}
                        value={data.phone} onChange={(e) => setData('phone', nextPhoneValue(data.phone, e.target.value))}
                        error={!!errors.phone} helperText={errors.phone || 'Preencha e-mail, telefone ou os dois.'}
                    />
                    <TextField
                        id="demo-company" label="Empresa (opcional)" fullWidth
                        value={data.company} onChange={(e) => setData('company', e.target.value)}
                        error={!!errors.company} helperText={errors.company}
                    />

                    <Box>
                        <FormControlLabel
                            control={<Checkbox id="demo-consent" checked={data.consent} onChange={(e) => setData('consent', e.target.checked)} />}
                            label={<Typography variant="body2">Aceito ser contatado pela equipe comercial sobre a plataforma.</Typography>}
                        />
                        {errors.consent && <FormHelperText error>{errors.consent}</FormHelperText>}
                    </Box>

                    <Button
                        type="submit" variant="contained" size="large" disabled={processing}
                        startIcon={processing ? <CircularProgress size={16} color="inherit" /> : null}
                        sx={{ py: 1.4, fontSize: '1rem' }}
                    >
                        Acessar demonstração
                    </Button>

                    <Alert severity="info" icon={<IconLock size={18} />} sx={{ borderRadius: 2 }}>
                        Ambiente com dados fictícios. Você navega por tudo; criar, editar e excluir ficam desativados.
                    </Alert>
                </Box>
            </Card>
        </Box>
    );
}
