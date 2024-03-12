import type { AppProps } from 'next/app'
import i18n from '@/i18n'
import { I18nextProvider } from 'react-i18next'
import { FileProvider } from '@/contexts/FileContext'
import { UpdateProvider } from '@/contexts/UpdateContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
  <I18nextProvider i18n={i18n}>
    <UpdateProvider>
      <FileProvider>
        <Component {...pageProps} />
      </FileProvider>
    </UpdateProvider>
  </I18nextProvider>
  )
}
