import { createContext, useContext } from "react";
import { searchStore, type SearchStore } from "../stores/Search.store";

const SearchContext = createContext<SearchStore>(searchStore);

export const useSearchStore = () => useContext(SearchContext);

const SearchStoreProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <SearchContext.Provider value={searchStore}>
            {children}
        </SearchContext.Provider>
    );
};

export default SearchStoreProvider;