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
import { formatMoney } from '../utils/chartFormatters';

export default function MoneyBarChart({
                                          data = [],
                                          dataKey = 'amount',
                                          labelKey = 'label',
                                          fill = '#2F7D18',
                                      }) {
    if (!data.length) {
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
                    tickFormatter={(value) => formatMoney(value)}
                    width={90}
                />
                <Tooltip formatter={(value) => formatMoney(value)} />
                <Bar dataKey={dataKey} fill={fill} radius={[10, 10, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
