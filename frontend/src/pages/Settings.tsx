import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { useTranslation } from 'react-i18next';
import styles from './Settings.module.css';

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { isDark, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'preferences' | 'data'>('profile');

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <header className={styles.header}>
          <button onClick={() => navigate('/dashboard')} className={styles.backButton}>
            ← {t('dashboard', 'Dashboard')}
          </button>
          <h1>{t('settings', 'Settings')}</h1>
        </header>

        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'preferences' ? styles.active : ''}`}
            onClick={() => setActiveTab('preferences')}
          >
            Preferences
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'data' ? styles.active : ''}`}
            onClick={() => setActiveTab('data')}
          >
            Data
          </button>
        </div>

        <div className={styles.content}>
          {activeTab === 'profile' && (
            <div className={styles.section}>
              <h2>Profile Information</h2>
              <div className={styles.field}>
                <label>Name</label>
                <input type="text" value={user?.name || ''} readOnly />
              </div>
              <div className={styles.field}>
                <label>Email</label>
                <input type="email" value={user?.email || ''} readOnly />
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className={styles.section}>
              <h2>Preferences</h2>

              <div className={styles.field}>
                <label>Theme</label>
                <button onClick={toggleTheme} className={styles.themeToggle}>
                  {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                </button>
              </div>

              <div className={styles.field}>
                <label>Language</label>
                <select value={i18n.language} onChange={(e) => changeLanguage(e.target.value)}>
                  <option value="en">English</option>
                  <option value="vn">Tiếng Việt</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className={styles.section}>
              <h2>Data Management</h2>
              <button className={styles.dangerButton} onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
