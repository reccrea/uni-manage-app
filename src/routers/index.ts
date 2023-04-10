import { createRouter, createWebHashHistory } from "vue-router";

import { staticRouter } from "@/routers/modules/staticRouter";

import { useUserStoreHook } from "@/stores/modules/user";

import NProgress from "@/config/nprogress";

import { ROUTER_WHITE_LIST } from "@/config/globalConfig";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [...staticRouter],
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 })
});

/* 
	路由拦截
*/
router.beforeEach((to, from, next) => {
	const useUserStore = useUserStoreHook();

	// 1.NProgress 开始
	NProgress.start();

	// 2.动态设置标题
	const title = import.meta.env.VITE_GLOB_APP_TITLE;
	document.title = to.meta.title ? `${to.meta.title} - ${title}` : title;

	// 3.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
	if (to.path.toLocaleLowerCase() === "/login") {
		if (useUserStore.token) {
			return next(from.fullPath);
		}
		// resetRouter();
		return next();
	}

	// 4.判断访问页面是否在路由白名单地址中，如果存在直接放行
	if (ROUTER_WHITE_LIST.includes(to.path)) return next();

	// 5.判断是否有 Token，没有重定向到 login
	if (!useUserStore.token)
		return next({
			path: "/login",
			replace: true
		});

	// 6.如果没有菜单列表，就重新请求菜单列表并添加动态路由
	/* const authStore = AuthStore();
	authStore.setRouteName(to.name as string);
	if (!authStore.authMenuListGet.length) {
		await initDynamicRouter();
		return next({ ...to, replace: true });
	} */

	// 7.正常访问页面
	next();
});

/* 
	路由跳转结束
*/
router.afterEach(() => {
	NProgress.done();
});

/* 
	路由跳转错误
*/
router.onError(error => {
	NProgress.done();
	console.warn("路由错误", error.message);
});

export default router;
