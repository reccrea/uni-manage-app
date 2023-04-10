import { defineStore } from "pinia";
import { userInterface } from "../interface";
import { pinia } from "@/stores";
import piniaPersistConfig from "@/config/piniaPersist";

export const useUserStore = defineStore({
	id: "reccrea-user",
	state: (): userInterface => ({
		token: "",
		userInfo: ""
	}),
	getters: {},
	actions: {
		setToken(token: string) {
			this.token = token;
		},
		setUserInfo(userInfo: any) {
			this.userInfo = userInfo;
		}
	},
	persist: piniaPersistConfig("useUserStore")
});

export function useUserStoreHook() {
	return useUserStore(pinia);
}
