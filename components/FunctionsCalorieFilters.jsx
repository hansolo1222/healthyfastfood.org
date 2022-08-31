import React, { useState } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/solid";

export const functionsCalorieFilters = (showCalorieFilter, setShowCalorieFilter) => {

  const openCalorieFilter = () => {
    document.body.style.overflow = "hidden";
    setShowCalorieFilter(true);
  };

  const closeCalorieFilter = () => {
    document.body.style.overflow = "auto";
    setShowCalorieFilter(false);
  };

  return {
    
    openCalorieFilter,
    closeCalorieFilter,
    // sortConfig,
    // SortableTableHeader,
    // SortableTableHeaderInverse,
    // SortableTableHeaderROI,
  };
};

