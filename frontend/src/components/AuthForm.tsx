import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import styles from "./AuthForm.module.css";
import { Input } from "./Input";
import { useTranslation } from "react-i18next";
import { useResponsive } from "../contexts/ResponsiveContext";
import { AuthForm2D } from "./AuthForm2D";

interface AuthFormProps {
  isLogin: boolean;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin }) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [jobs, setJobs] = React.useState([{ name: "", wagePerHour: "" }]); // State for multiple jobs
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();
  const { isMobile } = useResponsive();

  const handleAddJob = () => {
    setJobs([...jobs, { name: "", wagePerHour: "" }]);
  };

  const handleRemoveJob = (index: number) => {
    const newJobs = jobs.filter((_, i) => i !== index);
    setJobs(newJobs);
  };

  const handleJobChange = (
    index: number,
    field: "name" | "wagePerHour",
    value: string
  ) => {
    const newJobs = jobs.map((job, i) =>
      i === index ? { ...job, [field]: value } : job
    );
    setJobs(newJobs);
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => {
      const url = isLogin ? "/auth/login" : "/auth/register";
      return api.post(url, payload);
    },
    onSuccess: ({ data }) => {
      setTokens(data.accessToken, data.refreshToken, data.user);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message ||
          (isLogin ? t("failedToLogin") : t("failedToRegister"))
      );
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
          jobs: jobs.map((job) => ({
            name: job.name,
            wagePerHour: Number(job.wagePerHour),
          })),
        };
    mutation.mutate(payload);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  if (isMobile) {
    return <AuthForm2D isLogin={isLogin} />;
  }

  return (
    <div
      className={`${styles.formContainer} ${
        !isLogin ? styles.registerForm : ""
      }`}
    >
      <div className={styles.languageSwitcherContainer}>
        <select
          onChange={(e) => changeLanguage(e.target.value)}
          value={i18n.language}
          className={styles.languageSwitcher}
        >
          <option value="en">English</option>
          <option value="vn">Tiếng Việt</option>
        </select>
      </div>
      <h2 className={styles.title}>{isLogin ? t("login") : t("register")}</h2>
      <p className={styles.description}>{t("authDescription")}</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        {!isLogin && (
          <>
            <Input
              id="register-name"
              label={t("name")}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            {/* Inline validation example (can be expanded with real logic) */}
            {name.length > 0 && name.length < 2 && (
              <p className={styles.inlineError}>
                {t("nameTooShort", "Name must be at least 2 characters")}
              </p>
            )}
          </>
        )}
        <Input
          id={isLogin ? "login-email" : "register-email"}
          label={t("email")}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id={isLogin ? "login-password" : "register-password"}
          label={t("password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {isLogin && (
          <a
            href="#"
            className={styles.forgotPassword}
            onClick={(e) => e.preventDefault()}
          >
            {t("forgotPassword", "Forgot Password?")}
          </a>
        )}

        {!isLogin && (
          <div className={styles.jobsSection}>
            <h3>{t("yourJobs")}</h3>
            {jobs.map((job, index) => (
              <div key={index} className={styles.jobEntry}>
                <Input
                  id={`register-jobName-${index}`}
                  label={t("jobName")}
                  type="text"
                  value={job.name}
                  onChange={(e) =>
                    handleJobChange(index, "name", e.target.value)
                  }
                  required
                />
                <Input
                  id={`register-wagePerHour-${index}`}
                  label={t("wagePerHour")}
                  type="number"
                  value={job.wagePerHour}
                  onChange={(e) =>
            <button
              type="button"
              onClick={handleAddJob}
              className={styles.addJobButton}
            >
              {t("addJob")}
            </button>
          </div>
        )}
        <button
          type="submit"
          className={styles.submitButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? t("submitting")
            : isLogin
            ? t("loginButton")
            : t("registerButton")}
        </button>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.socialLogin}>
          <div className={styles.socialDivider}>
            <span>{t("orContinueWith", "Or continue with")}</span>
          </div>
          <div className={styles.socialButtons}>
            <button type="button" className={styles.socialButton}>
              <span className={styles.socialIcon}>G</span> Google
            </button>
            <button type="button" className={styles.socialButton}>
              <span className={styles.socialIcon}>f</span> Facebook
            </button>
          </div>
        </div>
      </form>
      <button
        onClick={() => navigate(isLogin ? "/register" : "/login")}
        className={styles.switchButton}
      >
        {isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}
      </button>
    </div>
  );
};
