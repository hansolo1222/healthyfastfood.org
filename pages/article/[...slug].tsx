import Head from "next/head";

// @ts-ignore
function DataToPage({ data }){
  
  return (
    <>
      <Head>
        <title>{ data.title }</title>
        <meta
          name="description"
          content={ data.description }
        />
      </Head>
        <div dangerouslySetInnerHTML={ { __html: data.html } } />
    </>
  )
}
// @ts-ignore
export async function getServerSideProps(context) {
  const res = await fetch('https://datatopage.com/api/v1/pages/render_html', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + process.env.DATA_TO_PAGE_SECRET_KEY,
    },
    body: JSON.stringify({
      page: {
        path: context.resolvedUrl
      }
    })
  });
  console.log(context.resolvedUrl)

  
  if (res.status !== 200) {
    return {
      notFound: true
    }
  }

  const data = await res.json()
  console.log(data)


  return { props: { data, status: res.status } }
}
  
export default DataToPage;