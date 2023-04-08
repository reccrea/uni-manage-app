import axios, {
	AxiosInstance,
	AxiosError,
	AxiosRequestConfig,
	InternalAxiosRequestConfig,
	AxiosResponse
} from "axios";

import { checkStatus } from "./helper/checkStatus";

const config = {
	// 默认地址请求地址，可在 .env.*** 文件中修改
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（30s）
	timeout: 1000 * 30,
	// 跨域时候允许携带凭证
	withCredentials: true
};

class RequestHttp {
	service: AxiosInstance;

	public constructor(config: AxiosRequestConfig) {
		// 实例化axios
		this.service = axios.create(config);

		/* 
			客户端发送请求 -> [请求拦截器] -> 服务器
		*/
		this.service.interceptors.request.use(
			(config: InternalAxiosRequestConfig) => {
				return config;
			},
			(error: AxiosError) => {
				return Promise.reject(error);
			}
		);

		/* 
			响应拦截器
			服务器换返回信息 -> [拦截统一处理] -> 客户端获取到信息
		*/
		this.service.interceptors.response.use(
			(response: AxiosResponse) => {
				const { data } = response;
				return data;
			},
			(error: AxiosError) => {
				const { response } = error;
				// 根据响应的错误状态码，做不同的处理
				if (response) {
					checkStatus(response.status);
				}
				return Promise.reject(error);
			}
		);
	}
}

export default new RequestHttp(config);
