/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";

export function useTableFilters(defaultLimit: number = 10) {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(defaultLimit);
  const [search, setSearch] = useState("");
  const [active, setActive] = useState(null);

  const handleSearchChange = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleFilterChange = useCallback((key: string, val: any) => {
    if (key == "active") {
      setActive(val);
    }
    setPage(1);
  }, []);

  const handleLimitChange = useCallback((val: number) => {
    setLimit(val);
    setPage(1);
  }, []);

  return {
    params: {
      page,
      limit,
      search,
      active,
    },
    setPage,
    handleSearchChange,
    handleFilterChange,
    handleLimitChange,
  };
}
