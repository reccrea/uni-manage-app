import { createApp } from "vue";

// 引入样式
import "@/styles/index.less";

// 路由 router
import router from "@/routers/index";

// 状态管理 store
import pinia from "@/stores/index";

import App from "./App.vue";

const app = createApp(App);

app.use(router);
app.use(pinia);

app.mount("#app");
