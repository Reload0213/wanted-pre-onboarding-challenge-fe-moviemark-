import { NextResponse } from "next/server";

import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const accessToken = request.cookies.get("accessToken");

	// 인증이 필요한 경로 목록
	const authRequiredPages = [
		"/movies",
		// ... 필요할 경우 추가
	];

	// 로그인이 필요한 페이지인지 확인
	const isAuthRequired = authRequiredPages.some(page =>
		pathname.startsWith(page)
	);

	// 로그인이 필요한 페이지인데 토큰이 없는 경우
	if (isAuthRequired && !accessToken) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// 이미 로그인된 상태에서 로그인/회원가입 페이지 접근 시
	if ((pathname === "/login" || pathname === "/signup") && accessToken) {
		return NextResponse.redirect(new URL("/movies", request.url));
	}

	return NextResponse.next();
}

// 미들웨어가 실행될 경로 설정
export const config = {
	matcher: [
		/*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
};