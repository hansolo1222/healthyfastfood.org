import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import Script from 'next/script'


function MyApp({ Component, pageProps }) {
  return (
  <>
    <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
    
      </Head>
      <Script id="gtag" strategy="lazyOnload" src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`} />

<Script id="ga" strategy="lazyOnload">
    {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}', {
        page_path: window.location.pathname,
        });
    `}
</Script>

      <Component {...pageProps} />
  </>
  )
}

export default MyApp
