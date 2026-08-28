/** 登录后缓存的用户摘要（刷新后还原角色） */
export interface UserProfile {
  id: number
  username: string
  roles: string[]
  permissions?: string[]
}
