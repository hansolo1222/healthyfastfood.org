import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'
 const GTM_ID = 'G-PSTY3EB8KQ';
import { GoogleAnalytics } from '@next/third-parties/google'
import { Analytics } from "@vercel/analytics/react"


function MyApp({ Component, pageProps }) {
  return (
  <>
    
    <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
      <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4191723359468026"
     crossorigin="anonymous"></script>
    </Head>
    <Component {...pageProps} />
    <GoogleAnalytics gaId="G-PSTY3EB8KQ" />
    <Analytics />
  </>
  )
}

export default MyApp
