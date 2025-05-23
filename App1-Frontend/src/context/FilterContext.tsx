import React, { createContext, useState, type ReactNode, useContext } from "react";

type Filter = {
    minPrice: number | undefined,
    maxPrice: number | undefined,
    sortBy: string | undefined,
};

type FilterContextType = {
    filter: Filter | null;
    setFilter: (filter: Filter | null) => void;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [filter, setFilter] = useState<Filter | null>(null);

    return (
        <FilterContext.Provider value={{ filter, setFilter }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilter = (): FilterContextType => {
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("useFilter must be used within a FilterProvider");
    }
    return context;
};
