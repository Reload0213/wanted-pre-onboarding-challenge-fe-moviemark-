import { type MovieListResponse, type Movie } from "@/types/movie";

import { client } from "../client";

const ITEM_COUNT = 16;

/**
 * 영화 목록을 가져오는 API
 * @param page 페이지 번호 (기본값: 1)
 * @param item 한 페이지당 아이템 수 (기본값: 10)
 */
export const getMovies = async (
	page: number = 1,
	item: number = ITEM_COUNT
): Promise<MovieListResponse> => {
	return client<MovieListResponse>("/movies/secure", {
		params: {
			page: page.toString(),
			item: item.toString(),
		},
	});
};

/**
 * 특정 영화의 상세 정보를 가져오는 API
 * @param id 영화 ID
 */
export const getMovie = async (id: string): Promise<Movie> => {
	return client<Movie>(`/movies/${id}`);
};

/**
 * 영화 검색 API
 * @param query 검색어
 * @param page 페이지 번호 (기본값: 1)
 */
export const searchMovies = async (
	query: string,
	page: number = 1
): Promise<MovieListResponse> => {
	return client<MovieListResponse>("/movies/search", {
		params: {
			query,
			page: page.toString(),
		},
	});
};
