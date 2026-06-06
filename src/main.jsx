import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Aplica dark mode antes de qualquer render
const saved = localStorage.getItem('liberty_theme')
document.body.className = (saved === 'light') ? 'light' : 'dark'
if (!saved) localStorage.setItem('liberty_theme', 'dark')

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
