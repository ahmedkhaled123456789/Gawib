 import React from "react";

interface ModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const CustomModal: React.FC<ModalProps> = ({ isOpen, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="flex items-center justify-center  rounded-lg  w-full max-w-4xl p-6 relative">
        
        {children}
      </div>
    </div>
  );
};

export default CustomModal;
