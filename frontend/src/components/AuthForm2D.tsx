import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../services/api";
import { useAuthStore } from "../store/authStore";
import styles from "./AuthForm.module.css";
import { Input } from "./Input";
import { useTranslation } from "react-i18next";

interface AuthForm2DProps {
  isLogin: boolean;
}

export const AuthForm2D: React.FC<AuthForm2DProps> = (props) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [jobs, setJobs] = useState([{ name: "", wagePerHour: "" }]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setTokens } = useAuthStore();

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
      const url = props.isLogin ? "/auth/login" : "/auth/register";
      return api.post(url, payload);
    },
    onSuccess: ({ data }) => {
      setTokens(data.accessToken, data.refreshToken, data.user);
      navigate("/dashboard");
    },
    onError: (err: any) => {
      setError(
        err.response?.data?.message ||
          (props.isLogin ? t("failedToLogin") : t("failedToRegister"))
      );
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const payload = props.isLogin
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

  return (
    <div
      className={`${styles.formContainer} ${
        !props.isLogin ? styles.registerForm : ""
      }`}
    >
      <div className={styles.formContent}>
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

        <div className={styles.form}>
          <h2 className={styles.title}>
            {props.isLogin ? t("login") : t("register")}
          </h2>
          <p className={styles.description}>{t("authDescription")}</p>
          <form onSubmit={handleSubmit}>
            {!props.isLogin && (
              <Input
                id="register-name-2d"
                label={t("name")}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}
            <Input
              id={props.isLogin ? "login-email-2d" : "register-email-2d"}
              label={t("email")}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id={props.isLogin ? "login-password-2d" : "register-password-2d"}
              label={t("password")}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {!props.isLogin && (
              <div className={styles.jobsSection}>
                <h3>{t("yourJobs")}</h3>
                {jobs.map((job, index) => (
                  <div key={index} className={styles.jobEntry}>
                    <Input
                      id={`register-jobName-2d-${index}`}
                      label={t("jobName")}
                      type="text"
                      value={job.name}
                      onChange={(e) =>
                        handleJobChange(index, "name", e.target.value)
                      }
                      required
                    />
                    <Input
                      id={`register-wagePerHour-2d-${index}`}
                      label={t("wagePerHour")}
                      type="number"
                      value={job.wagePerHour}
                      onChange={(e) =>
                        handleJobChange(index, "wagePerHour", e.target.value)
                      }
                      required
                    />
                    {jobs.length > 2 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveJob(index)}
                        className={styles.removeJobButton}
                      >
                        <span className={styles.removeJobSymbol}>-</span>
                      </button>
                    )}
                  </div>
                ))}
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
                : props.isLogin
                ? t("loginButton")
                : t("registerButton")}
            </button>
            {error && <p className={styles.error}>{error}</p>}
          </form>
          <button
            onClick={() => navigate(props.isLogin ? "/register" : "/login")}
            className={styles.switchButton}
          >
            {props.isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}
          </button>
        </div>
      </div>
    </div>
  );
};
