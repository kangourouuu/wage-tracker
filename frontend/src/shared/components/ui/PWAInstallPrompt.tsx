import { useEffect, useState } from 'react';
import styles from './PWAInstallPrompt.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Show the prompt after a delay (3 seconds)
      setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    
    // Don't show again for this session
    sessionStorage.setItem('pwa-prompt-dismissed', 'true');
  };

  // Don't show if already dismissed or not available
  if (!showPrompt || !deferredPrompt || sessionStorage.getItem('pwa-prompt-dismissed')) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.prompt}>
        <button className={styles.closeBtn} onClick={handleDismiss} aria-label="Dismiss">
          ✕
        </button>
        <div className={styles.content}>
          <div className={styles.icon}>📱</div>
          <div className={styles.text}>
            <h3 className={styles.title}>Install Wage Tracker</h3>
            <p className={styles.description}>
              Install our app for a better experience and offline access
            </p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.dismissBtn} onClick={handleDismiss}>
            Not Now
          </button>
          <button className={styles.installBtn} onClick={handleInstall}>
            Install
          </button>
        </div>
      </div>
    </div>
  );
};
