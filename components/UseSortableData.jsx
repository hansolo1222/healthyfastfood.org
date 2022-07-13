import React, {useState} from 'react';
import { ArrowDownIcon, ArrowUpIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";


export const useSortableData = (items, config = null) => {
  const [sortConfig, setSortConfig] = useState({key:'USDProfit',direction:'descending'});
  const sortedItems = React.useMemo(() => {
  let sortedItems = [...items];
    if (sortConfig !== null) {
  
    if (sortConfig.key=="calories" || sortConfig.key=="protein" ){
      
      sortedItems.sort((a, b) => {
        if(a[sortConfig.key] === null){
          
          return 1;
        }
        else if(b[sortConfig.key] === null){
         
          return -1;
        }
        else if(a === b){
          return 0;
        }
        else if(sortConfig.direction === 'descending') {
          return a[sortConfig.key] - b[sortConfig.key];
        }
        else {
          return b[sortConfig.key] - a[sortConfig.key];
        }

      })
    }
    else if (sortConfig.key == "hashrate" || sortConfig.key == "USDRevenue" || sortConfig.key=="power" || sortConfig.key == "USDProfit"){
      sortedItems.sort((a, b) => {
        if(isNaN(a[sortConfig.key])){
          
          return 1;
        }
        else if(isNaN(b[sortConfig.key])){
         
          return -1;
        }
        else if(a === b){
          return 0;
        }
        else if(sortConfig.direction === 'ascending') {
          return a[sortConfig.key] - b[sortConfig.key];
        }
        else {
          return b[sortConfig.key] - a[sortConfig.key];
        }
      })
    } else {
      sortedItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        return 0;
      });
    }
  }
    return sortedItems;
  }, [items, sortConfig]);

  const requestSortPreserveDirection = key => {
    let direction = sortConfig.direction;
    setSortConfig({ key, direction });
  }

  const requestSort = key => {

    let direction = 'descending';
    if (sortConfig.key === key && sortConfig.direction === 'descending') {
      direction = 'ascending';
    }
    setSortConfig({ key, direction });
  }


  const SortableTableHeader = ({ name, colKey}) => {
    return (
      <a className="sortable-table-header" type="button" onClick={() => requestSort(colKey)}>
        <div className="group inline-flex cursor-pointer">
          {name}
          <span
            className={`ml-1 flex-none rounded ${
              isActive(colKey) ? "text-gray-900" : "text-gray-300"
            } group-hover:visible group-focus:visible`}
          >
            {getDirectionForCol(colKey) == "ascending" ? (
              <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </div>
      </a>
    );
  };


  const SortableTableHeaderInverse = ({ name, colKey }) => {
    return (
      <a type="button" onClick={() => requestSort(colKey)}>
        <div className="group inline-flex cursor-pointer">
          {name}
          <span
            className={`ml-1 flex-none rounded ${
              isActive(colKey) ? "text-gray-900" : "text-gray-300"
            } group-hover:visible group-focus:visible`}
          >
            {getDirectionForCol(colKey) == "descending" ? (
              <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </div>
      </a>
    );
  };

  const SortableTableHeaderROI = ({ name, colKey }) => {
    return (
      <a type="button" onClick={() => requestSort(colKey)}>
        <div
          className={`group inline-flex cursor-pointer ml-3 ${
            isActive(colKey) ? "text-orange-600" : "text-orange-400"
          }`}
        >
          {name}
          <span
            className={`ml-1 flex-none rounded ${
              isActive(colKey) ? "text-orange-800" : "text-orange-400"
            } group-hover:visible group-focus:visible`}
          >
            {getDirectionForCol(colKey) == "descending" ? (
              <ArrowUpIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ArrowDownIcon className="h-5 w-5" aria-hidden="true" />
            )}
          </span>
        </div>
      </a>
    );
  };

  const getDirectionForCol = (colName) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === colName ? sortConfig.direction : undefined;
  };

  const isActive = (colName) => {
    if (!sortConfig) {
      return;
    }
    return sortConfig.key === colName;
  };


  return { items: sortedItems, requestSort,requestSortPreserveDirection, sortConfig, SortableTableHeader, SortableTableHeaderInverse, SortableTableHeaderROI };
}

// const requestSort = key => {

//   let direction = 'descending';
//   if (sortConfig.key === key && sortConfig.direction === 'descending') {
//     direction = 'ascending';
//   }
//   setSortConfig({ key, direction });
// }
