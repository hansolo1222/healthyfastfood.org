import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import Head from 'next/head'
import Script from 'next/script'
const GTMID = 'G-PSTY3EB8KQ';


function MyApp({ Component, pageProps }) {
  // const router = useRouter()
  // useEffect(()=>{
  //   const handleRouteChange = (url) => {
  //     gtag.pageview(url)
  //   }
  //   router.events.on('routeChangeComplete', handleRouteChange)
  //   router.events.on('hashChangeComplete', handleRouteChange)
  //   return () => {
  //     router.events.off('routeChangeComplete', handleRouteChange)
  //     router.events.off('hashChangeComplete', handleRouteChange)

  //   }
  // }, [router.events])



  return (
  <>
    <Head>
      <link rel="shortcut icon" href="/images/favicon.ico" />
      {/* <!-- Google Tag Manager --> */}
      <Script
  strategy="afterInteractive"
  id="your-id"
  dangerouslySetInnerHTML={{
    __html: `
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer', ${GTMID});
  `,
  }}
/>
{/* <!-- End Google Tag Manager --> */}
        </Head>

      <Component {...pageProps} />
  </>
  )
}

export default MyApp
