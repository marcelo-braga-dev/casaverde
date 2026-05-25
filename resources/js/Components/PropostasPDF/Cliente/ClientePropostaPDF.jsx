import React from 'react';

import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
} from '@react-pdf/renderer';

import convertFloatToMoney from "@/Utils/Datas/convertFloatToMoney.js";

const styles = StyleSheet.create({

    page: {
        padding: 32,
        fontSize: 11,
        fontFamily: 'Helvetica',
        backgroundColor: '#FFFFFF',
        color: '#1E293B',
    },

    hero: {
        backgroundColor: '#0B7A53',
        borderRadius: 12,
        padding: 24,
        marginBottom: 24,
    },

    logo: {
        fontSize: 12,
        color: '#D1FAE5',
        marginBottom: 8,
        fontWeight: 'bold',
    },

    heroTitle: {
        fontSize: 26,
        color: '#FFFFFF',
        fontWeight: 'bold',
        marginBottom: 4,
    },

    heroSubtitle: {
        fontSize: 12,
        color: '#ECFDF5',
    },

    discountBadge: {
        marginTop: 18,
        backgroundColor: '#FFFFFF',
        color: '#0B7A53',
        padding: 10,
        borderRadius: 8,
        width: 120,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },

    sectionRow: {
        flexDirection: 'row',
        marginBottom: 20,
    },

    card: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 16,
        marginRight: 10,
    },

    cardLast: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 10,
        padding: 16,
    },

    cardTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 14,
        color: '#0F172A',
    },

    infoRow: {
        marginBottom: 10,
    },

    label: {
        fontSize: 9,
        color: '#64748B',
        marginBottom: 2,
    },

    value: {
        fontSize: 11,
        fontWeight: 'bold',
    },

    green: {
        color: '#0B7A53',
    },

    highlights: {
        flexDirection: 'row',
        marginBottom: 24,
    },

    highlightCard: {
        flex: 1,
        backgroundColor: '#0F172A',
        borderRadius: 10,
        padding: 16,
        marginRight: 10,
        alignItems: 'center',
    },

    highlightCardLast: {
        flex: 1,
        backgroundColor: '#0F172A',
        borderRadius: 10,
        padding: 16,
        alignItems: 'center',
    },

    highlightLabel: {
        fontSize: 10,
        color: '#CBD5E1',
        marginBottom: 8,
    },

    highlightValue: {
        fontSize: 18,
        color: '#10B981',
        fontWeight: 'bold',
    },

    tableContainer: {
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 30,
    },

    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        fontWeight: 'bold',
        paddingVertical: 10,
    },

    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        paddingVertical: 10,
    },

    cell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 10,
    },

    cellGreen: {
        flex: 1,
        textAlign: 'center',
        fontSize: 10,
        color: '#0B7A53',
        fontWeight: 'bold',
    },

    cellEconomy: {
        flex: 1,
        textAlign: 'center',
        fontSize: 10,
        color: '#10B981',
        fontWeight: 'bold',
    },

    footer: {
        borderTopWidth: 1,
        borderTopColor: '#CBD5E1',
        paddingTop: 16,
        textAlign: 'center',
    },

    footerTitle: {
        fontSize: 14,
        color: '#0B7A53',
        fontWeight: 'bold',
        marginBottom: 6,
    },

    footerText: {
        fontSize: 10,
        color: '#64748B',
        lineHeight: 1.5,
    },
});

