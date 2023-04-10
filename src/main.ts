import { createApp } from "vue";

// 引入样式
import "@/styles/index.less";

// 路由 router
import router from "@/routers/index";

// 状态管理 store
import { setupStore } from "@/stores";

import App from "./App.vue";

const app = createApp(App);

app.use(router);

setupStore(app);

app.mount("#app");
