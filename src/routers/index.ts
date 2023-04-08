import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
	history: createWebHashHistory(),
	routes: [],
	strict: false,
	scrollBehavior: () => ({ left: 0, top: 0 })
});

export default router;
