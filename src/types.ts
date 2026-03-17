// 待办事项类型
export interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
}

// 新闻条目类型
export interface NewsItem {
  title: string
  link: string
  description: string
  pubDate: string
  source_id: string
  image_url: string
}

// 股票指数类型
export interface StockIndex {
  code: string
  name: string
  current: number
  change: number
  changePercent: number
}
