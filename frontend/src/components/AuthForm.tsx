import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import styles from './AuthForm.module.css';
import { Input } from './Input';
import { useTranslation } from 'react-i18next'; // Import useTranslation

interface AuthFormProps {
  isLogin: boolean;
}

interface JobInput {
  name: string;
  wagePerHour: number | string; // Allow string for input, convert to number for payload
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { t, i18n } = useTranslation(); // Initialize useTranslation
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [jobs, setJobs] = useState<JobInput[]>([{ name: '', wagePerHour: '' }]); // State for multiple jobs
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      const url = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(url, payload);
      return response;
    },
    onSuccess: ({ data }) => {
      setTokens(data.accessToken, data.user);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || (isLogin ? t('failedToLogin') : t('failedToRegister')));
    },
  });

  const handleJobChange = (index: number, field: keyof JobInput, value: string) => {
    const newJobs = [...jobs];
    newJobs[index] = { ...newJobs[index], [field]: value };
    setJobs(newJobs);
  };

  const handleAddJob = () => {
    setJobs([...jobs, { name: '', wagePerHour: '' }]);
  };

  const handleRemoveJob = (index: number) => {
    const newJobs = jobs.filter((_, i) => i !== index);
    setJobs(newJobs);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const payload: any = isLogin
      ? { email, password }
      : {
          name,
          email,
          password,
          jobs: jobs.map(job => ({
            name: job.name,
            wagePerHour: Number(job.wagePerHour),
          })),
        };
    mutation.mutate(payload);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.authFormContainer}>
      <div className={styles.languageSwitcherContainer}>
        <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language} className={styles.languageSwitcher}>
          <option value="en">English</option>
          <option value="vn">Tiếng Việt</option>
        </select>
      </div>
      <h2 className={styles.title}>{isLogin ? t('login') : t('register')}</h2>
      <p className={styles.description}>{t('authDescription')}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {!isLogin && (
          <>
            <Input
              id="name"
              label={t('name')}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {jobs.map((job, index) => (
              <div key={index} className={styles.jobInputGroup}>
                <Input
                  id={`jobName-${index}`}
                  label={`${t('jobName')} ${index + 1}`}
                  type="text"
                  value={job.name}
                  onChange={(e) => handleJobChange(index, 'name', e.target.value)}
                  required
                />
                <Input
                  id={`jobWagePerHour-${index}`}
                  label={`${t('jobWagePerHour')} ${index + 1}`}
                  type="number"
                  value={job.wagePerHour}
                  onChange={(e) => handleJobChange(index, 'wagePerHour', e.target.value)}
                  required
                />
                {jobs.length > 1 && (
                  <button type="button" onClick={() => handleRemoveJob(index)} className={styles.removeJobButton}>
                    {t('removeJob')}
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={handleAddJob} className={styles.addJobButton}>
              {t('addJob')}
            </button>
          </>
        )}
        <Input
          id="email"
          label={t('email')}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label={t('password')}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className={styles.button} disabled={mutation.isPending}>
          {mutation.isPending ? t('submitting') : (isLogin ? t('loginButton') : t('registerButton'))}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <button onClick={() => navigate(isLogin ? '/register' : '/login')} className={styles.switchButton}>
        {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
      </button>
    </div>
  );
};