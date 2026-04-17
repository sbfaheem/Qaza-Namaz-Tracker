import { jsPDF } from 'jspdf';

/**
 * Generate a Premium PDF report of the user's progress
 */
export const downloadQazaReport = (user, t, isRTL) => {
  const doc = new jsPDF();
  const { profile, stats, dailyLogs } = user;
  const today = new Date().toLocaleDateString(isRTL ? 'ur-PK' : 'en-GB', { day: '2-digit', month: 'long', year: 'numeric' });
  const primaryColor = [0, 75, 52]; // Islamic Green
  const accentGreen = [34, 197, 94];
  const accentRed = [239, 68, 68];
  const accentAmber = [245, 158, 11];
  const accentBlue = [59, 130, 246];

  // Helper for RTL alignment
  const getX = (x) => isRTL ? 210 - x : x;
  const align = isRTL ? 'right' : 'left';

  // --- Header Section ---
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text(t('progressReportTitle'), getX(20), 20, { align });

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(t('progressReportSub'), getX(20), 28, { align });
  doc.text(`${isRTL ? 'تاریخ درج' : 'Generated on'}: ${today}`, getX(150), 28, { align: isRTL ? 'left' : 'right' });

  // --- Summary Cards ---
  const cardWidth = 40;
  const cardHeight = 25;
  const cardY = 50;

  const drawCard = (x, title, value, color) => {
    const cardX = isRTL ? 210 - x - cardWidth : x;
    doc.setFillColor(249, 250, 251); // Light background
    doc.roundedRect(cardX, cardY, cardWidth, cardHeight, 3, 3, 'F');
    doc.setDrawColor(...color);
    doc.setLineWidth(0.5);
    doc.line(cardX, cardY + cardHeight, cardX + cardWidth, cardY + cardHeight); // color bottom border

    doc.setTextColor(110, 110, 110);
    doc.setFontSize(8);
    doc.text(title, isRTL ? cardX + cardWidth - 5 : cardX + 5, cardY + 8, { align });

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(value.toString(), isRTL ? cardX + cardWidth - 5 : cardX + 5, cardY + 18, { align });
  };

  const progressPercent = ((stats.completed / stats.total) * 100).toFixed(1);
  const now = new Date().toISOString().split('T')[0];
  const todayCount = dailyLogs.find(l => l.date === now)?.prayers.length || 0;

  drawCard(20, t('completed'), stats.completed.toLocaleString(), accentGreen);
  drawCard(65, t('remaining'), (stats.total - stats.completed).toLocaleString(), accentRed);
  drawCard(110, t('progress'), `${progressPercent}%`, accentAmber);
  drawCard(155, t('today'), todayCount.toString(), accentBlue);

  // --- Progress Bar ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(17, 24, 39);
  doc.text(t('overallJourney'), getX(20), 90, { align });

  doc.setFillColor(229, 231, 235);
  doc.roundedRect(20, 95, 170, 8, 4, 4, 'F');

  const fillWidth = (170 * (stats.completed / stats.total));
  doc.setFillColor(...accentGreen);
  if (isRTL) {
    doc.roundedRect(190 - fillWidth, 95, fillWidth, 8, 4, 4, 'F');
  } else {
    doc.roundedRect(20, 95, fillWidth, 8, 4, 4, 'F');
  }

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text(`${progressPercent}% ${t('completeTitle')}`, getX(190), 108, { align: isRTL ? 'left' : 'right' });

  // --- Namaz Breakdown Table ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(t('detailedBreakdown'), getX(20), 125, { align });

  // Table Header
  doc.setFillColor(243, 244, 246);
  doc.rect(20, 130, 170, 10, 'F');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  
  if (isRTL) {
    doc.text(t('colStatus'), getX(155), 136, { align });
    doc.text(t('colRemaining'), getX(110), 136, { align });
    doc.text(t('colCompleted'), getX(65), 136, { align });
    doc.text(t('colPrayer'), getX(25), 136, { align });
  } else {
    doc.text(t('colPrayer'), 25, 136);
    doc.text(t('colCompleted'), 65, 136);
    doc.text(t('colRemaining'), 110, 136);
    doc.text(t('colStatus'), 155, 136);
  }

  let yPos = 148;
  const getStatusText = (comp, tot) => {
    const ratio = comp / tot;
    if (ratio >= 0.9) return { label: t('statusNear'), color: accentGreen };
    if (ratio >= 0.4) return { label: t('statusModerate'), color: accentAmber };
    return { label: t('statusHigh'), color: accentRed };
  };

  doc.setTextColor(17, 24, 39);
  doc.setFont("helvetica", "normal");

  ['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'witr'].forEach((prayerKey) => {
    const p = stats.breakdown[prayerKey];
    const status = getStatusText(p.completed, p.total);

    doc.setDrawColor(243, 244, 246);
    doc.line(20, yPos + 2, 190, yPos + 2);

    if (isRTL) {
      doc.text(t(prayerKey), getX(25), yPos, { align });
      doc.text(p.completed.toLocaleString(), getX(65), yPos, { align });
      doc.text((p.total - p.completed).toLocaleString(), getX(110), yPos, { align });
      
      doc.setFillColor(...status.color);
      doc.roundedRect(getX(185), yPos - 4.5, 30, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text(status.label, getX(170), yPos - 0.5, { align: 'center' });
    } else {
      doc.text(t(prayerKey), 25, yPos);
      doc.text(p.completed.toLocaleString(), 65, yPos);
      doc.text((p.total - p.completed).toLocaleString(), 110, yPos);
      
      doc.setFillColor(...status.color);
      doc.roundedRect(155, yPos - 4.5, 30, 6, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(7);
      doc.text(status.label, 170, yPos - 0.5, { align: 'center' });
    }

    doc.setTextColor(17, 24, 39);
    doc.setFontSize(9);
    yPos += 12;
  });

  // --- Motivation Section ---
  doc.setFillColor(...primaryColor);
  doc.roundedRect(20, yPos + 10, 170, 25, 3, 3, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "italic");
  doc.setFontSize(isRTL ? 10 : 11);
  doc.text(t('motivationQuote'), 105, yPos + 22, { align: 'center' });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(t('motivationSub'), 105, yPos + 30, { align: 'center' });

  // --- Footer ---
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text('https://qaza-namaz-tracker-lovat.vercel.app/', 105, 285, { align: 'center' });
  doc.text(isRTL ? '© 2026 قضا نماز ٹریکر۔ اللہ آپ کو استقامت عطا فرمائے۔' : '© 2026 Qaza Namaz Tracker. May Allah grant you steadfastness.', 105, 290, { align: 'center' });

  doc.save(`Qaza_Report_${profile.name || 'User'}_${today.replace(/ /g, '_')}.pdf`);
};
