import getCurrentUser from "../actions/getCurrentUser";
import getFavouriteListings from "../actions/getFavouriteListings";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import FavouritesClient from "./FavouritesClient";

const FavouritesPage = async () => {
	const favourites = await getFavouriteListings();
	const currentUser = await getCurrentUser();

	if (favourites.length === 0) {
		return (
			<ClientOnly>
				<EmptyState
					title="No favourites added"
					subtitle="Looks like you have not added a favourite yet"
				/>
			</ClientOnly>
		);
	}

	return (
		<ClientOnly>
			<FavouritesClient listings={favourites} currentUser={currentUser} />
		</ClientOnly>
	);
};

export default FavouritesPage;
