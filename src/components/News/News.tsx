import { useState, useEffect } from 'react'
import './News.css'
import type { NewsItem } from '../../types'

// 使用免费的NewsAPI接口，免费额度足够个人使用
const API_KEY = 'pub_626147b6649530d8f0a8e15561f3f2c647d79'
const BASE_URL = 'https://newsdata.io/api/1/news'

export function News() {
  const [news, setNews] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('technology')

  useEffect(() => {
    fetchNews()
  }, [category])

  const fetchNews = async () => {
    setLoading(true)
    setError('')
    try {
      // 搜索关键词包含人工智能，分类是科技/世界
      const params = new URLSearchParams({
        apikey: API_KEY,
        q: category === 'ai' ? 'artificial intelligence' : '',
        category: category === 'ai' ? 'technology' : category,
        language: 'en,zh',
        size: '20'
      })
      const response = await fetch(`${BASE_URL}?${params}`)
      const data = await response.json()
      if (data.status === 'success') {
        setNews(data.results)
      } else {
        setError(data.message || '获取新闻失败')
      }
    } catch (err) {
      setError('网络请求失败，请稍后重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="news-container">
      <h2>📰 热点新闻</h2>
      
      <div className="category-tabs">
        <button
          className={category === 'world' ? 'active' : ''}
          onClick={() => setCategory('world')}
        >
          国际局势
        </button>
        <button
          className={category === 'technology' ? 'active' : ''}
          onClick={() => setCategory('technology')}
        >
          科技新闻
        </button>
        <button
          className={category === 'ai' ? 'active' : ''}
          onClick={() => setCategory('ai')}
        >
          人工智能
        </button>
      </div>

      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="news-list">
          {news.map((item, index) => (
            <a
              key={index}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-item"
            >
              <div className="news-content">
                <h3 className="news-title">{item.title}</h3>
                {item.description && (
                  <p className="news-description">{item.description.slice(0, 150)}...</p>
                )}
                <div className="news-meta">
                  <span className="source">{item.source_id}</span>
                  <span className="date">{new Date(item.pubDate).toLocaleString('zh-CN')}</span>
                </div>
              </div>
              {item.image_url && (
                <img src={item.image_url} alt={item.title} className="news-image" />
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
