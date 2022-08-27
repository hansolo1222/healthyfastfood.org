import { classNames } from "./utils"

const newLabel = <span className="ml-1 inline-flex items-center px-1 py-0-25 rounded-sm text-xs font-medium text-white bg-red-600">
        New
      </span>



export const Tabs = ({activeTab, slug}) => {

  const tabs = [
    { name: 'All Menu Items', mobileName: 'All Items', value: 'all', href: slug },
    { name: 'Keto Menu', mobileName: 'Keto', value: 'keto', href: slug + '/keto' },
    // { name: 'Gluten-Free Menu', mobileName: 'Gluten-Free', value: 'gluten-free', href: slug + '/gluten-free' },
    // { name: 'Vegetarian Options', mobileName: 'Vegetarian', value: 'vegetarian', href: slug + '/vegetarian' },

    // { name: 'Low-Carb Menu', value: 'low-carb', href: slug + '/low-carb' },
    // { name: 'Gluten-Free Menu', value: 'gluten-free', href: slug + '/gluten-free' },
    // { name: 'Vegetarian Options', value: 'vegetarian', href: slug + '/vegetarian' },
    // { name: 'Vegan Options', value: 'vegan', href: slug + '/vegan' },

  ]
  return (
     
        <div className="mobile-padding border-b border-t py-2 md:py-3 border-stone-200 bg-white overflow-x-auto">
          <nav className=" flex space-x-2 md:space-x-3" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.value == activeTab
                    ? 'text-red-600 bg-red-100'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:bg-stone-100',
                  'whitespace-nowrap py-1.5 md:py-2 px-3 rounded-lg font-medium text-sm flex items-center'
                )}
               
              >
                {/* <img className="h-8 w-8 mr-2" src={`/images/icons/${tab.image}`}/>  */}
                <span className="hidden md:block">{tab.name}</span>
                <span className="block md:hidden">{tab.mobileName}</span>

                 {tab.new ? newLabel : ""}
              </a>
            ))}
          </nav>
        </div>
    
  )
}

export const FoodCategoryTabs = ({activeTab, slug}) => {

  const tabs = [
    { name: 'All Items', value: 'all', href: '/' + slug },
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
                    ? 'text-red-700 bg-red-100'
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
    { name: 'Nutrition Information', value: 'nutrition-information', href:  slug + '#nutrition-information' },
    { name: 'Allergens', value: 'allergens', href: slug + "#allergens"},
    { name: 'Ingredients', value: 'ingredients', href: slug + '#ingredients' },
    { name: 'Restaurant Info', value: 'restaurant', href: slug + '#restaurant-information'},
    { name: 'FAQ', value: 'faq', href: slug + '#faq'},

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
                    ? 'text-red-700 bg-red-100'
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