export const convertData = (value) => {
    return value ? new Date(value).toLocaleDateString('pt-BR') : null
}

// Para datas de calendário (vencimento, competência): o backend serializa como
// "2026-06-20T00:00:00Z" e new Date() converteria para o dia anterior no fuso de Brasília.
export const formatDateOnly = (value) => {
    if (!value) return null
    const [year, month, day] = String(value).slice(0, 10).split('-')
    return day && month && year ? `${day}/${month}/${year}` : String(value)
}
