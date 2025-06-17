import React from "react";
import AddLicense from "../screen/License/AddLicense";

interface ModalProps {
  isVisible: boolean;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-[60%]  overflow-auto">
        <button className="text-red-600 float-right text-2xl" onClick={onClose}>
          &times;
        </button>
        <div className="mt-4">
          <AddLicense />
        </div>
      </div>
    </div>
  );
};

export default Modal;
