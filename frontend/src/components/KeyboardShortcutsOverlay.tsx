import { useEffect, useState } from 'react';
import styles from './KeyboardShortcutsOverlay.module.css';

const shortcuts = [
  { key: '?', description: 'Show keyboard shortcuts' },
  { key: 'N', description: 'Add new work entry' },
  { key: '/', description: 'Open AI assistant' },
  { key: 'Esc', description: 'Close modal/overlay' },
  { key: 'Ctrl + S', description: 'Save current form' },
  { key: 'Ctrl + K', description: 'Quick search' },
];

export const KeyboardShortcutsOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Keyboard Shortcuts</h2>
          <button onClick={() => setIsOpen(false)} className={styles.closeBtn}>✕</button>
        </div>
        <div className={styles.shortcuts}>
          {shortcuts.map((shortcut, index) => (
            <div key={index} className={styles.shortcut}>
              <kbd className={styles.key}>{shortcut.key}</kbd>
              <span className={styles.description}>{shortcut.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
