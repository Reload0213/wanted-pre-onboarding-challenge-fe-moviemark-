import { useRouter } from "next/navigation";
import { useSetRecoilState } from "recoil";

import { login as loginApi } from "@/api/auth";
import { useToastMessageContext } from "@/providers/ToastMessageProvider";
import { authState } from "@/store/auth";
import type { AuthCredentials, DecodedToken } from "@/types/auth";
import { removeCookie } from "@/utils/cookie";
import { decodeJwt } from "@/utils/decodeJwt";

export const useAuth = () => {
	const router = useRouter();
	const setAuthState = useSetRecoilState(authState);
	const { showToastMessage } = useToastMessageContext();

	const login = async (credentials: AuthCredentials) => {
		try {
			const response = await loginApi(credentials);
			const decodedToken = decodeJwt<DecodedToken>(response.access_token);
			if (decodedToken) {
				setAuthState({ user: { email: decodedToken.sub } });
				showToastMessage({ type: "success", message: "로그인 되었습니다." });
				router.push("/");
			}
			return response;
		} catch (error) {
			showToastMessage({ type: "error", message: "로그인에 실패했습니다." });
			throw error;
		}
	};

	const logout = () => {
		removeCookie("accessToken");
		removeCookie("refreshToken");
		setAuthState({ user: null });
		showToastMessage({ type: "info", message: "로그아웃 되었습니다." });
		router.push("/login");
	};

	return { login, logout };
};