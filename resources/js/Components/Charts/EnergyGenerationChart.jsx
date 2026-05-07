import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const defaultData = [
    { name: 'Jan', kwh: 3200 },
    { name: 'Fev', kwh: 4100 },
    { name: 'Mar', kwh: 3900 },
    { name: 'Abr', kwh: 4700 },
    { name: 'Mai', kwh: 5200 },
    { name: 'Jun', kwh: 6100 },
];

export default function EnergyGenerationChart({ data = defaultData }) {
    return (
        <ResponsiveContainer width="100%" height={310}>
            <BarChart data={data} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(value) => `${value} kWh`} />
                <Bar dataKey="kwh" fill="#0284C7" radius={[10, 10, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
