import { useEffect, useMemo, useState } from "react";
import { useSearch } from "./useSearch";
import { Seller } from "../types/seller";
import { useSellerStore } from "../stores/useSellerStore";

export const useSeller = () => {
  const { search } = useSearch();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null);

  const { sellers, getAllSellers } = useSellerStore() as {
    sellers: Seller[];
    getAllSellers: () => void;
  };

  const filteredSellers = useMemo(() => {
    const value = search.toLowerCase();

    return sellers.filter((seller) => {
      return (
        seller.name.toLowerCase().includes(value) ||
        seller.phone.toLowerCase().includes(value)
      );
    });
  }, [search, sellers]);

  useEffect(() => {
    getAllSellers();
  }, [getAllSellers]);

  return {
    filteredSellers,
    isAddModalOpen,
    setIsAddModalOpen,
    isEditModalOpen,
    setIsEditModalOpen,
    selectedSeller,
    setSelectedSeller,
  };
};
