import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

import postcssPresetEnv from "postcss-preset-env";
import postcssImport from "postcss-import";

import viteCompression from "vite-plugin-compression";

const pathSrc = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
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
	plugins: [
		vue(),
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
		viteCompression({
			verbose: true,
			disable: false,
			threshold: 10240,
			algorithm: "gzip",
			ext: ".gz"
		})
	]
});
