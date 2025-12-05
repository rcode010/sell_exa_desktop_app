import { useEffect, useMemo, useState } from "react";
import { Seller } from "../types/seller";
import { useSellerStore } from "../stores/useSellerStore";

export const useSeller = () => {
  const [search, setSearch] = useState("");
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
