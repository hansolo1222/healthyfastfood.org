export const FAQ = ({faqs}) => {
    return (
      <section className="mobile-padding bg-white pb-4">
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
            <div className="faq">
              <dl className="">
                {faqs.map((faq, index) => (
                  <div key={faq.question}>
                    <h3 id={index} className="">{faq.question}</h3>
                    <div className="" dangerouslySetInnerHTML={{ __html: faq.answer.replace('"','')}}></div>
                  </div>
                ))}
              </dl>
            </div>
          
      </div>
      </section>
    )
  }