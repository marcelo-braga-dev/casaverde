const formatarMoneyReal = (valor) => {

    const valorNumerico = String(valor ?? "").replace(/\D/g, "");

    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(Number(valorNumerico) / 100);
};

export const formatarMoneyInicial = (valor) => {
    return Number(valor || 0).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};

export default formatarMoneyReal
