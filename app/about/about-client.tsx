"use client"

import ReactMarkdown from "react-markdown"
import Image from "next/image"
import Link from "next/link"

const ABOUT_CONTENT = `
Hi I'm Kev, the creator of HealthyFastFood.org.

We're a website that collects, organizes, and presents nutrition data from official sources, so that people can make informed decisions when they eat out.

Our mission is to be the standard reference for restaurant nutrition data on the web. 

We advocate preparing your own food, as this is the own way you will know the precise macro and micronutrient content of your meals. However, many people have busy lifestyles and careers, and preparing every single meal is unrealistic.

This project was the result of my own problems. Like many office workers, I didn't have to time to prepare lunch, and struggled to eat healthy meals for lunch. This is exacerbed by the fact we often eat with coworkers and don't have a choice in the venue. I wanted to create a resource that would help people like me make informed decisions when they eat out.

## Where is the data sourced from?

Nutrition information on HealthyFastFood.org is sourced from official restaurant nutrition guides. 

If you believe information is incorrect or needs to be updated please email us at [support@healthyfastfood.org](mailto:support@healthyfastfood.org).

We make every effort to ensure the quality and accuracy of the data we report.

`

const DISCLAIMER_CONTENT = `
## Who uses this site?
HealthyFastFood.org is intended for both the general public and health professionals.

DISCLAIMER:
The information on HealthyFastFood.org is not intended to replace the consultation of a nutritionist or other certified health provider, but it is intended to inform readers so they can have a more constructive conversation with their health professionals.
`

export default function AboutClient() {
  return (
    <div className="overflow-hidden py-16">
      <div className="mx-auto space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto text-base lg:max-w-none">
          <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl text-center">
            About HealthyFastFood.org
          </h1>
        </div>

        <div className="relative z-10">
          <div className="prose prose-stone max-w-prose mx-auto">
            <ReactMarkdown>{ABOUT_CONTENT}</ReactMarkdown>
          </div>

          {/* <div>
            <div className="grid max-w-6xl grid-cols-2 sm:px-20 mx-auto mt-12 text-center sm:grid-cols-1 md:mt-20 gap-x-8 md:grid-cols-2 gap-y-12 lg:gap-x-16 xl:gap-x-20">
              <div>
                <Image
                  className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale"
                  src="/images/headshots/kev-headshot.png"
                  alt="Kev Ma headshot"
                  width={176}
                  height={176}
                />
                <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8">
                  Kev Ma
                </p>
                <Link
                  href="https://www.linkedin.com/in/kevma8807/"
                  className="mt-2 block"
                >
                  <svg
                    className="w-6 h-6 mx-auto text-blue-500 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                  </svg>
                </Link>
                <p className="mt-2 text-base font-normal text-gray-600">
                  Designer
                </p>
                <p className="text-left text-gray-500 text-sm mt-2">
                  Kev is a web designer living in California. He is responsible for creating and maintaining HealthyFastFood.org. He has a BA Information Science from Cornell University. He believes that many diseases can be prevented through proper nutrition and is passionate about empowering people with tools to organize and understand the foods they eat.
                </p>
              </div>

              <div>
                <Image
                  className="object-cover w-32 h-32 mx-auto rounded-full lg:w-44 lg:h-44 grayscale"
                  src="/images/headshots/khun-headshot.JPG"
                  alt="Khun Min Aung headshot"
                  width={176}
                  height={176}
                />
                <p className="mt-5 text-lg font-bold text-gray-900 sm:text-xl sm:mt-8">
                  Khun Min Aung
                </p>
                <Link
                  href="https://www.linkedin.com/in/khunminaung/"
                  className="mt-2 block"
                >
                  <svg
                    className="w-6 h-6 mx-auto text-blue-500 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                  </svg>
                </Link>
                <p className="mt-2 text-base font-normal text-gray-600">
                  Researcher
                </p>
                <p className="text-left text-gray-500 text-sm mt-2">
                  Brandon Aung studied Medicine at the University of Medicine in Yangon and Finance at the University of Technology Sydney. He currently works in a corporate development & strategy role and is passionate about using data to improve health outcomes.
                </p>
              </div>
            </div>
          </div> */}

          <div className="relative z-10 mt-10">
            <div className="prose prose-stone max-w-prose mx-auto">
              <ReactMarkdown>{DISCLAIMER_CONTENT}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 