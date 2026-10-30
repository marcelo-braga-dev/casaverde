import { useMemo, useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
    DndContext,
    KeyboardSensor,
    PointerSensor,
    useDraggable,
    useDroppable,
    useSensor,
    useSensors,
} from '@dnd-kit/core';

import Layout from '@/Layouts/UserLayout/Layout.jsx';

const formatKwp = (value) => `${Number(value || 0).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} kWp`;

function OnboardingCard({ usina, stages, stalledAfterDays, onMove }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: usina.id,
        data: { stage: usina.stage },
    });

    const stalled = usina.stage !== 'completed'
        && usina.days_in_stage !== null
        && usina.days_in_stage > stalledAfterDays;

    return (
        <Card
            ref={setNodeRef}
            variant="outlined"
            sx={{
                mb: 1.5,
                borderColor: stalled ? 'warning.main' : 'divider',
                opacity: isDragging ? 0.6 : 1,
                transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
                position: 'relative',
                zIndex: isDragging ? 10 : 'auto',
            }}
        >
            <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box {...listeners} {...attributes} sx={{ cursor: 'grab' }}>
                    <Typography fontWeight={800} fontSize={14}>
                        #{usina.id} · {usina.usina_nome}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {usina.produtor || 'Produtor não informado'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                        {formatKwp(usina.potencia_usina)} · {usina.concessionaria || '-'}
                    </Typography>
                    {usina.consultor && (
                        <Typography variant="caption" color="text.secondary" display="block">
                            Consultor: {usina.consultor}
                        </Typography>
                    )}
                </Box>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                    {usina.days_in_stage !== null && (
                        <Chip
                            size="small"
                            color={stalled ? 'warning' : 'default'}
                            label={stalled
                                ? `Parada há ${usina.days_in_stage} dias`
                                : `${usina.days_in_stage} dia(s) na etapa`}
                        />
                    )}
                    <Button
                        size="small"
                        component={Link}
                        href={route('consultor.producer.usinas.show', usina.id)}
                        endIcon={<OpenInNewIcon fontSize="small" />}
                    >
                        Abrir
                    </Button>
                </Stack>

                <TextField
                    select
                    size="small"
                    fullWidth
                    label="Mover para"
                    value={usina.stage}
                    onChange={(event) => onMove(usina.id, event.target.value)}
                    sx={{ mt: 1.5 }}
                >
                    {stages.map((stage) => (
                        <MenuItem key={stage.value} value={stage.value}>{stage.label}</MenuItem>
                    ))}
                </TextField>
            </CardContent>
        </Card>
    );
}

function OnboardingColumn({ stage, cards, children }) {
    const { setNodeRef, isOver } = useDroppable({ id: stage.value });

    return (
        <Box
            ref={setNodeRef}
            sx={{
                minWidth: 260,
                width: 260,
                flexShrink: 0,
                bgcolor: isOver ? 'action.hover' : 'grey.50',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                borderTop: `4px solid ${stage.color}`,
                p: 1.5,
                minHeight: 320,
            }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                <Typography fontWeight={800} fontSize={14}>{stage.label}</Typography>
                <Chip size="small" label={cards.length} />
            </Stack>
            {children}
            {cards.length === 0 && (
                <Typography variant="caption" color="text.secondary">
                    Arraste uma usina para cá.
                </Typography>
            )}
        </Box>
    );
}

export default function AdminUsinaOnboardingPage() {
    const { stages, usinas, availableUsinas, stalledAfterDays } = usePage().props;
    const [usinaToAdd, setUsinaToAdd] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
        useSensor(KeyboardSensor),
    );

    const cardsByStage = useMemo(() => {
        const grouped = Object.fromEntries(stages.map((stage) => [stage.value, []]));
        usinas.forEach((usina) => grouped[usina.stage]?.push(usina));
        return grouped;
    }, [stages, usinas]);

    const moveUsina = (usinaId, stage) => {
        router.patch(
            route('admin.usinas.onboarding.update', usinaId),
            { stage },
            { preserveScroll: true },
        );
    };

    const handleDragEnd = ({ active, over }) => {
        if (!over || over.id === active.data.current?.stage) {
            return;
        }
        moveUsina(active.id, over.id);
    };

    const handleAdd = () => {
        if (!usinaToAdd) {
            return;
        }
        moveUsina(usinaToAdd, stages[0].value);
        setUsinaToAdd('');
    };

    const inProgress = usinas.filter((usina) => usina.stage !== 'completed').length;
    const stalled = usinas.filter((usina) => usina.stage !== 'completed'
        && usina.days_in_stage !== null
        && usina.days_in_stage > stalledAfterDays).length;

    return (
        <Layout titlePage="Onboarding de Usinas" menu="usinas-solar" subMenu="usinas-onboarding">
            <Box sx={{ p: 3 }}>
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    alignItems={{ xs: 'stretch', md: 'center' }}
                    spacing={2}
                    sx={{ mb: 3 }}
                >
                    <Box>
                        <Typography variant="h4" fontWeight={900}>Onboarding de Usinas</Typography>
                        <Typography color="text.secondary">
                            Do aceite do produtor até a usina pronta para receber clientes no rateio.
                            {' '}{inProgress} em andamento{stalled > 0 ? ` · ${stalled} parada(s) há mais de ${stalledAfterDays} dias` : ''}.
                        </Typography>
                    </Box>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <TextField
                            select
                            size="small"
                            label="Colocar usina existente no quadro"
                            value={usinaToAdd}
                            onChange={(event) => setUsinaToAdd(event.target.value)}
                            sx={{ minWidth: 280 }}
                            disabled={availableUsinas.length === 0}
                        >
                            {availableUsinas.map((usina) => (
                                <MenuItem key={usina.id} value={usina.id}>#{usina.id} · {usina.usina_nome}</MenuItem>
                            ))}
                        </TextField>
                        <Button variant="outlined" onClick={handleAdd} disabled={!usinaToAdd}>
                            Colocar
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            component={Link}
                            href={route('consultor.producer.usinas.create')}
                        >
                            Nova usina
                        </Button>
                    </Stack>
                </Stack>

                <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                    <Box sx={{ display: 'flex', gap: 2, overflowX: 'auto', pb: 2 }}>
                        {stages.map((stage) => (
                            <OnboardingColumn key={stage.value} stage={stage} cards={cardsByStage[stage.value]}>
                                {cardsByStage[stage.value].map((usina) => (
                                    <OnboardingCard
                                        key={usina.id}
                                        usina={usina}
                                        stages={stages}
                                        stalledAfterDays={stalledAfterDays}
                                        onMove={moveUsina}
                                    />
                                ))}
                            </OnboardingColumn>
                        ))}
                    </Box>
                </DndContext>

                <Typography variant="caption" color="text.secondary">
                    Usinas novas entram na primeira etapa automaticamente. Concluídas ficam visíveis por 30 dias.
                </Typography>
            </Box>
        </Layout>
    );
}
