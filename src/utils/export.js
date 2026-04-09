import { jsPDF } from 'jspdf';

/**
 * Generate a PDF report of the user's progress
 */
export const downloadQazaReport = (user) => {
  const doc = new jsPDF();
  const { profile, stats } = user;
  const today = new Date().toLocaleDateString();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 75, 52); // Islamic Green
  doc.text('Al-Mihrab Qaza Tracker Report', 20, 30);

  doc.setFontSize(12);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${today}`, 20, 40);

  // Profile Info
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('User Profile', 20, 55);

  doc.setFontSize(12);
  doc.text(`Name: ${profile.name || 'Anonymous'}`, 20, 65);
  doc.text(`Gender: ${profile.gender}`, 20, 75);
  doc.text(`Balaghat Year: ${profile.balaghatYear}`, 20, 85);
  doc.text(`Regular Prayer Started: ${profile.startYear}`, 20, 95);
  doc.text(`Qaza Period: ${profile.qazaYears} years`, 20, 105);

  // Statistics
  doc.setFontSize(16);
  doc.text('Prayer Statistics', 20, 120);

  doc.setFontSize(12);
  doc.text(`Total Qaza Debt: ${stats.total.toLocaleString()}`, 20, 130);
  doc.text(`Total Completed: ${stats.completed.toLocaleString()}`, 20, 140);
  doc.text(`Total Remaining: ${(stats.total - stats.completed).toLocaleString()}`, 20, 150);
  doc.text(`Progress: ${((stats.completed / stats.total) * 100).toFixed(2)}%`, 20, 160);

  // Detailed Breakdown
  doc.setFontSize(16);
  doc.text('Namaz Breakdown', 20, 175);

  let yPos = 185;
  Object.keys(stats.breakdown).forEach((prayer) => {
    const p = stats.breakdown[prayer];
    doc.setFontSize(12);
    doc.text(`${prayer.charAt(0).toUpperCase() + prayer.slice(1)}: ${p.completed.toLocaleString()} / ${p.total.toLocaleString()}`, 20, yPos);
    yPos += 10;
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text('May Allah accept your efforts and grant you steadfastness.', 20, 280);

  doc.save(`Qaza_Report_${profile.name || 'User'}.pdf`);
};
