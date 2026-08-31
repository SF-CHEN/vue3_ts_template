// core
import SvgIcon from "~virtual/svg-component"
import { pinia } from "@/pinia"
import { router } from "@/router"
import App from "@/App.vue"
// css
import "normalize.css"
import "nprogress/nprogress.css"
import "element-plus/dist/index.css"
import "element-plus/theme-chalk/dark/css-vars.css"
import "@@/assets/styles/index.scss"
import "virtual:uno.css"

const app = createApp(App)

app.component("SvgIcon", SvgIcon)
app.use(pinia).use(router)

router.isReady().then(() => {
  app.mount("#app")
})
