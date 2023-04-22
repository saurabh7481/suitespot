"use client";

import React, { useCallback, useState } from "react";
import { SafeReservations, SafeUser } from "../types";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface TripsClientProps {
	reservations: SafeReservations[];
	currentUser: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
	reservations,
	currentUser,
}) => {
	const router = useRouter();
	const [deletingID, setDeletingID] = useState("");

	const onCancel = useCallback(
		async (id: string) => {
			setDeletingID(id);
			try {
				await axios.delete(`/api/reservations/${id}`);
				toast.success("Reservation Cancelled");
				router.refresh();
			} catch (err: any) {
				toast.error(err?.response?.data?.error);
			}
		},
		[router]
	);

	return (
		<Container>
			<Heading
				title="Trips"
				subtitle="Where you've been and where you're going"
			/>
			<div
				className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3
            lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-8"
			>
				{reservations.map((reservation) => (
					<ListingCard
						key={reservation.id}
						data={reservation.listing}
						reservation={reservation}
						actionId={reservation.id}
						onAction={onCancel}
						disabled={deletingID === reservation.id}
						actionLabel="Cancel Reservation"
						currentUser={currentUser}
					/>
				))}
			</div>
		</Container>
	);
};

export default TripsClient;
