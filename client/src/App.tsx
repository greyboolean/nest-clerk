import {
	SignedIn,
	SignedOut,
	SignInButton,
	useAuth,
	UserButton,
} from "@clerk/clerk-react";
import Item from "./components/Item";
import { getItems } from "./api/item";

export default function App() {
	const { getToken } = useAuth();

	const fetchItems = async () => {
		const token = await getToken();
		console.log(token);
		return getItems(token);
	};

	return (
		<header>
			<SignedOut>
				<SignInButton />
				<Item text="Get Users" fetchFunction={fetchItems} />
			</SignedOut>
			<SignedIn>
				<UserButton />
				<Item text="Get Users" fetchFunction={fetchItems} />
			</SignedIn>
		</header>
	);
}