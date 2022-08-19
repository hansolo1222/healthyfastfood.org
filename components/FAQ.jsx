export const FAQ = ({faqs}) => {
    return (
      <section>
      <h2 className="font-bold text-2xl mt-8 mb-6 pt-8 border-t" id="faq">Frequently Asked Questions</h2>
        <div className="mx-auto">
          {/* <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            <div className="">
  
              <h2 className="text-3xl font-extrabold text-stone-900">Frequently asked questions</h2>
              <div className="border p-4">
                <ul>
                {faqs.map((faq, index)=>(
                  <li><a href={`/#${index}`}>{faq.question}</a></li>
                ))}
                </ul>
              </div>
            </div> */}
            <div className="mt-12 lg:mt-0 faq">
              <dl className="space-y-10">
                {faqs.map((faq, index) => (
                  <div key={faq.question}>
                    <dt id={index} className="text-xl leading-6 font-medium text-stone-900">{faq.question}</dt>
                    <dd className="mt-4 text-base text-stone-600" dangerouslySetInnerHTML={{ __html: faq.answer.replace('"','')}}></dd>
                  </div>
                ))}
              </dl>
            </div>
          
      </div>
      </section>
    )
  }