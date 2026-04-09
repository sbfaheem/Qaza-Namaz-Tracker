export const ISLAMIC_QUOTES = [
  "Allah loves consistency in good deeds. (Bukhari, Muslim)",
  "Every Qaza Namaz brings you closer to Allah and fulfills your obligation.",
  "Allah does not waste the reward of good deeds. (Quran 18:30)",
  "Small consistent deeds lead to big rewards in Akhirah.",
  "Allah is Most Merciful and appreciates your effort. (Quran 39:53)",
  "Consistency in Salah leads to success. (Quran 23:1-2)",
  "Allah rewards actions based on intentions. (Bukhari)",
  "Making up missed prayers is obedience to Allah and a path to forgiveness."
];

export const getRandomQuote = () => {
  return ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
};
