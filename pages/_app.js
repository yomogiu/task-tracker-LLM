import '../styles/globals.css';
import { SettingsProvider } from '../contexts/SettingsContext';

function MyApp({ Component, pageProps }) {
  return (
    <SettingsProvider>
      <Component {...pageProps} />
    </SettingsProvider>
  )
}

export default MyApp