export default function Example() {
    return (
      <div className="py-16 sm:py-24">
        <div className="relative sm:py-16">
       
          <div className="mx-auto max-w-md px-4 sm:max-w-3xl sm:px-6 lg:max-w-7xl lg:px-8">
              
              <div className="relative">
                <div className="sm:text-center">
                  <h2 className="text-3xl font-bold  tracking-tight sm:text-4xl">
                  The Healthy & Fast Newsletter
                  </h2>
                  <p className="mt-6 mx-auto max-w-2xl text-lg text-stone-600">
                  You&apos;ll be the first to know about new features, restaurants, and articles. You&apos;ll only get content aimed at making you healthiest version of yourself. No spam, we promise.
                  </p>
                </div>
                <form action="#" className="mt-12 sm:mx-auto sm:max-w-lg sm:flex">
                  <div className="min-w-0 flex-1">
                    <label htmlFor="cta-email" className="sr-only">
                      Email address
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      className="border border-stone-300 block w-full rounded-md px-5 py-3 text-base text-stone-900 placeholder-stone-500 shadow-sm focus:outline-none focus:border-transparent focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div className="mt-4 sm:mt-0 sm:ml-3">
                    <button
                      type="submit"
                      className="block w-full rounded-md border border-transparent px-5 py-3 bg-red-500 text-base font-medium text-white shadow hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-600 sm:px-10"
                    >
                      Email me
                    </button>
                  </div>
                </form>
              </div>
            </div>
        </div>
      </div>
    )
  }



// export default function EmailSignup() {
//     return (
//       <div className="bg-white">
//         <div className="max-w-7xl mx-auto py-24 px-4 sm:px-6 lg:py-32 lg:px-8 lg:flex lg:items-center">
//           <div className="lg:w-0 lg:flex-1">
//             <h2 className="text-3xl tracking-tight font-bold text-stone-900 sm:text-4xl">The Healthy & Fast Newsletter</h2>
//             <p className="mt-3 max-w-3xl text-lg text-stone-500">
//               You'll be the first to know about new features, restaurants, and articles aimed at making you healthiest version of yourself. No spam, we promise.
//             </p>
//           </div>
//           <div className="mt-8 lg:mt-0 lg:ml-8">
//             <form className="sm:flex">
//               <label htmlFor="email-address" className="sr-only">
//                 Email address
//               </label>
//               <input
//                 id="email-address"
//                 name="email-address"
//                 type="email"
//                 autoComplete="email"
//                 required
//                 className="w-full px-5 py-3 border border-stone-300 shadow-sm placeholder-stone-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:max-w-xs rounded-md"
//                 placeholder="Enter your email"
//               />
//               <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
//                 <button
//                   type="submit"
//                   className="w-full flex items-center justify-center py-3 px-5 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
//                 >
//                   Email me
//                 </button>
//               </div>
//             </form>
//             <p className="mt-3 text-sm text-stone-500">
//               We care about your privacy. Read our{' '}
//               <a href="#" className="font-medium underline">
//                 Privacy Policy.
//               </a>
//             </p>
//           </div>
//         </div>
//       </div>
//     )
//   }