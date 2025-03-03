"use client"; // Next.js에서 이 컴포넌트가 클라이언트 사이드에서만 실행됨을 명시

import { createContext, useContext, useEffect, useState } from "react";

// 테마는 'light' 또는 'dark'만 가능하도록 타입 지정
type Theme = "light" | "dark";

// Context에서 사용할 값들의 타입 정의
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// Context 생성 및 기본값 설정
// 다른 컴포넌트에서 useContext로 접근할 때 사용할 context
const ThemeContext = createContext<ThemeContextType>({
	theme: "dark",
	toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	// 현재 테마 상태 관리
	const [theme, setTheme] = useState<Theme>("dark");
	// 컴포넌트가 클라이언트에서 마운트되었는지 확인하는 상태
	// SSR에서 hydration 문제를 방지하기 위해 사용 (브라우저에서 완전히 준비가 됐을 때만 그리기)
	const [mounted, setMounted] = useState(false);

	// 컴포넌트가 마운트될 때 한 번만 실행
	useEffect(() => {
		try {
			setMounted(true);
			// 1. localStorage에서 저장된 테마가 있는지 확인
			const savedTheme = localStorage.getItem("theme") as Theme;
			// 2. 시스템 테마 설정 확인 (다크모드인지 아닌지)
			// const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
			// 우선 기본 다크 고정(현재 라이트는 그냥 색반전)
			const defaultThemeColor = "dark";

			// 저장된 테마가 있으면 그것을 사용, 없으면 시스템 테마 사용
			const initialTheme = savedTheme || defaultThemeColor;
			setTheme(initialTheme);

			// HTML 문서에 테마 클래스 적용
			document.documentElement.classList.remove("light", "dark");
			document.documentElement.classList.add(initialTheme);
		} catch (error) {
			console.error("Theme initialization error:", error);
		}
	}, []);

	// 테마 전환 함수
	const toggleTheme = () => {
		try {
			const newTheme = theme === "light" ? "dark" : "light";
			setTheme(newTheme);
			// HTML 문서의 클래스를 변경하여 테마 적용
			document.documentElement.classList.remove("light", "dark");
			document.documentElement.classList.add(newTheme);
			// 선택한 테마를 localStorage에 저장하여 다음에 방문할 때도 유지
			localStorage.setItem("theme", newTheme);
		} catch (error) {
			console.error("Theme toggle error:", error);
		}
	};

	// Context에 제공할 값들
	const value = {
		theme,
		toggleTheme,
	};

	return (
		<ThemeContext.Provider value={value}>
			{/* 클라이언트 사이드에서 마운트된 후에만 children을 렌더링 */}
			{mounted ? children : null}
		</ThemeContext.Provider>
	);
}

// 다른 컴포넌트에서 테마 관련 기능을 사용하기 위한 커스텀 훅
export function useTheme() {
	const context = useContext(ThemeContext);
	return context;
}

// 이 코드의 핵심 포인트:
// SSR 고려: mounted 상태를 사용하여 클라이언트 사이드 렌더링 제어
// 테마 지속성: localStorage를 사용하여 사용자의 테마 선택을 저장
// 시스템 테마 감지: 사용자의 시스템 설정을 확인하여 초기 테마 결정
// 타입 안전성: TypeScript를 사용하여 테마 관련 타입을 명확히 정의