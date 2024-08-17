// Spinner.tsx
import React from "react";
import { Oval } from "react-loader-spinner";

interface SpinnerProps {
  isLoading: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Oval
        height={60}
        width={60}
        color="#ffffff"
        secondaryColor="#4fa94d"
        strokeWidth={4}
        strokeWidthSecondary={4}
        ariaLabel="loading"
      />
    </div>
  );
};

export default Spinner;
