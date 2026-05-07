import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';
import ReportEmptyChart from '../ReportEmptyChart';
import {
    formatMoney,
    formatNumber,
    normalizeStatusLabel,
} from '../utils/chartFormatters';
import { statusColor } from '../utils/chartColors';

export default function StatusDonutChart({
                                             data = [],
                                             valueKey = 'total',
                                             statusKey = 'status',
                                             showMoney = false,
                                         }) {
    if (!data.length) {
        return <ReportEmptyChart />;
    }

    const chartData = data.map((item) => ({
        ...item,
        name: normalizeStatusLabel(item[statusKey]),
        value: Number(item[valueKey] || 0),
        color: statusColor(item[statusKey]),
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={68}
                    outerRadius={104}
                    paddingAngle={4}
                >
                    {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                    ))}
                </Pie>

                <Tooltip
                    formatter={(value) =>
                        showMoney ? formatMoney(value) : formatNumber(value)
                    }
                />
            </PieChart>
        </ResponsiveContainer>
    );
}
