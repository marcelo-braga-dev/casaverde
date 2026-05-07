import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ReportEmptyChart from '../ReportEmptyChart';
import { formatMoney, formatNumber } from '../utils/chartFormatters';

export default function HorizontalRankingChart({
                                                   data = [],
                                                   labelKey = 'label',
                                                   valueKey = 'value',
                                                   money = false,
                                                   fill = '#2F7D18',
                                               }) {
    if (!data.length) {
        return <ReportEmptyChart />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart
                layout="vertical"
                data={data}
                margin={{ top: 8, right: 24, left: 24, bottom: 8 }}
            >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => money ? formatMoney(value) : formatNumber(value)}
                />
                <YAxis
                    type="category"
                    dataKey={labelKey}
                    width={150}
                    axisLine={false}
                    tickLine={false}
                />
                <Tooltip
                    formatter={(value) => money ? formatMoney(value) : formatNumber(value)}
                />
                <Bar dataKey={valueKey} fill={fill} radius={[0, 10, 10, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
