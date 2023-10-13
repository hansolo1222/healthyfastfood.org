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
        title={`About | Mealrank`}
        description={`Mealrank is the definite source on restaurant nutrition.`}
        canonical={`https://healthyfastfood.org/about/`}
        additionalMetaTags={[
          {
            property: "keywords",
            content: `mealrank`,
          },
        ]}
        openGraph={{
          url: "https://healthyfastfood.org/about",
          type: "website",
          title: "About | Mealrank",
          description:
            "Mealrank is the definite source on the healthiest items to order at restaurants",
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
      <Head></Head>
      <Layout>
        <div className="overflow-hidden  py-16">
          <div className="mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto  text-base lg:max-w-none">
              <h2 className="text-lg font-semibold text-red-600"></h2>
              <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl text-center">
                About Healthyfastfood.org
              </h1>
            </div>

            <div className="relative z-10">
              <div className="prose prose-stone max-w-prose mx-auto  ">
                <ReactMarkdown>
                  {`
Hi I'm Kev, the creator of Healthyfastfood.org.

We're a website that collects, organizes, and presents nutrition data from official sources, so that people can make informed decisions when they eat out.

Our mission is to be the standard reference for restaurant nutrition data on the web. 

We advocate preparing your own food, as this is the own way you will know the precise macro and micronutrient content of your meals. However, many people have busy lifestyles and careers, and preparing every single meal is unrealistic.

Healthyfastfood.org was created with these people in mind. 

In fact, it came out of my own experiences. I was a busy working in Manhattan and was trying to eat healthy, but I didn't have the time to prepare every single meal. I was frustrated, because all I wanted was a healthy meal, and I didn't know what do get besides Sweetgreen. I wanted to create a resource that would help people like me make informed decisions when they eat out.

## Where is the data sourced from?

Nutrition information on Healthyfastfood.org is sourced from official restaurant nutrition guides. 

If you believe information is incorrect or needs to be updated please email us at [support@healthyfastfood.org](mailto:support@healthyfastfood.org).

We make every effort to ensure the quality and accuracy of the data we report.

## Who works on Healthyfastfood.org?

`}
                </ReactMarkdown>
              </div>

              <div>
                <div className="grid max-w-6xl grid-cols-2 sm:px-20 mx-auto mt-12 text-center  sm:grid-cols-1 md:mt-20 gap-x-8 md:grid-cols-2 gap-y-12 lg:gap-x-16 xl:gap-x-20">
                  <div>
                    <img
                      className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale filter"
                      src="/images/headshots/kev-headshot.png"
                      alt=""
                    />

                    <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8 font-pj">
                      Kev Ma
                    </p>
                    <a
                      className="mt-2 cursor-pointer"
                      href="https://www.linkedin.com/in/kevma8807/"
                    >
                      <svg
                        className="w-6 h-6 mx-auto text-blue-500 fill-current "
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                      </svg>
                    </a>
                    <p className="mt-2 text-base font-normal text-gray-600 font-pj">
                      Designer
                    </p>
                    <p className="text-left text-gray-500 text-sm mt-2">
                      Kev is a web developer living in California. He is responsible for designing and maintaining Healthyfastfood.org. He has a Bachelor's Degree
                      in Informatics from Cornell University. He believes that many diseases can be prevented through proper nutrition and is passionate about empowering people with tools to organize and understand the foods they eat.
                    </p>
                  </div>
                  <div>
                    <img
                      className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale filter"
                      src="/images/headshots/khun-headshot.JPG"
                      alt=""
                    />
                    <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8 font-pj">
                      Khun Min Aung
                    </p>
                    <a
                      className="mt-2 cursor-pointer"
                      href="https://www.linkedin.com/in/khunminaung/"
                    >
                      <svg
                        className="w-6 h-6 mx-auto text-blue-500 fill-current "
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                      </svg>
                    </a>
                    <p className="mt-2 text-base font-normal text-gray-600 font-pj">
                      Researcher
                    </p>
                    <p className="text-left text-gray-500 text-sm mt-2">
                      Brandon Aung studied Medicine at the University of Medicine in Yangon and Finance at the University of Technology Sydney.
                      He currently works in a corporate development & strategy role and is passionate about using data to improve health outcomes.
                      
                    </p>
                  </div>

                  {/* <div>
                    <img
                      className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale filter"
                      src="/images/headshots/sophie-headshot.jpeg"
                      alt=""
                    />
                    <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8 font-pj">
                      Sophie Kjeldahl
                    </p>
                    <a
                      className="mt-2 cursor-pointer"
                      href="https://www.linkedin.com/in/sophiekjeldahlnutritionist/"
                    >
                      <svg
                        className="w-6 h-6 mx-auto text-blue-500 fill-current "
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                      >
                        <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"></path>
                      </svg>
                    </a>
                    <p className="mt-2 text-base font-normal text-gray-600 font-pj">
                      Nutritionist (MSc DipION)
                    </p>
                    <p className="text-left text-gray-500 text-sm mt-2">
                      Sophie Kjeldahl BSc (Hons) MSc DipION is a qualified
                      nutritionist also trained in nutritional therapy. After
                      her undergraduate degree in Biology, she studied a Masters
                      degree in Nutrition at University of Copenhagen, Denmark.
                    </p>
                  </div> */}

                  <div></div>
                </div>
              </div>

              <div className="relative z-10 mt-10">
                <div className="prose prose-stone max-w-prose mx-auto  ">
                  <ReactMarkdown>
                    {`
## Who uses this site?
Healthyfastfood.org is intended for both the general public and health professionals.

DISCLAIMNER:
The information on Healthyfastfood.org is not intended to replace the consultation of a nutritionist or other certified health provider, but it is intended to inform readers so they can have a more constructive conversation with their health professionals.

There are many contradictions and controversies in the field of nutrition, this website is intended to inform the reader so that he/she can make the best decision for their health.
`}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
}
