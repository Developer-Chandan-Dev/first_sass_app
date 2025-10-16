'use client';

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useCallback,
} from 'react';

interface BreadcrumbOverride {
  path: string;
  label: string;
  description?: string;
}

interface BreadcrumbContextType {
  overrides: BreadcrumbOverride[];
  addOverride: (override: BreadcrumbOverride) => void;
  removeOverride: (path: string) => void;
  clearOverrides: () => void;
  getOverride: (path: string) => BreadcrumbOverride | undefined;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [overrides, setOverrides] = useState<BreadcrumbOverride[]>([]);

  const addOverride = useCallback((override: BreadcrumbOverride) => {
    setOverrides((prev) => {
      const filtered = prev.filter((o) => o.path !== override.path);
      return [...filtered, override];
    });
  }, []);

  const removeOverride = useCallback((path: string) => {
    setOverrides((prev) => prev.filter((o) => o.path !== path));
  }, []);

  const clearOverrides = useCallback(() => {
    setOverrides([]);
  }, []);

  const getOverride = useCallback(
    (path: string) => {
      return overrides.find((o) => o.path === path);
    },
    [overrides]
  );

  return (
    <BreadcrumbContext.Provider
      value={{
        overrides,
        addOverride,
        removeOverride,
        clearOverrides,
        getOverride,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error('useBreadcrumb must be used within a BreadcrumbProvider');
  }
  return context;
}

// Hook for setting page-specific breadcrumb overrides
export function useBreadcrumbOverride(
  path: string,
  label: string,
  description?: string
) {
  const { addOverride, removeOverride } = useBreadcrumb();

  const setOverride = useCallback(() => {
    addOverride({ path, label, description });
  }, [addOverride, path, label, description]);

  const clearOverride = useCallback(() => {
    removeOverride(path);
  }, [removeOverride, path]);

  return { setOverride, clearOverride };
}
