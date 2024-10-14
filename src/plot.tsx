import React, { useState, useEffect } from "react";
import {
	CartesianGrid,
	ComposedChart,
	Legend,
	Line,
	ResponsiveContainer,
	Scatter,
	Tooltip,
	XAxis,
	YAxis,
	ZAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Slider } from "./components/ui/slider";

type DataPoint = {
	x: number;
	y: number;
	powY: number;
};

const generateData = (
	power: number,
	noise: number,
	n = 101,
): Array<DataPoint> => {
	const x = Array.from({ length: n }, (_, i) => i / n);
	const y = x.map((val) => val ** power + (Math.random() - 0.5) * noise);
	const powY = x.map((val) => val ** power);
	const points = x.map((val, i) => ({ x: val, y: y[i], powY: powY[i] }));
	return points;
};

const calculateCorrelation = (data: Array<DataPoint>): number => {
	const n = data.length;
	const sumX = data.reduce((sum, point) => sum + point.x, 0);
	const sumY = data.reduce((sum, point) => sum + point.y, 0);
	const sumXY = data.reduce((sum, point) => sum + point.x * point.y, 0);
	const sumX2 = data.reduce((sum, point) => sum + point.x * point.x, 0);
	const sumY2 = data.reduce((sum, point) => sum + point.y * point.y, 0);

	const numerator = n * sumXY - sumX * sumY;
	const denominator = Math.sqrt(
		(n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY),
	);

	return numerator / denominator;
};

export const Plot = () => {
	const [power, setPower] = useState(2);
	const [noise, setNoise] = useState(0.1);
	const [data, setData] = useState<Array<DataPoint>>([]);
	const [correlation, setCorrelation] = useState(0);

	useEffect(() => {
		const newData = generateData(power, noise);
		setData(newData);
		setCorrelation(calculateCorrelation(newData));
	}, [power, noise]);

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<CardTitle>Interactive Correlation Plot</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="mb-4">
					<p>
						This is an interactive plot that shows the correlation between the
						data points and the function{" "}
						<span className="inline-block">y = x^power</span>. You can add
						"noise" (some randomness) to the data points to simulate a more
						realistic dataset. This is a visual demonstration of how, even if
						the correlation coefficient is relatively high, we can't deem the
						relationship to be linear.
					</p>
				</div>
				<div className="mb-4 w-full">
					<p className="block mb-2">Power: {power.toFixed(2)}</p>
					<Slider
						value={[power]}
						onValueChange={(values) => setPower(values[0])}
						min={1}
						max={10}
						step={0.1}
					/>
				</div>
				<div className="mb-4">
					<p className="block mb-2">Noise: {noise.toFixed(2)}</p>
					<Slider
						value={[noise]}
						onValueChange={(values) => setNoise(values[0])}
						min={0}
						max={1}
						step={0.01}
					/>
				</div>
				<div className="mb-4">
					<p>Correlation coefficient: r = {correlation.toFixed(4)}</p>
					<p>Function equation: y = x^{power.toFixed(2)}</p>
				</div>
				<ResponsiveContainer width="100%" height={300}>
					<ComposedChart
						margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
						data={data}
					>
						<CartesianGrid />
						<XAxis type="number" dataKey="x" name="X" domain={[0, 1]} />
						<YAxis type="number" dataKey="y" name="Y" />
						<Legend />
						<Scatter name="Data Points" fill="#8884d8" data={data} />
						<Line
							name="Function"
							type="monotone"
							dataKey="powY"
							stroke="red"
							strokeWidth={2}
							dot={false}
						/>
					</ComposedChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
};
