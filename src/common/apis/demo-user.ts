import type { UserFormData, UserItem, UserPage, UserQuery } from "./types/demo-user"
import { request } from "@/http/axios"

let seed = 3
const store: UserItem[] = [
  {
    id: 1,
    username: "admin",
    role: "admin",
    status: "enabled",
    createdAt: "2026-01-10 10:00:00"
  },
  {
    id: 2,
    username: "alice",
    role: "user",
    status: "enabled",
    createdAt: "2026-01-12 14:30:00"
  },
  {
    id: 3,
    username: "bob",
    role: "user",
    status: "disabled",
    createdAt: "2026-01-15 09:20:00"
  }
]

function delay<T>(data: T, ms = 250): Promise<T> {
  return new Promise(resolve => setTimeout(resolve, ms, data))
}

const mockUserApi = {
  async fetchPage(params: { pageCurrent: number, pageSize: number, query: UserQuery }) {
    const { pageCurrent, pageSize, query } = params
    const username = query.username?.trim()
    let list = [...store]

    if (username) list = list.filter(item => item.username.includes(username))
    if (query.role) list = list.filter(item => item.role === query.role)
    if (query.status) list = list.filter(item => item.status === query.status)

    const total = list.length
    const start = (pageCurrent - 1) * pageSize
    return delay({ records: list.slice(start, start + pageSize), total })
  },
  async create(data: UserFormData) {
    seed += 1
    const item: UserItem = {
      id: seed,
      username: data.username,
      role: data.role,
      status: data.status,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " ")
    }
    store.unshift(item)
    return delay(item)
  },
  async update(data: UserFormData) {
    const index = store.findIndex(item => item.id === data.id)
    if (index < 0) throw new Error("用户不存在")
    store[index] = {
      ...store[index],
      username: data.username,
      role: data.role,
      status: data.status
    }
    return delay(store[index])
  },
  async delete(id: number) {
    const index = store.findIndex(item => item.id === id)
    if (index < 0) throw new Error("用户不存在")
    store.splice(index, 1)
    return delay(true)
  }
}

const realUserApi = {
  fetchPage(params: { pageCurrent: number, pageSize: number, query: UserQuery }) {
    return request<UserPage>({
      url: "/users",
      method: "get",
      params: {
        pageCurrent: params.pageCurrent,
        pageSize: params.pageSize,
        ...params.query
      }
    })
  },
  create(data: UserFormData) {
    return request<UserItem>({ url: "/users", method: "post", data })
  },
  update(data: UserFormData) {
    return request<UserItem>({ url: `/users/${data.id}`, method: "put", data })
  },
  async delete(id: number) {
    await request<void>({ url: `/users/${id}`, method: "delete" })
    return true
  }
}

const userApi = import.meta.env.VITE_USE_MOCK === "true" ? mockUserApi : realUserApi

export function fetchUserPage(params: {
  pageCurrent: number
  pageSize: number
  query: UserQuery
}) {
  return userApi.fetchPage(params)
}

export function createUser(data: UserFormData) {
  return userApi.create(data)
}

export function updateUser(data: UserFormData) {
  return userApi.update(data)
}

export function deleteUser(id: number) {
  return userApi.delete(id)
}
