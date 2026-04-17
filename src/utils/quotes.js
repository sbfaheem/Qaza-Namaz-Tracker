export const ISLAMIC_QUOTES = [
  {
    en: "Allah rewards actions based on intentions. (Bukhari: 1)",
    ur: "اعمال کا دارومدار نیتوں پر ہے۔ (بخاری: 1)"
  },
  {
    en: "Allah loves consistency in good deeds, even if they are small. (Bukhari: 6465)",
    ur: "اللہ کے نزدیک سب سے زیادہ پسندیدہ عمل وہ ہے جس پر ہمیشگی کی جائے، خواہ وہ تھوڑا ہی ہو۔ (بخاری: 6465)"
  },
  {
    en: "The first thing for which a person will be brought to account on the Day of Resurrection will be his Salah. (Tirmidhi: 413)",
    ur: "قیامت کے دن بندے کے اعمال میں سے سب سے پہلے جس چیز کا حساب لیا جائے گا وہ نماز ہے۔ (ترمذی: 413)"
  },
  {
    en: "Allah does not waste the reward of those who do good deeds. (Quran 18:30)",
    ur: "اللہ تعالیٰ نیک کام کرنے والوں کا اجر ضائع نہیں کرتا۔ (سورۃ الکہف: 30)"
  },
  {
    en: "Small consistent deeds lead to big rewards in Akhirah.",
    ur: "چھوٹے لیکن مستقل نیک اعمال آخرت میں بڑے اجر کا باعث بنتے ہیں۔"
  },
  {
    en: "Allah is Most Merciful and appreciates your effort. (Quran 39:53)",
    ur: "بے شک اللہ تعالیٰ بہت مہربان اور آپ کی کوشش کی قدر کرتا ہے۔ (سورۃ الزمر: 53)"
  },
  {
    en: "Consistency in Salah leads to success. (Quran 23:1-2)",
    ur: "نماز میں باقاعدگی کامیابی کی طرف لے جاتی ہے۔ (سورۃ المومنون: 1-2)"
  },
  {
    en: "Every Qaza Namaz brings you closer to Allah and fulfills your obligation.",
    ur: "ہر قضا نماز آپ کو اللہ کے قریب کرتی ہے اور آپ کا فرض پورا کرتی ہے۔"
  },
  {
    en: "Making up missed prayers is a path to forgiveness and soul purification.",
    ur: "چھوٹی ہوئی نمازوں کی ادائیگی مغفرت اور روح کی پاکیزگی کا راستہ ہے۔"
  }
];

export const getRandomQuote = (lang = 'en') => {
  const quoteObj = ISLAMIC_QUOTES[Math.floor(Math.random() * ISLAMIC_QUOTES.length)];
  return quoteObj[lang] || quoteObj['en'];
};
