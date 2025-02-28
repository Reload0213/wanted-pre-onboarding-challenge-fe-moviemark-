"use client";

import { useEffect } from "react";

import { useSetRecoilState } from "recoil";

import { getUserInfo } from "@/api/auth";
import { authState } from "@/store/auth";
import { getCookie, removeCookie } from "@/utils/cookie";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
	const setAuthState = useSetRecoilState(authState);

	useEffect(() => {
		const initializeAuth = async () => {
			const accessToken = getCookie("accessToken");

			// 쿠키에 accessToken이 남아있는 경우 유저정보 업데이트
			if (accessToken) {
				try {
					const userInfo = await getUserInfo(); // 토큰을 이용해 사용자 정보 조회
					setAuthState({ user: { email: userInfo.email } });
				} catch {
					// 토큰이 만료되었거나 유효하지 않은 경우
					removeCookie("accessToken");
					removeCookie("refreshToken");
					setAuthState({ user: null });
				}
			}
		};

		initializeAuth();
	}, [setAuthState]);

	return <>{children}</>;
};