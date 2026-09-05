"use client";
import { getPriceHistory } from "@/app/actions";
import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-background border border-border rounded-lg px-3 py-2 shadow-lg text-sm">
                <p className="text-muted-foreground mb-1">{label}</p>
                <p className="font-semibold text-foreground">
                    ₹{payload[0].value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
            </div>
        );
    }
    return null;
};

const PriceChart = ({ productId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            const history = await getPriceHistory(productId);
            const chartData = Array.isArray(history) ? history.map((item) => ({
                date: new Date(item.created_at || item.checked_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                }),
                price: parseFloat(item.price),
            })) : [];
            setData(chartData);
            setLoading(false);
        }
        loadData();
    }, [productId]);

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-muted-foreground text-sm">
                Loading price history…
            </div>
        );
    }

    if (!data.length) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-muted-foreground text-sm">
                No price history available.
            </div>
        );
    }

    return (
        <div className="w-full">
            <p className="text-sm font-semibold text-foreground mb-4">Price History</p>
            <ResponsiveContainer width="100%" height={260}>
                <LineChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                    />
                    <YAxis
                        tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v) => `₹${v.toLocaleString("en-IN")}`}
                        width={72}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                        type="monotone"
                        dataKey="price"
                        stroke="#6366f1"
                        strokeWidth={2}
                        dot={{ r: 4, fill: "#6366f1", strokeWidth: 0 }}
                        activeDot={{ r: 6, fill: "#6366f1" }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PriceChart;