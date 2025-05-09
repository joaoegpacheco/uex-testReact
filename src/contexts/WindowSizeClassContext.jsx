import { createContext, useContext, useEffect } from 'react';
import { useWindowSizeClass } from '../hooks/useWindowSizeClass';

const WindowSizeClassContext = createContext('expanded');

export const WindowSizeClassProvider = ({ children }) => {
  const sizeClass = useWindowSizeClass();

  useEffect(() => {
    document.body.classList.remove('compact', 'medium', 'expanded');
    document.body.classList.add(sizeClass);
  }, [sizeClass]);

  return (
    <WindowSizeClassContext.Provider value={sizeClass}>
      {children}
    </WindowSizeClassContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSizeClass = () => useContext(WindowSizeClassContext);
