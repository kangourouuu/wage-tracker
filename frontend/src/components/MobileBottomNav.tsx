import { useNavigate, useLocation } from 'react-router-dom';
import { useAiAssistantStore } from '../features/ai-assistant/store/aiAssistantStore';
import styles from './MobileBottomNav.module.css';

export const MobileBottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggle: toggleAssistant } = useAiAssistantStore();

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/analytics', icon: '📊', label: 'Analytics' },
    { action: toggleAssistant, icon: '💬', label: 'Assistant' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  const handleClick = (item: typeof navItems[0]) => {
    if (item.action) {
      item.action();
    } else if (item.path) {
      navigate(item.path);
    }
  };

  return (
    <nav className={styles.bottomNav} role="navigation" aria-label="Mobile navigation">
      {navItems.map((item, index) => (
        <button
          key={index}
          onClick={() => handleClick(item)}
          className={`${styles.navItem} ${
            item.path && location.pathname === item.path ? styles.active : ''
          }`}
          aria-label={item.label}
          aria-current={item.path && location.pathname === item.path ? 'page' : undefined}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  );
};
