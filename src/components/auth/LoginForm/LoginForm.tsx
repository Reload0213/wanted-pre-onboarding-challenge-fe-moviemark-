"use client";

import BaseButton from "@/components/common/Button/BaseButton";
import { EmailIcon, LockIcon } from "@/components/common/Icons";
import PasswordInput from "@/components/common/Input/PasswordInput";
import TextInput from "@/components/common/Input/TextInput";

import { useLoginForm } from "./useLoginForm";

export interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

const LoginForm = ({ onSuccess, onError }: LoginFormProps) => {
	const {
		formState,
		errors,
		isLoading,
		handleSubmit,
		handleLoginFormChange,
	} = useLoginForm({ onSuccess, onError });

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col gap-8 w-full max-w-[48.6rem]"
			noValidate
		>
			<h1 className='text-heading-1 text-white mb-20'>Login</h1>
			<TextInput
				label="이메일"
				placeholder="이메일을 입력하세요"
				icon={<EmailIcon />}
				required
				value={formState?.email}
				onChange={handleLoginFormChange("email")}
				validationState={errors.email ? "invalid" : "default"}
				error={errors.email}
				disabled={isLoading}
			/>
			<PasswordInput
				label="비밀번호"
				placeholder="비밀번호를 입력하세요"
				icon={<LockIcon />}
				required
				value={formState?.password}
				onChange={handleLoginFormChange("password")}
				validationState={errors.password ? "invalid" : "default"}
				error={errors.password}
				disabled={isLoading}
			/>
			<BaseButton
				type="submit"
				size="full"
				variant="filled"
				color="primary"
				isLoading={isLoading}
				disabled={isLoading}
			>
				{isLoading ? "로그인 중..." : "로그인"}
			</BaseButton>
		</form>
	);
};

export default LoginForm;