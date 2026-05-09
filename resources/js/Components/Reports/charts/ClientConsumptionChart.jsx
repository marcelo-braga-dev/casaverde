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
import { formatNumber } from '../utils/chartFormatters';

export default function ClientConsumptionChart({ data = [] }) {
    if (!data.length) {
        return <ReportEmptyChart />;
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 24, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="consumptionGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2F7D18" stopOpacity={0.34} />
                        <stop offset="95%" stopColor="#2F7D18" stopOpacity={0} />
                    </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />

                <XAxis dataKey="label" axisLine={false} tickLine={false} />

                <YAxis
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(value) => `${formatNumber(value)} kWh`}
                    width={90}
                />

                <Tooltip formatter={(value) => `${formatNumber(value)} kWh`} />

                <Area
                    type="monotone"
                    dataKey="consumo_kwh"
                    name="Consumo kWh"
                    stroke="#2F7D18"
                    strokeWidth={3}
                    fill="url(#consumptionGradient)"
                />
            </AreaChart>
        </ResponsiveContainer>
    );
}
