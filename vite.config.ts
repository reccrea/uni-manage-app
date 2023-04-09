import path from "path";
import { defineConfig, loadEnv, ConfigEnv, UserConfig } from "vite";
import { createHtmlPlugin } from "vite-plugin-html";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import postcssPresetEnv from "postcss-preset-env";
import postcssImport from "postcss-import";

import viteCompression from "vite-plugin-compression";
import vueSetupExtend from "vite-plugin-vue-setup-extend-plus";
import eslintPlugin from "vite-plugin-eslint";

import { wrapperEnv } from "./src/utils/getEnv";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv): UserConfig => {
	const env = loadEnv(mode, process.cwd());
	const viteEnv = wrapperEnv(env);

	return {
		resolve: {
			alias: {
				"@": pathSrc
			}
		},
		css: {
			postcss: {
				plugins: [
					postcssImport(),
					postcssPresetEnv({
						autoprefixer: {
							overrideBrowserslist: ["> 1%", "last 2 versions", "not ie <= 8"],
							grid: true
						}
					})
				]
			},
			preprocessorOptions: {
				less: {
					// 在 Less 中允许使用 JavaScript 代码
					javascriptEnabled: true
				}
			}
		},
		server: {
			// 服务器主机名，如果允许外部访问，可设置为 "0.0.0.0"
			host: "0.0.0.0",
			port: viteEnv.VITE_PORT,
			open: viteEnv.VITE_OPEN,
			cors: true
		},
		plugins: [
			vue(),
			createHtmlPlugin({
				inject: {
					data: {
						title: viteEnv.VITE_GLOB_APP_TITLE
					}
				}
			}),
			AutoImport({
				// 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
				imports: ["vue"],

				resolvers: [
					// 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
					ElementPlusResolver(),
					// 自动导入图标组件
					IconsResolver({
						prefix: "Icon"
					})
				],

				dts: path.resolve(pathSrc, "auto-imports.d.ts")
			}),
			Components({
				resolvers: [
					// 自动注册图标组件
					IconsResolver({
						enabledCollections: ["ep"]
					}),
					// 自动导入 Element Plus 组件
					ElementPlusResolver()
				],
				dts: path.resolve(pathSrc, "components.d.ts")
			}),
			Icons({
				autoInstall: true
			}),
			// EsLint 报错信息显示在浏览器界面上
			eslintPlugin(),
			// name 可以写在 script 标签上
			vueSetupExtend(),
			// gzip compress
			viteEnv.VITE_BUILD_GZIP &&
				viteCompression({
					verbose: true,
					disable: false,
					threshold: 10240,
					algorithm: "gzip",
					ext: ".gz"
				})
		],
		// 打包去除 console.log && debugger
		esbuild: {
			pure: viteEnv.VITE_DROP_CONSOLE ? ["console.log", "debugger"] : []
		},
		build: {
			outDir: "dist",
			minify: "esbuild",
			// esbuild 打包更快，但是不能去除 console.log，terser打包慢，但能去除 console.log
			// minify: "terser",
			// terserOptions: {
			// 	compress: {
			// 		drop_console: viteEnv.VITE_DROP_CONSOLE,
			// 		drop_debugger: true
			// 	}
			// },
			chunkSizeWarningLimit: 1500,
			rollupOptions: {
				output: {
					// Static resource classification and packaging
					chunkFileNames: "assets/js/[name]-[hash].js",
					entryFileNames: "assets/js/[name]-[hash].js",
					assetFileNames: "assets/[ext]/[name]-[hash].[ext]"
				}
			}
		}
	};
});
