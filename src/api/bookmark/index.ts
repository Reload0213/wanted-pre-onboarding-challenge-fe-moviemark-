import { client } from "../client";

/**
 * 북마크를 추가하는 API
 * @param movieId 영화 아이디
 */
export const addBookmark = async (
	movieId: string
): Promise<string> => {
	return client<string>("/bookmarks", {
		method: "POST",
		params: { movie_id: movieId },
	});
};

/**
 * 북마크를 해제하는 API
 * @param movieId 영화 아이디
 */
export const deleteBookmark = async (
	movieId: string
): Promise<string> => {
	return client<string>("/bookmarks", {
		method: "DELETE",
		params: { movie_id: movieId },
	});
};