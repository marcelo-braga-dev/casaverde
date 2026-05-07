import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const defaultData = [
    { name: 'Jan', value: 12000 },
    { name: 'Fev', value: 18500 },
    { name: 'Mar', value: 16200 },
    { name: 'Abr', value: 24000 },
    { name: 'Mai', value: 31500 },
    { name: 'Jun', value: 36800 },
];

export default function RevenueAreaChart({ data = defaultData }) {
    return (
        <ResponsiveContainer width="100%" height={310}>
            <AreaChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0B7A53" stopOpacity={0.32} />
                        <stop offset="95%" stopColor="#0B7A53" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip
                    formatter={(value) =>
                        new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                        }).format(value)
                    }
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#0B7A53"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
