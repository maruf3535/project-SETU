import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App.jsx'
import ScrollTopButton from './components/ScrollTopButton'
import { PasscodeProvider } from './components/Passcode'
import { ToastProvider } from './components/Toast'
import UnderDevelopmentBanner from './components/UnderDevelopmentBanner'
import { I18nProvider } from './i18n/I18nProvider'
import './index.css'
import { DemoStoreProvider } from './store/DemoStore'
import { ThemeProvider } from './theme/ThemeProvider'

// Hash routing keeps deep links working on static hosts (GitHub Pages has no SPA fallback)
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <ThemeProvider>
        <I18nProvider>
          <DemoStoreProvider>
            <ToastProvider>
              <PasscodeProvider>
                <UnderDevelopmentBanner />
                <App />
                <ScrollTopButton />
              </PasscodeProvider>
            </ToastProvider>
          </DemoStoreProvider>
        </I18nProvider>
      </ThemeProvider>
    </HashRouter>
  </StrictMode>,
)
