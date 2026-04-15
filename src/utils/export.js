import { jsPDF } from 'jspdf';

/**
 * Generate a Premium PDF report of the user's progress
 */
export const downloadQazaReport = (user) => {
  const doc = new jsPDF();
  const { profile, stats, dailyLogs } = user;
  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const primaryColor = [0, 75, 52]; // Islamic Green
  const accentGreen = [34, 197, 94];
  const accentRed = [239, 68, 68];
  const accentAmber = [245, 158, 11];
  const accentBlue = [59, 130, 246];

  // --- Header Section ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(24);
  doc.setFont("helvetica", "bold");
  doc.text('Qaza Namaz Progress Report', 20, 20);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text('Track your journey towards consistency', 20, 28);
  doc.text(`Generated on: ${today}`, 150, 28);

  // --- Summary Cards ---
  const cardWidth = 40;
  const cardHeight = 25;
  const cardY = 50;

  const drawCard = (x, title, value, color) => {
    doc.setFillColor(249, 250, 251); // Light background
    doc.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(x, cardY + cardHeight, x + cardWidth, cardY + cardHeight); // color bottom border
    
    doc.setTextColor(110, 110, 110);
    doc.setFontSize(8);
    doc.text(title, x + 5, cardY + 8);
    
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(value.toString(), x + 5, cardY + 18);
  };

  const progressPercent = ((stats.completed / stats.total) * 100).toFixed(1);
  const now = new Date().toISOString().split('T')[0];
  const todayCount = dailyLogs.find(l => l.date === now)?.prayers.length || 0;

  drawCard(20, 'COMPLETED', stats.completed.toLocaleString(), accentGreen);
  drawCard(65, 'REMAINING', (stats.total - stats.completed).toLocaleString(), accentRed);
  drawCard(110, 'PROGRESS', `${progressPercent}%`, accentAmber);
  drawCard(155, 'TODAY', todayCount.toString(), accentBlue);

  // --- Progress Bar ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text('Overall Progress', 20, 90);
  
  doc.setFillColor(229, 231, 235);
  doc.roundedRect(20, 95, 170, 8, 4, 4, 'F');
  
  const fillWidth = (170 * (stats.completed / stats.total));
  doc.setFillColor(...accentGreen);
  doc.roundedRect(20, 95, fillWidth, 8, 4, 4, 'F');
  
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${progressPercent}% Complete`, 175, 108, { align: 'right' });

  // --- Namaz Breakdown Table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text('Detailed Prayer Breakdown', 20, 125);

  // Table Header
  doc.setFillColor(243, 244, 246);
  doc.rect(20, 130, 170, 10, 'F');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('PRAYER', 25, 136);
  doc.text('COMPLETED', 65, 136);
  doc.text('REMAINING', 110, 136);
  doc.text('STATUS', 155, 136);

  let yPos = 148;
  // Status check helper for PDF
  const getStatusText = (comp, tot) => {
    const ratio = comp / tot;
    if (ratio >= 0.9) return { label: 'Near Completion', color: accentGreen };
    if (ratio >= 0.4) return { label: 'Moderate', color: accentAmber };
    return { label: 'High Remaining', color: accentRed };
  };

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");
  
  Object.keys(stats.breakdown).forEach((prayer) => {
    const p = stats.breakdown[prayer];
    const status = getStatusText(p.completed, p.total);
    
    // Row line
    doc.setDrawColor(243, 244, 246);
    doc.line(20, yPos + 2, 190, yPos + 2);
    
    doc.text(prayer.charAt(0).toUpperCase() + prayer.slice(1), 25, yPos);
    doc.text(p.completed.toLocaleString(), 65, yPos);
    doc.text((p.total - p.completed).toLocaleString(), 110, yPos);
    
    // Status Badge background
    doc.setFillColor(...status.color);
    doc.roundedRect(155, yPos - 4.5, 30, 6, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.text(status.label, 170, yPos - 0.5, { align: 'center' });
    
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(9);
    yPos += 12;
  });

  // --- Motivation Section ---
  doc.setFillColor(...primaryColor);
  doc.roundedRect(20, yPos + 10, 170, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(11);
  doc.text('"Allah loves consistency in good deeds, even if they are small."', 105, yPos + 22, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text('Keep lifting the weights from your soul. Stay steadfast.', 105, yPos + 30, { align: 'center' });

  // --- Footer ---
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('https://qaza-namaz-tracker-lovat.vercel.app/', 105, 285, { align: 'center' });
  doc.text('© 2026 Qaza Namaz Tracker. May Allah grant you steadfastness.', 105, 290, { align: 'center' });

  doc.save(`Qaza_Report_${profile.name || 'User'}_${today.replace(/ /g, '_')}.pdf`);
};
