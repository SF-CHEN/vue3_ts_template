export interface ArticleItem {
  id: number
  title: string
  status: "draft" | "published"
  author: string
  createdAt: string
}

export interface ArticleFormData {
  id?: number
  title: string
  status: "draft" | "published"
  author: string
}

export interface ArticleQuery {
  title?: string
  status?: "" | "draft" | "published"
}

export interface ArticlePage {
  records: ArticleItem[]
  total: number
}
