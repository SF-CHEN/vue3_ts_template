import type { RouterHistory } from "vue-router"

/** 路由配置 */
export interface RouterConfig {
  /**
   * @name 路由模式
   * @description hash 模式和 html5 模式
   */
  history: RouterHistory
  /**
   * @name 是否开启动态路由功能
   * @description 1. 开启后需要后端配合，在查询用户详情接口返回当前用户的 permissions；roles 仅作为辅助限制字段
   * @description 2. 假如项目不需要根据不同的用户来显示不同的页面，则应该将 dynamic: false
   */
  dynamic: boolean
}
