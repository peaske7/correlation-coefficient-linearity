import { Plot } from "./plot";

export const App = () => {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Plot />
			<div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs">
				<p>Made by Jay for Math 146</p>
			</div>
		</div>
	);
};
