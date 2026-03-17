import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { Todo } from './components/Todo/Todo'
import { News } from './components/News/News'
import { Finance } from './components/Finance/Finance'
import './App.css'

function App() {
  // 主题切换，存在localStorage
  const [theme, setTheme] = useState<'auto' | 'light' | 'dark'>('auto')

  useEffect(() => {
    const savedTheme = localStorage.getItem('openclaw-theme') as 'auto' | 'light' | 'dark'
    if (savedTheme) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    if (theme !== 'auto') {
      root.classList.add(theme)
    }
    localStorage.setItem('openclaw-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'auto') return 'light'
      if (prev === 'light') return 'dark'
      return 'auto'
    })
  }

  const getThemeEmoji = () => {
    switch (theme) {
      case 'auto': return '🌓'
      case 'light': return '☀️'
      case 'dark': return '🌙'
      default: return '🌓'
    }
  }

  return (
    <div className="app">
      <nav className="navbar">
        <div className="navbar-brand">🦞 OpenClaw Personal</div>
        <div className="navbar-links">
          <NavLink to="/" className="nav-link">
            待办
          </NavLink>
          <NavLink to="/news" className="nav-link">
            新闻
          </NavLink>
          <NavLink to="/finance" className="nav-link">
            金融
          </NavLink>
          <button className="theme-toggle" onClick={toggleTheme} title="切换主题">
            {getThemeEmoji()}
          </button>
        </div>
      </nav>
      <main className="container">
        <Routes>
          <Route path="/" element={<Todo />} />
          <Route path="/news" element={<News />} />
          <Route path="/finance" element={<Finance />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
