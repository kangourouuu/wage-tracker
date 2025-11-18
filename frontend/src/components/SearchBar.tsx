import { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchBar = ({ onSearch, placeholder = 'Search...' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        setQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounce);
  }, [query, onSearch]);

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className={styles.trigger}>
        🔍 Search (Ctrl+K)
      </button>
    );
  }

  return (
    <div className={styles.overlay} onClick={() => setIsOpen(false)}>
      <div className={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className={styles.input}
          autoFocus
        />
        {query && (
          <button onClick={() => setQuery('')} className={styles.clearButton}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
