export const FAQ = ({faqs}) => {
    return (
      <div className="bg-white ">
        <div className="mx-auto py-16 ">
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="">
  
              <h2 className="text-3xl font-extrabold text-zinc-900">Frequently asked questions</h2>
              {/* <div className="border p-4">
                <ul>
                {faqs.map((faq, index)=>(
                  <li><a href={`/#${index}`}>{faq.question}</a></li>
                ))}
                </ul>
              </div> */}
            </div>
            <div className="mt-12 lg:mt-0 lg:col-span-2 faq">
              <dl className="space-y-12">
                {faqs.map((faq, index) => (
                  <div key={faq.question}>
                    <dt id={index} className="text-xl leading-6 font-medium text-zinc-900">{faq.question}</dt>
                    <dd className="mt-4 text-base text-zinc-600" dangerouslySetInnerHTML={{ __html: faq.answer.replace('"','')}}></dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    )
  }