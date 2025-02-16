"use client"

import ReactMarkdown from "react-markdown"
import Link from "next/link"

const DONATE_CONTENT = `
### How can I support HealthyFastFood.org?

You can use Ko-Fi to help with continued development of HealthyFastFood.org!
`

export default function DonateClient() {
  return (
    <div className="overflow-hidden py-16">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-base lg:max-w-none">
          <h1 className="mt-2 text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl">
            🍕 Donate
          </h1>
        </div>
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-8">
          <div className="relative z-10">
            <div className="prose prose-stone mx-auto lg:max-w-none">
              <ReactMarkdown>{DONATE_CONTENT}</ReactMarkdown>
            </div>
            <div className="mx-auto mt-10 flex max-w-prose text-base lg:max-w-none">
              <div className="rounded-md shadow">
                <Link
                  href="https://ko-fi.com/healthyfastfood"
                  className="flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-5 py-3 text-base font-medium text-white hover:bg-red-700"
                >
                  Donate with Ko-Fi
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 