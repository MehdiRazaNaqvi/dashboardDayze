// daysToNextBirthday.js

export const daysToNextBirthday = (birthday) => {
    const today = new Date();
    const birthdate = new Date(birthday);
    const nextBirthday = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
  
    if (today > nextBirthday) {
      nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
  
    const msPerDay = 1000 * 60 * 60 * 24;
    const daysToNextBday = Math.ceil((nextBirthday - today) / msPerDay);
  
    return daysToNextBday;
  };
  