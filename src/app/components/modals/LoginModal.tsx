"use client";

import axios from "axios";
import { AiFillGithub } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useCallback, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import { toast } from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";

const LoginModal = () => {
	const router = useRouter();
	const registerModal = useRegisterModal();
	const loginModal = useLoginModal();
	const [isLoading, setIsLoading] = useState(false);

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit: SubmitHandler<FieldValues> = async (data) => {
		try {
			setIsLoading(true);
			await signIn("credentials", {
				...data,
				redirect: false,
			});
            console.log('logged in')
			setIsLoading(false);
			router.refresh();
            
			toast.success("Logged In");
			loginModal.onClose();
		} catch (err) {
            console.log(err)
			toast.error("Something went wrong");
		} finally {
			setIsLoading(false);
		}
		// setIsLoading(true);
		// signIn("credentials", {
		// 	...data,
		// 	redirect: true,
        //     // callbackUrl: '/success'
		// }).then((callback) => {
        //     console.log('here')
		// 	setIsLoading(false);
		// 	if (callback?.ok) {
        //         console.log('logged in')
		// 		toast.success("Logged In");
		// 		router.refresh();

		// 		registerModal.onClose();
		// 	}

		// 	if (callback?.error) {
		// 		toast.error(callback?.error);
		// 	}
		// }).catch(err => {
        //     console.log(err)
        // })
	};

	const bodyContent = (
		<div className="flex flex-col gap-4">
			<Heading title="Welcome back!" subtitle="Login to your account" center />
			<Input
				id="email"
				label="Email"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
				type="email"
			/>
			<Input
				id="password"
				label="Password"
				disabled={isLoading}
				register={register}
				errors={errors}
				required
				type="password"
			/>
		</div>
	);

	const footerContent = (
		<div className="flex flex-col gap-4 mt-3">
			<hr />
			<Button
				outline
				label="Continue with Google"
				icon={FcGoogle}
				onClick={() => signIn('google')}
			/>
			<Button
				outline
				label="Continue with Github"
				icon={AiFillGithub}
				onClick={() => signIn('github')}
			/>
			<div
				className="
              text-neutral-500 
              text-center 
              mt-4 
              font-light
            "
			>
				<p>
					Already have an account?
					<span
						onClick={() => {}}
						className="
                  text-neutral-800
                  cursor-pointer 
                  hover:underline
                "
					>
						{" "}
						Log in
					</span>
				</p>
			</div>
		</div>
	);

	return (
		<Modal
			disabled={isLoading}
			isOpen={loginModal.isOpen}
			title="Login"
			actionLabel="Log In"
			onClose={loginModal.onClose}
			onSubmit={handleSubmit(onSubmit)}
			body={bodyContent}
			footer={footerContent}
		/>
	);
};

export default LoginModal;
