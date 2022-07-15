import React, {useState} from 'react';

export const useFilteredData = (items,selectedCoins) => {
  const [filterConfig, setFilterConfig] = useState({key:'coin',values:[],active:false})

  const filteredItems = React.useMemo(()=>{
    let filteredItems = [...items]

    if (filterConfig.active == true){
      filteredItems = filteredItems.filter((item)=> filterConfig.values.includes(item['topCoin']) )
    }
    
    return filteredItems
  },[items, filterConfig])
  
  const requestFilter = key => {
    let values = selectedCoins.map((x)=>{return x.value})
    let active = false;
    if (selectedCoins.length > 0 && filterConfig.key === key) {
    
      active = true;
    }
    setFilterConfig({ key, values, active });
  }

  const requestFilterPreserveFilter = key => {
    let values = filterConfig.values;
    let active = filterConfig.active;
    setFilterConfig({ key, values, active });
  }

  return { filteritems: filteredItems, requestFilter, requestFilterPreserveFilter, filterConfig };
}