import { atom, selector } from "recoil";

import type { User } from "@/types/auth";

interface AuthState {
  user: Pick<User, "email"> | null;
}

export const authState = atom<AuthState>({
	key: "authState",
	default: {
		user: null,
	},
});

export const isLoggedInState = selector({
	key: "isLoggedInState",
	get: ({ get }) => {
		const { user } = get(authState);
		return !!user?.email;
	},
});