const PropostaModelo = ({dados}) => {

    const taxaReducao = Number(
        dados?.proposal?.discount_percent ||
        0
    );

    const valorMedio = Number(
        dados?.valor_medio || 0
    );

    const mediaConsumo = Number(
        dados?.media_consumo || 0
    );

    const prazoLocacao = Number(
        dados?.prazo_locacao || 0
    );

    const valorComDesconto = (
        valorMedio * (1 - (taxaReducao / 100))
    );

    const economiaMensal = (
        valorMedio - valorComDesconto
    );

    const economiaAnual = (
        economiaMensal * 12
    );

    const economiaContrato = (
        economiaMensal * prazoLocacao
    );

    const rows = [
        {
            periodo: 'Mensal',
            concessionaria: valorMedio,
            solar: valorComDesconto,
            economia: economiaMensal,
        },
        {
            periodo: 'Trimestral',
            concessionaria: valorMedio * 3,
            solar: valorComDesconto * 3,
            economia: economiaMensal * 3,
        },
        {
            periodo: 'Semestral',
            concessionaria: valorMedio * 6,
            solar: valorComDesconto * 6,
            economia: economiaMensal * 6,
        },
        {
            periodo: 'Anual',
            concessionaria: valorMedio * 12,
            solar: valorComDesconto * 12,
            economia: economiaMensal * 12,
        },
    ];

    return (
        <Document>

            <Page size="A4" style={styles.page}>

                <View style={styles.hero}>
                    <Text style={styles.logo}>
                        CASA VERDE
                    </Text>
                    <Text style={styles.heroTitle}>
                        Proposta Comercial
                    </Text>

                    <Text style={styles.heroSubtitle}>
                        Economia Inteligente com Energia Solar
                    </Text>

                    <View style={styles.discountBadge}>
                        <Text>
                            {taxaReducao}%
                        </Text>
                    </View>

                </View>

                <View style={styles.sectionRow}>

                    <View style={styles.card}>

                        <Text style={styles.cardTitle}>
                            Dados do Cliente
                        </Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Cliente</Text>
                            <Text style={styles.value}>
                                {
                                    dados?.cliente?.user_data?.nome
                                    || dados?.cliente?.user_data?.razao_social
                                    || '-'
                                }
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Documento</Text>
                            <Text style={styles.value}>
                                {
                                    dados?.cliente?.user_data?.cpf
                                    || dados?.cliente?.user_data?.cnpj
                                    || '-'
                                }
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Endereço</Text>
                            <Text style={styles.value}>
                                {dados?.proposal?.address?.full_address}
                            </Text>
                        </View>

                    </View>

                    <View style={styles.cardLast}>

                        <Text style={styles.cardTitle}>
                            Dados da Proposta
                        </Text>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Média Mensal</Text>

                            <Text style={[styles.value, styles.green]}>
                                {
                                    convertFloatToMoney(valorMedio)
                                }
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Consumo Médio Mensal</Text>

                            <Text style={styles.value}>
                                {mediaConsumo} kWh/mês
                            </Text>
                        </View>

                        <View style={styles.infoRow}>
                            <Text style={styles.label}>Prazo do Contrato</Text>

                            <Text style={styles.value}>
                                {prazoLocacao} meses
                            </Text>
                        </View>

                    </View>

                </View>

                <View style={styles.highlights}>

                    <View style={styles.highlightCard}>
                        <Text style={styles.highlightLabel}>
                            Economia Mensal
                        </Text>

                        <Text style={styles.highlightValue}>
                            {convertFloatToMoney(economiaMensal)}
                        </Text>
                    </View>

                    <View style={styles.highlightCard}>
                        <Text style={styles.highlightLabel}>
                            Economia Anual
                        </Text>

                        <Text style={styles.highlightValue}>
                            {convertFloatToMoney(economiaAnual)}
                        </Text>
                    </View>

                    <View style={styles.highlightCardLast}>
                        <Text style={styles.highlightLabel}>
                            Economia Contrato
                        </Text>

                        <Text style={styles.highlightValue}>
                            {convertFloatToMoney(economiaContrato)}
                        </Text>
                    </View>

                </View>

                <View style={styles.tableContainer}>

                    <View style={styles.tableHeader}>

                        <Text style={styles.cell}>
                            Período
                        </Text>

                        <Text style={styles.cell}>
                            Concessionária
                        </Text>

                        <Text style={styles.cell}>
                            Solar
                        </Text>

                        <Text style={styles.cell}>
                            Economia
                        </Text>

                    </View>

                    {rows.map((item) => (
                        <View
                            key={item.periodo}
                            style={styles.tableRow}
                        >

                            <Text style={styles.cell}>
                                {item.periodo}
                            </Text>

                            <Text style={styles.cell}>
                                {
                                    convertFloatToMoney(
                                        item.concessionaria
                                    )
                                }
                            </Text>

                            <Text style={styles.cellGreen}>
                                {
                                    convertFloatToMoney(
                                        item.solar
                                    )
                                }
                            </Text>

                            <Text style={styles.cellEconomy}>
                                {
                                    convertFloatToMoney(
                                        item.economia
                                    )
                                }
                            </Text>

                        </View>
                    ))}

                </View>

                <View style={styles.footer}>

                    <Text style={styles.footerTitle}>
                        Energia limpa, economia real.
                    </Text>

                    <Text style={styles.footerText}>
                        Esta proposta foi desenvolvida com base
                        no histórico de consumo informado pelo cliente.
                    </Text>

                </View>

            </Page>

        </Document>
    );
};

export default PropostaModelo;
