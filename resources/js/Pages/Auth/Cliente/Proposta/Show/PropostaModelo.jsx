import {
    Document,
    Page,
    Image,
    Text,
    View,
    StyleSheet,
} from '@react-pdf/renderer';
import convertFloatToMoney from "@/Utils/Datas/convertFloatToMoney.js";

// Componente do PDF
const PropostaModelo = ({dados, imagemGrafico}) => {

    const valorConsorcio = (valor) => {
        return valor * (1 - dados?.discount_percent / 100)
    }

    return <Document>
        {/* Página de Capa */}
        <Page size="A4">
            <Image style={styles.capa} src="/storage/propostas/cliente/capa.jpg"/>
        </Page>
        <Page size="A4" style={styles.page}>
            <Image style={styles.cabecalho} src="/storage/propostas/cliente/cabecalho.jpg"/>
            <Image style={styles.rodape} src="/storage/propostas/cliente/rodape.jpg"/>
            <View style={styles.conteudo}>
                {/* Informações do Cliente */}
                <Text style={styles.sectionTitle}>INFORMAÇÕES DO CLIENTE</Text>
                <View style={styles.fieldGroup}>
                    {dados?.client_profile?.nome && <Text style={styles.field}><Text style={styles.label}>Nome:</Text> {dados?.client_profile?.nome}</Text>}
                    {dados?.client_profile?.nome_fantasia &&
                        <Text style={styles.field}><Text style={styles.label}>Nome Fantasia:</Text> {dados?.client_profile?.nome_fantasia}</Text>}
                    {dados?.client_profile?.razao_social &&
                        <Text style={styles.field}><Text style={styles.label}>Razão Social:</Text> {dados?.client_profile?.razao_social}</Text>}

                    <View style={styles.tableRow}>
                        {dados?.client_profile?.cnpj &&
                            <Text style={{
                                width: '100%',
                                paddingRight: 4,
                            }}>
                                <Text style={styles.field}><Text style={styles.label}>CNPJ:</Text> {dados?.client_profile?.cnpj}</Text>
                            </Text>
                        }
                        {dados?.client_profile?.cpf &&
                            <Text style={{
                                width: '100%',
                                paddingRight: 4,
                            }}>
                                <Text style={styles.field}><Text style={styles.label}>CPF:</Text> {dados?.client_profile?.cpf}</Text>
                            </Text>
                        }


                    </View>
                    <View style={styles.tableRow}>
                        {dados?.client_profile?.contacts?.celular &&
                            <Text style={{
                                width: '30%',
                                paddingRight: 4,
                            }}>
                                <Text style={styles.field}><Text style={styles.label}>Celular:</Text> {dados?.client_profile?.contacts?.celular}</Text>
                            </Text>
                        }

                        {dados?.client_profile?.contacts?.telefone &&
                            <Text style={{
                                width: '30%',
                                paddingRight: 4,
                            }}>
                                <Text style={styles.field}><Text style={styles.label}>Telefone:</Text> {dados?.client_profile?.contacts?.telefone}</Text>
                            </Text>
                        }

                        {dados?.client_profile?.contacts?.email &&
                            <Text style={{
                                width: '40%',
                                paddingRight: 4,
                            }}>
                                <Text style={styles.field}><Text style={styles.label}>E-mail:</Text> {dados?.client_profile?.contacts?.email}</Text>
                            </Text>
                        }
                    </View>
                    {dados?.proposal?.address?.full_address &&
                        <Text style={styles.field}><Text style={styles.label}>Endereço:</Text> {dados?.proposal?.address?.full_address}</Text>}
                </View>

                {/* Proposta */}
                <Text style={styles.sectionTitle}>PROPOSTA</Text>
                <View style={styles.fieldGroup}>
                    <Text style={styles.field}><Text style={styles.label}>Gasto Mensal:</Text> R$ {convertFloatToMoney(dados?.valor_medio)}</Text>
                    <Text style={styles.field}><Text style={styles.label}>Média de Consumo Mensal:</Text> {dados?.media_consumo} kWh/mês</Text>
                    <Text style={styles.field}><Text style={styles.label}>Prazo do Contrato:</Text> {dados?.prazo_locacao} meses</Text>
                </View>

                <View style={{marginBottom: 12, textAlign: 'center'}}>
                    <Text style={{fontWeight: 'bold', color: 'green', fontSize: 14, marginBottom: 4}}><Text>Taxa de Redução na Conta de
                        Energia:</Text> {dados?.discount_percent}%</Text>
                    {/*<Text style={{fontWeight: 'bold', color: 'green', fontSize: 12, marginBottom: 4}}><Text>Desconto Anual*/}
                    {/*    Estimado:</Text> {convertFloatToMoney(dados?.desconto_anual)}*</Text>*/}
                </View>

                {/* Tabela */}
                <Text style={styles.sectionTitle}>DESCONTOS ESTIMADOS</Text>
                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableColHeader}></Text>
                        <Text style={styles.tableColHeader}>Na Concessionária</Text>
                        <Text style={styles.tableColHeader}>No Consórcio</Text>
                        <Text style={styles.tableColHeader}>Desconto Total</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Mensal</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(dados?.valor_medio)}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(valorConsorcio(dados?.valor_medio))}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney((dados?.valor_medio) - (valorConsorcio(dados?.valor_medio)))}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Trimestral</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(dados?.valor_medio * 3)}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(valorConsorcio(dados?.valor_medio) * 3)}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney((dados?.valor_medio * 3) - (valorConsorcio(dados?.valor_medio) * 3))}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Semestral</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(dados?.valor_medio * 6)}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(valorConsorcio(dados?.valor_medio) * 6)}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney((dados?.valor_medio * 6) - (valorConsorcio(dados?.valor_medio) * 6))}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Anual</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(dados?.valor_medio * 12)}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney(valorConsorcio(dados?.valor_medio) * 12)}</Text>
                        <Text style={styles.tableCol}>{convertFloatToMoney((dados?.valor_medio * 12) - (valorConsorcio(dados?.valor_medio) * 12))}</Text>
                    </View>
                </View>

                <Text style={{marginTop: 20, fontSize: 14}}>Desconto Acumulado Durante o Contrato de {dados?.prazo_locacao} meses</Text>
                {imagemGrafico && <Image style={{width: '100%', height: 120, marginTop: 20,}} src={imagemGrafico}/>}

                <View style={{marginTop: 12}}>
                    <Text  style={{ fontSize: 8}}>
                        *Os valores apresentados neste documento têm caráter meramente ilustrativo e podem não refletir os valores reais obtidos.
                    </Text>
                </View>
            </View>
        </Page>

        <Page size="A4">
            <Image style={styles.capa} src="/storage/propostas/cliente/paginas/_3.jpg"/>
        </Page>
        <Page size="A4">
            <Image style={styles.capa} src="/storage/propostas/cliente/paginas/_4.jpg"/>
        </Page>
        <Page size="A4">
            <Image style={styles.capa} src="/storage/propostas/cliente/paginas/5.jpg"/>
        </Page>
    </Document>
};

// Estilos
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff'
    },
    capa: {
        width: '100%',
        height: '100%',
    },
    cabecalho: {
        width: '100%',
        position: 'absolute',
        top: 0,
    },
    rodape: {
        width: '100%',
        position: 'absolute',
        bottom: 0,
    },
    conteudo: {
        marginTop: 110,
        marginBottom: 80,
        paddingHorizontal: 40,
    },

    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        borderBottom: '1pt solid #000',
        paddingBottom: 4,
    },
    fieldGroup: {
        marginBottom: 12,
        fontSize: 12,
    },
    field: {
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
    },
    table: {
        marginTop: 10,
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        width: '25%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        backgroundColor: '#eee',
        padding: 4,
        fontWeight: 'bold',
        fontSize: 12,
    },
    tableCol: {
        width: '25%',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        borderRightWidth: 1,
        padding: 4,
        fontSize: 12,
    },
});

export default PropostaModelo;
