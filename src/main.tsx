import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from "react-error-boundary";

import App from './App.tsx'
import { ErrorFallback } from './ErrorFallback.tsx'
import { mockStorage } from './services/mockStorage.ts'

import "./main.css"
import "./styles/theme.css"
import "./index.css"

// Create global spark object for KV storage
declare global {
  var spark: {
    kv: {
      get: <T>(key: string) => Promise<T | null>
      set: <T>(key: string, value: T) => Promise<void>
    }
  }
}

globalThis.spark = {
  kv: {
    get: <T,>(key: string) => mockStorage.get<T>(key),
    set: <T,>(key: string, value: T) => mockStorage.set<T>(key, value)
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
)
