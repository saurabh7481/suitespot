"use client";

import React, { useCallback, useState } from "react";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeReservations, SafeUser } from "../types";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";

interface ReservationClientProps {
	reservations: SafeReservations[];
	currentUser?: SafeUser | null;
}

const ReservationClient: React.FC<ReservationClientProps> = ({
	reservations,
	currentUser,
}) => {
	const router = useRouter();
	const [deletingID, setDeletingId] = useState("");

	const onCancel = useCallback(
		async (id: string) => {
			try {
				setDeletingId(id);
				await axios.delete(`/api/reservations/${id}`);
				toast.success("Reservation Cancelled");
				router.refresh();
			} catch (err: any) {
				toast.error("Something went wrong!");
			}
		},
		[router]
	);

	return (
		<Container>
			<Heading title="Reservations" subtitle="Bookings on your properties" />
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

export default ReservationClient;
