import toast from 'react-hot-toast';
import { getErrorMessage } from './error.utils';

export const showSuccessToast = (message: string) => {
  return toast.success(message, {
    duration: 3000,
    position: 'bottom-right',
    style: {
      background: 'var(--glass-bg)',
      color: 'var(--text-color)',
      backdropFilter: 'var(--glass-backdrop-filter)',
      border: '1px solid var(--glass-border)',
    },
  });
};

export const showErrorToast = (error: any) => {
  const message = getErrorMessage(error);
  return toast.error(message, {
    duration: 4000,
    position: 'bottom-right',
    style: {
      background: 'var(--glass-bg)',
      color: 'var(--text-color)',
      backdropFilter: 'var(--glass-backdrop-filter)',
      border: '1px solid var(--error-color)',
    },
  });
};

export const showLoadingToast = (message: string) => {
  return toast.loading(message, {
    position: 'bottom-right',
    style: {
      background: 'var(--glass-bg)',
      color: 'var(--text-color)',
      backdropFilter: 'var(--glass-backdrop-filter)',
      border: '1px solid var(--glass-border)',
    },
  });
};

export const showInfoToast = (message: string) => {
  return toast(message, {
    duration: 3500,
    position: 'bottom-right',
    icon: 'ℹ️',
    style: {
      background: 'var(--glass-bg)',
      color: 'var(--text-color)',
      backdropFilter: 'var(--glass-backdrop-filter)',
      border: '1px solid var(--glass-border)',
    },
  });
};
