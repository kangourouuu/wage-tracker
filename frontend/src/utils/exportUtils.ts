import type { WorkEntry } from '../types/work-entry';

export const exportToCSV = (data: WorkEntry[], filename: string = 'work-entries.csv') => {
  const headers = ['Date', 'Job', 'Start Time', 'End Time', 'Hours', 'Wage/Hour', 'Total Earnings'];

  const rows = data.map(entry => {
    const start = new Date(entry.startTime);
    const end = new Date(entry.endTime);
    const durationMs = end.getTime() - start.getTime();
    const breakMs = entry.breakDuration * 60 * 1000;
    const hours = (durationMs - breakMs) / (1000 * 60 * 60);
    const wagePerHour = Number(entry.job.wagePerHour) || 0;
    const earnings = hours * wagePerHour;

    return [
      start.toLocaleDateString(),
      entry.job.name,
      start.toLocaleTimeString(),
      end.toLocaleTimeString(),
      hours.toFixed(2),
      wagePerHour.toFixed(2),
      earnings.toFixed(2)
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
