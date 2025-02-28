import { getCookie, removeCookie, setCookie } from "@/utils/cookie";

const API_BASE_URL = "http://localhost:8000";

interface ApiError extends Error {
  statusCode?: number;
  code?: string;
}

interface RequestConfig extends RequestInit {
  params?: Record<string, string>;
  requireAuth?: boolean; // 인증이 필요한 요청인지 여부
}

/**
 * API 요청을 위한 기본 클라이언트
 *
 * @throws {ApiError} API 요청 실패 시 에러
 */
async function client<T>(endpoint: string, { params, requireAuth = true, ...customConfig }: RequestConfig = {}): Promise<T> {
	const accessToken = getCookie("accessToken");
	const refreshToken = getCookie("refreshToken");

	const headers = {
		"Content-Type": "application/json",
		...(requireAuth && accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
		...customConfig.headers,
	};

	const config: RequestInit = {
		...customConfig,
		headers,
	};

	// URL에 쿼리 파라미터 추가
	const queryString = params ? `?${new URLSearchParams(params)}` : "";
	const url = `${API_BASE_URL}${endpoint}${queryString}`;

	try {
		const response = await fetch(url, config);

		// 403 에러 처리
		// 토큰이 유효하지 않거나 비정상
		if (response.status === 403) {
			removeCookie("accessToken");
			removeCookie("refreshToken");
			window.location.href = "/login"; // 로그인 페이지로 리다이렉트
			throw new Error("접근 권한이 없습니다. 다시 로그인해주세요.");
		}

		// 토큰 갱신이 필요한 경우 (401 에러)
		if (response.status === 401 && refreshToken) {
			try {
				const refreshResponse = await fetch(`${API_BASE_URL}/auth/refresh?refresh_token=${encodeURIComponent(refreshToken)}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
				});

				// 토큰 갱신 성공
				if (refreshResponse.ok) {
					const { access_token: newAccessToken } = await refreshResponse.json();

					// 새로운 토큰을 쿠키에 저장
					setCookie("accessToken", newAccessToken);

					// 새로운 accessToken으로 원래 요청 재시도
					const newHeaders = {
						...headers,
						Authorization: `Bearer ${newAccessToken}`,
					};

					const retryResponse = await fetch(url, { ...config, headers: newHeaders });
					const data = await retryResponse.json();

					if (!retryResponse.ok) {
						throw new Error(data.message || "요청에 실패했습니다.");
					}

					return data;
				}
			} catch {
				// 토큰 갱신 실패 시 로그아웃 처리
				removeCookie("accessToken");
				removeCookie("refreshToken");
				throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
			}
		}

		const data = await response.json();

		if (!response.ok) {
			const error = new Error(data.message || "요청에 실패했습니다.") as ApiError;
			error.statusCode = response.status;
			error.code = data.code;
			throw error;
		}

		return data;
	} catch (error) {
		if (error instanceof Error) {
			throw error;
		}
		throw new Error("알 수 없는 오류가 발생했습니다.");
	}
}

export { client };