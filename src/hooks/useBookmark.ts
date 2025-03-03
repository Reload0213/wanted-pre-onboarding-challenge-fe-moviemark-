import { addBookmark as addBookmarkApi, deleteBookmark as deleteBookmarkApi } from "@/api/bookmark";
import { useToastMessageContext } from "@/providers/ToastMessageProvider";

export const useBookmark = () => {
	const { showToastMessage } = useToastMessageContext();

	const addBookmark = async (movieId: string) => {
		try {
			const response = await addBookmarkApi(movieId);
			showToastMessage({ type: "success", message: "북마크에 되었습니다." });
			return response;
		} catch (error) {
			showToastMessage({ type: "error", message: "북마크에 실패했습니다." });
			throw error;
		}
	};

	const deleteBookmark = async (movieId: string) => {
		try {
			const response = await deleteBookmarkApi(movieId);
			showToastMessage({ type: "success", message: "북마크가 해제되었습니다." });
			return response;
		} catch (error) {
			showToastMessage({ type: "error", message: "북마크에 해제가 실패했습니다." });
			throw error;
		}
	};

	return { addBookmark, deleteBookmark };
};