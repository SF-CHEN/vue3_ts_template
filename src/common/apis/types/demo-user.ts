export interface UserItem {
  id: number
  username: string
  role: "admin" | "user"
  status: "enabled" | "disabled"
  createdAt: string
}

export interface UserFormData {
  id?: number
  username: string
  role: "admin" | "user"
  status: "enabled" | "disabled"
}

export interface UserQuery {
  username?: string
  role?: "" | "admin" | "user"
  status?: "" | "enabled" | "disabled"
}

export interface UserPage {
  records: UserItem[]
  total: number
}
