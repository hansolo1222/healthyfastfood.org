"use client"

import ReactMarkdown from "react-markdown"

const TERMS_CONTENT = `
Please read this Terms of Service carefully before using the website. The following terms and conditions govern all use of HealthyFastFood.org and apply to all visitors and users. By accessing our website, you agree to be bound by all these terms and conditions. If you do not comply with this agreement, then you may not be allowed to access the website or use any services.

## Privacy Policy
At HealthyFastFood.org, we are committed to respecting and protecting your privacy. Please read our [Privacy Policy](/privacy-policy) before accessing the website; it will inform you about how we collect, use and disclose the information.

## Proprietary Rights
HealthyFastFood.org and all its aspects, including but not limited to all the content and data, the design and the layout, are owned by our company. Using the Website does not grant you ownership of any property rights. The information on the Website is only for personal use and non-commercial purposes. Any individual or organization shall not be allowed to copy or republish the content elsewhere.

## Information on the Website
We put a lot of emphasis on the accuracy of the content on HealthyFastFood.org, but we cannot guarantee that the services are all available or there is no incorrect information on the Website because restaurant locations and menu items might change at any time. Your use of the Website means you accept such inaccuracy or incompleteness. We will not be responsible for any harms that may result from accessing or using the information on the Website.

## Linked Sites
We do not own or control or monitor any third-party websites and links on HealthyFastFood.org, and we take no responsibility for any false or incorrect information on those sites. Users who enter the sites should be careful and will do it at one's own risk. We strongly suggest you read their terms of service and privacy policies before Further accessing their websites.

## Changes
HealthyFastFood.org reserves the right to modify or replace these Terms of Service without further notice. It is your responsibility to check it. Your continued use of or access to the Website acknowledges you agree to be bound by the latest terms.

## Contact Information
If you would like to request additional information regarding the Terms of Service, please contact us at support@healthyfastfood.org.
`

export default function TermsOfServiceClient() {
  return (
    <div className="overflow-hidden py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-base lg:max-w-none">
          <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl">
            Terms of Service
          </h1>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="relative z-10">
            <div className="prose prose-stone mx-auto lg:max-w-none">
              <ReactMarkdown>{TERMS_CONTENT}</ReactMarkdown>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 