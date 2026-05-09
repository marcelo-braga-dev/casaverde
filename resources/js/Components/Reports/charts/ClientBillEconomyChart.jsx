import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Legend,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ReportEmptyChart from '../ReportEmptyChart';
import { formatMoney } from '../utils/chartFormatters';

export default function ClientBillEconomyChart({ data = [] }) {
    if (!data.length) {
        return <ReportEmptyChart />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

                <XAxis dataKey="label" axisLine={false} tickLine={false} />

                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatMoney(value)}
                    width={90}
                />

                <Tooltip formatter={(value) => formatMoney(value)} />
                <Legend />

                <Bar
                    dataKey="original_amount"
                    name="Fatura cheia / Concessionária"
                    fill="#111827"
                    radius={[10, 10, 0, 0]}
                />

                <Bar
                    dataKey="final_amount"
                    name="Valor a pagar Casa Verde"
                    fill="#2F7D18"
                    radius={[10, 10, 0, 0]}
                />

                <Line
                    type="monotone"
                    dataKey="net_savings"
                    name="Economia do cliente"
                    stroke="#D89614"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </ComposedChart>
        </ResponsiveContainer>
    );
}
