import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ReportEmptyChart from '../ReportEmptyChart';
import { formatMoney, formatNumber } from '../utils/chartFormatters';
import { chartColors } from '../utils/chartColors';

export default function StackedBarChart({
                                            data = [],
                                            bars = [],
                                            labelKey = 'label',
                                            money = false,
                                        }) {
    if (!data.length || !bars.length) {
        return <ReportEmptyChart />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
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

                {bars.map((bar, index) => (
                    <Bar
                        key={bar.dataKey}
                        dataKey={bar.dataKey}
                        name={bar.name}
                        stackId="stack"
                        fill={bar.color || chartColors.palette[index]}
                        radius={index === bars.length - 1 ? [10, 10, 0, 0] : [0, 0, 0, 0]}
                    />
                ))}
            </BarChart>
        </ResponsiveContainer>
    );
}
