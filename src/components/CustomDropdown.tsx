import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const CustomDropdown = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative w-1/2 border rounded-md  border-[#085E9C]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-right flex justify-between items-center focus:outline-none"
      >
        <span className="ml-2 text-gray-500">ترتيب حسب :</span>
        <span>{selected || "الأحدث "}</span>
        <FiChevronDown />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                selected === option.value ? "bg-gray-100" : ""
              }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;