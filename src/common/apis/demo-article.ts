import type { ArticleFormData, ArticleItem, ArticlePage, ArticleQuery } from "./types/demo-article"
import { request } from "@/http/axios"

/** 本地内存 Mock，演示 CRUD；接入真实后端时替换为本文件中的 request 调用即可 */
let seed = 3
const store: ArticleItem[] = [
  {
    id: 1,
    title: "如何接入认证适配层",
    status: "published",
    author: "admin",
    createdAt: "2026-01-10 10:00:00"
  },
  {
    id: 2,
    title: "CustomTable 使用说明",
    status: "draft",
    author: "user",
    createdAt: "2026-01-12 14:30:00"
  },
  {
    id: 3,
    title: "新增业务页面清单",
    status: "published",
    author: "admin",
    createdAt: "2026-01-15 09:20:00"
  }
]

function delay<T>(data: T, ms = 250): Promise<T> {
  return new Promise(resolve => setTimeout(resolve, ms, data))
}

const mockArticleApi = {
  async fetchPage(params: { pageCurrent: number, pageSize: number, query: ArticleQuery }) {
    const { pageCurrent, pageSize, query } = params
    let list = [...store]
    if (query.title) list = list.filter(item => item.title.includes(query.title.trim()))
    if (query.status) list = list.filter(item => item.status === query.status)

    const total = list.length
    const start = (pageCurrent - 1) * pageSize
    return delay({ records: list.slice(start, start + pageSize), total })
  },
  async create(data: ArticleFormData) {
    seed += 1
    const item: ArticleItem = {
      id: seed,
      title: data.title,
      status: data.status,
      author: data.author,
      createdAt: new Date().toISOString().slice(0, 19).replace("T", " ")
    }
    store.unshift(item)
    return delay(item)
  },
  async update(data: ArticleFormData) {
    const index = store.findIndex(item => item.id === data.id)
    if (index < 0) throw new Error("记录不存在")
    store[index] = { ...store[index], title: data.title, status: data.status, author: data.author }
    return delay(store[index])
  },
  async delete(id: number) {
    const index = store.findIndex(item => item.id === id)
    if (index < 0) throw new Error("记录不存在")
    store.splice(index, 1)
    return delay(true)
  }
}

const realArticleApi = {
  fetchPage(params: { pageCurrent: number, pageSize: number, query: ArticleQuery }) {
    return request<ArticlePage>({
      url: "/articles",
      method: "get",
      params: {
        pageCurrent: params.pageCurrent,
        pageSize: params.pageSize,
        ...params.query
      }
    })
  },
  create(data: ArticleFormData) {
    return request<ArticleItem>({ url: "/articles", method: "post", data })
  },
  update(data: ArticleFormData) {
    return request<ArticleItem>({ url: `/articles/${data.id}`, method: "put", data })
  },
  async delete(id: number) {
    await request<void>({ url: `/articles/${id}`, method: "delete" })
    return true
  }
}

const articleApi = import.meta.env.VITE_USE_MOCK === "true" ? mockArticleApi : realArticleApi

export function fetchArticlePage(params: {
  pageCurrent: number
  pageSize: number
  query: ArticleQuery
}) {
  return articleApi.fetchPage(params)
}

export function createArticle(data: ArticleFormData) {
  return articleApi.create(data)
}

export function updateArticle(data: ArticleFormData) {
  return articleApi.update(data)
}

export function deleteArticle(id: number) {
  return articleApi.delete(id)
}
