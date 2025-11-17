import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/Calendar.css";
import styles from "./Dashboard.module.css";
import SummaryCard from "../components/SummaryCard";
import { DarkModeToggle } from "../shared/components/ui";

// Mock data for demonstration
const mockWorkEntries = [
  { id: "1", startTime: new Date(2025, 10, 15), endTime: new Date(2025, 10, 15), breakDuration: 0 },
  { id: "2", startTime: new Date(2025, 10, 18), endTime: new Date(2025, 10, 18), breakDuration: 0 },
  { id: "3", startTime: new Date(2025, 10, 20), endTime: new Date(2025, 10, 20), breakDuration: 0 },
  { id: "4", startTime: new Date(2025, 10, 22), endTime: new Date(2025, 10, 22), breakDuration: 0 },
  { id: "5", startTime: new Date(2025, 10, 25), endTime: new Date(2025, 10, 25), breakDuration: 0 },
];

export const DashboardDemo = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  // Get dates with work entries
  const getDatesWithEntries = () => {
    const dates = new Set<string>();
    mockWorkEntries.forEach((entry) => {
      const date = new Date(entry.startTime);
      const dateString = date.toDateString();
      dates.add(dateString);
    });
    return dates;
  };

  const datesWithEntries = getDatesWithEntries();

  // Function to add dots to calendar tiles
  const tileContent = ({ date }: { date: Date }) => {
    const dateString = date.toDateString();
    if (datesWithEntries.has(dateString)) {
      return <div className={styles.calendarDot}></div>;
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className={styles.pageWrapper}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <nav className={styles.sidebarNav}>
          <button 
            className={`${styles.sidebarTab} ${styles.active}`}
            onClick={() => {}}
          >
            <span className={styles.sidebarIcon}>📊</span>
            <span className={styles.sidebarLabel}>Dashboard</span>
          </button>
          <button 
            className={styles.sidebarTab}
            onClick={() => navigate('/analytics-demo')}
          >
            <span className={styles.sidebarIcon}>📈</span>
            <span className={styles.sidebarLabel}>Analytics</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.dashboardContainer}>
          <header className={styles.header}>
            <div className={styles.welcomeSection}>
              <h1 className={styles.welcomeTitle}>
                Welcome, Demo User! 👋
              </h1>
            </div>
            <div className={styles.headerActions}>
              <DarkModeToggle />
              <button 
                onClick={() => navigate('/login')} 
                className={styles.logoutButton}
              >
                Login
              </button>
            </div>
          </header>

          <div className={styles.mainContent}>
            <div className={styles.centerColumn}>
              <div className={styles.calendarWrapper}>
                <Calendar
                  onChange={(value) => {
                    if (Array.isArray(value)) {
                      handleDateClick(value[0] as Date);
                    } else {
                      handleDateClick(value as Date);
                    }
                  }}
                  value={selectedDate}
                  onClickDay={handleDateClick}
                  tileContent={tileContent}
                  locale="en-US"
                />
              </div>
              
              <div className={styles.summaryCardsContainer}>
                <SummaryCard title="Total Hours" value="44.00" />
                <SummaryCard title="Estimated Earnings" value="2200.00" />
              </div>
            </div>
          </div>

          <div className={styles.listsContainer}>
            <div className={styles.listWrapper}>
              <div style={{ 
                padding: '2rem', 
                textAlign: 'center', 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '1rem',
                backdropFilter: 'blur(10px)'
              }}>
                <h3>Jobs List</h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '1rem' }}>
                  • Click on calendar dates with dots to view/edit/delete work entries<br/>
                  • Summary cards are now displayed below the calendar<br/>
                  • WorkEntryList component has been removed
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
