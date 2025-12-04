import React from "react";

const StatsCard = ({
  statsTitle,
  statsValue,
}: {
  statsTitle: string;
  statsValue: number;
}) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <p className="text-gray-500 text-sm font-medium">{statsTitle}</p>
      <h3 className="text-3xl font-semibold mt-2 text-gray-900">
        {statsValue}
      </h3>
    </div>
  );
};

export default StatsCard;
