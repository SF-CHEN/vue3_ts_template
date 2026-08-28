/** 登录入参 */
export interface LoginInput {
  username: string
  password: string
}

/** 登录结果 */
export interface LoginResult {
  token: string
  user: CurrentUser
}

/** 当前用户 */
export interface CurrentUser {
  id: number
  username: string
  /** 角色列表，如 admin / user */
  roles: string[]
  /** 按钮级权限，可选 */
  permissions?: string[]
}

/** 最小认证契约：替换此文件对应实现即可接入真实后端 */
export interface AuthApi {
  login: (input: LoginInput) => Promise<LoginResult>
  getCurrentUser: () => Promise<CurrentUser>
  logout: () => Promise<void>
}
