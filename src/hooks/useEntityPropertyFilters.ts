"use client";

import { useCallback, useMemo, useState } from "react";
import {
  getFilterEntityOptions,
  getFilterPortfolioOptions,
  getFilterPropertyOptions,
} from "@/src/lib/leaseBackendData";

export const ENTITY_FILTER_PLACEHOLDER = "Select entity";
export const PROPERTY_FILTER_PLACEHOLDER = "Select property";

export function useEntityPropertyFilters(initialPortfolio = "Portfolio A") {
  const [selectedPortfolio, setSelectedPortfolio] = useState(initialPortfolio);
  const [selectedEntity, setSelectedEntity] = useState(ENTITY_FILTER_PLACEHOLDER);
  const [selectedProperty, setSelectedProperty] = useState(PROPERTY_FILTER_PLACEHOLDER);

  const portfolioOptions = useMemo(() => getFilterPortfolioOptions(), []);
  const entityOptions = useMemo(
    () => getFilterEntityOptions(selectedPortfolio),
    [selectedPortfolio],
  );
  const propertyOptions = useMemo(
    () =>
      selectedEntity === ENTITY_FILTER_PLACEHOLDER
        ? []
        : getFilterPropertyOptions(selectedPortfolio, selectedEntity),
    [selectedEntity, selectedPortfolio],
  );

  const isEntitySelected = selectedEntity !== ENTITY_FILTER_PLACEHOLDER;
  const isPropertySelected = selectedProperty !== PROPERTY_FILTER_PLACEHOLDER;

  const handlePortfolioChange = useCallback((value: string) => {
    setSelectedPortfolio(value);
    setSelectedEntity(ENTITY_FILTER_PLACEHOLDER);
    setSelectedProperty(PROPERTY_FILTER_PLACEHOLDER);
  }, []);

  const handleEntityChange = useCallback((value: string) => {
    setSelectedEntity(value);
    setSelectedProperty(PROPERTY_FILTER_PLACEHOLDER);
  }, []);

  const handlePropertyChange = useCallback((value: string) => {
    setSelectedProperty(value);
  }, []);

  return {
    selectedPortfolio,
    selectedEntity,
    selectedProperty,
    portfolioOptions,
    entityOptions,
    propertyOptions,
    isEntitySelected,
    isPropertySelected,
    handlePortfolioChange,
    handleEntityChange,
    handlePropertyChange,
  };
}
