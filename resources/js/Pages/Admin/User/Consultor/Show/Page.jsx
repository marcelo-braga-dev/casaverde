import React from "react";

import {Link} from "@inertiajs/react";

import Grid from "@mui/material/Grid2";

import Layout from "@/Layouts/UserLayout/Layout.jsx";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Divider,
    Stack,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import {
    IconBolt,
    IconBuildingFactory,
    IconEye,
    IconFileInvoice,
    IconUsers,
} from "@tabler/icons-react";

import AccessHistoryCard from '@/Components/Acesso/AccessHistoryCard.jsx';
import { router } from '@inertiajs/react';
import { CircularProgress, Tooltip } from '@mui/material';
import { IconLock, IconLockOpen } from '@tabler/icons-react';
import { useState as useStateAccess } from 'react';

function safeRoute(n, p) { try { return route(n, p); } catch { return '#'; } }

export default function Page({
    consultor,
    stats,
    clients,
    proposals,
    usinas,
    producers,
    accessHistory = [],
}) {
    return (
        <Layout
            menu="consultores"
            subMenu="consultores-cadastrados">

            <Stack spacing={3}>

                <HeroSection consultor={consultor} />

                <Grid container spacing={3}>

                    <Grid size={{xs: 12, md: 3}}>
                        <MetricCard
                            title="Clientes"
                            value={stats.clients_count}
                            icon={<IconUsers size={26}/>}
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
                        <MetricCard
                            title="Propostas"
                            value={stats.proposals_count}
                            icon={<IconFileInvoice size={26}/>}
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
                        <MetricCard
                            title="Usinas"
                            value={stats.usinas_count}
                            icon={<IconBolt size={26}/>}
                        />
                    </Grid>

                    <Grid size={{xs: 12, md: 3}}>
                        <MetricCard
                            title="Produtores"
                            value={stats.producers_count}
                            icon={<IconBuildingFactory size={26}/>}
                        />
                    </Grid>

                </Grid>

                <ModernTable
                    title="Clientes Recentes"
                    items={clients}
                    emptyText="Nenhum cliente encontrado."
                    columns={[
                        {
                            label: "Cliente",
                            render: (item) =>
                                item.nome
                                || item.razao_social
                                || '-',
                        },
                        {
                            label: "CPF/CNPJ",
                            render: (item) =>
                                item.cpf
                                || item.cnpj
                                || '-',
                        },
                        {
                            label: "Cidade",
                            render: (item) =>
                                item.cidade
                                || '-',
                        },
                    ]}
                    routeName="consultor.user.cliente.show"
                />

                <ModernTable
                    title="Propostas Recentes"
                    items={proposals}
                    emptyText="Nenhuma proposta encontrada."
                    columns={[
                        {
                            label: "Código",
                            render: (item) =>
                                item.proposal_code,
                        },
                        {
                            label: "Cliente",
                            render: (item) =>
                                item.client_profile?.display_name
                                || '-',
                        },
                        {
                            label: "Valor Médio",
                            render: (item) =>
                                item.valor_medio
                                    ? `R$ ${Number(item.valor_medio).toLocaleString('pt-BR', {
                                        minimumFractionDigits: 2,
                                    })}`
                                    : '-',
                        },
                    ]}
                    routeName="consultor.propostas.cliente.show"
                />

                <ModernTable
                    title="Usinas Recentes"
                    items={usinas}
                    emptyText="Nenhuma usina encontrada."
                    columns={[
                        {
                            label: "Nome",
                            render: (item) =>
                                item.nome
                                || '-',
                        },
                        {
                            label: "UC",
                            render: (item) =>
                                item.uc
                                || '-',
                        },
                        {
                            label: "Status",
                            render: (item) =>
                                item.status
                                || '-',
                        },
                    ]}
                    routeName="consultor.producer.usinas.show"
                />

                <ModernTable
                    title="Produtores Recentes"
                    items={producers}
                    emptyText="Nenhum produtor encontrado."
                    columns={[
                        {
                            label: "Nome",
                            render: (item) =>
                                item.nome,
                        },
                        {
                            label: "Email",
                            render: (item) =>
                                item.email,
                        },
                        {
                            label: "Status",
                            render: (item) =>
                                item.status_nome,
                        },
                    ]}
                    routeName="admin.produtores.show"
                />

                {/* ── Histórico de acesso ─────────────────────── */}
                <AccessHistoryCard
                    history={accessHistory}
                    title={`Histórico de Acesso — ${consultor?.name}`}
                />

                {/* ── Bloquear / Liberar ──────────────────────── */}
                <BlockAccessCard user={consultor} />

            </Stack>

        </Layout>
    )
}

