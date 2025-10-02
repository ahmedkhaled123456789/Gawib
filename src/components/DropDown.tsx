import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

const Dropdown = ({ options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (value) => {
    onChange(value);
    setIsOpen(false);
  };

  return (
    <div className="relative  border rounded-md  border-[#085E9C]">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-right flex justify-between items-center focus:outline-none"
      >
        <span>{selected || "كل الحالات"}</span>
        <FiChevronDown />
      </button>

     {isOpen && (
  <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-96 overflow-y-auto">
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

export default Dropdown;