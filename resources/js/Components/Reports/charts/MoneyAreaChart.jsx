import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import ReportEmptyChart from '../ReportEmptyChart';
import { formatMoney } from '../utils/chartFormatters';

export default function MoneyAreaChart({
                                           data = [],
                                           dataKey = 'amount',
                                           labelKey = 'label',
                                           stroke = '#2F7D18',
                                       }) {
    if (!data.length) {
        return <ReportEmptyChart />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="moneyAreaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={stroke} stopOpacity={0.34} />
                        <stop offset="95%" stopColor={stroke} stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey={labelKey} axisLine={false} tickLine={false} />
                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => formatMoney(value)}
                    width={90}
                />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Area
                    type="monotone"
                    dataKey={dataKey}
                    stroke={stroke}
                    strokeWidth={3}
                    fill="url(#moneyAreaGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
