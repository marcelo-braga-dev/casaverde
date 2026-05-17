import React from 'react';

const DadosProposta = ({proposal}) => {console.log(proposal)
    return (
        <>
            <div style={styles.container}>
                <div style={styles.overlayContainer}>
                    <div style={styles.overlayText}>
                        <div>
                            <div style={styles.sectionTitle}>INFORMAÇÕES DO INVESTIDOR</div>
                            {proposal?.producer_profile?.nome && <p style={styles.sectionText}><strong>Nome:</strong> {proposal?.producer_profile?.nome}</p>}
                            {proposal?.producer_profile?.nome_fantasia &&
                                <p style={styles.sectionText}><strong>Nome Fantasia:</strong> {proposal?.producer_profile?.nome_fantasia}</p>}
                            {proposal?.producer_profile?.razao_social &&
                                <p style={styles.sectionText}><strong>Razão Social:</strong> {proposal?.producer_profile?.razao_social}</p>}
                            {proposal?.producer_profile?.cnpj && <p style={styles.sectionText}><strong>CNPJ:</strong> {proposal?.producer_profile?.cnpj}</p>}
                            {proposal?.producer_profile?.cpf && <p style={styles.sectionText}><strong>CPF:</strong> {proposal?.producer_profile?.cpf}</p>}
                            {proposal?.produtor?.contatos?.celular && <p style={styles.sectionText}><strong>Celular:</strong> {proposal?.produtor?.contatos?.celular}</p>}
                            {proposal?.produtor?.contatos?.email && <p style={styles.sectionText}><strong>E-mail:</strong> {proposal?.produtor?.contatos?.email}</p>}
                        </div>

                        <div>
                            <div style={styles.sectionTitle}>INFORMAÇÕES DA USINA SOLAR</div>
                            {proposal?.media_geracao && <p style={styles.sectionText}><strong>Média Geração:</strong> {proposal?.media_geracao} kWh/mês</p>}
                            {proposal?.potencia_usina && <p style={styles.sectionText}><strong>Potência da Usina:</strong> {proposal?.potencia_usina} kWp</p>}
                            {proposal?.concessionaria?.nome && <p style={styles.sectionText}><strong>Concessionária:</strong> {proposal?.concessionaria?.nome} kWp</p>}
                            {proposal?.taxa_reducao && <p style={styles.sectionText}><strong>Redução da Conta de Energia:</strong> {proposal?.taxa_reducao}%</p>}
                            {proposal?.endereco?.endereco_completo && <p style={styles.sectionText}><strong>Endereço da Usina:</strong> {proposal?.endereco?.endereco_completo}</p>}
                        </div>
                        <div>
                            <div style={styles.sectionTitle}>PROPOSTA DE INVESTIMENTO</div>
                            {proposal?.valor_investimento && <p style={styles.sectionText}><strong>Valor do Investimento:</strong> R$ {proposal?.valor_investimento}</p>}
                            {proposal?.prazo_contrato && <p style={styles.sectionText}><strong>Prazo do Contrato:</strong> {proposal?.prazo_contrato} meses</p>}
                        </div>
                        <table style={styles.table}>
                            <tbody>
                            <tr>
                                <td>Tarifa Consumidor Grupo B</td>
                                <td>R$ 0,81</td>
                            </tr>
                            <tr>
                                <td>Redução de consumo para Consumidor</td>
                                <td>R$ 0,20 (25%)</td>
                            </tr>
                            <tr>
                                <td>Dedução operacionalização</td>
                                <td>R$ {proposal?.fill_percent}</td>
                            </tr>
                            <tr>
                                <td>Produção Média Anual de energia</td>
                                <td>{proposal?.geracao_anual} kWh/ano</td>
                            </tr>
                            <tr>
                                <td>Pagamento anual Bruto</td>
                                <td>R$ {proposal?.retorno_anual_bruto} ano (Produção Anual * 0.41)</td>
                            </tr>
                            </tbody>
                        </table>

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
        color: '#000',
        padding: 100,
        paddingBlockStart: 300,
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
    },
    sectionText: {
        fontSize: '18px',
        marginBottom: '5px',
    },
};

export default DadosProposta;
