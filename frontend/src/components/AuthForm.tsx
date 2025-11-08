import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import styles from './AuthForm.module.css';
import { Input } from './Input';

interface AuthFormProps {
  isLogin: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [wagePerHour, setWagePerHour] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

  const mutation = useMutation({
    mutationFn: (payload: any) => {
      const url = isLogin ? '/auth/login' : '/auth/register';
      return api.post(url, payload);
    },
    onSuccess: ({ data }) => {
      setTokens(data.accessToken, data.user);
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message || 'An error occurred.');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = isLogin
      ? { email, password }
      : { name, email, password, wagePerHour: Number(wagePerHour) };
    mutation.mutate(payload);
  };

  return (
    <div className={styles.authFormContainer}>
      <h2 className={styles.title}>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {!isLogin && (
          <Input
            id="name"
            label="Name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <Input
          id="email"
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {!isLogin && (
          <Input
            id="wagePerHour"
            label="Wage Per Hour"
            type="number"
            value={wagePerHour}
            onChange={(e) => setWagePerHour(e.target.value)}
            required
          />
        )}
        <button type="submit" className={styles.button} disabled={mutation.isPending}>
          {mutation.isPending ? 'Submitting...' : (isLogin ? 'Login' : 'Register')}
        </button>
        {error && <p className={styles.error}>{error}</p>}
      </form>
      <button onClick={() => navigate(isLogin ? '/register' : '/login')} className={styles.switchButton}>
        {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
      </button>
    </div>
  );
};