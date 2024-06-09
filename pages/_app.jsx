import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'
 const GTM_ID = 'G-PSTY3EB8KQ';
import { GoogleAnalytics } from '@next/third-parties/google'


function MyApp({ Component, pageProps }) {
  return (
  <>
    
    <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
    </Head>
    <Component {...pageProps} />
    <GoogleAnalytics gaId="G-PSTY3EB8KQ" />

  </>
  )
}

export default MyApp
