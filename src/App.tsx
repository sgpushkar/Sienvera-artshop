import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Admin from './pages/Admin'

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const stored = window.localStorage.getItem('artshop_theme')
    return stored === 'dark' ? 'dark' : 'light'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('artshop_theme', theme)
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<Home theme={theme} onToggleTheme={() => setTheme(theme === 'light' ? 'dark' : 'light')} />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  )
}
