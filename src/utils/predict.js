export const calculateETA = (user) => {
  const { stats, dailyLogs } = user;
  const remaining = stats.total - stats.completed;
  if (remaining <= 0) return { isComplete: true, text: "Alhamdulillah, Completed!" };

  let avgPerDay = 5; 
  let avgPhrase = "Assuming 5/day";

  if (dailyLogs && dailyLogs.length > 0) {
    let totalLoggedRecently = 0;
    // Look at up to the last 14 logs (active days)
    const recentLogs = dailyLogs.slice(-14);
    recentLogs.forEach(log => {
      totalLoggedRecently += log.prayers.length;
    });
    
    // Calculate calendar days between first log in that window and today
    const firstDate = new Date(recentLogs[0].date);
    const today = new Date();
    today.setHours(0,0,0,0);
    firstDate.setHours(0,0,0,0);
    
    const msDiff = Math.abs(today - firstDate);
    // +1 to include both start and end dates
    const daysDiff = Math.max(1, Math.ceil(msDiff / (1000 * 60 * 60 * 24)) + 1);
    
    const calcAvg = totalLoggedRecently / daysDiff;
    // Only use calculated average if it's a realistic number > 0.1 to avoid infinite days
    if (calcAvg > 0.1) { 
       avgPerDay = calcAvg;
       avgPhrase = `Based on your avg ${avgPerDay.toFixed(1)}/day`;
    }
  }

  // Calculate remaining days
  const remainingDaysTotal = Math.ceil(remaining / avgPerDay);
  
  // Format into Years, Months, Days
  const years = Math.floor(remainingDaysTotal / 365.25);
  const remainingAfterYears = Math.floor(remainingDaysTotal % 365.25);
  const months = Math.floor(remainingAfterYears / 30.44);
  const days = Math.floor(remainingAfterYears % 30.44);

  let timeComponents = [];
  if (years > 0) timeComponents.push(`${years} ${years === 1 ? 'Year' : 'Years'}`);
  if (months > 0) timeComponents.push(`${months} ${months === 1 ? 'Mth' : 'Mths'}`);
  if (days > 0 || timeComponents.length === 0) timeComponents.push(`${days} ${days === 1 ? 'Day' : 'Days'}`);

  // Calculate future completion date
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + remainingDaysTotal);
  const dateStr = futureDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

  return {
     isComplete: false,
     dateStr,
     timeStr: timeComponents.join(', '),
     avgPhrase,
     rawDays: remainingDaysTotal
  };
};
