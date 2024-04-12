import { useState } from "react";

export default function Item({
	text,
	fetchFunction,
}: {
	text: string;
	fetchFunction: () => Promise<any>;
}) {
	const [data, setData] = useState("");

	const buttonFunction = async () => {
		const response = await fetchFunction();
		setData(response);
	};

	return (
		<div>
			<button onClick={buttonFunction}>{text}</button>
			<pre>{JSON.stringify(data, null, 2)}</pre>
		</div>
	);
}
