import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// HashRouter 필수. GitHub Pages에는 서버 사이드 rewrite가 없어서
// BrowserRouter로 배포하면 #없는 깊은 경로를 새로고침할 때 404가 난다. (규칙 4번)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
