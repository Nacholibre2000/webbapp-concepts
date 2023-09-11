// _app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  console.log("_app.tsx component rendered");  // Debugging statement
  return (
    <div>
      <div className="gradient-bar flex justify-center items-center pr-80">
        <span className="text-5xl font-semibold tracking-wider text-emerald-600 mr-40">
          Kursplanen online
        </span>
      </div>
      <Component {...pageProps} />
    </div>
  );
}