function BlockAccessCard({ user }) {
    const [loading, setLoading] = useStateAccess(false);
    const isBlocked = String(user?.status) === '0';

    function toggle() {
        setLoading(true);
        const routeName = isBlocked ? 'admin.acesso.liberar' : 'admin.acesso.bloquear';
        router.post(safeRoute(routeName, user?.id), {}, {
            preserveScroll: true,
            onFinish: () => setLoading(false),
        });
    }

    return (
        <Card>
            <CardContent>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>Status de acesso</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isBlocked
                                ? 'Este consultor está bloqueado e não pode acessar a plataforma.'
                                : 'Este consultor tem acesso ativo à plataforma.'}
                        </Typography>
                    </Box>
                    <Stack direction="row" gap={1} alignItems="center">
                        <Chip
                            label={isBlocked ? 'Bloqueado' : 'Ativo'}
                            color={isBlocked ? 'error' : 'success'}
                            size="small"
                        />
                        <Button
                            variant="outlined"
                            color={isBlocked ? 'success' : 'error'}
                            size="small"
                            startIcon={loading
                                ? <CircularProgress size={13} color="inherit" />
                                : isBlocked ? <IconLockOpen size={15} /> : <IconLock size={15} />
                            }
                            onClick={toggle}
                            disabled={loading}
                        >
                            {isBlocked ? 'Liberar acesso' : 'Bloquear acesso'}
                        </Button>
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    );
}

function HeroSection({
                         consultor,
                     }) {

    return (
        <Card className="cv-card-hero">

            <CardContent sx={{p: 4}}>

                <Stack
                    direction="row"
                    spacing={3}
                    alignItems="center"
                >

                    <Avatar
                        sx={{
                            width: 90,
                            height: 90,
                            fontSize: 36,
                            fontWeight: 900,
                        }}
                    >
                        {consultor.nome?.charAt(0)}
                    </Avatar>

                    <Box flex={1}>

                        <Typography
                            variant="h3"
                            fontWeight={900}
                        >
                            {consultor.nome}
                        </Typography>

                        <Typography
                            variant="body1"
                            color="text.secondary"
                            mt={0.5}
                        >
                            {consultor.email}
                        </Typography>

                        <Stack
                            direction="row"
                            spacing={1}
                            mt={2}
                        >

                            <Chip
                                label={consultor.role_name}
                                color="primary"
                            />

                            <Chip
                                label={consultor.status_nome}
                                color={
                                    consultor.status == 1
                                        ? "success"
                                        : "error"
                                }
                            />

                        </Stack>

                    </Box>

                </Stack>

            </CardContent>

        </Card>
    )
}

function MetricCard({
                        title,
                        value,
                        icon,
                    }) {

    return (
        <Card className="cv-card">

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Typography
                            color="text.secondary"
                            fontWeight={700}
                        >
                            {title}
                        </Typography>

                        {icon}

                    </Stack>

                    <Typography
                        variant="h3"
                        fontWeight={900}
                    >
                        {value}
                    </Typography>

                </Stack>

            </CardContent>

        </Card>
    )
}

function ModernTable({
                         title,
                         items,
                         columns,
                         routeName,
                         emptyText,
                     }) {

    return (
        <Card className="cv-card">

            <CardContent>

                <Stack spacing={2}>

                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >

                        <Typography
                            variant="h5"
                            fontWeight={800}
                        >
                            {title}
                        </Typography>

                        <Chip
                            label={`${items.length} registros`}
                            color="primary"
                            variant="outlined"
                        />

                    </Stack>

                    <Divider/>

                    <TableContainer>

                        <Table>

                            <TableHead>

                                <TableRow>

                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.label}
                                            sx={{
                                                fontWeight: 800,
                                                fontSize: 14,
                                            }}
                                        >
                                            {column.label}
                                        </TableCell>
                                    ))}

                                    <TableCell
                                        width={120}
                                        align="right"
                                        sx={{
                                            fontWeight: 800,
                                        }}
                                    >
                                        Ações
                                    </TableCell>

                                </TableRow>

                            </TableHead>

                            <TableBody>

                                {items.length === 0 && (
                                    <TableRow>

                                        <TableCell
                                            colSpan={
                                                columns.length + 1
                                            }
                                        >

                                            <Box
                                                py={6}
                                                textAlign="center"
                                            >

                                                <Typography
                                                    color="text.secondary"
                                                >
                                                    {emptyText}
                                                </Typography>

                                            </Box>

                                        </TableCell>

                                    </TableRow>
                                )}

                                {items.map((item) => (

                                    <TableRow
                                        key={item.id}
                                        hover
                                    >

                                        {columns.map((column) => (

                                            <TableCell
                                                key={column.label}
                                            >
                                                {column.render(item)}
                                            </TableCell>

                                        ))}

                                        <TableCell align="right">

                                            <Link
                                                href={route(
                                                    routeName,
                                                    item.id
                                                )}
                                            >

                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={
                                                        <IconEye size={16}/>
                                                    }
                                                >
                                                    Ver
                                                </Button>

                                            </Link>

                                        </TableCell>

                                    </TableRow>

                                ))}

                            </TableBody>

                        </Table>

                    </TableContainer>

                </Stack>

            </CardContent>

        </Card>
    )
}
