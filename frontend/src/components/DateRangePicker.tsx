import { useState, useRef, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./DateRangePicker.module.css";
import { format } from "date-fns"; // Assuming date-fns might be available or I'll use native Intl

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

interface DateRangePickerProps {
  onChange: (start: Date, end: Date) => void;
  startDate?: Date;
  endDate?: Date;
}

export const DateRangePicker = ({
  onChange,
  startDate,
  endDate,
}: DateRangePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState<Value>([
    startDate || new Date(),
    endDate || new Date(),
  ]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (nextValue: Value) => {
    setValue(nextValue);
    if (Array.isArray(nextValue) && nextValue[0] && nextValue[1]) {
      onChange(nextValue[0], nextValue[1]);
      // Optional: close on selection if you want
      // setIsOpen(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <button
        className={styles.triggerButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.icon}>📅</span>
        <span className={styles.label}>
          {Array.isArray(value) && value[0] && value[1]
            ? `${formatDate(value[0])} - ${formatDate(value[1])}`
            : "Select Date Range"}
        </span>
      </button>

      {isOpen && (
        <div className={styles.calendarPopup}>
          <Calendar
            onChange={handleChange}
            value={value}
            selectRange={true}
            className="custom-calendar"
          />
        </div>
      )}
    </div>
  );
};
