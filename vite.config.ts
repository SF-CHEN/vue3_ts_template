/// <reference types="vitest/config" />

import { resolve } from "node:path"
import vue from "@vitejs/plugin-vue"
import UnoCSS from "unocss/vite"
import AutoImport from "unplugin-auto-import/vite"
import SvgComponent from "unplugin-svg-component/vite"
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"
import Components from "unplugin-vue-components/vite"
import { defineConfig, loadEnv } from "vite"

// Configuring Vite: https://cn.vite.dev/config
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "") as ImportMetaEnv
  const { VITE_PUBLIC_PATH, VITE_PROXY_TARGET } = env

  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
        "@@": resolve(__dirname, "src/common")
      }
    },
    server: {
      host: true,
      port: 3333,
      strictPort: false,
      open: true,
      proxy: {
        "/api": {
          target: VITE_PROXY_TARGET || "http://127.0.0.1:8080",
          ws: false,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, "")
        }
      },
      cors: true
    },
    build: {
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2048
    },
    esbuild:
      mode === "development"
        ? undefined
        : {
            pure: ["console.log"],
            drop: ["debugger"],
            legalComments: "none"
          },
    plugins: [
      vue(),
      SvgComponent({
        iconDir: [resolve(__dirname, "src/common/assets/icons")],
        preserveColor: resolve(__dirname, "src/common/assets/icons/preserve-color"),
        dts: true,
        dtsDir: resolve(__dirname, "types/auto")
      }),
      UnoCSS(),
      AutoImport({
        imports: [
          "vue",
          "vue-router",
          "pinia",
          {
            "element-plus": ["ElMessage", "ElMessageBox", "ElNotification", "ElLoading"]
          }
        ],
        dts: "types/auto/auto-imports.d.ts",
        resolvers: [ElementPlusResolver({ importStyle: false })]
      }),
      Components({
        dts: "types/auto/components.d.ts",
        resolvers: [ElementPlusResolver({ importStyle: false })]
      })
    ],
    test: {
      include: ["tests/**/*.test.{ts,js}"],
      environment: "happy-dom",
      server: {
        deps: {
          inline: ["element-plus"]
        }
      }
    }
  }
})
