import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ReportEmptyChart from '../ReportEmptyChart';
import { formatMoney, formatNumber } from '../utils/chartFormatters';
import { chartColors } from '../utils/chartColors';

export default function MultiLineChart({
                                           data = [],
                                           lines = [],
                                           labelKey = 'label',
                                           money = false,
                                       }) {
    if (!data.length || !lines.length) {
        return <ReportEmptyChart />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey={labelKey} axisLine={false} tickLine={false} />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => money ? formatMoney(value) : formatNumber(value)}
                    width={90}
                />
                <Tooltip
                    formatter={(value) => money ? formatMoney(value) : formatNumber(value)}
                />
                <Legend />

                {lines.map((line, index) => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color || chartColors.palette[index]}
                        strokeWidth={3}
                        dot={{ r: 3 }}
                        activeDot={{ r: 6 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
