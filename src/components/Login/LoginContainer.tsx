"use client";

import Image from "next/image";

import LoginForm from "../auth/LoginForm/LoginForm";

const LoginContainer = () => {
	return (
		<div className="flex flex-col flex-1 h-full w-full justify-center">
			<div className="flex items-center justify-center w-full gap-[12rem]">
				<div className="flex-1">
					<Image
						src="/images/sally.png"
						alt="sally"
						width={486}
						height={584}
						className="text-white"
					/>
				</div>
				<div className="flex-1">
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default LoginContainer;