import { useEffect, useMemo, useState } from "react";
import { useSearch } from "./useSearch";
import { useCompanyStore } from "../stores/useCompanyStore";
import { Company } from "../types/company";

export const useCompany = () => {
  const { search } = useSearch();
  const { getCompanies, companies } = useCompanyStore() as {
    getCompanies: () => void;
    companies: Company[];
  };
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  useEffect(() => {
    getCompanies();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
