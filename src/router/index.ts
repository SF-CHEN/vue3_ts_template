import type { RouteRecordRaw } from "vue-router"
import { ROLE_ADMIN, ROLE_USER } from "@@/constants/roles"
import { createRouter } from "vue-router"
import { REDIRECT_PATH, routerConfig } from "@/router/config"
import { registerNavigationGuard } from "@/router/guard"

const Layouts = () => import("@/layouts/index.vue")

/**
 * @name 常驻路由
 * @description 除了 redirect/403/404/login 等隐藏页面，其他页面建议设置唯一的 Name 属性
 */
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: REDIRECT_PATH,
    component: Layouts,
    meta: {
      hidden: true
    },
    children: [
      {
        path: ":path(.*)",
        component: () => import("@/pages/redirect/index.vue")
      }
    ]
  },
  {
    path: "/403",
    component: () => import("@/pages/error/403.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/404",
    component: () => import("@/pages/error/404.vue"),
    meta: {
      hidden: true
    },
    alias: "/:pathMatch(.*)*"
  },
  {
    path: "/login",
    component: () => import("@/pages/login/index.vue"),
    meta: {
      hidden: true
    }
  },
  {
    path: "/",
    component: Layouts,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/pages/home/index.vue"),
        name: "Dashboard",
        meta: {
          title: "首页",
          svgIcon: "dashboard",
          affix: true
        }
      }
    ]
  }
]

/**
 * @name 动态路由
 * @description 用来放置有权限 (roles / permissions 属性) 的路由
 * @description 必须带有唯一的 Name 属性
 */
export const dynamicRoutes: RouteRecordRaw[] = [
  {
    path: "/demo",
    component: Layouts,
    redirect: "/demo/article",
    name: "Demo",
    meta: {
      title: "示例",
      icon: "fa-solid:flask",
      alwaysShow: true,
      roles: [ROLE_ADMIN, ROLE_USER]
    },
    children: [
      {
        path: "article",
        component: () => import("@/pages/demo/article/index.vue"),
        name: "DemoArticle",
        meta: {
          title: "文章管理",
          icon: "fa-solid:file-alt",
          roles: [ROLE_ADMIN, ROLE_USER],
          permissions: ["demo:article:list"],
          keepAlive: true
        }
      },
      {
        path: "user",
        component: () => import("@/pages/demo/user/index.vue"),
        name: "DemoUser",
        meta: {
          title: "用户管理",
          icon: "ep:user",
          roles: [ROLE_ADMIN],
          permissions: ["demo:user:list"]
        }
      },
      {
        path: "file",
        component: () => import("@/pages/demo/file/index.vue"),
        name: "DemoFile",
        meta: {
          title: "文件传输",
          icon: "fa-solid:file-alt",
          roles: [ROLE_ADMIN],
          permissions: ["demo:file:transfer"]
        }
      }
    ]
  }
]

/** 路由实例 */
export const router = createRouter({
  history: routerConfig.history,
  routes: constantRoutes
})

/** 重置路由 */
export function resetRouter() {
  try {
    router.getRoutes().forEach((route) => {
      const { name, meta } = route
      if (name && (meta.roles?.length || meta.permissions?.length)) {
        router.hasRoute(name) && router.removeRoute(name)
      }
    })
  } catch {
    location.reload()
  }
}

registerNavigationGuard(router)
