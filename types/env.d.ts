/** 声明 vite 环境变量的类型（如果未声明则默认是 any） */
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_BASE_URL: string
  readonly VITE_ROUTER_HISTORY: "hash" | "html5"
  readonly VITE_PUBLIC_PATH: string
  /** 开发代理目标，仅服务端读取 */
  readonly VITE_PROXY_TARGET?: string
  /** 是否启用全局本地 Mock API */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
