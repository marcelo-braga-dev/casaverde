import Layout from "@/Layouts/UserLayout/Layout.jsx";
import { Head, Link } from "@inertiajs/react";
import { Button, Card, CardContent, Divider, Stack, Typography } from "@mui/material";

export default function Page({ producer }) {
    return (
        <Layout titlePage="Perfil de Produtor" menu="produtores">
            <Head title="Perfil de Produtor" />

            <Card>
                <CardContent>
                    <Typography variant="h5" marginBottom={2}>
                        {producer.usina_nome || producer.admin_nome || `Produtor #${producer.id}`}
                    </Typography>

                    <Stack spacing={1}>
                        <Typography>Administrador: {producer.admin_nome || "-"}</Typography>
                        <Typography>Qualificação: {producer.admin_qualificacao || "-"}</Typography>
                        <Typography>Usina: {producer.usina_nome || "-"}</Typography>
                        <Typography>CNPJ da usina: {producer.usina_cnpj || "-"}</Typography>
                        <Typography>UC: {producer.unidade_consumidora || "-"}</Typography>
                        <Typography>Status: {producer.status}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Stack spacing={1}>
                        <Typography>Potência kW: {producer.potencia_kw || "-"}</Typography>
                        <Typography>Potência kWp: {producer.potencia_kwp || "-"}</Typography>
                        <Typography>Geração anual: {producer.geracao_anual || "-"}</Typography>
                        <Typography>Área da usina: {producer.usina_area || "-"}</Typography>
                        <Typography>Área do imóvel: {producer.imovel_area || "-"}</Typography>
                        <Typography>Matrícula: {producer.imovel_matricula || "-"}</Typography>
                        <Typography>Tipo de área: {producer.tipo_area || "-"}</Typography>
                        <Typography>Classificação: {producer.classificacao || "-"}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Stack spacing={1}>
                        <Typography>Prazo de locação: {producer.prazo_locacao || "-"}</Typography>
                        <Typography>Parcela fixa: {producer.parcela_fixa || "-"}</Typography>
                        <Typography>Taxa de administração: {producer.taxa_administracao || "-"}</Typography>
                        <Typography>Data do contrato: {producer.contrato_data || "-"}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Stack spacing={1}>
                        <Typography>Módulos: {producer.modulos || "-"}</Typography>
                        <Typography>Inversores: {producer.inversores || "-"}</Typography>
                        <Typography>Descrição: {producer.descricao || "-"}</Typography>
                    </Stack>

                    <Divider sx={{ my: 3 }} />

                    <Link href={route("admin.producer-profiles.edit", producer.id)}>
                        <Button variant="contained">Editar</Button>
                    </Link>
                </CardContent>
            </Card>
        </Layout>
    );
}