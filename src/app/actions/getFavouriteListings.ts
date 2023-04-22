import prisma from "../libs/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getFavouriteListings() {
	try {
		const currentUser = await getCurrentUser();

		if (!currentUser) return [];

		if (currentUser.favoriteIds === "") {
			return [];
		}
		const favouriteList = currentUser.favoriteIds?.split(",");

		const favourites = await prisma.listing.findMany({
			where: {
				id: {
					in: [...(favouriteList || [])],
				},
			},
		});

		const safeFavourites = favourites.map((fav) => ({
			...fav,
			createdAt: fav.createdAt.toISOString(),
		}));

		return safeFavourites;
	} catch (err: any) {
		throw new Error(err);
	}
}
