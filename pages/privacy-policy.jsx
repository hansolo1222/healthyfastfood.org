import Head from "next/head";
import Layout from "../components/Layout";
// import prisma from "../lib/prisma";
import { NextSeo } from "next-seo";
import { RestaurantSectionTextBlock } from "../components/RestaurantSectionTextBlock";
import ReactMarkdown from "react-markdown";


export default function Privacy() {
  return (
    <div className="">
      <NextSeo
        title={`Privacy Policy | Healthy Fast Food`}
        description={`This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the Website Name website.
`}
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
            "Privacy Policy | Healthy Fast Food",
          description:
            "This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the Website Name website.",
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
          <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl">
            Privacy Policy
          </h1>
        </div>
        <div className="relative z-10 mx-auto max-w-prose text-base lg:mx-0 lg:max-w-5xl lg:pr-72">
          <p className="text-lg text-stone-500">
          
          </p>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="relative z-10">
            <div className="prose prose-stone mx-auto  lg:max-w-none">

              <ReactMarkdown>
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

Afternoons LLC operates the HealthyFastFood.org website, which provides the SERVICE.

This page is used to inform website visitors regarding our policies with the collection, use, and disclosure of Personal Information if anyone decided to use our Service, the Website Name website.

If you choose to use our Service, then you agree to the collection and use of information in relation with this policy. The Personal Information that we collect are used for providing and improving the Service. We will not use or share your information with anyone except as described in this Privacy Policy.

The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Website URL, unless otherwise defined in this Privacy Policy.

## Information Collection and Use
For a better experience while using our Service, we may require you to provide us with certain personally identifiable information, including but not limited to your name, phone number, and postal address. The information that we collect will be used to contact or identify you.

## Log Data
We want to inform you that whenever you visit our Service, we collect information that your browser sends to us that is called Log Data. This Log Data may include information such as your computer's Internet Protocol (“IP”) address, browser version, pages of our Service that you visit, the time and date of your visit, the time spent on those pages, and other statistics.

## Cookies
Cookies are files with small amount of data that is commonly used an anonymous unique identifier. These are sent to your browser from the website that you visit and are stored on your computer's hard drive.

Our website uses these “cookies” to collection information and to improve our Service. You have the option to either accept or refuse these cookies, and know when a cookie is being sent to your computer. If you choose to refuse our cookies, you may not be able to use some portions of our Service.

## Service Providers
We may employ third-party companies and individuals due to the following reasons:

To facilitate our Service;
To provide the Service on our behalf;
To perform Service-related services; or
To assist us in analyzing how our Service is used.
We want to inform our Service users that these third parties have access to your Personal Information. The reason is to perform the tasks assigned to them on our behalf. However, they are obligated not to disclose or use the information for any other purpose.

## Security
We value your trust in providing us your Personal Information, thus we are striving to use commercially acceptable means of protecting it. But remember that no method of transmission over the internet, or method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.

## Links to Other Sites
Our Service may contain links to other sites. If you click on a third-party link, you will be directed to that site. Note that these external sites are not operated by us. Therefore, we strongly advise you to review the Privacy Policy of these websites. We have no control over, and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.

## Children's Privacy

Our Services do not address anyone under the age of 13. We do not knowingly collect personal identifiable information from children under 13. In the case we discover that a child under 13 has provided us with personal information, we immediately delete this from our servers. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us so that we will be able to do necessary actions.

## Changes to This Privacy Policy
We may update our Privacy Policy from time to time. Thus, we advise you to review this page periodically for any changes. We will notify you of any changes by posting the new Privacy Policy on this page. These changes are effective immediately, after they are posted on this page.

## Contact Us
If you have any questions or suggestions about our Privacy Policy, do not hesitate to contact us at [support@healthyfastfood.org]("mailto:support@healthyfastfood.org").
`}         
</ReactMarkdown>

             </div>
            {/* <div className="mx-auto mt-10 flex max-w-prose text-base lg:max-w-none">
              <div className="rounded-md shadow">
                <a
                  href="/restaurants"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
                >
                  See Restaurants
                </a>
              </div>
              <div className="ml-4 rounded-md shadow">
                <a
                  href="/categories"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 hover:bg-stone-50"
                >
                  See Food Categories
                </a>
              </div>
            </div> */}
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





