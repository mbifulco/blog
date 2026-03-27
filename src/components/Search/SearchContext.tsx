import { createContext, useContext, useState, type Dispatch, type SetStateAction } from 'react';

type SearchContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

const SearchContext = createContext<SearchContextValue>({
  open: false,
  setOpen: () => undefined,
});

export const SearchProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <SearchContext.Provider value={{ open, setOpen }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext);
