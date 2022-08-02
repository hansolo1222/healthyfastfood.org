import { classNames } from "./utils"

const newLabel = <span className="ml-1 inline-flex items-center px-1 py-0-25 rounded-sm text-xs font-medium text-white bg-red-600">
        New
      </span>



export const Tabs = ({activeTab, slug}) => {

  const tabs = [
    { name: 'Menu Items', value: 'all', href: '/' + slug },
    // { name: 'Healthy Options', value: 'healthy', href: '/' + slug },
    // { name: 'Gluten-Free Options', value: 'healthy', href: '/' + slug },
    { name: 'About this Restaurant', value: 'healthy', href: '/' + slug },

  ]
  return (
     
        <div className="border-b border-t py-3 border-stone-200 overflow-x-auto">
          <nav className=" flex space-x-3" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.value == activeTab
                    ? 'text-red-500 bg-red-100'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100',
                  'whitespace-nowrap py-2 px-3 rounded-lg font-medium text-sm flex items-center'
                )}
               
              >
                {/* <img className="h-8 w-8 mr-2" src={`/images/icons/${tab.image}`}/>  */}
                {tab.name} {tab.new ? newLabel : ""}
              </a>
            ))}
          </nav>
        </div>
    
  )
}



export const MealTabs = ({activeTab, slug}) => {

  const tabs = [
    { name: 'Nutrition Information', value: 'nutrition-information', href: '/' + slug },
    { name: 'Allergens', value: 'allergens', href: '/' + slug },
    { name: 'Ingredients', value: 'ingredients', href: '/' + slug },
    { name: 'Restaurant Info', value: 'restaurant', href: '/' + slug },
    { name: 'FAQ', value: 'faq', href: '/' + slug },

  ]
  return (
     
        <div className="border-b border-t py-3 border-stone-200 overflow-x-auto">
          <nav className=" flex space-x-3" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.value == activeTab
                    ? 'text-red-500 bg-red-100'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100',
                  'whitespace-nowrap py-2 px-3 rounded-lg font-medium text-sm flex items-center'
                )}
               
              >
                {/* <img className="h-8 w-8 mr-2" src={`/images/icons/${tab.image}`}/>  */}
                {tab.name} {tab.new ? newLabel : ""}
              </a>
            ))}
          </nav>
        </div>
    
  )
}