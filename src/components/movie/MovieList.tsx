"use client";

import { useEffect } from "react";

// import { useInfiniteQuery } from "@tanstack/react-query";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";

import { getMovies } from "@/api/movie";
import { MovieListResponse } from "@/types/movie";

import MovieCard from "./MovieCard/MovieCard";
import MovieListSkeleton from "./MovieListSkeleton";

/**
 * 영화 목록을 보여주는 컴포넌트
 *
 * 주요 기능:
 * 1. 영화 데이터를 API로부터 가져옴
 * 2. 무한 스크롤 구현
 * 3. 로딩/에러 상태 처리
 *
 * 사용된 기술:
 * - @tanstack/react-query의 useInfiniteQuery:
 *   페이지네이션된 데이터를 자동으로 관리해주는 훅
 *
 * - react-intersection-observer의 useInView:
 *   특정 요소가 화면에 보이는지 감지하는 훅 (무한 스크롤 구현에 사용)
 */
const MovieList = () => {
	const { ref, inView } = useInView({
		threshold: 1, // 요소가 얼마나 보여야 감지할지 (0~1)
	});

	// 영화 데이터 불러오기
	const {
		data,
		isError,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
	// } = useInfiniteQuery<MovieListResponse>({
	} = useSuspenseInfiniteQuery<MovieListResponse>({
		// 1. 이 데이터를 찾을 때 쓰는 고유한 이름표예요
		queryKey: ["movies"],

		// 2. 실제로 데이터를 가져오는 함수예요
		// pageParam은 현재 페이지 번호인데, 없으면 1페이지부터 시작해요
		queryFn: ({ pageParam = 1 }) => getMovies(pageParam as number),

		// 3. 다음 페이지가 있는지 확인하는 함수예요
		getNextPageParam: (lastPage, allPages) => {
			// 지금까지 가져온 페이지 수에 1을 더해서 다음 페이지 번호를 만들어요
			const nextPage = allPages.length + 1;

			// 만약 다음 페이지 번호가 전체 페이지 수보다 작거나 같으면
			// 그 번호를 반환하고, 아니면 undefined를 반환해요
			// (undefined가 반환되면 더 이상 가져올 페이지가 없다는 뜻이에요)
			return nextPage <= lastPage.total_pages ? nextPage : undefined;
		},

		// 4. 첫 페이지 번호를 1로 설정해요
		initialPageParam: 1,

		// 5. 데이터를 얼마나 오래 유지할지 설정해요
		// 5분 동안은 같은 데이터를 다시 불러오지 않아요
		// (1000 = 1초, 60 = 1분, 5 = 5분)
		staleTime: 1000 * 60 * 5,
	});

	// 화면에 보이고, 다음 페이지가 있고, 현재 페이지를 가져오는 중이 아닐 때
	useEffect(() => {
		if (inView && hasNextPage && !isFetchingNextPage) {
			console.log("다음 페이지 로딩..."); // 디버깅용
			fetchNextPage();
		}
	}, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

	// 로딩 중이거나 에러 발생 시 처리
	if (isError) return <p className="text-center">영화 목록을 불러오지 못했습니다.</p>;

	return (
		<div className="container mx-auto px-4 invisible-scroll">
			{/* 영화 카드 그리드 */}
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{data?.pages.map((page) =>
					page.movies.map((movie) => (
						<MovieCard key={movie.id} movie={movie} />
					))
				)}
			</div>

			{/* 무한 스크롤 감지 영역 */}
			<div ref={ref} className="h-10 mt-4">
				{isFetchingNextPage && <MovieListSkeleton />}
			</div>
		</div>
	);
};

export default MovieList;