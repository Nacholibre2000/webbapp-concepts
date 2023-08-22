import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div>
      <div className="gradient-bar">
        Kursplanen online
      </div>
      <Component {...pageProps} />
    </div>
  );
}
