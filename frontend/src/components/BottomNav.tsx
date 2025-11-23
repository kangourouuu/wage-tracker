import { NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HomeIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { useState, useEffect, useRef } from "react";
import styles from "./BottomNav.module.css";

export const BottomNav = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const navRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { path: "/dashboard", icon: HomeIcon, label: t("nav.home") },
    { path: "/clock", icon: ClockIcon, label: "Clock" },
    { path: "/analytics", icon: ChartBarIcon, label: t("nav.analytics") },
    { path: "/settings", icon: Cog6ToothIcon, label: t("nav.settings") },
  ];

  useEffect(() => {
    const index = navItems.findIndex((item) => item.path === location.pathname);
    if (index !== -1) {
      setActiveIndex(index);
    }
  }, [location.pathname]);

  return (
    <nav className={styles.navContainer} ref={navRef}>
      {/* Animated Background */}
      <div
        className={styles.activeBackground}
        style={{
            transform: `translateX(${activeIndex * 68}px)` // 60px width + 8px gap
        }}
      />

      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `${styles.navItem} ${isActive ? styles.active : ""}`
          }
        >
          <item.icon className={styles.icon} />
          <span className={styles.label}>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

