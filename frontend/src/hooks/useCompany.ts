import { useMemo, useState } from "react";
import { useSearch } from "./useSearch";
import { Company } from "../types/company";

export const useCompany = (companies: Company[]) => {
  const { search } = useSearch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  // Filter companies based on search
  const filteredCompanies = useMemo(() => {
    if (!search) return companies;

    const value = search.toLowerCase();
    return companies?.filter((company: Company) => {
      return company.name.toLowerCase().includes(value);
    });
  }, [search, companies]);

  return {
    filteredCompanies,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedCompany,
    setSelectedCompany,
  };
};
