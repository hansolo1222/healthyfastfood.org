import React, { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";

export const useSortableData = (items, config = null) => {

  const [sortConfig, setSortConfig] = useState(config);

  // {
  //   key: "name",
  //   direction: "descending",
  // }
  const sortedItems = React.useMemo(() => {
    let sortedItems = [...items];

    if (sortConfig !== null) {
      if (
      sortConfig.key == "restaurantTypeSlug" ||
      sortConfig.key == "segmentSlug" ||
      sortConfig.key == "slug" ||
      sortConfig.key == "categoryName" ||
      sortConfig.key == "name"

      ) {
        sortedItems.sort((a, b) => {
           if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === "ascending" ? 1 : -1;
          }
          else if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === "descending" ? -1 : 1;
          }
         
        });
      } else {
        sortedItems.sort((a, b) => {
          if (a[sortConfig.key] === null) {
            return 1;
          } else if (b[sortConfig.key] === null) {
            return -1;
          } else if (a === b) {
            return 0;
          } else if (sortConfig.direction === "ascending") {
            return a[sortConfig.key] - b[sortConfig.key];
          } else {
            return b[sortConfig.key] - a[sortConfig.key];
          }
        });
      }
    }
    return sortedItems;
  }, [items, sortConfig]);

  const requestSortPreserveDirection= (key, value, startingDirection) => {
    let direction = startingDirection;
    if (sortConfig.key === key && sortConfig.direction == startingDirection) {
      direction = oppositeDirection(startingDirection);
    }
    setSortConfig({ key, direction });
  };

  const requestSort = (key, startingDirection) => {
    let direction = startingDirection;
    if (sortConfig.key === key && sortConfig.direction == startingDirection) {
      direction = oppositeDirection(startingDirection);
    }
    setSortConfig({ key, direction });
  };

  const oppositeDirection = (direction) => {
    if (direction == "ascending") return "descending";
    if (direction == "descending") return "ascending";
  };

  const SortableTableHeader = ({ name, colKey, direction }) => {
    // const getDirection = direction ? direction : "ascending"

    return (
      <button
        className="sortable-table-header"
        type="button"
        onClick={() => requestSort(colKey, direction)}
      >
        <div
          className={`group inline-flex items-center cursor-pointer text-xs
        ${isActive(colKey) ? "text-stone-900" : "text-stone-500"} `}
        >
          {name}
          <span
            className={`flex-none rounded ${
              isActive(colKey) ? "text-stone-900" : "text-stone-300"
            } group-hover:visible group-focus:visible`}
          >
            {getDirectionForCol(colKey) == direction ? (
              <ChevronUpIcon className="h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            )}
          </span>
        </div>
      </button>
    );
  };

  const SortableTableHeaderInverse = ({ name, colKey }) => {
    return (
      <a type="button" onClick={() => requestSort(colKey)}>
        <div
          className={`group inline-flex cursor-pointer text-xs uppercase
        ${isActive(colKey) ? "text-stone-900" : "text-stone-500"} `}
        >
          {name}
          <span
            className={`flex-none rounded ${
              isActive(colKey) ? "text-stone-900" : "text-stone-300"
            } group-hover:visible group-focus:visible`}
          >
            {getDirectionForCol(colKey) == "descending" ? (
              <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
            ) : (
              <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
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

  return {
    items: sortedItems,
    requestSort,
    requestSortPreserveDirection,
    sortConfig,
    SortableTableHeader,
    SortableTableHeaderInverse,
    SortableTableHeaderROI,
  };
};

// const requestSort = key => {

//   let direction = 'descending';
//   if (sortConfig.key === key && sortConfig.direction === 'descending') {
//     direction = 'ascending';
//   }
//   setSortConfig({ key, direction });
// }
