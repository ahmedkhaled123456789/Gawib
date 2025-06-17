import React from "react";
import { useDispatch } from "react-redux";
import { setLanguage } from "../Redux/slice/AppSettings";
import { t } from "i18next";

const CustomSelect = () => {
  const dispatch = useDispatch();

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setLanguage(e.target.value)); // Dispatch the selected language
  };

  return (
    <select onChange={handleLanguageChange} defaultValue="ar">
      <option value="ar">{t("arabic")}</option>
      <option value="en">{t("english")}</option>
    </select>
  );
};

export default CustomSelect;
