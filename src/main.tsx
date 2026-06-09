import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App/App.tsx'
import Providers from './App/Providers.tsx'
import { replaceLocalhostBase } from './utils/apiBaseUrl'

const nativeFetch = window.fetch.bind(window)

window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
  if (typeof input === 'string') {
    return nativeFetch(replaceLocalhostBase(input), init)
  }

  if (input instanceof URL) {
    return nativeFetch(new URL(replaceLocalhostBase(input.toString())), init)
  }

  return nativeFetch(input, init)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Providers>
    <App />
    </Providers>
  </StrictMode>,
)
