import { useEffect } from "react";
import styles from "./ShortcutsModal.module.css";

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal = ({ isOpen, onClose }: ShortcutsModalProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const shortcuts = [
    { key: "?", description: "Show this help menu" },
    { key: "Esc", description: "Close modals" },
    { key: "Alt + N", description: "Add new entry" },
    { key: "Alt + D", description: "Go to Dashboard" },
    { key: "Alt + A", description: "Go to Analytics" },
    { key: "Alt + S", description: "Go to Settings" },
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>⌨️ Keyboard Shortcuts</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>
        <div className={styles.content}>
          <div className={styles.grid}>
            {shortcuts.map((shortcut, index) => (
              <div key={index} className={styles.row}>
                <kbd className={styles.key}>{shortcut.key}</kbd>
                <span className={styles.description}>
                  {shortcut.description}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
