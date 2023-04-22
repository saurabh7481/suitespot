"use client";

import useSearchModal from "@/app/hooks/useSearchModal";
import Modal from "./Modal";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback } from "react";
import { Range } from "react-date-range";
import dynamic from "next/dynamic";
import CountrySelect, { CountrySelectValue } from "../inputs/CountrySelect";
import queryString from "query-string";
import { formatISO } from "date-fns";
import Heading from "../Heading";
import Calender from "../inputs/Calender";
import Counter from "../inputs/Counter";

enum STEPS {
	LOCATION = 0,
	DATE = 1,
	INFO = 2,
}

const SearchModal = () => {
	const router = useRouter();
	const params = useSearchParams();
	const searchModal = useSearchModal();

	const [step, setStep] = useState(STEPS.LOCATION);
	const [guestCount, setGuestCount] = useState(1);
	const [roomCount, setRoomCount] = useState(1);
	const [bathroomCount, setBathroomCount] = useState(1);
	const [location, setLocation] = useState<CountrySelectValue>();

	const [dateRange, setDateRange] = useState<Range>({
		startDate: new Date(),
		endDate: new Date(),
		key: "selection",
	});

	const Map = useMemo(
		() =>
			dynamic(() => import("../Map"), {
				ssr: false,
			}),
		[location]
	);

	const onBack = useCallback(() => {
		setStep((val) => val - 1);
	}, []);

	const onNext = useCallback(() => {
		setStep((val) => val + 1);
	}, []);

	const onSubmit = useCallback(async () => {
		if (step !== STEPS.INFO) return onNext();

		let currentQuery = {};
		if (params) {
			currentQuery = queryString.parse(params.toString());
		}

		const updatedQuery: any = {
			...currentQuery,
			locationValue: location?.value,
			guestCount,
			roomCount,
			bathroomCount,
		};

		if (dateRange.startDate) {
			updatedQuery.startDate = formatISO(dateRange.startDate);
		}

		if (dateRange.endDate) {
			updatedQuery.endDate = formatISO(dateRange.endDate);
		}

		const URL = queryString.stringifyUrl(
			{
				url: "/",
				query: updatedQuery,
			},
			{ skipNull: true }
		);

		setStep(STEPS.LOCATION);
		searchModal.onClose();

		router.push(URL);
	}, [
		step,
		searchModal,
		guestCount,
		bathroomCount,
		dateRange,
		onNext,
		params,
		location,
		roomCount,
		router,
	]);

	const actionLabel = useMemo(() => {
		if (step === STEPS.INFO) return "Search";
		return "Next";
	}, [step]);

	const secondaryActionLabel = useMemo(() => {
		if (step === STEPS.LOCATION) return undefined;
		return "Back";
	}, [step]);

	let bodyContent = (
		<div className="flex flex-col gap-8">
			<Heading
				title="Where do you want to go?"
				subtitle="Find the perfect location"
			/>
			<CountrySelect
				value={location}
				onChange={(val) => setLocation(val as CountrySelectValue)}
			/>
			<hr />
			<Map center={location?.latlng} />
		</div>
	);

	if (step === STEPS.DATE) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading
					title="When do you plan to go?"
					subtitle="Select your journey date"
				/>
				<Calender
					value={dateRange}
					onChange={(val) => setDateRange(val.selection)}
				/>
			</div>
		);
	}

	if (step === STEPS.INFO) {
		bodyContent = (
			<div className="flex flex-col gap-8">
				<Heading
					title="Give us more information?"
					subtitle="Help us find a perfect place for you"
				/>
				<Counter
					title="Guests"
					subtitle="How many guests are there?"
					value={guestCount}
					onChange={(val) => setGuestCount(val)}
				/>

				<Counter
					title="Rooms"
					subtitle="How many rooms do you need?"
					value={roomCount}
					onChange={(val) => setRoomCount(val)}
				/>

				<Counter
					title="Bathroom"
					subtitle="How many bathrooms do you need?"
					value={bathroomCount}
					onChange={(val) => setBathroomCount(val)}
				/>
			</div>
		);
	}

	return (
		<Modal
			isOpen={searchModal.isOpen}
			onClose={searchModal.onClose}
			onSubmit={onSubmit}
			body={bodyContent}
			title="Filters"
			actionLabel={actionLabel}
			secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
			secondaryActionLabel={secondaryActionLabel}
		/>
	);
};

export default SearchModal;
