import { RouteRecordRaw } from "vue-router";

export const staticRouter: RouteRecordRaw[] = [
	{
		path: "/",
		redirect: "/home"
	},
	{
		path: "/login",
		name: "login",
		component: () => import("@/views/login/index.vue"),
		meta: {
			title: "登录",
			// 不需要缓存
			keepAlive: false
		}
	}
];
