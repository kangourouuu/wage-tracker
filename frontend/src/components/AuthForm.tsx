import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';
import styles from './AuthForm.module.css';
import { Input } from './Input';
import { useTranslation } from 'react-i18next';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

interface AuthFormProps {
  isLogin: boolean;
}

const AuthForm3D: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { t, i18n } = useTranslation();
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
      setError(err.response?.data?.message || (isLogin ? t('failedToLogin') : t('failedToRegister')));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = isLogin
      ? { email, password }
      : {
          name,
          email,
          password,
          jobs: [{ name: 'Default Job', wagePerHour: Number(wagePerHour) }],
        };
    mutation.mutate(payload);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const groupRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.mouse.x * 0.1, 0.1);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, -state.mouse.y * 0.1, 0.1);
    }
  });

  return (
    <group ref={groupRef}>
      <Html center>
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
              <Input
                id="name"
                label={t('name')}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
            {!isLogin && (
              <Input
                id="wagePerHour"
                label={t('wagePerHour')}
                type="number"
                value={wagePerHour}
                onChange={(e) => setWagePerHour(e.target.value)}
                required
              />
            )}
            <button type="submit" className={styles.button} disabled={mutation.isPending}>
              {mutation.isPending ? t('submitting') : (isLogin ? t('loginButton') : t('registerButton'))}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
          <button onClick={() => navigate(isLogin ? '/register' : '/login')} className={styles.switchButton}>
            {isLogin ? t('dontHaveAccount') : t('alreadyHaveAccount')}
          </button>
        </div>
      </Html>
    </group>
  );
};

export const AuthForm: React.FC<AuthFormProps> = (props) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <AuthForm3D {...props} />
    </Canvas>
  );
};