<?php
// Gera a calculadora do curso. Uso: php83 gerar-calculadora.php <vendor/autoload.php> <saida.xlsx>
require $argv[1];

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Conditional;
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

$OUT = $argv[2];
$wb = new Spreadsheet();
$wb->getDefaultStyle()->getFont()->setName('Arial')->setSize(10);

const BRL = '"R$" #,##0.00;("R$" #,##0.00);"-"';
const BRL0 = '"R$" #,##0;("R$" #,##0);"-"';
const BRL4 = '"R$" #,##0.0000;("R$" #,##0.0000);"-"';
const KWH = '#,##0" kWh";(#,##0" kWh");"-"';
const NUM = '#,##0;(#,##0);"-"';
const PCT = '0.0%;(0.0%);"-"';
const PCT2 = '0.00%;(0.00%);"-"';

function newSheet(Spreadsheet $wb, string $title, string $heading, int $wa = 46, array $widths = [], bool $first = false)
{
    $ws = $first ? $wb->getActiveSheet() : $wb->createSheet();
    $ws->setTitle($title);
    $ws->setShowGridlines(false);
    $ws->setCellValue('A1', $heading);
    $ws->mergeCells('A1:H1');
    $ws->getStyle('A1')->getFont()->setBold(true)->setSize(14)->getColor()->setRGB('FFFFFF');
    $ws->getStyle('A1:H1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('1F4E3D');
    $ws->getRowDimension(1)->setRowHeight(26);
    $ws->getColumnDimension('A')->setWidth($wa);
    foreach ($widths as $c => $w) {
        $ws->getColumnDimension($c)->setWidth($w);
    }
    return $ws;
}

function section($ws, int $row, string $text, int $cols = 8)
{
    $ws->setCellValue("A{$row}", $text);
    $last = chr(64 + $cols);
    $ws->getStyle("A{$row}")->getFont()->setBold(true)->setSize(11)->getColor()->setRGB('1F4E3D');
    $ws->getStyle("A{$row}:{$last}{$row}")->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('E2EFDA');
}

function put($ws, string $ref, $value, ?string $fmt = null, string $kind = 'formula', ?string $comment = null)
{
    if ($value !== null) {
        $ws->setCellValue($ref, $value);
    }
    $style = $ws->getStyle($ref);
    $color = ['input' => '0000FF', 'formula' => '000000', 'link' => '008000', 'bold' => '000000'][$kind];
    $style->getFont()->getColor()->setRGB($color);
    if ($kind === 'bold') {
        $style->getFont()->setBold(true);
    }
    if ($kind === 'input') {
        $style->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setRGB('FFF2A8');
    }
    if ($fmt) {
        $style->getNumberFormat()->setFormatCode($fmt);
    }
    $style->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setRGB('BFBFBF');
    if ($comment) {
        $ws->getComment($ref)->getText()->createTextRun($comment);
    }
}

function label($ws, string $ref, string $text, bool $bold = false)
{
    $ws->setCellValue($ref, $text);
    $ws->getStyle($ref)->getFont()->setBold($bold);
    $ws->getStyle($ref)->getAlignment()->setWrapText(true)->setVertical('center');
}

function note($ws, string $ref, string $text)
{
    $ws->setCellValue($ref, $text);
    $ws->getStyle($ref)->getFont()->setItalic(true)->setSize(9)->getColor()->setRGB('666666');
}

function head($ws, int $row, array $cols)
{
    foreach ($cols as $c => $h) {
        $ws->setCellValue("{$c}{$row}", $h);
        $ws->getStyle("{$c}{$row}")->getFont()->setBold(true);
        $ws->getStyle("{$c}{$row}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN);
    }
}

function listValidation($ws, string $ref, string $list)
{
    $dv = $ws->getCell($ref)->getDataValidation();
    $dv->setType(DataValidation::TYPE_LIST)->setShowDropDown(true)->setShowErrorMessage(true)->setFormula1($list);
}

function textRule($ws, string $range, string $value, string $rgb, bool $fill = false, string $op = Conditional::OPERATOR_EQUAL)
{
    $c = new Conditional();
    $c->setConditionType(Conditional::CONDITION_CELLIS)->setOperatorType($op)->addCondition('"' . $value . '"');
    if ($fill) {
        $c->getStyle()->getFill()->setFillType(Fill::FILL_SOLID)->getEndColor()->setRGB($rgb);
    } else {
        $c->getStyle()->getFont()->setBold(true)->getColor()->setRGB($rgb);
    }
    $list = $ws->getStyle($range)->getConditionalStyles();
    $list[] = $c;
    $ws->getStyle($range)->setConditionalStyles($list);
}

// ---------------- Leia-me ----------------
$L = newSheet($wb, 'Leia-me', 'Calculadora do curso — Empresa de Assinatura de Energia Solar', 120, [], true);
$rows = [
    3 => ['Como usar', 'h'],
    4 => ['1. Comece pela aba "Premissas": tarifa da sua distribuidora, tributos, desconto, taxa de administração e usina.', ''],
    5 => ['2. As outras abas usam essas premissas. Edite só as células amarelas com texto azul.', ''],
    6 => ['3. Células em preto são fórmulas; em verde, valores trazidos de outra aba. Não sobrescreva.', ''],
    8 => ['Abas (e onde aparecem no curso)', 'h'],
    9 => ['Premissas — M2 a07 / M3 a06 · Valor do crédito — M1 a07, M2 a05 e a07 · Cota e economia — M2 a06, M5 a02', ''],
    10 => ['Unit economics — M3 a04 · Cenários Fio B — M3 a05 · Meu modelo — M3 a06 · Funil e metas — M5 a05', ''],
    11 => ['Plano de ocupação — M6 a05 e a06 · Painel de indicadores — M10 a01 e a05', ''],
    13 => ['Avisos importantes', 'h'],
    14 => ['• Os valores iniciais são os EXEMPLOS ILUSTRATIVOS do curso (tarifa R$ 0,80/kWh sem impostos, Fio B R$ 0,20). Troque pelos da sua distribuidora (tarifas homologadas no site da ANEEL).', ''],
    15 => ['• Fio B não compensado (GD II, Lei 14.300/2022): 2026: 60% · 2027: 75% · 2028: 90%. 2029 em diante é CENÁRIO: depende da valoração da ANEEL.', ''],
    16 => ['• A tributação sobre a energia compensada depende do estado (Convênio ICMS 16/2015) e da reforma tributária. Use a regra que o seu contador indicar (aba Premissas).', ''],
    17 => ['• Simplificações: sem iluminação pública, bandeiras e diferenças de ciclo de leitura; confira a economia real numa fatura.', ''],
    18 => ['• Material educacional: não é recomendação de investimento nem parecer jurídico ou tributário.', ''],
    20 => ['Legenda de cores', 'h'],
];
foreach ($rows as $r => [$t, $k]) {
    $L->setCellValue("A{$r}", $t);
    if ($k === 'h') {
        $L->getStyle("A{$r}")->getFont()->setBold(true)->setSize(11)->getColor()->setRGB('1F4E3D');
    }
}
put($L, 'A21', 'Entrada (editar)', null, 'input');
put($L, 'A22', 'Fórmula (não editar)');
put($L, 'A23', 'Valor trazido de outra aba', null, 'link');

// ---------------- Premissas ----------------
$P = newSheet($wb, 'Premissas', 'Premissas — edite aqui os números da sua distribuidora e do seu negócio', 64, ['B' => 18, 'C' => 70]);
section($P, 3, 'Tarifa sem impostos (R$/kWh) — subgrupo que você atende');
label($P, 'A4', 'TE — Tarifa de Energia'); put($P, 'B4', 0.35, BRL4, 'input', 'Exemplo do curso. Fonte real: tarifas homologadas da distribuidora (ANEEL).');
label($P, 'A5', 'TUSD — Tarifa de Uso do Sistema de Distribuição'); put($P, 'B5', 0.45, BRL4, 'input');
label($P, 'A6', 'Fio B (parcela da TUSD)'); put($P, 'B6', 0.20, BRL4, 'input', 'Exemplo do curso. Fonte real: detalhamento da TUSD da distribuidora.');
label($P, 'A7', 'Tarifa sem impostos (TE + TUSD)'); put($P, 'B7', '=B4+B5', BRL4);
section($P, 9, 'Tributos');
label($P, 'A10', 'ICMS'); put($P, 'B10', 0.18, PCT, 'input', 'Alíquota do seu estado. [CONFERIR com contador]');
label($P, 'A11', 'PIS + COFINS'); put($P, 'B11', 0.05, PCT, 'input', 'Varia mês a mês na fatura. Exemplo do curso.');
label($P, 'A12', 'Tarifa com impostos (cálculo "por dentro")'); put($P, 'B12', '=IFERROR(B7/(1-(B10+B11)),0)', BRL4);
label($P, 'A13', 'Tributos incidem sobre o valor do crédito compensado? (1 = sim, 0 = não)');
put($P, 'B13', 1, NUM, 'input', '1 reproduz os exemplos do curso. Use a regra do seu estado indicada pelo contador.');
label($P, 'A14', 'Alíquota "por dentro" aplicada ao crédito'); put($P, 'B14', '=(B10+B11)*B13', PCT);
section($P, 16, 'Transição do Fio B (GD II) — parcela NÃO compensada');
head($P, 17, ['A' => 'Ano', 'B' => '% do Fio B pago']);
foreach ([['2026', 0.60], ['2027', 0.75], ['2028', 0.90], ['2029 (cenário)', 1.00]] as $k => [$ano, $pct]) {
    $r = 18 + $k;
    label($P, "A{$r}", $ano);
    put($P, "B{$r}", $pct, PCT, 'input', $r < 21 ? 'Lei 14.300/2022.' : 'CENÁRIO: regra de 2029+ depende da valoração da ANEEL.');
}
note($P, 'C21', 'Cenário — ajuste para testar 2029 em diante.');
section($P, 23, 'Seu negócio');
label($P, 'A24', 'Desconto ao cliente (% do valor do crédito)'); put($P, 'B24', 0.20, PCT, 'input', 'Padrão do curso (Configurações Padrão → Taxa de desconto).');
label($P, 'A25', 'Taxa de administração da gestora (% do valor do crédito)'); put($P, 'B25', 0.15, PCT, 'input', 'Padrão do curso (Configurações Padrão → Taxa de administração).');
label($P, 'A26', 'Ano de referência para os cálculos (2026 a 2029)'); put($P, 'B26', 2026, '0', 'input');
section($P, 28, 'Usina de referência');
label($P, 'A29', 'Potência (kWp)'); put($P, 'B29', 500, NUM, 'input');
label($P, 'A30', 'Produtividade (kWh/kWp/mês)'); put($P, 'B30', 120, NUM, 'input', 'Brasil: ~100 a 140 conforme a região (Atlas Brasileiro de Energia Solar, INPE).');
label($P, 'A31', 'Geração média mensal (kWh)'); put($P, 'B31', '=B29*B30', KWH);
listValidation($P, 'B26', '"2026,2027,2028,2029"');
listValidation($P, 'B13', '"0,1"');

// ---------------- Valor do crédito ----------------
$V = newSheet($wb, 'Valor do crédito', 'Valor do crédito por ano (GD II) — quanto vale 1 kWh compensado', 34, ['B' => 16, 'C' => 18, 'D' => 18, 'E' => 18, 'F' => 16]);
section($V, 3, 'Tarifa');
label($V, 'A4', 'Tarifa sem impostos'); put($V, 'B4', '=Premissas!B7', BRL4, 'link');
label($V, 'A5', 'Tarifa com impostos'); put($V, 'B5', '=Premissas!B12', BRL4, 'link');
label($V, 'A6', 'Fio B (sem impostos)'); put($V, 'B6', '=Premissas!B6', BRL4, 'link');
section($V, 8, 'Valor do crédito ano a ano');
head($V, 9, ['A' => 'Ano', 'B' => '% Fio B pago', 'C' => 'Fio B pago', 'D' => 'Crédito s/ impostos', 'E' => 'Crédito c/ impostos', 'F' => 'Variação vs 2026']);
for ($k = 0; $k < 4; $k++) {
    $r = 10 + $k; $pr = 18 + $k;
    put($V, "A{$r}", "=Premissas!A{$pr}", null, 'link');
    put($V, "B{$r}", "=Premissas!B{$pr}", PCT, 'link');
    put($V, "C{$r}", "=B{$r}*\$B\$6", BRL4);
    put($V, "D{$r}", "=\$B\$4-C{$r}", BRL4);
    put($V, "E{$r}", "=IFERROR(D{$r}/(1-Premissas!\$B\$14),0)", BRL4);
    put($V, "F{$r}", "=IFERROR(D{$r}/\$D\$10-1,0)", PCT);
}
section($V, 15, 'No ano de referência (usado nas outras abas)');
label($V, 'A16', 'Ano de referência'); put($V, 'B16', '=Premissas!B26', '0', 'link');
label($V, 'A17', 'Linha do ano (1 = 2026 … 4 = 2029)'); put($V, 'B17', '=MAX(1,MIN(4,B16-2025))', '0');
label($V, 'A18', 'Crédito sem impostos (R$/kWh)'); put($V, 'B18', '=INDEX(D10:D13,B17)', BRL4);
label($V, 'A19', 'Crédito com impostos (R$/kWh)'); put($V, 'B19', '=INDEX(E10:E13,B17)', BRL4);
label($V, 'A20', 'Fio B pago com impostos (R$/kWh)'); put($V, 'B20', '=IFERROR(INDEX(C10:C13,B17)/(1-(Premissas!B10+Premissas!B11)),0)', BRL4);
note($V, 'A22', 'Na plataforma: Configurações → Concessionárias → "Tarifa GD2" = crédito sem impostos do ano corrente (M2 aula 7).');

// ---------------- Cota e economia ----------------
$C = newSheet($wb, 'Cota e economia', 'Cota ideal, % de rateio e economia real do cliente (conta total)', 56, ['B' => 18, 'C' => 4, 'D' => 18, 'E' => 18]);
section($C, 3, 'Cliente (exemplo do curso: Clínica, trifásica)', 2);
label($C, 'A4', 'Nome do cliente'); put($C, 'B4', 'Clínica (exemplo)', null, 'input');
label($C, 'A5', 'Tipo de ligação'); put($C, 'B5', 'Trifásica', null, 'input');
listValidation($C, 'B5', '"Monofásica,Bifásica,Trifásica"');
label($C, 'A6', 'Margem de segurança da cota'); put($C, 'B6', 0.95, PCT, 'input', 'Curso: 90% a 95% da cota calculada.');
head($C, 3, ['D' => 'Histórico', 'E' => 'Consumo (kWh)']);
for ($i = 0; $i < 12; $i++) {
    $r = 4 + $i;
    label($C, "D{$r}", 'Mês ' . ($i + 1));
    put($C, "E{$r}", 4000, NUM, 'input');
}
note($C, 'D16', 'Copie o histórico impresso na conta de luz.');
section($C, 18, 'Cota', 2);
head($C, 19, ['D' => 'Ligação', 'E' => 'Custo disp. (kWh)']);
foreach ([['Monofásica', 30], ['Bifásica', 50], ['Trifásica', 100]] as $k => [$lig, $kwh]) {
    label($C, 'D' . (20 + $k), $lig); put($C, 'E' . (20 + $k), $kwh, NUM, 'input');
}
label($C, 'A19', 'Consumo médio mensal (12 meses)'); put($C, 'B19', '=AVERAGE(E4:E15)', KWH);
label($C, 'A20', 'Custo de disponibilidade'); put($C, 'B20', '=IFERROR(INDEX(E20:E22,MATCH(B5,D20:D22,0)),0)', KWH);
label($C, 'A21', 'Cota ideal = (média − custo de disponibilidade) × margem'); put($C, 'B21', '=MAX(0,(B19-B20)*B6)', KWH);
label($C, 'A22', 'Geração média da usina'); put($C, 'B22', '=Premissas!B31', KWH, 'link');
label($C, 'A23', '% de rateio na usina'); put($C, 'B23', '=IFERROR(B21/B22,0)', PCT2);
section($C, 25, 'Economia na conta total (ano de referência)', 2);
label($C, 'A26', 'Conta hoje (média × tarifa com impostos)'); put($C, 'B26', '=B19*Premissas!B12', BRL);
label($C, 'A27', 'Distribuidora: consumo fora da cota (no mínimo, o custo de disponibilidade)'); put($C, 'B27', '=MAX(B19-B21,B20)*Premissas!B12', BRL);
label($C, 'A28', 'Distribuidora: Fio B não compensado sobre a cota'); put($C, 'B28', "=B21*'Valor do crédito'!B20", BRL);
label($C, 'A29', 'Sua cobrança: cota × crédito com impostos × (1 − desconto)'); put($C, 'B29', "=B21*'Valor do crédito'!B19*(1-Premissas!B24)", BRL);
label($C, 'A30', 'Total com assinatura', true); put($C, 'B30', '=B27+B28+B29', BRL, 'bold');
label($C, 'A31', 'Economia por mês', true); put($C, 'B31', '=B26-B30', BRL, 'bold');
label($C, 'A32', 'Economia por ano'); put($C, 'B32', '=B31*12', BRL);
label($C, 'A33', 'Economia em % da conta total'); put($C, 'B33', '=IFERROR(B31/B26,0)', PCT);
note($C, 'A35', 'O desconto é sobre a energia compensada — por isso a economia na conta total é menor que o desconto (M3 aula 4).');

// ---------------- Unit economics ----------------
$U = newSheet($wb, 'Unit economics', 'Unit economics — divisão do kWh e margem por usina', 56, ['B' => 18]);
section($U, 3, 'Divisão de 1 kWh compensado (sem impostos, ano de referência)', 2);
label($U, 'A4', 'Valor do crédito (R$/kWh)'); put($U, 'B4', "='Valor do crédito'!B18", BRL4, 'link');
label($U, 'A5', 'Desconto ao cliente'); put($U, 'B5', '=Premissas!B24', PCT, 'link');
label($U, 'A6', 'Taxa de administração'); put($U, 'B6', '=Premissas!B25', PCT, 'link');
label($U, 'A7', 'Cliente paga por kWh'); put($U, 'B7', '=B4*(1-B5)', BRL4);
label($U, 'A8', 'Economia do cliente por kWh'); put($U, 'B8', '=B4*B5', BRL4);
label($U, 'A9', 'Gestora (taxa) por kWh'); put($U, 'B9', '=B4*B6', BRL4);
label($U, 'A10', 'Repasse ao produtor por kWh'); put($U, 'B10', '=B4-B8-B9', BRL4);
section($U, 12, 'Por usina, por mês (100% alocada e paga)', 2);
label($U, 'A13', 'Energia alocada (kWh/mês)'); put($U, 'B13', '=Premissas!B31', KWH, 'link');
label($U, 'A14', 'Clientes pagam (R$/mês)'); put($U, 'B14', '=B13*B7', BRL);
label($U, 'A15', 'Economia dos clientes (R$/mês)'); put($U, 'B15', '=B13*B8', BRL);
label($U, 'A16', 'Taxa de administração da gestora (R$/mês)'); put($U, 'B16', '=B13*B9', BRL);
label($U, 'A17', 'Repasse ao produtor (R$/mês)'); put($U, 'B17', '=B13*B10', BRL);
section($U, 19, 'Custos variáveis da gestora', 2);
label($U, 'A20', 'Meio de pagamento (% do que os clientes pagam)'); put($U, 'B20', 0.015, PCT, 'input', 'Exemplo. [CONFERIR tarifas atuais do Mercado Pago]');
label($U, 'A21', 'Reserva de inadimplência (% do que os clientes pagam)'); put($U, 'B21', 0.03, PCT, 'input');
label($U, 'A22', 'Impostos da gestora (% da taxa)'); put($U, 'B22', 0.10, PCT, 'input', 'Exemplo. Use o percentual do seu regime (contador).');
label($U, 'A23', 'Meio de pagamento (R$/mês)'); put($U, 'B23', '=B14*B20', BRL);
label($U, 'A24', 'Inadimplência (R$/mês)'); put($U, 'B24', '=B14*B21', BRL);
label($U, 'A25', 'Impostos (R$/mês)'); put($U, 'B25', '=B16*B22', BRL);
label($U, 'A26', 'Margem de contribuição por usina (R$/mês)', true); put($U, 'B26', '=B16-B23-B24-B25', BRL, 'bold');
label($U, 'A27', 'Margem de contribuição por kWh', true); put($U, 'B27', '=IFERROR(B26/B13,0)', BRL4, 'bold');
section($U, 29, 'Visão do produtor (investimento na usina)', 2);
label($U, 'A30', 'Custo da usina (R$/Wp)'); put($U, 'B30', 3.5, BRL, 'input', 'Ordem de grandeza ilustrativa. [CONFERIR com orçamentos atuais]');
label($U, 'A31', 'Investimento (R$)'); put($U, 'B31', '=Premissas!B29*1000*B30', BRL0);
label($U, 'A32', 'O&M + seguro (R$/ano)'); put($U, 'B32', 25000, BRL0, 'input');
label($U, 'A33', 'Receita anual do produtor (R$)'); put($U, 'B33', '=B17*12', BRL0);
label($U, 'A34', 'Receita líquida anual (R$)'); put($U, 'B34', '=B33-B32', BRL0);
label($U, 'A35', 'Retorno simples (anos)'); put($U, 'B35', '=IFERROR(B31/B34,0)', '0.0" anos"');
label($U, 'A36', 'Rentabilidade anual (líquida ÷ investimento)'); put($U, 'B36', '=IFERROR(B34/B31,0)', PCT);

// ---------------- Cenários Fio B ----------------
$S = newSheet($wb, 'Cenários Fio B', 'Cenários Fio B — quem absorve a queda do crédito', 30, ['B' => 16, 'C' => 16, 'D' => 16, 'E' => 16]);
section($S, 3, 'Política A: desconto e taxa em % do crédito (todos dividem o impacto)', 5);
head($S, 4, ['A' => 'Ano', 'B' => 'Crédito', 'C' => 'Economia cliente', 'D' => 'Gestora', 'E' => 'Produtor']);
for ($k = 0; $k < 4; $k++) {
    $r = 5 + $k;
    put($S, "A{$r}", "='Valor do crédito'!A" . (10 + $k), null, 'link');
    put($S, "B{$r}", "='Valor do crédito'!D" . (10 + $k), BRL4, 'link');
    put($S, "C{$r}", "=B{$r}*Premissas!\$B\$24", BRL4);
    put($S, "D{$r}", "=B{$r}*Premissas!\$B\$25", BRL4);
    put($S, "E{$r}", "=B{$r}-C{$r}-D{$r}", BRL4);
}
section($S, 10, 'Política B: preço fixo por kWh ao cliente (cliente perde economia)', 5);
label($S, 'A11', 'Preço fixo cobrado (R$/kWh)'); put($S, 'B11', '=B5*(1-Premissas!B24)', BRL4);
note($S, 'C11', 'Igual ao que o cliente paga em 2026 na política A.');
head($S, 12, ['A' => 'Ano', 'B' => 'Crédito', 'C' => 'Economia cliente', 'D' => 'Gestora', 'E' => 'Produtor']);
for ($k = 0; $k < 4; $k++) {
    $r = 13 + $k;
    put($S, "A{$r}", '=A' . (5 + $k));
    put($S, "B{$r}", '=B' . (5 + $k), BRL4);
    put($S, "C{$r}", "=B{$r}-\$B\$11", BRL4);
    put($S, "D{$r}", "=B{$r}*Premissas!\$B\$25", BRL4);
    put($S, "E{$r}", "=\$B\$11-D{$r}", BRL4);
}
section($S, 18, 'Economia do cliente por kWh: comparação', 5);
head($S, 19, ['A' => 'Ano', 'B' => 'Política A', 'C' => 'Var. A', 'D' => 'Política B', 'E' => 'Var. B']);
for ($k = 0; $k < 4; $k++) {
    $r = 20 + $k;
    put($S, "A{$r}", '=A' . (5 + $k));
    put($S, "B{$r}", '=C' . (5 + $k), BRL4);
    put($S, "C{$r}", "=IFERROR(B{$r}/\$B\$20-1,0)", PCT);
    put($S, "D{$r}", '=C' . (13 + $k), BRL4);
    put($S, "E{$r}", "=IFERROR(D{$r}/\$D\$20-1,0)", PCT);
}
note($S, 'A25', 'Tarifa constante (cenário de estresse); reajustes costumam compensar parte da queda. Recomendação do curso: política A + cláusula de reequilíbrio.');

// ---------------- Meu modelo ----------------
$M = newSheet($wb, 'Meu modelo', 'Meu modelo — ponto de equilíbrio, capital de giro e projeção de 36 meses', 50,
    ['B' => 16, 'C' => 3, 'D' => 7, 'E' => 8, 'F' => 11, 'G' => 13, 'H' => 13, 'I' => 15, 'J' => 13, 'K' => 15, 'L' => 8]);
section($M, 3, 'Custos fixos mensais (exemplo do curso: R$ 18.000)', 2);
$fixos = [['Operador (com encargos)', 7000], ['Vendedor — parte fixa (com encargos)', 5000], ['Plataforma', 1500],
    ['Contador', 1500], ['Jurídico', 1000], ['Escritório, marketing e outros', 2000]];
foreach ($fixos as $k => [$n, $v]) {
    label($M, 'A' . (4 + $k), $n); put($M, 'B' . (4 + $k), $v, BRL0, 'input');
}
label($M, 'A10', 'Total de custos fixos', true); put($M, 'B10', '=SUM(B4:B9)', BRL0, 'bold');
section($M, 12, 'Premissas comerciais', 2);
label($M, 'A13', 'Cota média por cliente (kWh/mês)'); put($M, 'B13', 500, NUM, 'input', 'Média da sua carteira (empresas puxam para cima).');
label($M, 'A14', 'Novos clientes por mês'); put($M, 'B14', 30, NUM, 'input');
label($M, 'A15', 'Churn mensal'); put($M, 'B15', 0.01, PCT, 'input');
label($M, 'A16', 'Comissão por cliente novo (R$)'); put($M, 'B16', 250, BRL0, 'input', 'Ex.: 1 mensalidade, paga após a 1ª cobrança paga.');
label($M, 'A17', 'Ano do mês 1 da operação'); put($M, 'B17', 2026, '0', 'input');
section($M, 19, 'Margem e ponto de equilíbrio', 2);
label($M, 'A20', 'Custo variável sobre o que o cliente paga'); put($M, 'B20', "='Unit economics'!B20+'Unit economics'!B21", PCT, 'link');
label($M, 'A21', 'Impostos sobre a taxa'); put($M, 'B21', "='Unit economics'!B22", PCT, 'link');
label($M, 'A22', 'Margem de contribuição por kWh (ano de referência)'); put($M, 'B22', "='Unit economics'!B27", BRL4, 'link');
label($M, 'A23', 'Ponto de equilíbrio (kWh/mês)', true); put($M, 'B23', '=IFERROR(B10/B22,0)', KWH, 'bold');
label($M, 'A24', 'Ponto de equilíbrio (clientes)'); put($M, 'B24', '=IFERROR(B23/B13,0)', NUM);
label($M, 'A25', 'Ponto de equilíbrio (usinas de referência)'); put($M, 'B25', '=IFERROR(B23/Premissas!B31,0)', '0.0');
label($M, 'A26', 'Primeiro mês com resultado positivo'); put($M, 'B26', '=IFERROR(MATCH(1,L32:L67,0),"após 36 meses")', '0');
label($M, 'A27', 'Capital de giro necessário (pior saldo acumulado)', true); put($M, 'B27', '=MAX(0,-MIN(K32:K67))', BRL0, 'bold');
note($M, 'A29', 'A margem por kWh muda com o ano (transição do Fio B). Simplificação: clientes entram já pagando no mês.');
head($M, 31, ['D' => 'Mês', 'E' => 'Ano', 'F' => 'Clientes', 'G' => 'kWh alocados', 'H' => 'Margem/kWh', 'I' => 'Margem − fixos', 'J' => 'Comissões', 'K' => 'Acumulado', 'L' => '≥ 0?']);
for ($m = 1; $m <= 36; $m++) {
    $r = 31 + $m;
    put($M, "D{$r}", $m, '0');
    put($M, "E{$r}", "=\$B\$17+INT((D{$r}-1)/12)", '0');
    put($M, "F{$r}", $m === 1 ? '=$B$14' : '=F' . ($r - 1) . '*(1-$B$15)+$B$14', NUM);
    put($M, "G{$r}", "=F{$r}*\$B\$13", NUM);
    put($M, "H{$r}", "=INDEX('Valor do crédito'!\$D\$10:\$D\$13,MAX(1,MIN(4,E{$r}-2025)))*(Premissas!\$B\$25-(1-Premissas!\$B\$24)*\$B\$20-Premissas!\$B\$25*\$B\$21)", BRL4);
    put($M, "I{$r}", "=G{$r}*H{$r}-\$B\$10", BRL0);
    put($M, "J{$r}", "=\$B\$14*\$B\$16", BRL0);
    put($M, "K{$r}", $m === 1 ? "=I{$r}-J{$r}" : '=K' . ($r - 1) . "+I{$r}-J{$r}", BRL0);
    put($M, "L{$r}", "=IF(I{$r}-J{$r}>=0,1,0)", '0');
}

// ---------------- Funil e metas ----------------
$FU = newSheet($wb, 'Funil e metas', 'Funil e metas comerciais', 52, ['B' => 16]);
section($FU, 3, 'Conversões (exemplos ilustrativos — meça as suas)', 2);
$et = [['Lead → conta de luz recebida', 0.50], ['Conta → proposta apresentada', 0.80], ['Proposta → aceite', 0.40],
    ['Aceite → contrato e documentos', 0.90], ['Contrato → 1ª cobrança paga', 0.95]];
foreach ($et as $k => [$n, $v]) {
    label($FU, 'A' . (4 + $k), $n); put($FU, 'B' . (4 + $k), $v, PCT, 'input');
}
label($FU, 'A9', 'Conversão total lead → cliente pagante', true); put($FU, 'B9', '=PRODUCT(B4:B8)', PCT, 'bold');
section($FU, 11, 'Meta', 2);
label($FU, 'A12', 'Novos clientes pagantes por mês'); put($FU, 'B12', "='Meu modelo'!B14", NUM, 'link');
label($FU, 'A13', 'Leads necessários por mês'); put($FU, 'B13', '=IFERROR(ROUNDUP(B12/B9,0),0)', NUM);
label($FU, 'A14', 'Propostas a apresentar por mês'); put($FU, 'B14', '=IFERROR(ROUNDUP(B12/(B6*B7*B8),0),0)', NUM);
label($FU, 'A15', 'Clientes que um consultor fecha por mês'); put($FU, 'B15', 6, NUM, 'input');
label($FU, 'A16', 'Consultores necessários'); put($FU, 'B16', '=IFERROR(ROUNDUP(B12/B15,0),0)', NUM);
label($FU, 'A17', 'Meses até o ponto de equilíbrio em clientes (sem churn)'); put($FU, 'B17', "=IFERROR('Meu modelo'!B24/B12,0)", '0.0');

// ---------------- Plano de ocupação ----------------
$O = newSheet($wb, 'Plano de ocupação', 'Plano de ocupação da usina e planilha de rateio', 40, ['B' => 16, 'C' => 14, 'D' => 15, 'E' => 15, 'F' => 13]);
label($O, 'A3', 'Energia disponível da usina (kWh/mês)'); put($O, 'B3', '=Premissas!B31', KWH, 'link');
label($O, 'A4', 'Margem de segurança da cota'); put($O, 'B4', 0.95, PCT, 'input');
head($O, 6, ['A' => 'Cliente', 'B' => 'UC', 'C' => 'Ligação', 'D' => 'Consumo médio', 'E' => 'Cota (kWh)', 'F' => '% rateio']);
$ex = [['Padaria', 'Trifásica', 2500], ['Clínica', 'Trifásica', 4000], ['Academia', 'Trifásica', 6200],
    ['Restaurante', 'Trifásica', 3800], ['Farmácia', 'Trifásica', 2200], ['Escola', 'Trifásica', 5200],
    ['Mercado', 'Trifásica', 9000], ['Pousada', 'Trifásica', 3200], ['Escritório', 'Bifásica', 1400],
    ['Residência 1', 'Bifásica', 450], ['Residência 2', 'Bifásica', 600], ['Residência 3', 'Bifásica', 520],
    ['Residência 4', 'Monofásica', 320], ['Residência 5', 'Bifásica', 780], ['Residência 6', 'Bifásica', 900]];
for ($i = 0; $i < 30; $i++) {
    $r = 7 + $i;
    [$n, $lig, $kwh] = $ex[$i] ?? [null, null, null];
    put($O, "A{$r}", $n, null, 'input');
    put($O, "B{$r}", null, null, 'input');
    put($O, "C{$r}", $lig, null, 'input');
    listValidation($O, "C{$r}", '"Monofásica,Bifásica,Trifásica"');
    put($O, "D{$r}", $kwh, NUM, 'input');
    put($O, "E{$r}", "=IF(D{$r}=\"\",\"\",MAX(0,(D{$r}-IF(C{$r}=\"Trifásica\",100,IF(C{$r}=\"Bifásica\",50,30)))*\$B\$4))", NUM);
    put($O, "F{$r}", "=IF(E{$r}=\"\",\"\",IFERROR(E{$r}/\$B\$3,0))", PCT2);
}
label($O, 'A38', 'Total alocado (kWh)', true); put($O, 'E38', '=SUM(E7:E36)', NUM, 'bold');
label($O, 'A39', 'Ocupação da usina', true); put($O, 'E39', '=IFERROR(E38/B3,0)', PCT, 'bold');
label($O, 'A40', 'Maior participação de um cliente'); put($O, 'E40', '=IFERROR(MAX(F7:F36),0)', PCT2);
label($O, 'A41', 'Saldo para vender (kWh)'); put($O, 'E41', '=B3-E38', NUM);
label($O, 'A42', 'Ocupação entre 90% e 98%?'); put($O, 'E42', '=IF(AND(E39>=0.9,E39<=0.98),"OK","AJUSTAR")');
label($O, 'A43', 'Nenhum cliente com 25% ou mais?'); put($O, 'E43', '=IF(E40<0.25,"OK","RISCO GD III")');
textRule($O, 'E42:E43', 'OK', '008000');
textRule($O, 'E42:E43', 'OK', 'C00000', false, Conditional::OPERATOR_NOTEQUAL);
note($O, 'A45', 'Com a lista de exemplo a usina fica em ~63%: acrescente clientes até chegar a 90–98% (exercício do M6 aula 6). Na plataforma, vínculo acima do saldo é recusado.');

// ---------------- Painel de indicadores ----------------
$I = newSheet($wb, 'Painel de indicadores', 'Painel de indicadores — 12 indicadores, meta e semáforo (M10)', 50,
    ['B' => 13, 'C' => 9, 'D' => 14, 'E' => 14, 'F' => 14, 'G' => 12]);
head($I, 3, ['A' => 'Indicador', 'B' => 'Meta', 'C' => 'Sentido', 'D' => 'Mês 1', 'E' => 'Mês 2', 'F' => 'Mês 3', 'G' => 'Mês 3']);
$inds = [
    ['1. Taxa de ocupação (alocada ÷ disponível)', 0.90, '>=', PCT, [0.91, 0.94, 0.95]],
    ['2. Desempenho de geração (gerada ÷ esperada)', 0.95, '>=', PCT, [0.97, 0.92, 0.99]],
    ['3. Energia compensada ÷ alocada', 0.95, '>=', PCT, [0.90, 0.96, 0.97]],
    ['4. Novos clientes no mês', 30, '>=', NUM, [18, 26, 31]],
    ['5. Conversão proposta → cliente pagante', 0.25, '>=', PCT, [0.22, 0.27, 0.30]],
    ['6. CAC (R$ por cliente)', 400, '<=', BRL0, [520, 450, 390]],
    ['7. Receita da gestora (R$/mês)', 6000, '>=', BRL0, [3100, 4800, 6200]],
    ['8. Taxa de recebimento (recebido ÷ faturado)', 0.95, '>=', PCT, [0.89, 0.93, 0.96]],
    ['9. Inadimplência > 30 dias (% do faturado)', 0.03, '<=', PCT, [0, 0.025, 0.031]],
    ['10. Resultado do mês (R$)', 0, '>=', BRL0, [-14000, -9000, -2500]],
    ['11. Churn mensal', 0.01, '<=', PCT, [0, 0.007, 0.012]],
    ['12. Economia média por cliente (R$/mês)', 150, '>=', BRL0, [165, 160, 158]],
];
foreach ($inds as $k => [$n, $meta, $sent, $fmt, $vals]) {
    $r = 4 + $k;
    label($I, "A{$r}", $n);
    put($I, "B{$r}", $meta, $fmt, 'input');
    put($I, "C{$r}", $sent, '@', 'input');
    foreach (['D', 'E', 'F'] as $j => $col) {
        put($I, "{$col}{$r}", $vals[$j], $fmt, 'input');
    }
    put($I, "G{$r}", "=IF(F{$r}=\"\",\"\",IF(IF(C{$r}=\">=\",F{$r}>=B{$r},F{$r}<=B{$r}),\"verde\",\"vermelho\"))");
}
textRule($I, 'G4:G15', 'verde', 'C6EFCE', true);
textRule($I, 'G4:G15', 'vermelho', 'FFC7CE', true);
note($I, 'A17', 'Valores de exemplo — substitua pelos do seu laboratório ou da sua empresa. Metas são referências de gestão do curso.');
label($I, 'A19', 'Comentário do mês (o que foi bem, o que foi mal, o que fazer):', true);
put($I, 'A20', 'Escreva aqui…', null, 'input');
$I->mergeCells('A20:G24');
$I->getStyle('A20')->getAlignment()->setWrapText(true)->setVertical('top');

foreach ($wb->getWorksheetIterator() as $w) {
    $w->getTabColor()->setRGB(in_array($w->getTitle(), ['Leia-me', 'Premissas']) ? '1F4E3D' : '70AD47');
    $w->setSelectedCell('A1');
}
$wb->setActiveSheetIndex(0);

// Verificação: calcula todas as fórmulas e procura erros.
$errors = [];
foreach ($wb->getWorksheetIterator() as $w) {
    foreach ($w->getCellCollection()->getCoordinates() as $coord) {
        $cell = $w->getCell($coord);
        if ($cell->isFormula()) {
            try {
                $v = $cell->getCalculatedValue();
                if (is_string($v) && str_starts_with($v, '#')) {
                    $errors[] = $w->getTitle() . "!{$coord} = {$v}";
                }
            } catch (\Throwable $e) {
                $errors[] = $w->getTitle() . "!{$coord}: " . $e->getMessage();
            }
        }
    }
}
(new Xlsx($wb))->setPreCalculateFormulas(true)->save($OUT);
echo 'erros: ' . count($errors) . PHP_EOL . implode(PHP_EOL, array_slice($errors, 0, 30)) . PHP_EOL;

$g = fn ($s, $c) => $wb->getSheetByName($s)->getCell($c)->getCalculatedValue();
$checks = [
    ['Tarifa com impostos', $g('Premissas', 'B12')],
    ['Crédito 2026/2027/2028', [$g('Valor do crédito', 'D10'), $g('Valor do crédito', 'D11'), $g('Valor do crédito', 'D12')]],
    ['Clínica: cota / % / hoje / total / economia', [$g('Cota e economia', 'B21'), $g('Cota e economia', 'B23'), $g('Cota e economia', 'B26'), $g('Cota e economia', 'B30'), $g('Cota e economia', 'B31')]],
    ['UE: cliente/econ/gestora/produtor', [$g('Unit economics', 'B7'), $g('Unit economics', 'B8'), $g('Unit economics', 'B9'), $g('Unit economics', 'B10')]],
    ['UE: clientes pagam / gestora / produtor / margem / margem kWh', [$g('Unit economics', 'B14'), $g('Unit economics', 'B16'), $g('Unit economics', 'B17'), $g('Unit economics', 'B26'), $g('Unit economics', 'B27')]],
    ['Produtor: investimento / payback', [$g('Unit economics', 'B31'), $g('Unit economics', 'B35')]],
    ['Modelo: PE kWh / clientes / mês positivo / capital', [$g('Meu modelo', 'B23'), $g('Meu modelo', 'B24'), $g('Meu modelo', 'B26'), $g('Meu modelo', 'B27')]],
    ['Funil: total / leads / consultores', [$g('Funil e metas', 'B9'), $g('Funil e metas', 'B13'), $g('Funil e metas', 'B16')]],
    ['Ocupação: total / % / maior / status', [$g('Plano de ocupação', 'E38'), $g('Plano de ocupação', 'E39'), $g('Plano de ocupação', 'E40'), $g('Plano de ocupação', 'E42')]],
];
foreach ($checks as [$n, $v]) {
    echo $n . ': ' . json_encode($v) . PHP_EOL;
}
