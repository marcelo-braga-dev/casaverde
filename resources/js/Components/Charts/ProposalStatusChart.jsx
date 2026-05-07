import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const defaultData = [
    { name: 'Emitidas', value: 42, color: '#0284C7' },
    { name: 'Aprovadas', value: 28, color: '#16A34A' },
    { name: 'Pendentes', value: 16, color: '#F59E0B' },
    { name: 'Rejeitadas', value: 6, color: '#DC2626' },
];

export default function ProposalStatusChart({ data = defaultData }) {
    return (
        <ResponsiveContainer width="100%" height={280}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={98}
                    paddingAngle={4}
                    dataKey="value"
                >
                    {data.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer>
    );
}
