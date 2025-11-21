import React from "react";
import styles from "./SegmentedControl.module.css";

interface Option {
  value: string;
  label: string;
}

interface SegmentedControlProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SegmentedControl: React.FC<SegmentedControlProps> = ({
  options,
  value,
  onChange,
  className = "",
}) => {
  return (
    <div className={`${styles.container} ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.segment} ${
            value === option.value ? styles.active : ""
          }`}
          onClick={() => onChange(option.value)}
          type="button"
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
