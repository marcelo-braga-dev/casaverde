function convertFloatToMoney(valor) {
    if (valor) return valor.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });

    return 'R$ 0,00';
}

export default convertFloatToMoney
