// dayAge.js

// Returns the age of the user in days based on their birthdate
export const calculateDayAge = (birthday) => {
    // Get the current date and calculate the difference in milliseconds
    const currentDate = new Date();
    const diffInMs = currentDate.getTime() - birthday.getTime();
  
    // Convert the difference to days and return the result
    const msInDay = 1000 * 60 * 60 * 24;
    return Math.floor(diffInMs / msInDay);
  };
  