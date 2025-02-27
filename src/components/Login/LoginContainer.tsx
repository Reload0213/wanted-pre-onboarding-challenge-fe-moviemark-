"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import LoginForm from "../auth/LoginForm/LoginForm";

const LoginContainer = () => {
	const router = useRouter();

	const handleLogInSuccess = () => {
		// 회원가입 성공 시 로그인 페이지로 이동
		router.push("/movies");
	};

	const handleLogInError = (error: Error) => {
		// 에러 로깅이나 분석을 위한 처리
		console.error("로그인 실패:", error);
	};

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
					<LoginForm
						onSuccess={handleLogInSuccess}
						onError={handleLogInError}
					/>
				</div>
			</div>
		</div>
	);
};

export default LoginContainer;