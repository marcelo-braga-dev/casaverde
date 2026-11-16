import React from 'react';

const fmtMoney = (v, opts = {}) => v != null
    ? `R$ ${Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2, ...opts })}`
    : '—';

const fmtMoneyPrecise = v => fmtMoney(v, { maximumFractionDigits: 4 });

const fmtNumber = v => v != null ? Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : '—';

const fmtPercent = v => v != null ? `${Number(v).toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%` : '—';

const fmtDate = v => {
    if (!v) return '—';
    try {
        return String(v).substring(0, 10).split('-').reverse().join('/');
    } catch {
        return v;
    }
};

const DadosProposta = ({proposal, investmentSummary}) => {
    const producer = proposal?.producer_profile;
    const contacts = producer?.contacts;

    return (
        <>
            <div style={styles.container}>
                <div style={styles.overlayContainer}>
                    <div style={styles.overlayText}>
                        <div>
                            <div style={styles.sectionTitle}>INFORMAÇÕES DO INVESTIDOR</div>
                            {producer?.nome && <p style={styles.sectionText}><strong>Nome:</strong> {producer.nome}</p>}
                            {producer?.nome_fantasia && <p style={styles.sectionText}><strong>Nome Fantasia:</strong> {producer.nome_fantasia}</p>}
                            {producer?.razao_social && <p style={styles.sectionText}><strong>Razão Social:</strong> {producer.razao_social}</p>}
                            {producer?.cnpj && <p style={styles.sectionText}><strong>CNPJ:</strong> {producer.cnpj}</p>}
                            {producer?.cpf && <p style={styles.sectionText}><strong>CPF:</strong> {producer.cpf}</p>}
                            {contacts?.celular && <p style={styles.sectionText}><strong>Celular:</strong> {contacts.celular}</p>}
                            {contacts?.telefone && <p style={styles.sectionText}><strong>Telefone:</strong> {contacts.telefone}</p>}
                            {contacts?.email && <p style={styles.sectionText}><strong>E-mail:</strong> {contacts.email}</p>}
                            {proposal?.consultor?.name && <p style={styles.sectionText}><strong>Consultor responsável:</strong> {proposal.consultor.name}</p>}
                        </div>

                        <div>
                            <div style={styles.sectionTitle}>INFORMAÇÕES DA USINA SOLAR</div>
                            {proposal?.potencia_usina && <p style={styles.sectionText}><strong>Potência da Usina:</strong> {proposal.potencia_usina} kWp</p>}
                            {proposal?.media_geracao && <p style={styles.sectionText}><strong>Média de Geração:</strong> {proposal.media_geracao} kWh/mês</p>}
                            {proposal?.concessionaria?.nome && <p style={styles.sectionText}><strong>Concessionária:</strong> {proposal.concessionaria.nome}{proposal.concessionaria.estado ? ` (${proposal.concessionaria.estado})` : ''}</p>}
                            {investmentSummary?.consumer_discount_percent != null && <p style={styles.sectionText}><strong>Redução da Conta de Energia:</strong> {fmtPercent(investmentSummary.consumer_discount_percent)}</p>}
                            {proposal?.address?.full_address && <p style={styles.sectionText}><strong>Endereço da Usina:</strong> {proposal.address.full_address}</p>}
                        </div>

                        <div>
                            <div style={styles.sectionTitle}>PROPOSTA DE INVESTIMENTO</div>
                            {proposal?.proposal_code && <p style={styles.sectionText}><strong>Código da Proposta:</strong> {proposal.proposal_code}</p>}
                            {proposal?.valor_investimento && <p style={styles.sectionText}><strong>Valor do Investimento:</strong> {fmtMoney(proposal.valor_investimento)}</p>}
                            {proposal?.prazo_contrato && <p style={styles.sectionText}><strong>Prazo do Contrato:</strong> {proposal.prazo_contrato} meses</p>}
                            {proposal?.issued_at && <p style={styles.sectionText}><strong>Emitida em:</strong> {fmtDate(proposal.issued_at)}</p>}
                            {proposal?.valid_until && <p style={styles.sectionText}><strong>Válida até:</strong> {fmtDate(proposal.valid_until)}</p>}
                        </div>

                        <table style={styles.table}>
                            <tbody>
                            <tr>
                                <td style={styles.tableCellLabel}>Tarifa Consumidor Grupo B</td>
                                <td style={styles.tableCellValue}>{fmtMoneyPrecise(investmentSummary?.tarifa_grupo_b)} / kWh</td>
                            </tr>
                            <tr>
                                <td style={styles.tableCellLabel}>Redução de consumo para Consumidor</td>
                                <td style={styles.tableCellValue}>{fmtMoneyPrecise(investmentSummary?.consumer_discount_value)} / kWh ({fmtPercent(investmentSummary?.consumer_discount_percent)})</td>
                            </tr>
                            <tr>
                                <td style={styles.tableCellLabel}>Dedução operacionalização</td>
                                <td style={styles.tableCellValue}>{fmtMoneyPrecise(investmentSummary?.admin_fee_value_kwh)} / kWh ({fmtPercent(investmentSummary?.admin_fee_percent)})</td>
                            </tr>
                            <tr>
                                <td style={styles.tableCellLabel}>Valor pago ao Produtor por kWh</td>
                                <td style={styles.tableCellValue}>{fmtMoneyPrecise(investmentSummary?.valor_pago_produtor_kwh)} / kWh</td>
                            </tr>
                            <tr>
                                <td style={styles.tableCellLabel}>Produção Média Mensal de energia</td>
                                <td style={styles.tableCellValue}>{fmtNumber(proposal?.media_geracao)} kWh/mês</td>
                            </tr>
                            <tr>
                                <td style={styles.tableCellLabel}>Pagamento Mensal Previsto</td>
                                <td style={styles.tableCellValue}>{fmtMoney(investmentSummary?.pagamento_mensal_previsto)} /mês</td>
                            </tr>
                            </tbody>
                        </table>

                        <p style={styles.disclaimer}>
                            Os valores apresentados nesta proposta são uma simulação aproximada, baseada nas
                            informações e parâmetros disponíveis no momento da emissão. Eles não constituem garantia
                            de resultado e podem variar de acordo com a geração real de energia, tarifas vigentes,
                            condições contratuais e outros fatores. A Casa Verde não se responsabiliza caso os
                            valores efetivamente alcançados sejam diferentes dos valores simulados.
                        </p>

                    </div>
                </div>
            </div>
        </>
    );
};

const styles = {
    container: {
        width: '100%',
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
    },
    overlayContainer: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    overlayText: {
        position: 'absolute',
        left: '0',
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        color: '#000',
        padding: 40,
        display: 'flex',
        flexDirection: 'column',
    },
    section: {
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        marginTop: 30,
        borderBottom: '1px solid black'
    },
    table: {
        fontSize: '20px',
        fontWeight: 'bold',
        marginBottom: '10px',
        marginTop: 30,
        borderCollapse: 'collapse',
        width: '100%',
    },
    tableCellLabel: {
        padding: '4px 10px 4px 0',
        textAlign: 'left',
    },
    tableCellValue: {
        padding: '4px 0',
        textAlign: 'right',
    },
    sectionText: {
        fontSize: '18px',
        marginBottom: '0px',
    },
    disclaimer: {
        fontSize: '14px',
        fontStyle: 'italic',
        fontWeight: 'normal',
        color: '#555',
        marginTop: '15px',
        lineHeight: 1.4,
    },
};

export default DadosProposta;
