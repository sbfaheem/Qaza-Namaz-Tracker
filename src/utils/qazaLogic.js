/**
 * Calculation logic for Qaza Namaz
 */

export const GENDER = {
  MALE: 'male',
  FEMALE: 'female'
};

export const BALAGHAT_AGE = {
  [GENDER.MALE]: 12,
  [GENDER.FEMALE]: 9
};

export const PRAYERS = ['fajr', 'zuhr', 'asr', 'maghrib', 'isha', 'witr'];

/**
 * Calculate the year of maturity (Balaghat)
 */
export const calculateBalaghatYear = (dob, gender) => {
  const birthYear = new Date(dob).getFullYear();
  return birthYear + (gender === GENDER.MALE ? BALAGHAT_AGE[GENDER.MALE] : BALAGHAT_AGE[GENDER.FEMALE]);
};

/**
 * Calculate the period of missed prayers in years
 */
export const calculateQazaPeriod = (startYear, balaghatYear) => {
  return Math.max(0, startYear - balaghatYear);
};

/**
 * Calculate total missed prayers
 */
export const calculateTotalPrayers = (qazaYears) => {
  const daysInYear = 365;
  const prayersPerDay = 6;
  const total = qazaYears * daysInYear * prayersPerDay;
  
  return {
    total,
    fajr: qazaYears * daysInYear,
    zuhr: qazaYears * daysInYear,
    asr: qazaYears * daysInYear,
    maghrib: qazaYears * daysInYear,
    isha: qazaYears * daysInYear,
    witr: qazaYears * daysInYear
  };
};

/**
 * Helper to get default state for a new user
 */
export const getDefaultUserState = (config) => {
  const { name, dob, gender, startYear } = config;
  const balaghatYear = calculateBalaghatYear(dob, gender);
  const qazaYears = calculateQazaPeriod(startYear, balaghatYear);
  const breakdown = calculateTotalPrayers(qazaYears);

  return {
    id: crypto.randomUUID(),
    profile: {
      name,
      dob,
      gender,
      startYear,
      balaghatYear,
      qazaYears
    },
    stats: {
      total: breakdown.total,
      completed: 0,
      breakdown: {
        fajr: { total: breakdown.fajr, completed: 0 },
        zuhr: { total: breakdown.zuhr, completed: 0 },
        asr: { total: breakdown.asr, completed: 0 },
        maghrib: { total: breakdown.maghrib, completed: 0 },
        isha: { total: breakdown.isha, completed: 0 },
        witr: { total: breakdown.witr, completed: 0 }
      }
    },
    dailyLogs: [] // { date: 'YYYY-MM-DD', prayers: ['fajr', ...] }
  };
};
