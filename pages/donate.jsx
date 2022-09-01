import Head from "next/head";
import Layout from "../components/Layout";
// import prisma from "../lib/prisma";
import { NextSeo } from "next-seo";
import { RestaurantSectionTextBlock } from "../components/RestaurantSectionTextBlock";
import ReactMarkdown from "react-markdown";


export default function About() {
  return (
    <div className="">
      <NextSeo
        title={`Donate | Healthy Fast Food`}
        description={`Healthy Fast Food is the definite source on restaurant nutrition to get the body you want.`}
        canonical={`https://healthyfastfood.org/about/`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `healthy fast food,about,weight loss,body,lose weight,nutrition,facts,`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/about-healthy-fast-food",
          type: "website",
          title:
            "Donate | Healthy Fast Food",
          description:
            "Healthy Fast Food is the definite source on the healthiest items to order at restaurants",
          images: [
            {
              url: `/images/restaurant_logos/mcdonalds.webp`,
              width: 400,
              height: 400,
              alt: " Logo",
            },
          ],
        }}
        twitter={{
          handle: "@healthyfastfood",
          site: "https://healthyfastfood.org",
          cardType: "summary_large_image",
        }}
      />
      <Head>
      </Head>
      <Layout>
 
    <div className="overflow-hidden  py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-base lg:max-w-none">
          {/* <h2 className="text-lg font-semibold text-red-600">🍔</h2> */}
          <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl">
          🍕 Donate
          </h1>
        </div>
        <div className="relative z-10 mx-auto max-w-prose text-base lg:mx-0 lg:max-w-5xl lg:pr-72">
          {/* <p className="text-lg text-stone-500">
          Support the development of HealthyFastFood.org
          </p> */}
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="relative z-10">
            <div className="prose prose-stone mx-auto  lg:max-w-none">

              <ReactMarkdown>
{`
`}         
</ReactMarkdown>

{/* <div className="rounded-md shadow">
  <a
    href="/restaurants"
    className="flex w-full items-center underline-none justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
  >
    Submit feature/content update request
  </a>
</div> */}
  <ReactMarkdown>
{`
### How can I support HealthyFastFood.org?

You can use Ko-Fi to help with continued development of HealthyFastFood.org!
`}
</ReactMarkdown>

             </div>
            <div className="mx-auto mt-10 flex max-w-prose text-base lg:max-w-none">
              <div className="rounded-md shadow">
                <a
                  href="https://ko-fi.com/healthyfastfood"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
                >
                  Donate with Ko-Fi
                </a>
              </div>
              {/* <div className="rounded-md shadow">
                <a
                  href="https://ko-fi.com/healthyfastfood"
                  className="flex w-full items-center justify-center rounded-md border bg-white px-5 py-3 text-base font-medium text-stone-900 hover:bg-stone-50"
                >
                  Buy me a Coffee (Ko-Fi)
                </a>
              </div> */}
            </div>
          </div>
          {/* <div className="relative mx-auto mt-12 max-w-prose text-base lg:mt-0 lg:max-w-none">
            
            <blockquote className="relative rounded-lg bg-white shadow-lg">
              <div className="rounded-t-lg px-6 py-8 sm:px-10 sm:pt-10 sm:pb-8">
                <img
                  src="https://tailwindui.com/img/logos/workcation-logo-indigo-600-mark-stone-800-and-indigo-600-text.svg"
                  alt="Workcation"
                  className="h-8"
                />
                <div className="relative mt-8 text-lg font-medium text-stone-700">
                  <svg
                    className="absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-stone-200"
                    fill="currentColor"
                    viewBox="0 0 32 32"
                    aria-hidden="true"
                  >
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative">
                    Tincidunt integer commodo, cursus etiam aliquam neque, et. Consectetur pretium in volutpat, diam.
                    Montes, magna cursus nulla feugiat dignissim id lobortis amet. Laoreet sem est phasellus eu proin
                    massa, lectus.
                  </p>
                </div>
              </div>
              <cite className="relative flex items-center rounded-b-lg bg-indigo-600 py-5 px-6 not-italic sm:mt-10 sm:items-start sm:py-5 sm:pl-12 sm:pr-10">
                <span className="relative rounded-full border-2 border-white sm:absolute sm:top-0 sm:-translate-y-1/2 sm:transform">
                  <img
                    className="h-12 w-12 rounded-full bg-indigo-300 sm:h-20 sm:w-20"
                    src="https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2.5&w=160&h=160&q=80"
                    alt=""
                  />
                </span>
                <span className="relative ml-4 font-semibold leading-6 text-indigo-300 sm:ml-24 sm:pl-1">
                  <span className="font-semibold text-white sm:inline">Judith Black</span>{' '}
                  <span className="sm:inline">CEO at Workcation</span>
                </span>
              </cite>
            </blockquote>
          </div> */}
        </div>
      </div>
    </div>
      </Layout>
    </div>
  );
}





