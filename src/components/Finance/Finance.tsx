import { useState, useEffect } from 'react'
import './Finance.css'
import type { StockIndex } from '../../types'

// 用新浪财经免费接口获取指数数据
const INDEX_CODES = {
  sh: '000001', // 上证指数
  sz: '399001', // 深证成指
  cyb: '399006', // 创业板指
  djia: '.DJI', // 道琼斯
  nasdaq: '.IXIC', // 纳斯达克
  sp500: '.INX' // 标普500
}

export function Finance() {
  const [indices, setIndices] = useState<StockIndex[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchIndices()
  }, [])

  const fetchIndices = async () => {
    setLoading(true)
    setError('')
    try {
      // 使用新浪财经的免费jsonp接口
      const codes = Object.values(INDEX_CODES).join(',')
      const response = await fetch(`https://hq.sinajs.cn/list=${codes}`, {
        headers: {
          'Referer': 'https://finance.sina.com.cn/'
        }
      })
      const text = await response.text()
      const data = parseSinaData(text)
      setIndices(data)
    } catch (err) {
      setError('获取行情数据失败，请稍后重试')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const parseSinaData = (text: string): StockIndex[] => {
    const lines = text.split('\n').filter(line => line.trim())
    const names: Record<string, string> = {
      '000001': '上证指数',
      '399001': '深证成指',
      '399006': '创业板指',
      '.DJI': '道琼斯',
      '.IXIC': '纳斯达克',
      '.INX': '标普500'
    }

    return lines.map(line => {
      const match = line.match(/var hq_str_(.*?)="(.*?)";/)
      if (!match) return null
      const [_, code, values] = match
      const parts = values.split(',')
      const name = names[code] || code
      const current = parseFloat(parts[3])
      const preClose = parseFloat(parts[2])
      const change = current - preClose
      const changePercent = (change / preClose * 100).toFixed(2)

      return {
        code,
        name,
        current,
        change,
        changePercent: parseFloat(changePercent)
      }
    }).filter(Boolean) as StockIndex[]
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'var(--stock-up)'
    if (change < 0) return 'var(--stock-down)'
    return 'var(--text-secondary)'
  }

  return (
    <div className="finance-container">
      <h2>📈 金融市场</h2>

      <div className="section-title">国内指数</div>
      {loading && <div className="loading">加载中...</div>}
      {error && <div className="error">{error}</div>}

      {!loading && !error && (
        <>
          <div className="indices-grid">
            {indices.filter(index => !index.code.includes('.')).map(index => (
              <div key={index.code} className="index-card">
                <div className="index-name">{index.name}</div>
                <div className="index-value" style={{ color: getChangeColor(index.change) }}>
                  {index.current.toFixed(2)}
                </div>
                <div className="index-change" style={{ color: getChangeColor(index.change) }}>
                  {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent}%)
                </div>
              </div>
            ))}
          </div>

          <div className="section-title">美股指数</div>
          <div className="indices-grid">
            {indices.filter(index => index.code.includes('.')).map(index => (
              <div key={index.code} className="index-card">
                <div className="index-name">{index.name}</div>
                <div className="index-value" style={{ color: getChangeColor(index.change) }}>
                  {index.current.toFixed(2)}
                </div>
                <div className="index-change" style={{ color: getChangeColor(index.change) }}>
                  {index.change > 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent}%)
                </div>
              </div>
            ))}
          </div>

          <button onClick={fetchIndices} className="refresh-btn">
            🔄 刷新数据
          </button>
        </>
      )}
    </div>
  )
}
