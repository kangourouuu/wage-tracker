import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import styles from "./LanguageSwitcher.module.css";

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: "en", label: "English", flag: "🇺🇸" },
    { code: "vn", label: "Tiếng Việt", flag: "🇻🇳" },
  ];

  const currentLanguage =
    languages.find((lang) => lang.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (code: string) => {
    i18n.changeLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={dropdownRef}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        type="button"
      >
        <span className={styles.flag}>{currentLanguage.flag}</span>
        <span className={styles.label}>{currentLanguage.label}</span>
        <span className={`${styles.arrow} ${isOpen ? styles.up : ""}`}>▼</span>
      </button>

      {isOpen && (
        <ul className={styles.dropdown} role="listbox">
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`${styles.option} ${
                lang.code === currentLanguage.code ? styles.selected : ""
              }`}
              onClick={() => handleLanguageChange(lang.code)}
              role="option"
              aria-selected={lang.code === currentLanguage.code}
            >
              <span className={styles.flag}>{lang.flag}</span>
              <span className={styles.labelText}>{lang.label}</span>
              {lang.code === currentLanguage.code && (
                <span className={styles.check}>✓</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
